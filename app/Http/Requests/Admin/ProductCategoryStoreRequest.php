<?php

namespace App\Http\Requests\Admin;

use App\Models\ProductCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductCategoryStoreRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:product_categories,name'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:5120'],
            'display_order' => ['required', 'integer', 'min:1', 'unique:product_categories,display_order'],
            'status' => ['required', Rule::in([
                ProductCategory::STATUS_ACTIVE,
                ProductCategory::STATUS_INACTIVE,
                ProductCategory::STATUS_DRAFT,
            ])],
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
