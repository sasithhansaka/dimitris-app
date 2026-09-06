<?php

namespace App\Http\Requests\Admin;

use App\Models\ArticleCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ArticleCategoryUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in([
                ArticleCategory::STATUS_ACTIVE,
                ArticleCategory::STATUS_INACTIVE,
                ArticleCategory::STATUS_DRAFT,
            ])],
        ];
    }
}
