<?php

namespace Database\Factories;

use App\Models\Machine;
use App\Models\ProductionLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductionLog>
 */
class ProductionLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'machine_id' => Machine::factory(),
            'operator_id' => User::factory(),
            'quantity_produced' => $this->faker->numberBetween(10, 500),
            'timestamp' => now()->toDateTimeString(),
        ];
    }
}
