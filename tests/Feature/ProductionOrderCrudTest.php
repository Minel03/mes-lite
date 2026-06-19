<?php

use App\Models\ProductionOrder;
use App\Models\User;

test('guests are redirected from production orders', function () {
    $this->get('/production-orders')->assertRedirect('/login');
});

test('authenticated users can view production orders', function () {
    $user = User::factory()->create();
    $productionOrder = ProductionOrder::factory()->create([
        'order_number' => 'PO-2001',
        'product_name' => 'Control Panel',
    ]);

    $this->actingAs($user)
        ->get(route('production-orders.index'))
        ->assertOk()
        ->assertSee($productionOrder->order_number);
});

test('authenticated users can create production orders', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('production-orders.store'), [
        'order_number' => 'PO-3001',
        'product_name' => 'Sensor Bracket',
        'quantity' => 250,
        'completed_quantity' => 25,
        'status' => 'Running',
        'assigned_operator' => 'Operator One',
        'deadline' => '2026-07-15',
    ]);

    $productionOrder = ProductionOrder::query()->where('order_number', 'PO-3001')->firstOrFail();

    $response->assertRedirect(route('production-orders.show', $productionOrder, absolute: false));
    $this->assertModelExists($productionOrder);
});

test('authenticated users can update production orders', function () {
    $user = User::factory()->create();
    $productionOrder = ProductionOrder::factory()->create([
        'order_number' => 'PO-4001',
        'status' => 'Pending',
    ]);

    $response = $this->actingAs($user)->put(route('production-orders.update', $productionOrder), [
        'order_number' => 'PO-4001',
        'product_name' => 'Updated Assembly',
        'quantity' => 600,
        'completed_quantity' => 600,
        'status' => 'Completed',
        'assigned_operator' => 'Operator Two',
        'deadline' => '2026-08-01',
    ]);

    $response->assertRedirect(route('production-orders.show', $productionOrder, absolute: false));
    expect($productionOrder->fresh())
        ->product_name->toBe('Updated Assembly')
        ->completed_quantity->toBe(600)
        ->status->toBe('Completed');
});

test('authenticated users can delete production orders', function () {
    $user = User::factory()->create();
    $productionOrder = ProductionOrder::factory()->create();

    $this->actingAs($user)
        ->delete(route('production-orders.destroy', $productionOrder))
        ->assertRedirect(route('production-orders.index', absolute: false));

    $this->assertModelMissing($productionOrder);
});

test('order numbers must be unique', function () {
    $user = User::factory()->create();

    ProductionOrder::factory()->create([
        'order_number' => 'PO-5001',
    ]);

    $this->actingAs($user)
        ->post(route('production-orders.store'), [
            'order_number' => 'PO-5001',
            'product_name' => 'Duplicate Order',
            'quantity' => 100,
            'completed_quantity' => 0,
            'status' => 'Pending',
            'assigned_operator' => 'Operator One',
            'deadline' => '2026-07-01',
        ])
        ->assertSessionHasErrors('order_number');
});

test('completed quantity cannot exceed quantity', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('production-orders.store'), [
            'order_number' => 'PO-6001',
            'product_name' => 'Invalid Progress',
            'quantity' => 100,
            'completed_quantity' => 101,
            'status' => 'Running',
            'assigned_operator' => 'Operator One',
            'deadline' => '2026-07-01',
        ])
        ->assertSessionHasErrors('completed_quantity');
});
