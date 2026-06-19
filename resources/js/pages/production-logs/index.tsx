import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ProductionLog } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Production Logs',
        href: '/production-logs',
    },
];

export default function ProductionLogsIndex({ productionLogs }: { productionLogs: ProductionLog[] }) {
    const destroy = (log: ProductionLog) => {
        if (window.confirm(`Delete this production log entry?`)) {
            router.delete(route('production-logs.destroy', log.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Production Logs" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-normal">Production Logs</h1>
                        <p className="text-sm text-muted-foreground">Track updates on quantity produced by machine and operator.</p>
                    </div>

                    <Button asChild>
                        <Link href={route('production-logs.create')} prefetch>
                            <Plus />
                            Log Production
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50 text-left text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Machine</th>
                                    <th className="px-4 py-3 font-medium">Operator</th>
                                    <th className="px-4 py-3 font-medium">Quantity Produced</th>
                                    <th className="px-4 py-3 font-medium">Timestamp</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productionLogs.map((log) => (
                                    <tr key={log.id} className="border-b last:border-b-0">
                                        <td className="px-4 py-3 font-medium">
                                            <div>{log.machine_name}</div>
                                            <div className="text-xs text-muted-foreground">{log.machine_code}</div>
                                        </td>
                                        <td className="px-4 py-3">{log.operator_name}</td>
                                        <td className="px-4 py-3 font-semibold">{log.quantity_produced} units</td>
                                        <td className="px-4 py-3">{log.timestamp}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild aria-label={`View log`}>
                                                    <Link href={route('production-logs.show', log.id)} prefetch>
                                                        <Eye />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild aria-label={`Edit log`}>
                                                    <Link href={route('production-logs.edit', log.id)} prefetch>
                                                        <Pencil />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Delete log`}
                                                    onClick={() => destroy(log)}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {productionLogs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                                            No production logs have been recorded yet.
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
