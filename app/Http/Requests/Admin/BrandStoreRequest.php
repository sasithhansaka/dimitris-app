<?php

namespace App\Http\Requests\Admin;

use App\Models\Brand;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BrandStoreRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:brands,name'],
            'description' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'max:5120'],
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
}
