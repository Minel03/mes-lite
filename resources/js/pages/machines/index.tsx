import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Machine } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Machines',
        href: '/machines',
    },
];

const statusClassNames: Record<Machine['status'], string> = {
    Running: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    Offline: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
    Maintenance: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
    Idle: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
};

export default function MachinesIndex({ machines }: { machines: Machine[] }) {
    const destroy = (machine: Machine) => {
        if (window.confirm(`Delete ${machine.machine_code}?`)) {
            router.delete(route('machines.destroy', machine.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Machines" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-normal">Machines</h1>
                        <p className="text-sm text-muted-foreground">Track equipment status, location, and maintenance dates.</p>
                    </div>

                    <Button asChild>
                        <Link href={route('machines.create')} prefetch>
                            <Plus />
                            New machine
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50 text-left text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Code</th>
                                    <th className="px-4 py-3 font-medium">Machine</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Location</th>
                                    <th className="px-4 py-3 font-medium">Next maintenance</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {machines.map((machine) => (
                                    <tr key={machine.id} className="border-b last:border-b-0">
                                        <td className="px-4 py-3 font-medium">{machine.machine_code}</td>
                                        <td className="px-4 py-3">{machine.machine_name}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className={statusClassNames[machine.status]}>
                                                {machine.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">{machine.location}</td>
                                        <td className="px-4 py-3">{machine.next_maintenance ?? 'Not scheduled'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild aria-label={`View ${machine.machine_code}`}>
                                                    <Link href={route('machines.show', machine.id)} prefetch>
                                                        <Eye />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild aria-label={`Edit ${machine.machine_code}`}>
                                                    <Link href={route('machines.edit', machine.id)} prefetch>
                                                        <Pencil />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Delete ${machine.machine_code}`}
                                                    onClick={() => destroy(machine)}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {machines.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                            No machines have been registered yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
