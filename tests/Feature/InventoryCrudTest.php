<?php

use App\Models\Inventory;
use App\Models\Product;
use App\Models\User;

// ---- Products ----

test('guests are redirected from products', function () {
    $this->get('/products')->assertRedirect('/login');
});

test('authenticated users can view products', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $this->actingAs($user)
        ->get(route('products.index'))
        ->assertOk()
        ->assertSee($product->sku);
});

test('authenticated users can access create product page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('products.create'))
        ->assertOk();
});

test('authenticated users can create a product', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('products.store'), [
        'sku' => 'PRD-TEST-001',
        'name' => 'Test Widget',
        'description' => 'A test product',
        'unit' => 'pcs',
        'price' => 9.99,
        'category' => 'Component',
    ]);

    $product = Product::query()->where('sku', 'PRD-TEST-001')->firstOrFail();

    $response->assertRedirect(route('products.show', $product, absolute: false));
    $this->assertModelExists($product);

    // Inventory record should be auto-created
    $this->assertDatabaseHas('inventories', ['product_id' => $product->id, 'quantity' => 0]);
});

test('sku must be unique when creating product', function () {
    $user = User::factory()->create();
    Product::factory()->create(['sku' => 'DUPE-001']);

    $this->actingAs($user)->post(route('products.store'), [
        'sku' => 'DUPE-001',
        'name' => 'Duplicate',
        'unit' => 'pcs',
        'price' => 1.00,
    ])->assertSessionHasErrors('sku');
});

test('authenticated users can view a product', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $this->actingAs($user)
        ->get(route('products.show', $product))
        ->assertOk();
});

test('authenticated users can edit a product', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $this->actingAs($user)
        ->get(route('products.edit', $product))
        ->assertOk();
});

test('authenticated users can update a product', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $response = $this->actingAs($user)->put(route('products.update', $product), [
        'sku' => $product->sku,
        'name' => 'Updated Name',
        'unit' => 'kg',
        'price' => 19.99,
    ]);

    $response->assertRedirect(route('products.show', $product, absolute: false));
    expect($product->fresh()->name)->toBe('Updated Name');
});

test('authenticated users can delete a product', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $this->actingAs($user)
        ->delete(route('products.destroy', $product))
        ->assertRedirect(route('products.index', absolute: false));

    $this->assertModelMissing($product);
});

// ---- Inventory ----

test('guests are redirected from inventory', function () {
    $this->get('/inventory')->assertRedirect('/login');
});

test('authenticated users can view inventory list', function () {
    $user = User::factory()->create();
    $inventory = Inventory::factory()->create();

    $this->actingAs($user)
        ->get(route('inventory.index'))
        ->assertOk()
        ->assertSee($inventory->product->name);
});

test('authenticated users can view inventory item', function () {
    $user = User::factory()->create();
    $inventory = Inventory::factory()->create();

    $this->actingAs($user)
        ->get(route('inventory.show', $inventory))
        ->assertOk();
});

test('authenticated users can record a stock-in transaction', function () {
    $user = User::factory()->create();
    $inventory = Inventory::factory()->create(['quantity' => 10]);

    $response = $this->actingAs($user)->post(route('inventory.store'), [
        'inventory_id' => $inventory->id,
        'type' => 'In',
        'quantity' => 50,
        'reference' => 'PO-9999',
    ]);

    $response->assertRedirect(route('inventory.index', absolute: false));
    expect($inventory->fresh()->quantity)->toBe(60);
});

test('authenticated users can record a stock-out transaction', function () {
    $user = User::factory()->create();
    $inventory = Inventory::factory()->create(['quantity' => 100]);

    $this->actingAs($user)->post(route('inventory.store'), [
        'inventory_id' => $inventory->id,
        'type' => 'Out',
        'quantity' => 30,
    ])->assertRedirect(route('inventory.index', absolute: false));

    expect($inventory->fresh()->quantity)->toBe(70);
});

test('authenticated users can update inventory settings', function () {
    $user = User::factory()->create();
    $inventory = Inventory::factory()->create(['minimum_quantity' => 5, 'location' => null]);

    $this->actingAs($user)->put(route('inventory.update', $inventory), [
        'minimum_quantity' => 20,
        'location' => 'Shelf A1',
    ])->assertRedirect(route('inventory.show', $inventory, absolute: false));

    expect($inventory->fresh())
        ->minimum_quantity->toBe(20)
        ->location->toBe('Shelf A1');
});
