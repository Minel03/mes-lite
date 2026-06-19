<?php

namespace App\Models;

use Database\Factories\ProductionOrderFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionOrder extends Model
{
    /** @use HasFactory<ProductionOrderFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'order_number',
        'product_name',
        'quantity',
        'completed_quantity',
        'status',
        'assigned_operator',
        'deadline',
    ];

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'completed_quantity' => 0,
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'completed_quantity' => 'integer',
            'deadline' => 'date',
        ];
    }
}
