<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductCategoryStoreRequest;
use App\Http\Requests\Admin\ProductCategoryUpdateRequest;
use App\Models\ProductCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
                $q->where('name', 'like', "%{$search}%")
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
        return Inertia::render('Admin/productCategories/create');
    }

    /**
     * Store a newly created product category.
     */
    public function store(ProductCategoryStoreRequest $request): RedirectResponse
    {
        ProductCategory::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product category created.')]);

        return to_route('product-categories.index');
    }

    /**
     * Display the specified product category.
     */
    public function show(ProductCategory $productCategory): Response
    {
        return Inertia::render('Admin/productCategories/show', [
            'productCategory' => $productCategory,
        ]);
    }

    /**
     * Show the form for editing the specified product category.
     */
    public function edit(ProductCategory $productCategory): Response
    {
        return Inertia::render('Admin/productCategories/edit', [
            'productCategory' => $productCategory,
        ]);
    }

    /**
     * Update the specified product category.
     */
    public function update(ProductCategoryUpdateRequest $request, ProductCategory $productCategory): RedirectResponse
    {
        $productCategory->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product category updated.')]);

        return to_route('product-categories.index');
    }

    /**
     * Remove the specified product category.
     */
    public function destroy(ProductCategory $productCategory): RedirectResponse
    {
        $productCategory->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product category deleted.')]);

        return to_route('product-categories.index');
    }
}
