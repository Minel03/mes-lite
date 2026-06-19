<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductionOrderRequest;
use App\Http\Requests\UpdateProductionOrderRequest;
use App\Models\ProductionOrder;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductionOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('production-orders/index', [
            'productionOrders' => ProductionOrder::query()
                ->latest('id')
                ->get()
                ->map(fn (ProductionOrder $productionOrder): array => $this->productionOrderData($productionOrder)),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('production-orders/create', [
            'statuses' => $this->statuses(),
            'users' => User::query()->select(['id', 'name'])->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductionOrderRequest $request): RedirectResponse
    {
        $productionOrder = ProductionOrder::query()->create($request->validated());

        return to_route('production-orders.show', $productionOrder);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductionOrder $productionOrder): Response
    {
        return Inertia::render('production-orders/show', [
            'productionOrder' => $this->productionOrderData($productionOrder),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductionOrder $productionOrder): Response
    {
        return Inertia::render('production-orders/edit', [
            'productionOrder' => $this->productionOrderData($productionOrder),
            'statuses' => $this->statuses(),
            'users' => User::query()->select(['id', 'name'])->orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductionOrderRequest $request, ProductionOrder $productionOrder): RedirectResponse
    {
        $productionOrder->update($request->validated());

        return to_route('production-orders.show', $productionOrder);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductionOrder $productionOrder): RedirectResponse
    {
        $productionOrder->delete();

        return to_route('production-orders.index');
    }

    /**
     * @return array<int, string>
     */
    private function statuses(): array
    {
        return ['Pending', 'Running', 'Completed', 'Cancelled'];
    }

    /**
     * @return array<string, mixed>
     */
    private function productionOrderData(ProductionOrder $productionOrder): array
    {
        return [
            'id' => $productionOrder->id,
            'order_number' => $productionOrder->order_number,
            'product_name' => $productionOrder->product_name,
            'quantity' => $productionOrder->quantity,
            'completed_quantity' => $productionOrder->completed_quantity,
            'status' => $productionOrder->status,
            'assigned_operator' => $productionOrder->assigned_operator,
            'deadline' => $productionOrder->deadline?->toDateString(),
            'created_at' => $productionOrder->created_at?->toDateTimeString(),
        ];
    }
}
