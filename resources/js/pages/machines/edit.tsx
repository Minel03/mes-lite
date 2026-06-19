import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Machine } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

type MachineForm = {
    machine_code: string;
    machine_name: string;
    status: Machine['status'];
    location: string;
    last_maintenance: string;
    next_maintenance: string;
};

export default function EditMachine({ machine, statuses }: { machine: Machine; statuses: Machine['status'][] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Machines',
            href: '/machines',
        },
        {
            title: machine.machine_code,
            href: route('machines.show', machine.id),
        },
        {
            title: 'Edit',
            href: route('machines.edit', machine.id),
        },
    ];

    const { data, setData, put, errors, processing } = useForm<MachineForm>({
        machine_code: machine.machine_code,
        machine_name: machine.machine_name,
        status: machine.status,
        location: machine.location,
        last_maintenance: machine.last_maintenance ?? '',
        next_maintenance: machine.next_maintenance ?? '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        put(route('machines.update', machine.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${machine.machine_code}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-normal">Edit {machine.machine_code}</h1>
                        <p className="text-sm text-muted-foreground">Update machine identity, status, and maintenance planning.</p>
                    </div>

                    <Button variant="outline" asChild>
                        <Link href={route('machines.show', machine.id)} prefetch>
                            <ArrowLeft />
                            Back
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="max-w-3xl space-y-6">
                    <MachineFields data={data} errors={errors} statuses={statuses} setData={setData} />

                    <Button disabled={processing}>
                        <Save />
                        Save changes
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}

function MachineFields({
    data,
    errors,
    statuses,
    setData,
}: {
    data: MachineForm;
    errors: Partial<Record<keyof MachineForm, string>>;
    statuses: Machine['status'][];
    setData: <K extends keyof MachineForm>(key: K, value: MachineForm[K]) => void;
}) {
    return (
        <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
                <Label htmlFor="machine_code">Machine code</Label>
                <Input id="machine_code" value={data.machine_code} onChange={(event) => setData('machine_code', event.target.value)} required />
                <InputError message={errors.machine_code} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="machine_name">Machine name</Label>
                <Input id="machine_name" value={data.machine_name} onChange={(event) => setData('machine_name', event.target.value)} required />
                <InputError message={errors.machine_name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={data.status} onValueChange={(value) => setData('status', value as Machine['status'])}>
                    <SelectTrigger id="status">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.status} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={data.location} onChange={(event) => setData('location', event.target.value)} required />
                <InputError message={errors.location} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="last_maintenance">Last maintenance</Label>
                <Input
                    id="last_maintenance"
                    type="date"
                    value={data.last_maintenance}
                    onChange={(event) => setData('last_maintenance', event.target.value)}
                />
                <InputError message={errors.last_maintenance} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="next_maintenance">Next maintenance</Label>
                <Input
                    id="next_maintenance"
                    type="date"
                    value={data.next_maintenance}
                    onChange={(event) => setData('next_maintenance', event.target.value)}
                />
                <InputError message={errors.next_maintenance} />
            </div>
        </div>
    );
}
