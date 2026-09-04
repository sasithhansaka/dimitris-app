<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ArticleStoreRequest;
use App\Http\Requests\Admin\ArticleUpdateRequest;
use App\Models\Article;
use App\Models\ArticleCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    /**
     * Display a paginated, searchable listing of articles.
     */
    public function index(Request $request): Response
    {
        $query = Article::query()->with('category');

        if ($search = $request->string('searchParam')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('introduction', 'like', "%{$search}%");
            });
        }

        $statuses = [Article::STATUS_ACTIVE, Article::STATUS_INACTIVE, Article::STATUS_DRAFT];
        $status = $request->string('status')->toString();

        if (in_array($status, $statuses, true)) {
            $query->where('status', $status);
        }

        $articles = $query->orderBy('title')
            ->paginate($request->integer('rowPerPage', 10))
            ->withQueryString();

        return Inertia::render('Admin/articles/index', [
            'articles' => $articles,
            'filters' => $request->only(['searchParam', 'page', 'rowPerPage', 'sortBy', 'sortDirection', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new article.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/articles/create', [
            'categories' => ArticleCategory::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created article.
     */
    public function store(ArticleStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = Article::generateUniqueSlug($data['title']);

        if ($request->hasFile('banner')) {
            $data['banner'] = $this->storeBanner($request->file('banner'));
        }

        Article::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Article created.')]);

        return to_route('articles.index');
    }

    /**
     * Show the form for editing the specified article.
     */
    public function edit(Article $article): Response
    {
        return Inertia::render('Admin/articles/edit', [
            'article' => $article,
            'categories' => ArticleCategory::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified article.
     */
    public function update(ArticleUpdateRequest $request, Article $article): RedirectResponse
    {
        $data = $request->validated();

        if ($data['title'] !== $article->title) {
            $data['slug'] = Article::generateUniqueSlug($data['title'], $article->id);
        }

        if ($request->hasFile('banner')) {
            $data['banner'] = $this->storeBanner($request->file('banner'));
        } else {
            unset($data['banner']);
        }

        $article->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Article updated.')]);

        return to_route('articles.index');
    }

    /**
     * Remove the specified article.
     */
    public function destroy(Article $article): RedirectResponse
    {
        $article->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Article deleted.')]);

        return to_route('articles.index');
    }

    /**
     * Store the uploaded banner image and return its public storage path.
     */
    private function storeBanner(UploadedFile $file): string
    {
        $filename = time().'_'.Str::random(10).'.'.$file->getClientOriginalExtension();

        $file->storeAs('articles', $filename, 'public');

        return "articles/{$filename}";
    }
}
