import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Product } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, SlidersHorizontal, TrendingDown, TrendingUp } from 'lucide-react';

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

export default function ShowProduct({ product }: { product: Product }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Products', href: '/products' },
        { title: product.name, href: route('products.show', product.id) },
    ];

    const inv = product.inventory;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-normal">{product.name}</h1>
                        <p className="text-muted-foreground font-mono text-sm">{product.sku}</p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('products.index')} prefetch>
                                <ArrowLeft />
                                Back
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('products.edit', product.id)} prefetch>
                                <Pencil />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Product details */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <DetailCard label="Category" value={product.category ?? '—'} />
                    <DetailCard label="Unit" value={product.unit} />
                    <DetailCard label="Price" value={`${Number(product.price).toFixed(2)}`} />
                    <DetailCard label="Created" value={product.created_at?.split(' ')[0] ?? '—'} />
                </div>

                {product.description && (
                    <div className="rounded-lg border p-4">
                        <p className="text-muted-foreground text-sm">{product.description}</p>
                    </div>
                )}

                {/* Inventory snapshot */}
                {inv && (
                    <div className="rounded-lg border">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h2 className="font-semibold">Inventory</h2>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route('inventory.show', inv.id)}>View full inventory</Link>
                            </Button>
                        </div>
                        <div className="grid gap-4 p-4 sm:grid-cols-3">
                            <DetailCard
                                label="Current stock"
                                value={`${inv.quantity} ${product.unit}`}
                                highlight={inv.is_low_stock ? 'danger' : 'success'}
                            />
                            <DetailCard label="Minimum stock" value={`${inv.minimum_quantity} ${product.unit}`} />
                            <DetailCard label="Location" value={inv.location ?? '—'} />
                        </div>

                        {/* Recent transactions */}
                        {inv.transactions && inv.transactions.length > 0 && (
                            <div className="border-t">
                                <p className="text-muted-foreground px-4 py-2 text-xs font-medium tracking-wide uppercase">Recent transactions</p>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50 text-muted-foreground border-b text-left">
                                            <tr>
                                                <th className="px-4 py-2 font-medium">Type</th>
                                                <th className="px-4 py-2 font-medium">Qty</th>
                                                <th className="px-4 py-2 font-medium">Reference</th>
                                                <th className="px-4 py-2 font-medium">By</th>
                                                <th className="px-4 py-2 font-medium">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inv.transactions.map((tx) => {
                                                const meta = transactionTypeMeta[tx.type];
                                                return (
                                                    <tr key={tx.id} className="border-b last:border-b-0">
                                                        <td className="px-4 py-2">
                                                            <Badge variant="outline" className={meta.className}>
                                                                {tx.type === 'In' && <TrendingUp className="mr-1 h-3 w-3" />}
                                                                {tx.type === 'Out' && <TrendingDown className="mr-1 h-3 w-3" />}
                                                                {tx.type === 'Adjustment' && <SlidersHorizontal className="mr-1 h-3 w-3" />}
                                                                {meta.label}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-2 font-medium">{tx.quantity}</td>
                                                        <td className="text-muted-foreground px-4 py-2">{tx.reference ?? '—'}</td>
                                                        <td className="px-4 py-2">{tx.user_name}</td>
                                                        <td className="text-muted-foreground px-4 py-2">{tx.created_at}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function DetailCard({ label, value, highlight }: { label: string; value: string; highlight?: 'success' | 'danger' }) {
    return (
        <div className="rounded-lg border p-4">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
            <p
                className={`mt-1 text-lg font-semibold ${
                    highlight === 'success'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : highlight === 'danger'
                          ? 'text-red-600 dark:text-red-400'
                          : ''
                }`}
            >
                {value}
            </p>
        </div>
    );
}
