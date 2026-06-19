import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ProductionOrder } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';

const statusClassNames: Record<ProductionOrder['status'], string> = {
    Pending: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
    Running: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300',
    Completed: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    Cancelled: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
};

export default function ShowProductionOrder({ productionOrder }: { productionOrder: ProductionOrder }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Production Orders',
            href: '/production-orders',
        },
        {
            title: productionOrder.order_number,
            href: route('production-orders.show', productionOrder.id),
        },
    ];

    const destroy = () => {
        if (window.confirm(`Delete ${productionOrder.order_number}?`)) {
            router.delete(route('production-orders.destroy', productionOrder.id));
        }
    };

    const progress = Math.round((productionOrder.completed_quantity / productionOrder.quantity) * 100);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={productionOrder.order_number} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-normal">{productionOrder.order_number}</h1>
                            <Badge variant="outline" className={statusClassNames[productionOrder.status]}>
                                {productionOrder.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{productionOrder.product_name}</p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('production-orders.index')} prefetch>
                                <ArrowLeft />
                                Back
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('production-orders.edit', productionOrder.id)} prefetch>
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
                    <Detail label="Assigned operator" value={productionOrder.assigned_operator} />
                    <Detail label="Deadline" value={productionOrder.deadline} />
                    <Detail label="Quantity" value={String(productionOrder.quantity)} />
                    <Detail label="Completed" value={`${productionOrder.completed_quantity} (${progress}%)`} />
                    <Detail label="Created" value={productionOrder.created_at ?? 'Unknown'} />
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
