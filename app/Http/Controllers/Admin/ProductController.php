<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductStoreRequest;
use App\Http\Requests\Admin\ProductUpdateRequest;
use App\Models\Brand;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Retailer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a paginated, searchable listing of products.
     */
    public function index(Request $request): Response
    {
        $query = Product::query()->with(['brand', 'category']);

        if ($search = $request->string('searchParam')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('product_code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $statuses = [Product::STATUS_ACTIVE, Product::STATUS_INACTIVE, Product::STATUS_DRAFT];
        $status = $request->string('status')->toString();

        if (in_array($status, $statuses, true)) {
            $query->where('status', $status);
        }

        $products = $query->orderByDesc('created_at')
            ->paginate($request->integer('rowPerPage', 10))
            ->withQueryString();

        return Inertia::render('Admin/products/index', [
            'products' => $products,
            'filters' => $request->only(['searchParam', 'page', 'rowPerPage', 'sortBy', 'sortDirection', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/products/create', [
            'brands' => Brand::query()
                ->where('status', Brand::STATUS_ACTIVE)
                ->with('distributors:id,name')
                ->orderBy('name')
                ->get(['id', 'name']),
            'categories' => ProductCategory::query()
                ->where('status', ProductCategory::STATUS_ACTIVE)
                ->orderBy('name')
                ->get(['id', 'name']),
            'nextProductCode' => Product::nextProductCode(),
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(ProductStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $this->storeImage($request->file('image'));
        }

        Product::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product created.')]);

        return to_route('products.index');
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product): Response
    {
        return Inertia::render('Admin/products/show', [
            'product' => $product->load([
                'brand',
                'category',
                'retailers' => fn ($query) => $query->where('status', Retailer::STATUS_ACTIVE),
            ]),
        ]);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product): Response
    {
        $product->loadCount(['retailers', 'coupons', 'stampPrograms']);

        return Inertia::render('Admin/products/edit', [
            'product' => $product,
            'brands' => Brand::query()
                ->where(function ($query) use ($product) {
                    $query->where('status', Brand::STATUS_ACTIVE)
                        ->orWhere('id', $product->brand_id);
                })
                ->with('distributors:id,name')
                ->orderBy('name')
                ->get(['id', 'name']),
            'categories' => ProductCategory::query()
                ->where(function ($query) use ($product) {
                    $query->where('status', ProductCategory::STATUS_ACTIVE)
                        ->orWhere('id', $product->category_id);
                })
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified product.
     */
    public function update(ProductUpdateRequest $request, Product $product): RedirectResponse
    {
        $data = $request->validated();
        unset($data['remove_image']);

        if ($request->hasFile('image')) {
            $this->deleteImage($product);
            $data['image'] = $this->storeImage($request->file('image'));
        } elseif ($request->boolean('remove_image')) {
            $this->deleteImage($product);
            $data['image'] = null;
        } else {
            unset($data['image']);
        }

        $product->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product updated.')]);

        return to_route('products.index');
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $linkedTo = array_filter([
            $product->retailers()->exists() ? 'retailers' : null,
            $product->coupons()->exists() ? 'coupons' : null,
            $product->stampPrograms()->exists() ? 'stamp programs' : null,
        ]);

        if ($linkedTo !== []) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __('This product cannot be deleted because it is linked to one or more :items.', [
                    'items' => implode(', ', $linkedTo),
                ]),
            ]);

            return to_route('products.index');
        }

        $product->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product deleted.')]);

        return to_route('products.index');
    }

    /**
     * Store the uploaded image and return its public storage path.
     */
    private function storeImage(UploadedFile $file): string
    {
        $filename = time().'_'.Str::random(10).'.'.$file->getClientOriginalExtension();

        $file->storeAs('products', $filename, 'public');

        return "products/{$filename}";
    }

    /**
     * Delete the product's current image file from storage, if any.
     */
    private function deleteImage(Product $product): void
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
    }
}
