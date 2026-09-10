<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StampProgramStoreRequest;
use App\Http\Requests\Admin\StampProgramUpdateRequest;
use App\Models\Product;
use App\Models\StampProgram;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StampProgramController extends Controller
{
    /**
     * Display a paginated, searchable listing of stamp programs.
     */
    public function index(Request $request): Response
    {
        $query = StampProgram::query();

        if ($search = $request->string('searchParam')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('stamp_code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $statuses = [StampProgram::STATUS_ACTIVE, StampProgram::STATUS_INACTIVE, StampProgram::STATUS_DRAFT];
        $status = $request->string('status')->toString();

        if (in_array($status, $statuses, true)) {
            $query->where('status', $status);
        }

        $stampPrograms = $query->orderByDesc('created_at')
            ->paginate($request->integer('rowPerPage', 10))
            ->withQueryString();

        return Inertia::render('Admin/stampPrograms/index', [
            'stampPrograms' => $stampPrograms,
            'filters' => $request->only(['searchParam', 'page', 'rowPerPage', 'sortBy', 'sortDirection', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new stamp program.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/stampPrograms/create', [
            'nextStampCode' => StampProgram::nextStampCode(),
            'products' => Product::query()
                ->where('status', Product::STATUS_ACTIVE)
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created stamp program.
     */
    public function store(StampProgramStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $productIds = $data['product_ids'];
        unset($data['product_ids']);

        $data['image'] = $this->storeImage($request->file('image'));

        $stampProgram = StampProgram::create($data);
        $stampProgram->products()->sync($productIds);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Stamp program created.')]);

        return to_route('stamp-programs.index');
    }

    /**
     * Show the form for editing the specified stamp program.
     */
    public function edit(StampProgram $stampProgram): Response
    {
        $stampProgram->load('products:id');
        $linkedProductIds = $stampProgram->products->pluck('id');

        return Inertia::render('Admin/stampPrograms/edit', [
            'stampProgram' => $stampProgram,
            'products' => Product::query()
                ->where(function ($query) use ($linkedProductIds) {
                    $query->where('status', Product::STATUS_ACTIVE)
                        ->orWhereIn('id', $linkedProductIds);
                })
                ->orderBy('name')
                ->get(['id', 'name']),
            'linked_product_ids' => $linkedProductIds,
        ]);
    }

    /**
     * Update the specified stamp program.
     */
    public function update(StampProgramUpdateRequest $request, StampProgram $stampProgram): RedirectResponse
    {
        $data = $request->validated();
        $productIds = $data['product_ids'];
        unset($data['product_ids'], $data['remove_image']);

        if ($request->hasFile('image')) {
            $this->deleteImage($stampProgram);
            $data['image'] = $this->storeImage($request->file('image'));
        } elseif ($request->boolean('remove_image')) {
            $this->deleteImage($stampProgram);
            $data['image'] = null;
        } else {
            unset($data['image']);
        }

        $stampProgram->update($data);
        $stampProgram->products()->sync($productIds);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Stamp program updated.')]);

        return to_route('stamp-programs.index');
    }

    /**
     * Remove the specified stamp program.
     */
    public function destroy(StampProgram $stampProgram): RedirectResponse
    {
        $this->deleteImage($stampProgram);
        $stampProgram->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Stamp program deleted.')]);

        return to_route('stamp-programs.index');
    }

    /**
     * Store the uploaded image and return its public storage path.
     */
    private function storeImage(UploadedFile $file): string
    {
        $filename = time().'_'.Str::random(10).'.'.$file->getClientOriginalExtension();

        $file->storeAs('stamp-programs', $filename, 'public');

        return "stamp-programs/{$filename}";
    }

    /**
     * Delete the stamp program's current image file from storage, if any.
     */
    private function deleteImage(StampProgram $stampProgram): void
    {
        if ($stampProgram->image) {
            Storage::disk('public')->delete($stampProgram->image);
        }
    }
}
