<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMachineRequest;
use App\Http\Requests\UpdateMachineRequest;
use App\Models\Machine;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MachineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('machines/index', [
            'machines' => Machine::query()
                ->latest('id')
                ->get()
                ->map(fn (Machine $machine): array => $this->machineData($machine)),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('machines/create', [
            'statuses' => $this->statuses(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMachineRequest $request): RedirectResponse
    {
        $machine = Machine::query()->create($request->validated());

        return to_route('machines.show', $machine);
    }

    /**
     * Display the specified resource.
     */
    public function show(Machine $machine): Response
    {
        return Inertia::render('machines/show', [
            'machine' => $this->machineData($machine),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Machine $machine): Response
    {
        return Inertia::render('machines/edit', [
            'machine' => $this->machineData($machine),
            'statuses' => $this->statuses(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMachineRequest $request, Machine $machine): RedirectResponse
    {
        $machine->update($request->validated());

        return to_route('machines.show', $machine);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Machine $machine): RedirectResponse
    {
        $machine->delete();

        return to_route('machines.index');
    }

    /**
     * @return array<int, string>
     */
    private function statuses(): array
    {
        return ['Running', 'Offline', 'Maintenance', 'Idle'];
    }

    /**
     * @return array<string, mixed>
     */
    private function machineData(Machine $machine): array
    {
        return [
            'id' => $machine->id,
            'machine_code' => $machine->machine_code,
            'machine_name' => $machine->machine_name,
            'status' => $machine->status,
            'location' => $machine->location,
            'last_maintenance' => $machine->last_maintenance?->toDateString(),
            'next_maintenance' => $machine->next_maintenance?->toDateString(),
            'created_at' => $machine->created_at?->toDateTimeString(),
        ];
    }
}
