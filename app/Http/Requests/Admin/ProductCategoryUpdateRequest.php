<?php

namespace App\Http\Requests\Admin;

use App\Models\ProductCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class ProductCategoryUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('product_categories', 'name')->ignore($this->route('productCategory')),
            ],
            'description' => ['nullable', 'string'],
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

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            /** @var ProductCategory $productCategory */
            $productCategory = $this->route('productCategory');

            if (
                $this->input('status') !== ProductCategory::STATUS_ACTIVE
                && $productCategory->products()->exists()
            ) {
                $validator->errors()->add(
                    'status',
                    __('This product category is linked to one or more products and must stay active.'),
                );
            }
        });
    }
}
