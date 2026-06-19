<?php

use App\Models\Machine;
use App\Models\ProductionLog;
use App\Models\User;

test('guests are redirected from production logs', function () {
    $this->get('/production-logs')->assertRedirect('/login');
});

test('authenticated users can view production logs', function () {
    $user = User::factory()->create();
    $log = ProductionLog::factory()->create();

    $this->actingAs($user)
        ->get(route('production-logs.index'))
        ->assertOk()
        ->assertSee((string) $log->quantity_produced);
});

test('authenticated users can access create log page', function () {
    $user = User::factory()->create();
    Machine::factory()->create();

    $this->actingAs($user)
        ->get(route('production-logs.create'))
        ->assertOk();
});

test('authenticated users can create production logs', function () {
    $user = User::factory()->create();
    $machine = Machine::factory()->create();
    $operator = User::factory()->create();

    $response = $this->actingAs($user)->post(route('production-logs.store'), [
        'machine_id' => $machine->id,
        'operator_id' => $operator->id,
        'quantity_produced' => 150,
        'timestamp' => '2026-06-19 14:00:00',
    ]);

    $log = ProductionLog::query()->where('quantity_produced', 150)->firstOrFail();

    $response->assertRedirect(route('production-logs.show', $log, absolute: false));
    $this->assertModelExists($log);
});

test('authenticated users can view a single production log', function () {
    $user = User::factory()->create();
    $log = ProductionLog::factory()->create();

    $this->actingAs($user)
        ->get(route('production-logs.show', $log))
        ->assertOk();
});

test('authenticated users can access edit log page', function () {
    $user = User::factory()->create();
    $log = ProductionLog::factory()->create();

    $this->actingAs($user)
        ->get(route('production-logs.edit', $log))
        ->assertOk();
});

test('authenticated users can update production logs', function () {
    $user = User::factory()->create();
    $log = ProductionLog::factory()->create();
    $machine = Machine::factory()->create();
    $operator = User::factory()->create();

    $response = $this->actingAs($user)->put(route('production-logs.update', $log), [
        'machine_id' => $machine->id,
        'operator_id' => $operator->id,
        'quantity_produced' => 250,
        'timestamp' => '2026-06-19 15:00:00',
    ]);

    $response->assertRedirect(route('production-logs.show', $log, absolute: false));
    expect($log->fresh())
        ->quantity_produced->toBe(250)
        ->machine_id->toBe($machine->id)
        ->operator_id->toBe($operator->id);
});

test('authenticated users can delete production logs', function () {
    $user = User::factory()->create();
    $log = ProductionLog::factory()->create();

    $this->actingAs($user)
        ->delete(route('production-logs.destroy', $log))
        ->assertRedirect(route('production-logs.index', absolute: false));

    $this->assertModelMissing($log);
});
