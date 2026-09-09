<?php

namespace App\Http\Requests\Admin;

use App\Models\Retailer;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class RetailerUpdateRequest extends FormRequest
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
                Rule::unique('retailers', 'name')->ignore($this->route('retailer')),
            ],
            'country' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'max:5120'],
            'remove_logo' => ['nullable', 'boolean'],
            'website' => ['nullable', 'url', 'max:255'],
            'primary_contact' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50', 'regex:/^[0-9+\-()\s]+$/'],
            'address' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in([
                Retailer::STATUS_ACTIVE,
                Retailer::STATUS_INACTIVE,
                Retailer::STATUS_DRAFT,
            ])],
            'product_ids' => ['required', 'array', 'min:1'],
            'product_ids.*' => ['integer', 'exists:products,id'],
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
            'name' => 'retailer name',
            'product_ids' => 'products',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            /** @var Retailer $retailer */
            $retailer = $this->route('retailer');

            if (
                $this->input('status') !== Retailer::STATUS_ACTIVE
                && $retailer->coupons()->exists()
            ) {
                $validator->errors()->add(
                    'status',
                    __('This retailer is linked to one or more coupons and must stay active.'),
                );
            }
        });
    }
}
