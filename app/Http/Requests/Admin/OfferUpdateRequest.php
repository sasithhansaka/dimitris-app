<?php

namespace App\Http\Requests\Admin;

use App\Models\Offer;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class OfferUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => [
                $this->route('offer')?->image ? 'nullable' : 'required',
                'image',
                'max:5120',
            ],
            'remove_image' => ['nullable', 'boolean'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'status' => ['required', Rule::in([
                Offer::STATUS_ACTIVE,
                Offer::STATUS_INACTIVE,
                Offer::STATUS_DRAFT,
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
            'brand_id' => 'brand',
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
