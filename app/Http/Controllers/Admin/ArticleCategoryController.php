<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ArticleCategoryStoreRequest;
use App\Http\Requests\Admin\ArticleCategoryUpdateRequest;
use App\Models\ArticleCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleCategoryController extends Controller
{
    /**
     * Display a paginated, searchable listing of article categories.
     */
    public function index(Request $request): Response
    {
        $query = ArticleCategory::query();

        if ($search = $request->string('searchParam')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $statuses = [ArticleCategory::STATUS_ACTIVE, ArticleCategory::STATUS_INACTIVE, ArticleCategory::STATUS_DRAFT];
        $status = $request->string('status')->toString();

        if (in_array($status, $statuses, true)) {
            $query->where('status', $status);
        }

        $categories = $query->orderByDesc('created_at')
            ->paginate($request->integer('rowPerPage', 10))
            ->withQueryString();

        return Inertia::render('Admin/articleCategories/index', [
            'categories' => $categories,
            'filters' => $request->only(['searchParam', 'page', 'rowPerPage', 'sortBy', 'sortDirection', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new article category.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/articleCategories/create');
    }

    /**
     * Store a newly created article category.
     */
    public function store(ArticleCategoryStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = ArticleCategory::generateUniqueSlug($data['name']);

        ArticleCategory::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Article category created.')]);

        return to_route('article-categories.index');
    }

    /**
     * Show the form for editing the specified article category.
     */
    public function edit(ArticleCategory $articleCategory): Response
    {
        return Inertia::render('Admin/articleCategories/edit', [
            'category' => $articleCategory,
        ]);
    }

    /**
     * Update the specified article category.
     */
    public function update(ArticleCategoryUpdateRequest $request, ArticleCategory $articleCategory): RedirectResponse
    {
        $data = $request->validated();

        if ($data['name'] !== $articleCategory->name) {
            $data['slug'] = ArticleCategory::generateUniqueSlug($data['name'], $articleCategory->id);
        }

        $articleCategory->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Article category updated.')]);

        return to_route('article-categories.index');
    }

    /**
     * Remove the specified article category.
     */
    public function destroy(ArticleCategory $articleCategory): RedirectResponse
    {
        if ($articleCategory->articles()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __('This category cannot be deleted because it is linked to one or more articles.'),
            ]);

            return to_route('article-categories.index');
        }

        $articleCategory->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Article category deleted.')]);

        return to_route('article-categories.index');
    }
}
