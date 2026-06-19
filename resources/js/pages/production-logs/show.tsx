import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ProductionLog } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';

export default function ShowProductionLog({ productionLog }: { productionLog: ProductionLog }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Production Logs',
            href: '/production-logs',
        },
        {
            title: `Log #${productionLog.id}`,
            href: route('production-logs.show', productionLog.id),
        },
    ];

    const destroy = () => {
        if (window.confirm(`Delete this production log entry?`)) {
            router.delete(route('production-logs.destroy', productionLog.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Production Log #${productionLog.id}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-normal">Production Log #{productionLog.id}</h1>
                        </div>
                        <p className="text-muted-foreground text-sm">Recorded entry details.</p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('production-logs.index')} prefetch>
                                <ArrowLeft />
                                Back
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('production-logs.edit', productionLog.id)} prefetch>
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
                    <Detail label="Machine" value={`${productionLog.machine_name} (${productionLog.machine_code})`} />
                    <Detail label="Operator" value={productionLog.operator_name} />
                    <Detail label="Quantity Produced" value={`${productionLog.quantity_produced} units`} />
                    <Detail label="Timestamp" value={productionLog.timestamp} />
                    <Detail label="Created At" value={productionLog.created_at ?? 'Unknown'} />
                </div>
            </div>
        </AppLayout>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border p-4">
            <div className="text-muted-foreground text-sm">{label}</div>
            <div className="mt-1 font-medium">{value}</div>
        </div>
    );
}
