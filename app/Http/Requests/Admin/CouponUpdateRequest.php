<?php

namespace App\Http\Requests\Admin;

use App\Models\Coupon;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class CouponUpdateRequest extends FormRequest
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
                Rule::unique('coupons', 'name')->ignore($this->route('coupon')),
            ],
            'description' => ['required', 'string'],
            'image' => [
                $this->route('coupon')?->image ? 'nullable' : 'required',
                'image',
                'max:5120',
            ],
            'remove_image' => ['nullable', 'boolean'],
            'country' => ['required', 'string', 'max:255'],
            'currency' => ['required', 'string', 'max:10'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'status' => ['required', Rule::in([
                Coupon::STATUS_ACTIVE,
                Coupon::STATUS_INACTIVE,
                Coupon::STATUS_DRAFT,
            ])],
            'featured' => ['boolean'],

            'products' => ['required', 'array', 'min:1'],
            'products.*.product_id' => ['required', 'integer', 'exists:products,id', 'distinct'],
            'products.*.ocr_name' => ['required', 'string', 'max:255'],
            'products.*.ocr_keywords' => ['required', 'string'],
            'products.*.quantity' => ['required', 'integer', 'min:1'],
            'products.*.required' => ['boolean'],

            'retailer_ids' => ['required', 'array', 'min:1'],
            'retailer_ids.*' => ['integer', 'exists:retailers,id'],
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
            'products' => 'products',
            'products.*.product_id' => 'product',
            'products.*.ocr_name' => 'OCR name',
            'products.*.ocr_keywords' => 'OCR keywords',
            'retailer_ids' => 'retailers',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($this->boolean('remove_image') && ! $this->hasFile('image')) {
                $validator->errors()->add(
                    'image',
                    __('An image is required. Upload a new one to remove the current image.'),
                );
            }
        });
    }
}
