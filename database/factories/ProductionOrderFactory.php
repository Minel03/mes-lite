<?php

namespace Database\Factories;

use App\Models\ProductionOrder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductionOrder>
 */
class ProductionOrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->numberBetween(50, 1000);

        return [
            'order_number' => 'PO-'.fake()->unique()->numerify('####'),
            'product_name' => fake()->randomElement([
                'Control Panel',
                'Motor Housing',
                'Sensor Bracket',
                'Valve Assembly',
                'Packaging Kit',
            ]),
            'quantity' => $quantity,
            'completed_quantity' => fake()->numberBetween(0, $quantity),
            'status' => fake()->randomElement(['Pending', 'Running', 'Completed', 'Cancelled']),
            'assigned_operator' => fake()->name(),
            'deadline' => fake()->dateTimeBetween('now', '+60 days'),
        ];
    }
}
