<?php

namespace App\Http\Requests\Admin;

use App\Models\Brand;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class BrandUpdateRequest extends FormRequest
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
                Rule::unique('brands', 'name')->ignore($this->route('brand')),
            ],
            'description' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'max:5120'],
            'remove_logo' => ['nullable', 'boolean'],
            'website' => ['nullable', 'url', 'max:255'],
            'status' => ['required', Rule::in([
                Brand::STATUS_ACTIVE,
                Brand::STATUS_INACTIVE,
                Brand::STATUS_DRAFT,
            ])],
            'featured' => ['boolean'],
            'distributor_ids' => ['required', 'array', 'min:1'],
            'distributor_ids.*' => ['integer', 'exists:distributors,id'],
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
            'name' => 'brand name',
            'distributor_ids' => 'distributors',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            /** @var Brand $brand */
            $brand = $this->route('brand');

            if ($this->input('status') === Brand::STATUS_ACTIVE) {
                return;
            }

            $linkedTo = array_filter([
                $brand->products()->exists() ? 'products' : null,
                $brand->offers()->exists() ? 'offers' : null,
                $brand->giftCards()->exists() ? 'gift cards' : null,
            ]);

            if ($linkedTo !== []) {
                $validator->errors()->add(
                    'status',
                    __('This brand is linked to one or more :items and must stay active.', [
                        'items' => implode(', ', $linkedTo),
                    ]),
                );
            }
        });
    }
}
