import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Machine } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';

const statusClassNames: Record<Machine['status'], string> = {
    Running: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    Offline: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
    Maintenance: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
    Idle: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
};

export default function ShowMachine({ machine }: { machine: Machine }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Machines',
            href: '/machines',
        },
        {
            title: machine.machine_code,
            href: route('machines.show', machine.id),
        },
    ];

    const destroy = () => {
        if (window.confirm(`Delete ${machine.machine_code}?`)) {
            router.delete(route('machines.destroy', machine.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={machine.machine_code} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-normal">{machine.machine_code}</h1>
                            <Badge variant="outline" className={statusClassNames[machine.status]}>
                                {machine.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{machine.machine_name}</p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('machines.index')} prefetch>
                                <ArrowLeft />
                                Back
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('machines.edit', machine.id)} prefetch>
                                <Pencil />
                                Edit
                            </Link>
                        </Button>
                        <Button type="button" variant="destructive" onClick={destroy}>
                            <Trash2 />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid max-w-4xl gap-4 md:grid-cols-2">
                    <Detail label="Location" value={machine.location} />
                    <Detail label="Created" value={machine.created_at ?? 'Unknown'} />
                    <Detail label="Last maintenance" value={machine.last_maintenance ?? 'No record'} />
                    <Detail label="Next maintenance" value={machine.next_maintenance ?? 'Not scheduled'} />
                </div>
            </div>
        </AppLayout>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="mt-1 font-medium">{value}</div>
        </div>
    );
}
