<?php

namespace App\Http\Requests\Admin;

use App\Models\StampProgram;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StampProgramUpdateRequest extends FormRequest
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
                Rule::unique('stamp_programs', 'name')->ignore($this->route('stampProgram')),
            ],
            'description' => ['required', 'string'],
            'required_stamps' => ['required', 'integer', 'min:1'],
            'image' => ['nullable', 'image', 'max:5120'],
            'remove_image' => ['nullable', 'boolean'],
            'featured' => ['required', 'boolean'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'status' => ['required', Rule::in([
                StampProgram::STATUS_ACTIVE,
                StampProgram::STATUS_INACTIVE,
                StampProgram::STATUS_DRAFT,
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
            'name' => 'program name',
            'product_ids' => 'products',
        ];
    }
}
