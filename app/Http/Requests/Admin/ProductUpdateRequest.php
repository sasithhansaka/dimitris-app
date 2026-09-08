<?php

namespace App\Http\Requests\Admin;

use App\Models\Product;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class ProductUpdateRequest extends FormRequest
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
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'category_id' => ['required', 'integer', 'exists:product_categories,id'],
            'description' => ['nullable', 'string'],
            'image' => [
                $this->route('product')?->image ? 'nullable' : 'required',
                'image',
                'max:5120',
            ],
            'remove_image' => ['nullable', 'boolean'],
            'status' => ['required', Rule::in([
                Product::STATUS_ACTIVE,
                Product::STATUS_INACTIVE,
                Product::STATUS_DRAFT,
            ])],
            'featured' => ['boolean'],
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
            'name' => 'product name',
            'brand_id' => 'brand',
            'category_id' => 'category',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            /** @var Product $product */
            $product = $this->route('product');

            if (
                $this->input('status') !== Product::STATUS_ACTIVE
                && $product->retailers()->exists()
            ) {
                $validator->errors()->add(
                    'status',
                    __('This product is linked to one or more retailers and must stay active.'),
                );
            }

            if ($this->boolean('remove_image') && ! $this->hasFile('image')) {
                $validator->errors()->add(
                    'image',
                    __('An image is required. Upload a new one to remove the current image.'),
                );
            }
        });
    }
}
