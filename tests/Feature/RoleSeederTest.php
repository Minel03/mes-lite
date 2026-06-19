<?php

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Spatie\Permission\Models\Role;

it('seeds the mes user roles', function () {
    $this->seed(RoleSeeder::class);

    expect(Role::query()->pluck('name')->all())->toEqualCanonicalizing([
        'Admin',
        'Supervisor',
        'Operator',
        'Maintenance Engineer',
    ]);
});

it('allows users to be assigned an mes role', function () {
    $this->seed(RoleSeeder::class);

    $user = User::factory()->create();

    $user->assignRole('Operator');

    expect($user->fresh()->hasRole('Operator'))->toBeTrue();
});
