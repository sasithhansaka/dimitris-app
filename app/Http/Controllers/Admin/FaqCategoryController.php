<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FaqCategoryStoreRequest;
use App\Http\Requests\Admin\FaqCategoryUpdateRequest;
use App\Models\Faq;
use App\Models\FaqCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class FaqCategoryController extends Controller
{
    /**
     * Display a paginated, searchable listing of FAQ categories.
     */
    public function index(Request $request): Response
    {
        $query = FaqCategory::query()->withCount('faqs');

        if ($search = $request->string('searchParam')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('faq_code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $statuses = [FaqCategory::STATUS_ACTIVE, FaqCategory::STATUS_INACTIVE, FaqCategory::STATUS_DRAFT];
        $status = $request->string('status')->toString();

        if (in_array($status, $statuses, true)) {
            $query->where('status', $status);
        }

        $categories = $query->orderBy('display_order')
            ->paginate($request->integer('rowPerPage', 10))
            ->withQueryString();

        return Inertia::render('Admin/faqCategories/index', [
            'categories' => $categories,
            'filters' => $request->only(['searchParam', 'page', 'rowPerPage', 'sortBy', 'sortDirection', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new FAQ category.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/faqCategories/create', [
            'nextFaqCode' => FaqCategory::nextFaqCode(),
            'nextDisplayOrder' => FaqCategory::nextDisplayOrder(),
        ]);
    }

    /**
     * Store a newly created FAQ category along with its FAQs.
     */
    public function store(FaqCategoryStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $faqs = $data['faqs'] ?? [];
        unset($data['faqs']);

        $data['slug'] = FaqCategory::generateUniqueSlug($data['name']);

        if ($request->hasFile('banner')) {
            $data['banner'] = $this->storeBanner($request->file('banner'));
        }

        $category = FaqCategory::create($data);

        foreach ($faqs as $index => $faq) {
            $category->faqs()->create([
                'question' => $faq['question'],
                'answer' => $faq['answer'],
                'display_order' => $index + 1,
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('FAQ category created.')]);

        return to_route('faq-categories.index');
    }

    /**
     * Show the form for editing the specified FAQ category.
     */
    public function edit(FaqCategory $faqCategory): Response
    {
        return Inertia::render('Admin/faqCategories/edit', [
            'category' => $faqCategory->load('faqs'),
        ]);
    }

    /**
     * Update the specified FAQ category and sync its FAQs.
     */
    public function update(FaqCategoryUpdateRequest $request, FaqCategory $faqCategory): RedirectResponse
    {
        $data = $request->validated();
        $faqs = $data['faqs'] ?? [];
        unset($data['faqs'], $data['remove_banner']);

        if ($data['name'] !== $faqCategory->name) {
            $data['slug'] = FaqCategory::generateUniqueSlug($data['name'], $faqCategory->id);
        }

        if ($request->hasFile('banner')) {
            $this->deleteBanner($faqCategory);
            $data['banner'] = $this->storeBanner($request->file('banner'));
        } elseif ($request->boolean('remove_banner')) {
            $this->deleteBanner($faqCategory);
            $data['banner'] = null;
        } else {
            unset($data['banner']);
        }

        $faqCategory->update($data);

        $keptIds = [];

        foreach ($faqs as $index => $faq) {
            $attributes = [
                'question' => $faq['question'],
                'answer' => $faq['answer'],
                'display_order' => $index + 1,
            ];

            if (! empty($faq['id'])) {
                $faqCategory->faqs()->where('id', $faq['id'])->update($attributes);
                $keptIds[] = (int) $faq['id'];
            } else {
                $keptIds[] = $faqCategory->faqs()->create($attributes)->id;
            }
        }

        $faqCategory->faqs()->whereNotIn('id', $keptIds)->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('FAQ category updated.')]);

        return to_route('faq-categories.index');
    }

    /**
     * Remove the specified FAQ category along with its FAQs.
     */
    public function destroy(FaqCategory $faqCategory): RedirectResponse
    {
        $this->deleteBanner($faqCategory);
        $faqCategory->faqs()->delete();
        $faqCategory->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('FAQ category deleted.')]);

        return to_route('faq-categories.index');
    }

    /**
     * Store the uploaded banner and return its public storage path.
     */
    private function storeBanner(UploadedFile $file): string
    {
        $filename = time().'_'.Str::random(10).'.'.$file->getClientOriginalExtension();

        $file->storeAs('faq-categories', $filename, 'public');

        return "faq-categories/{$filename}";
    }

    /**
     * Delete the FAQ category's current banner file from storage, if any.
     */
    private function deleteBanner(FaqCategory $faqCategory): void
    {
        if ($faqCategory->banner) {
            Storage::disk('public')->delete($faqCategory->banner);
        }
    }
}
