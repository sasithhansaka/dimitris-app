<?php

namespace App\Http\Requests\Admin;

use App\Models\Article;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ArticleUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'introduction' => ['required', 'string'],
            'content' => ['required', 'string'],
            'banner' => [
                $this->route('article')?->banner ? 'nullable' : 'required',
                'image',
                'max:5120',
            ],
            'keywords' => ['nullable', 'string'],
            'status' => ['required', Rule::in([
                Article::STATUS_ACTIVE,
                Article::STATUS_INACTIVE,
                Article::STATUS_DRAFT,
            ])],
            'read_time' => ['required', 'integer', 'min:1'],
            'featured' => ['boolean'],
            'article_category_id' => ['required', 'integer', 'exists:article_categories,id'],
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
            'article_category_id' => 'article category',
        ];
    }
}
