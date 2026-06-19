<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        collect([
            'Admin',
            'Supervisor',
            'Operator',
            'Maintenance Engineer',
        ])->each(fn (string $role): Role => Role::findOrCreate($role, 'web'));

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
