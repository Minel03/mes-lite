<?php

namespace Database\Seeders;

use App\Models\Machine;
use Illuminate\Database\Seeder;

class MachineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            [
                'machine_code' => 'MC-1001',
                'machine_name' => 'CNC Milling Center',
                'status' => 'Running',
                'location' => 'Line A',
                'last_maintenance' => now()->subDays(20)->toDateString(),
                'next_maintenance' => now()->addDays(40)->toDateString(),
            ],
            [
                'machine_code' => 'MC-1002',
                'machine_name' => 'Hydraulic Press',
                'status' => 'Offline',
                'location' => 'Line B',
                'last_maintenance' => now()->subDays(45)->toDateString(),
                'next_maintenance' => now()->addDays(15)->toDateString(),
            ],
        ])->each(fn (array $machine): Machine => Machine::query()->updateOrCreate(
            ['machine_code' => $machine['machine_code']],
            $machine,
        ));
    }
}
