<?php

namespace Database\Factories;

use App\Models\Machine;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Machine>
 */
class MachineFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $lastMaintenance = fake()->dateTimeBetween('-90 days', '-1 day');

        return [
            'machine_code' => 'MC-'.fake()->unique()->numerify('####'),
            'machine_name' => fake()->randomElement([
                'CNC Milling Center',
                'Hydraulic Press',
                'Assembly Conveyor',
                'Injection Molding Unit',
                'Packaging Line',
            ]),
            'status' => fake()->randomElement(['Running', 'Offline', 'Maintenance', 'Idle']),
            'location' => fake()->randomElement(['Line A', 'Line B', 'Line C', 'Maintenance Bay']),
            'last_maintenance' => $lastMaintenance,
            'next_maintenance' => fake()->dateTimeBetween($lastMaintenance, '+90 days'),
        ];
    }
}
