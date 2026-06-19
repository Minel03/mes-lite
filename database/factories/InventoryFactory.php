<?php

namespace Database\Factories;

use App\Models\Inventory;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Inventory>
 */
class InventoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'quantity' => $this->faker->numberBetween(0, 500),
            'minimum_quantity' => $this->faker->numberBetween(5, 50),
            'location' => $this->faker->randomElement(['Warehouse A', 'Warehouse B', 'Shelf C1', 'Shelf D2', null]),
        ];
    }
}
