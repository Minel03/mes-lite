<?php

namespace Database\Seeders;

use App\Models\ProductionOrder;
use Illuminate\Database\Seeder;

class ProductionOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            [
                'order_number' => 'PO-1001',
                'product_name' => 'Control Panel',
                'quantity' => 500,
                'completed_quantity' => 125,
                'status' => 'Running',
                'assigned_operator' => 'Operator One',
                'deadline' => now()->addDays(10)->toDateString(),
            ],
            [
                'order_number' => 'PO-1002',
                'product_name' => 'Motor Housing',
                'quantity' => 300,
                'completed_quantity' => 0,
                'status' => 'Pending',
                'assigned_operator' => 'Operator Two',
                'deadline' => now()->addDays(20)->toDateString(),
            ],
        ])->each(fn (array $productionOrder): ProductionOrder => ProductionOrder::query()->updateOrCreate(
            ['order_number' => $productionOrder['order_number']],
            $productionOrder,
        ));
    }
}
