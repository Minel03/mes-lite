import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ProductionOrder } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Production Orders',
        href: '/production-orders',
    },
];

const statusClassNames: Record<ProductionOrder['status'], string> = {
    Pending: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
    Running: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300',
    Completed: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    Cancelled: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
};

export default function ProductionOrdersIndex({ productionOrders }: { productionOrders: ProductionOrder[] }) {
    const destroy = (productionOrder: ProductionOrder) => {
        if (window.confirm(`Delete ${productionOrder.order_number}?`)) {
            router.delete(route('production-orders.destroy', productionOrder.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Production Orders" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-normal">Production Orders</h1>
                        <p className="text-sm text-muted-foreground">Plan quantities, operators, deadlines, and production status.</p>
                    </div>

                    <Button asChild>
                        <Link href={route('production-orders.create')} prefetch>
                            <Plus />
                            New order
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50 text-left text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Order</th>
                                    <th className="px-4 py-3 font-medium">Product</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Progress</th>
                                    <th className="px-4 py-3 font-medium">Operator</th>
                                    <th className="px-4 py-3 font-medium">Deadline</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productionOrders.map((productionOrder) => (
                                    <tr key={productionOrder.id} className="border-b last:border-b-0">
                                        <td className="px-4 py-3 font-medium">{productionOrder.order_number}</td>
                                        <td className="px-4 py-3">{productionOrder.product_name}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className={statusClassNames[productionOrder.status]}>
                                                {productionOrder.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            {productionOrder.completed_quantity} / {productionOrder.quantity}
                                        </td>
                                        <td className="px-4 py-3">{productionOrder.assigned_operator}</td>
                                        <td className="px-4 py-3">{productionOrder.deadline}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild aria-label={`View ${productionOrder.order_number}`}>
                                                    <Link href={route('production-orders.show', productionOrder.id)} prefetch>
                                                        <Eye />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild aria-label={`Edit ${productionOrder.order_number}`}>
                                                    <Link href={route('production-orders.edit', productionOrder.id)} prefetch>
                                                        <Pencil />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Delete ${productionOrder.order_number}`}
                                                    onClick={() => destroy(productionOrder)}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {productionOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                                            No production orders have been created yet.
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
