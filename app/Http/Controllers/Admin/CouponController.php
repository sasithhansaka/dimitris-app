<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CouponStoreRequest;
use App\Http\Requests\Admin\CouponUpdateRequest;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\Retailer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    /**
     * Display a paginated, searchable listing of coupons.
     */
    public function index(Request $request): Response
    {
        $query = Coupon::query()->with('products');

        if ($search = $request->string('searchParam')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $statuses = [Coupon::STATUS_ACTIVE, Coupon::STATUS_INACTIVE, Coupon::STATUS_DRAFT];
        $status = $request->string('status')->toString();

        if (in_array($status, $statuses, true)) {
            $query->where('status', $status);
        }

        $coupons = $query->orderByDesc('created_at')
            ->paginate($request->integer('rowPerPage', 10))
            ->withQueryString();

        return Inertia::render('Admin/coupons/index', [
            'coupons' => $coupons,
            'filters' => $request->only(['searchParam', 'page', 'rowPerPage', 'sortBy', 'sortDirection', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new coupon.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Admin/coupons/create', [
            'products' => Product::query()
                ->where('status', Product::STATUS_ACTIVE)
                ->orderBy('name')
                ->get(['id', 'name']),
            'retailers' => fn () => $this->retailersForCountry($request->string('country')->toString()),
        ]);
    }

    /**
     * Store a newly created coupon.
     */
    public function store(CouponStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $products = $data['products'];
        $retailerIds = $data['retailer_ids'] ?? [];
        unset($data['products'], $data['retailer_ids']);

        $data['image'] = $this->storeImage($request->file('image'));

        $coupon = Coupon::create($data);
        $this->syncProducts($coupon, $products);
        $coupon->retailers()->sync($retailerIds);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Coupon created.')]);

        return to_route('coupons.index');
    }

    /**
     * Display the specified coupon.
     */
    public function show(Coupon $coupon): Response
    {
        return Inertia::render('Admin/coupons/show', [
            'coupon' => $coupon->load(['products', 'retailers']),
        ]);
    }

    /**
     * Show the form for editing the specified coupon.
     */
    public function edit(Request $request, Coupon $coupon): Response
    {
        $coupon->load('products', 'retailers:id');
        $linkedProductIds = $coupon->products->pluck('id');
        $linkedRetailerIds = $coupon->retailers->pluck('id');

        $country = $request->string('country')->toString() ?: $coupon->country;

        return Inertia::render('Admin/coupons/edit', [
            'coupon' => $coupon,
            'products' => Product::query()
                ->where(function ($query) use ($linkedProductIds) {
                    $query->where('status', Product::STATUS_ACTIVE)
                        ->orWhereIn('id', $linkedProductIds);
                })
                ->orderBy('name')
                ->get(['id', 'name']),
            'retailers' => fn () => $this->retailersForCountry(
                $country,
                $country === $coupon->country ? $linkedRetailerIds : null,
            ),
            'linked_retailer_ids' => $linkedRetailerIds,
        ]);
    }

    /**
     * Update the specified coupon.
     */
    public function update(CouponUpdateRequest $request, Coupon $coupon): RedirectResponse
    {
        $data = $request->validated();
        $products = $data['products'];
        $retailerIds = $data['retailer_ids'] ?? [];
        unset($data['products'], $data['retailer_ids'], $data['remove_image']);

        if ($request->hasFile('image')) {
            $this->deleteImage($coupon);
            $data['image'] = $this->storeImage($request->file('image'));
        } elseif ($request->boolean('remove_image')) {
            $this->deleteImage($coupon);
            $data['image'] = null;
        } else {
            unset($data['image']);
        }

        $coupon->update($data);
        $this->syncProducts($coupon, $products);
        $coupon->retailers()->sync($retailerIds);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Coupon updated.')]);

        return to_route('coupons.index');
    }

    /**
     * Remove the specified coupon.
     */
    public function destroy(Coupon $coupon): RedirectResponse
    {
        $this->deleteImage($coupon);
        $coupon->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Coupon deleted.')]);

        return to_route('coupons.index');
    }

    /**
     * Sync the coupon's linked products along with their OCR pivot data.
     *
     * @param  array<int, array{product_id: int, ocr_name: string, ocr_keywords: string, quantity: int, required?: bool}>  $products
     */
    private function syncProducts(Coupon $coupon, array $products): void
    {
        $syncData = [];

        foreach ($products as $product) {
            $syncData[$product['product_id']] = [
                'ocr_name' => $product['ocr_name'],
                'ocr_keywords' => $product['ocr_keywords'],
                'quantity' => $product['quantity'],
                'required' => $product['required'] ?? false,
            ];
        }

        $coupon->products()->sync($syncData);
    }

    /**
     * Get the active retailers for a given country, including any already-linked retailers.
     *
     * @param  Collection<int, int>|null  $linkedIds
     * @return Collection<int, Retailer>
     */
    private function retailersForCountry(string $country, $linkedIds = null)
    {
        if ($country === '') {
            return collect();
        }

        return Retailer::query()
            ->where('country', $country)
            ->where(function ($query) use ($linkedIds) {
                $query->where('status', Retailer::STATUS_ACTIVE);

                if ($linkedIds && $linkedIds->isNotEmpty()) {
                    $query->orWhereIn('id', $linkedIds);
                }
            })
            ->orderBy('name')
            ->get(['id', 'name']);
    }

    /**
     * Store the uploaded image and return its public storage path.
     */
    private function storeImage(UploadedFile $file): string
    {
        $filename = time().'_'.Str::random(10).'.'.$file->getClientOriginalExtension();

        $file->storeAs('coupons', $filename, 'public');

        return "coupons/{$filename}";
    }

    /**
     * Delete the coupon's current image file from storage, if any.
     */
    private function deleteImage(Coupon $coupon): void
    {
        if ($coupon->image) {
            Storage::disk('public')->delete($coupon->image);
        }
    }
}
