<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductionLogRequest;
use App\Http\Requests\UpdateProductionLogRequest;
use App\Models\Machine;
use App\Models\ProductionLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductionLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('production-logs/index', [
            'productionLogs' => ProductionLog::query()
                ->with(['machine', 'operator'])
                ->latest('id')
                ->get()
                ->map(fn (ProductionLog $log): array => $this->productionLogData($log)),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('production-logs/create', [
            'machines' => Machine::query()->select(['id', 'machine_name', 'machine_code'])->orderBy('machine_name')->get(),
            'users' => User::query()->select(['id', 'name'])->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductionLogRequest $request): RedirectResponse
    {
        $log = ProductionLog::query()->create($request->validated());

        return to_route('production-logs.show', $log);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductionLog $productionLog): Response
    {
        $productionLog->load(['machine', 'operator']);

        return Inertia::render('production-logs/show', [
            'productionLog' => $this->productionLogData($productionLog),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductionLog $productionLog): Response
    {
        return Inertia::render('production-logs/edit', [
            'productionLog' => $this->productionLogData($productionLog),
            'machines' => Machine::query()->select(['id', 'machine_name', 'machine_code'])->orderBy('machine_name')->get(),
            'users' => User::query()->select(['id', 'name'])->orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductionLogRequest $request, ProductionLog $productionLog): RedirectResponse
    {
        $productionLog->update($request->validated());

        return to_route('production-logs.show', $productionLog);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductionLog $productionLog): RedirectResponse
    {
        $productionLog->delete();

        return to_route('production-logs.index');
    }

    /**
     * Format production log data for Inertia view.
     *
     * @return array<string, mixed>
     */
    private function productionLogData(ProductionLog $log): array
    {
        return [
            'id' => $log->id,
            'machine_id' => $log->machine_id,
            'machine_name' => $log->machine?->machine_name ?? 'Unknown Machine',
            'machine_code' => $log->machine?->machine_code ?? '',
            'operator_id' => $log->operator_id,
            'operator_name' => $log->operator?->name ?? 'Unknown Operator',
            'quantity_produced' => $log->quantity_produced,
            'timestamp' => $log->timestamp?->toDateTimeString(),
            'created_at' => $log->created_at?->toDateTimeString(),
        ];
    }
}
