<?php

use App\Models\Machine;
use App\Models\User;

test('guests are redirected from machines', function () {
    $this->get('/machines')->assertRedirect('/login');
});

test('authenticated users can view machines', function () {
    $user = User::factory()->create();
    $machine = Machine::factory()->create([
        'machine_code' => 'MC-2001',
        'machine_name' => 'Assembly Conveyor',
    ]);

    $this->actingAs($user)
        ->get(route('machines.index'))
        ->assertOk()
        ->assertSee($machine->machine_code);
});

test('authenticated users can create machines', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('machines.store'), [
        'machine_code' => 'MC-3001',
        'machine_name' => 'Packaging Line',
        'status' => 'Running',
        'location' => 'Line C',
        'last_maintenance' => '2026-06-01',
        'next_maintenance' => '2026-07-01',
    ]);

    $machine = Machine::query()->where('machine_code', 'MC-3001')->firstOrFail();

    $response->assertRedirect(route('machines.show', $machine, absolute: false));
    $this->assertModelExists($machine);
});

test('authenticated users can update machines', function () {
    $user = User::factory()->create();
    $machine = Machine::factory()->create([
        'machine_code' => 'MC-4001',
        'status' => 'Idle',
    ]);

    $response = $this->actingAs($user)->put(route('machines.update', $machine), [
        'machine_code' => 'MC-4001',
        'machine_name' => 'Updated Press',
        'status' => 'Maintenance',
        'location' => 'Maintenance Bay',
        'last_maintenance' => '2026-06-10',
        'next_maintenance' => '2026-06-25',
    ]);

    $response->assertRedirect(route('machines.show', $machine, absolute: false));
    expect($machine->fresh())
        ->machine_name->toBe('Updated Press')
        ->status->toBe('Maintenance')
        ->location->toBe('Maintenance Bay');
});

test('authenticated users can delete machines', function () {
    $user = User::factory()->create();
    $machine = Machine::factory()->create();

    $this->actingAs($user)
        ->delete(route('machines.destroy', $machine))
        ->assertRedirect(route('machines.index', absolute: false));

    $this->assertModelMissing($machine);
});

test('machine codes must be unique', function () {
    $user = User::factory()->create();

    Machine::factory()->create([
        'machine_code' => 'MC-5001',
    ]);

    $this->actingAs($user)
        ->post(route('machines.store'), [
            'machine_code' => 'MC-5001',
            'machine_name' => 'Duplicate Machine',
            'status' => 'Running',
            'location' => 'Line A',
            'last_maintenance' => '2026-06-01',
            'next_maintenance' => '2026-07-01',
        ])
        ->assertSessionHasErrors('machine_code');
});
