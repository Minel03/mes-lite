import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type InventoryItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Eye, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', href: '/inventory' },
];

export default function InventoryIndex({ inventories }: { inventories: InventoryItem[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-normal">Inventory</h1>
                        <p className="text-sm text-muted-foreground">Monitor stock levels and record transactions.</p>
                    </div>

                    <Button asChild>
                        <Link href={route('inventory.create')} prefetch>
                            <Plus />
                            Record transaction
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50 text-left text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">SKU</th>
                                    <th className="px-4 py-3 font-medium">Product</th>
                                    <th className="px-4 py-3 font-medium">Category</th>
                                    <th className="px-4 py-3 font-medium">Location</th>
                                    <th className="px-4 py-3 font-medium">Min. qty</th>
                                    <th className="px-4 py-3 font-medium">Stock</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventories.map((inv) => (
                                    <tr key={inv.id} className="border-b last:border-b-0">
                                        <td className="px-4 py-3 font-mono text-xs font-medium">{inv.product?.sku}</td>
                                        <td className="px-4 py-3 font-medium">{inv.product?.name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{inv.product?.category ?? '—'}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{inv.location ?? '—'}</td>
                                        <td className="px-4 py-3">{inv.minimum_quantity}</td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant="outline"
                                                className={
                                                    inv.is_low_stock
                                                        ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300'
                                                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                                                }
                                            >
                                                {inv.quantity} {inv.product?.unit}
                                                {inv.is_low_stock && ' ⚠'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild aria-label={`View ${inv.product?.sku}`}>
                                                    <Link href={route('inventory.show', inv.id)} prefetch>
                                                        <Eye />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {inventories.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                                            No inventory records found. Add a product first.
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
