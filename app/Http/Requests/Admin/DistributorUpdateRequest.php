<?php

namespace App\Http\Requests\Admin;

use App\Models\Distributor;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class DistributorUpdateRequest extends FormRequest
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
                Rule::unique('distributors', 'name')->ignore($this->route('distributor')),
            ],
            'country' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'max:5120'],
            'remove_logo' => ['nullable', 'boolean'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50', 'regex:/^[0-9+\-()\s]+$/'],
            'address' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in([
                Distributor::STATUS_ACTIVE,
                Distributor::STATUS_INACTIVE,
                Distributor::STATUS_DRAFT,
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
            'name' => 'distributor name',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            /** @var Distributor $distributor */
            $distributor = $this->route('distributor');

            if (
                $this->input('status') !== Distributor::STATUS_ACTIVE
                && $distributor->brands()->exists()
            ) {
                $validator->errors()->add(
                    'status',
                    __('This distributor is linked to one or more brands and must stay active.'),
                );
            }
        });
    }
}
