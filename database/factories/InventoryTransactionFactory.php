<?php

namespace Database\Factories;

use App\Models\Inventory;
use App\Models\InventoryTransaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<InventoryTransaction>
 */
class InventoryTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'inventory_id' => Inventory::factory(),
            'user_id' => User::factory(),
            'type' => $this->faker->randomElement(['In', 'Out', 'Adjustment']),
            'quantity' => $this->faker->numberBetween(1, 100),
            'reference' => $this->faker->optional()->bothify('REF-####'),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}
