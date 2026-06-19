import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type InventoryItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, Plus, SlidersHorizontal, TrendingDown, TrendingUp } from 'lucide-react';

const transactionTypeMeta: Record<string, { label: string; className: string }> = {
    In: {
        label: 'Stock In',
        className: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    },
    Out: {
        label: 'Stock Out',
        className: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
    },
    Adjustment: {
        label: 'Adjustment',
        className: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
    },
};

export default function ShowInventory({ inventory }: { inventory: InventoryItem }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Inventory', href: '/inventory' },
        { title: inventory.product?.name ?? 'Item', href: route('inventory.show', inventory.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Inventory – ${inventory.product?.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-normal">{inventory.product?.name}</h1>
                        <p className="text-muted-foreground font-mono text-sm">{inventory.product?.sku}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('inventory.index')} prefetch>
                                <ArrowLeft />
                                Back
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route('inventory.edit', inventory.id)} prefetch>
                                <Pencil />
                                Edit
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('inventory.create')} prefetch>
                                <Plus />
                                Transaction
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stock summary cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border p-4">
                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Current stock</p>
                        <p
                            className={`mt-1 text-2xl font-bold ${inventory.is_low_stock ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}
                        >
                            {inventory.quantity} <span className="text-muted-foreground text-base font-normal">{inventory.product?.unit}</span>
                        </p>
                        {inventory.is_low_stock && <p className="mt-1 text-xs text-red-600 dark:text-red-400">⚠ Below minimum threshold</p>}
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Minimum stock</p>
                        <p className="mt-1 text-2xl font-bold">
                            {inventory.minimum_quantity}{' '}
                            <span className="text-muted-foreground text-base font-normal">{inventory.product?.unit}</span>
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Location</p>
                        <p className="mt-1 text-lg font-semibold">{inventory.location ?? '—'}</p>
                    </div>
                </div>

                {/* Transaction history */}
                <div className="overflow-hidden rounded-lg border">
                    <div className="border-b px-4 py-3">
                        <h2 className="font-semibold">Transaction history</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-muted-foreground border-b text-left">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Type</th>
                                    <th className="px-4 py-3 font-medium">Qty</th>
                                    <th className="px-4 py-3 font-medium">Reference</th>
                                    <th className="px-4 py-3 font-medium">Notes</th>
                                    <th className="px-4 py-3 font-medium">By</th>
                                    <th className="px-4 py-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.transactions && inventory.transactions.length > 0 ? (
                                    inventory.transactions.map((tx) => {
                                        const meta = transactionTypeMeta[tx.type];
                                        return (
                                            <tr key={tx.id} className="border-b last:border-b-0">
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline" className={meta.className}>
                                                        {tx.type === 'In' && <TrendingUp className="mr-1 h-3 w-3" />}
                                                        {tx.type === 'Out' && <TrendingDown className="mr-1 h-3 w-3" />}
                                                        {tx.type === 'Adjustment' && <SlidersHorizontal className="mr-1 h-3 w-3" />}
                                                        {meta.label}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 font-medium">{tx.quantity}</td>
                                                <td className="text-muted-foreground px-4 py-3">{tx.reference ?? '—'}</td>
                                                <td className="text-muted-foreground px-4 py-3">{tx.notes ?? '—'}</td>
                                                <td className="px-4 py-3">{tx.user_name}</td>
                                                <td className="text-muted-foreground px-4 py-3">{tx.created_at}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-4 py-12 text-center">
                                            No transactions recorded yet.
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
