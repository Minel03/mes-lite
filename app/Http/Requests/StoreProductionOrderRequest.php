<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductionOrderRequest extends FormRequest
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
            'order_number' => ['required', 'string', 'max:50', 'unique:production_orders,order_number'],
            'product_name' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:1'],
            'completed_quantity' => ['required', 'integer', 'min:0', 'lte:quantity'],
            'status' => ['required', 'string', Rule::in(['Pending', 'Running', 'Completed', 'Cancelled'])],
            'assigned_operator' => ['required', 'string', 'max:255'],
            'deadline' => ['required', 'date'],
        ];
    }
}
