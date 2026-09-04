<?php

namespace App\Http\Requests\Admin;

use App\Models\Article;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ArticleStoreRequest extends FormRequest
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
            'banner' => ['nullable', 'image', 'max:5120'],
            'keywords' => ['nullable', 'string'],
            'status' => ['required', Rule::in([
                Article::STATUS_ACTIVE,
                Article::STATUS_INACTIVE,
                Article::STATUS_DRAFT,
            ])],
            'article_category_id' => ['required', 'integer', 'exists:article_categories,id'],
        ];
    }
}
