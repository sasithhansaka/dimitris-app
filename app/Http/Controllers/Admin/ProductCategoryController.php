<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductCategoryStoreRequest;
use App\Http\Requests\Admin\ProductCategoryUpdateRequest;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductCategoryController extends Controller
{
    /**
     * Display a paginated, searchable listing of product categories.
     */
    public function index(Request $request): Response
    {
        $query = ProductCategory::query();

        if ($search = $request->string('searchParam')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('category_code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $statuses = [ProductCategory::STATUS_ACTIVE, ProductCategory::STATUS_INACTIVE, ProductCategory::STATUS_DRAFT];
        $status = $request->string('status')->toString();

        if (in_array($status, $statuses, true)) {
            $query->where('status', $status);
        }

        $productCategories = $query->orderByDesc('created_at')
            ->paginate($request->integer('rowPerPage', 10))
            ->withQueryString();

        return Inertia::render('Admin/productCategories/index', [
            'productCategories' => $productCategories,
            'filters' => $request->only(['searchParam', 'page', 'rowPerPage', 'sortBy', 'sortDirection', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new product category.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/productCategories/create', [
            'nextCategoryCode' => ProductCategory::nextCategoryCode(),
            'nextDisplayOrder' => ProductCategory::nextDisplayOrder(),
        ]);
    }

    /**
     * Store a newly created product category.
     */
    public function store(ProductCategoryStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $this->storeImage($request->file('image'));
        }

        ProductCategory::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product category created.')]);

        return to_route('product-categories.index');
    }

    /**
     * Display the specified product category.
     */
    public function show(ProductCategory $productCategory): Response
    {
        return Inertia::render('Admin/productCategories/show', [
            'productCategory' => $productCategory->load([
                'products' => fn ($query) => $query->where('status', Product::STATUS_ACTIVE),
            ]),
        ]);
    }

    /**
     * Show the form for editing the specified product category.
     */
    public function edit(ProductCategory $productCategory): Response
    {
        $productCategory->loadCount('products');

        return Inertia::render('Admin/productCategories/edit', [
            'productCategory' => $productCategory,
        ]);
    }

    /**
     * Update the specified product category.
     */
    public function update(ProductCategoryUpdateRequest $request, ProductCategory $productCategory): RedirectResponse
    {
        $data = $request->validated();
        unset($data['remove_image']);

        if ($request->hasFile('image')) {
            $this->deleteImage($productCategory);
            $data['image'] = $this->storeImage($request->file('image'));
        } elseif ($request->boolean('remove_image')) {
            $this->deleteImage($productCategory);
            $data['image'] = null;
        } else {
            unset($data['image']);
        }

        $productCategory->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product category updated.')]);

        return to_route('product-categories.index');
    }

    /**
     * Remove the specified product category.
     */
    public function destroy(ProductCategory $productCategory): RedirectResponse
    {
        if ($productCategory->products()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __('This product category cannot be deleted because it is linked to one or more products.'),
            ]);

            return to_route('product-categories.index');
        }

        $productCategory->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product category deleted.')]);

        return to_route('product-categories.index');
    }

    /**
     * Store the uploaded image and return its public storage path.
     */
    private function storeImage(UploadedFile $file): string
    {
        $filename = time().'_'.Str::random(10).'.'.$file->getClientOriginalExtension();

        $file->storeAs('product-categories', $filename, 'public');

        return "product-categories/{$filename}";
    }

    /**
     * Delete the product category's current image file from storage, if any.
     */
    private function deleteImage(ProductCategory $productCategory): void
    {
        if ($productCategory->image) {
            Storage::disk('public')->delete($productCategory->image);
        }
    }
}
