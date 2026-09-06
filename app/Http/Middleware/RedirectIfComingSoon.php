<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfComingSoon
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! config('app.coming_soon')) {
            return $next($request);
        }

        return Inertia::render('Public/coming-soon')
            ->toResponse($request)
            ->setStatusCode(503);
    }
}
