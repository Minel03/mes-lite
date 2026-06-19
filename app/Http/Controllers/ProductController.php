<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Inventory;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('products/index', [
            'products' => Product::query()
                ->with('inventory')
                ->latest('id')
                ->get()
                ->map(fn (Product $product): array => $this->productData($product)),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('products/create', [
            'units' => $this->units(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        $product = Product::query()->create($request->validated());

        // Auto-create inventory record for the new product
        Inventory::query()->create([
            'product_id' => $product->id,
            'quantity' => 0,
            'minimum_quantity' => 0,
        ]);

        return to_route('products.show', $product);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): Response
    {
        $product->load(['inventory.transactions' => fn ($q) => $q->with('user')->latest('id')->limit(20)]);

        return Inertia::render('products/show', [
            'product' => $this->productData($product),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product): Response
    {
        return Inertia::render('products/edit', [
            'product' => $this->productData($product),
            'units' => $this->units(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $product->update($request->validated());

        return to_route('products.show', $product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return to_route('products.index');
    }

    /**
     * @return array<int, string>
     */
    private function units(): array
    {
        return ['pcs', 'kg', 'liter', 'meter', 'box', 'roll', 'set'];
    }

    /**
     * @return array<string, mixed>
     */
    private function productData(Product $product): array
    {
        return [
            'id' => $product->id,
            'sku' => $product->sku,
            'name' => $product->name,
            'description' => $product->description,
            'unit' => $product->unit,
            'price' => $product->price,
            'category' => $product->category,
            'created_at' => $product->created_at?->toDateTimeString(),
            'inventory' => $product->inventory ? [
                'id' => $product->inventory->id,
                'quantity' => $product->inventory->quantity,
                'minimum_quantity' => $product->inventory->minimum_quantity,
                'location' => $product->inventory->location,
                'is_low_stock' => $product->inventory->quantity <= $product->inventory->minimum_quantity,
                'transactions' => $product->inventory->relationLoaded('transactions')
                    ? $product->inventory->transactions->map(fn ($tx) => [
                        'id' => $tx->id,
                        'type' => $tx->type,
                        'quantity' => $tx->quantity,
                        'reference' => $tx->reference,
                        'notes' => $tx->notes,
                        'user_name' => $tx->user->name,
                        'created_at' => $tx->created_at?->toDateTimeString(),
                    ])->all()
                    : [],
            ] : null,
        ];
    }
}
