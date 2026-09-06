<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    /**
     * Display a paginated listing of activity logs, latest first.
     */
    public function index(Request $request): Response
    {
        $logs = ActivityLog::query()
            ->with('user:id,name,email')
            ->latest()
            ->paginate($request->integer('rowPerPage', 10))
            ->withQueryString();

        return Inertia::render('Admin/logs/index', [
            'logs' => $logs,
            'filters' => $request->only(['page', 'rowPerPage']),
        ]);
    }
}
