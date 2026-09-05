<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    /**
     * Display the public articles listing, split into featured and recent.
     */
    public function index(): Response
    {
        $articles = Article::query()
            ->with('category')
            ->where('status', Article::STATUS_ACTIVE)
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Public/Articles/page', [
            'featuredArticles' => $articles->where('featured', true)->values(),
            'recentArticles' => $articles->where('featured', false)->values(),
        ]);
    }
}
