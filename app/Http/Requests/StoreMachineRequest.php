<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMachineRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'machine_code' => ['required', 'string', 'max:50', 'unique:machines,machine_code'],
            'machine_name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(['Running', 'Offline', 'Maintenance', 'Idle'])],
            'location' => ['required', 'string', 'max:255'],
            'last_maintenance' => ['nullable', 'date'],
            'next_maintenance' => ['nullable', 'date', 'after_or_equal:last_maintenance'],
        ];
    }
}
