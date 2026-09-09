<?php

namespace App\Http\Requests\Admin;

use App\Models\GiftCard;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class GiftCardUpdateRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'amount' => ['required', 'string'],
            'currency' => ['required', 'string', 'size:3'],
            'image' => [
                $this->route('giftCard')?->image ? 'nullable' : 'required',
                'image',
                'max:5120',
            ],
            'remove_image' => ['nullable', 'boolean'],
            'status' => ['required', Rule::in([
                GiftCard::STATUS_ACTIVE,
                GiftCard::STATUS_INACTIVE,
                GiftCard::STATUS_DRAFT,
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
