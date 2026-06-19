<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryTransactionRequest;
use App\Models\Inventory;
use App\Models\InventoryTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    /**
     * Display a listing of all inventory items.
     */
    public function index(): Response
    {
        return Inertia::render('inventory/index', [
            'inventories' => Inventory::query()
                ->with('product')
                ->latest('id')
                ->get()
                ->map(fn (Inventory $inventory): array => $this->inventoryData($inventory)),
        ]);
    }

    /**
     * Show the form for creating a new transaction.
     */
    public function create(): Response
    {
        return Inertia::render('inventory/create', [
            'inventories' => Inventory::query()
                ->with('product')
                ->get()
                ->map(fn (Inventory $inv) => [
                    'id' => $inv->id,
                    'label' => "{$inv->product->name} ({$inv->product->sku})",
                    'quantity' => $inv->quantity,
                ]),
            'types' => $this->types(),
        ]);
    }

    /**
     * Store a new transaction and update inventory quantity.
     */
    public function store(StoreInventoryTransactionRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        /** @var Inventory $inventory */
        $inventory = Inventory::query()->findOrFail($validated['inventory_id']);

        InventoryTransaction::query()->create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        // Adjust quantity based on transaction type
        $quantity = (int) $validated['quantity'];
        $inventory->quantity += match ($validated['type']) {
            'In' => $quantity,
            'Out' => -$quantity,
            'Adjustment' => $quantity - $inventory->quantity,
            default => 0,
        };
        $inventory->save();

        return to_route('inventory.index');
    }

    /**
     * Display specific inventory with transaction history.
     */
    public function show(Inventory $inventory): Response
    {
        $inventory->load(['product', 'transactions' => fn ($q) => $q->with('user')->latest('id')]);

        return Inertia::render('inventory/show', [
            'inventory' => $this->inventoryData($inventory, loadTransactions: true),
        ]);
    }

    /**
     * Show the form for editing the specified inventory item.
     */
    public function edit(Inventory $inventory): Response
    {
        $inventory->load('product');

        return Inertia::render('inventory/edit', [
            'inventory' => $this->inventoryData($inventory),
        ]);
    }

    /**
     * Update the specified inventory item.
     */
    public function update(Request $request, Inventory $inventory): RedirectResponse
    {
        $validated = $request->validate([
            'minimum_quantity' => ['required', 'integer', 'min:0'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        $inventory->minimum_quantity = (int) $validated['minimum_quantity'];
        $inventory->location = $validated['location'];
        $inventory->save();

        return to_route('inventory.show', $inventory);
    }

    /**
     * Remove the specified inventory.
     */
    public function destroy(Inventory $inventory): RedirectResponse
    {
        Inventory::destroy($inventory->id);

        return to_route('inventory.index');
    }

    /**
     * @return array<int, string>
     */
    private function types(): array
    {
        return ['In', 'Out', 'Adjustment'];
    }

    /**
     * @return array<string, mixed>
     */
    private function inventoryData(Inventory $inventory, bool $loadTransactions = false): array
    {
        return [
            'id' => $inventory->id,
            'quantity' => $inventory->quantity,
            'minimum_quantity' => $inventory->minimum_quantity,
            'location' => $inventory->location,
            'is_low_stock' => $inventory->quantity <= $inventory->minimum_quantity,
            'product' => $inventory->product ? [
                'id' => $inventory->product->id,
                'sku' => $inventory->product->sku,
                'name' => $inventory->product->name,
                'unit' => $inventory->product->unit,
                'category' => $inventory->product->category,
            ] : null,
            'transactions' => $loadTransactions && $inventory->relationLoaded('transactions')
                ? $inventory->transactions->map(fn (InventoryTransaction $tx) => [
                    'id' => $tx->id,
                    'type' => $tx->type,
                    'quantity' => $tx->quantity,
                    'reference' => $tx->reference,
                    'notes' => $tx->notes,
                    'user_name' => $tx->user->name,
                    'created_at' => $tx->created_at?->toDateTimeString(),
                ])->all()
                : [],
        ];
    }
}
