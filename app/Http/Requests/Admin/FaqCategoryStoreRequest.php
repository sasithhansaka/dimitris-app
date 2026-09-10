<?php

namespace App\Http\Requests\Admin;

use App\Models\FaqCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FaqCategoryStoreRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:faq_categories,name'],
            'description' => ['nullable', 'string'],
            'banner' => ['nullable', 'image', 'max:5120'],
            'display_order' => ['required', 'integer', 'min:1', 'unique:faq_categories,display_order'],
            'status' => ['required', Rule::in([
                FaqCategory::STATUS_ACTIVE,
                FaqCategory::STATUS_INACTIVE,
                FaqCategory::STATUS_DRAFT,
            ])],
            'faqs' => ['nullable', 'array'],
            'faqs.*.question' => ['required', 'string', 'max:255'],
            'faqs.*.answer' => ['required', 'string'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'category name',
        ];
    }
}
