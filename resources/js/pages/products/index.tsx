import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Product } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

export default function ProductsIndex({ products }: { products: Product[] }) {
    const destroy = (product: Product) => {
        if (window.confirm(`Delete "${product.name}"?`)) {
            router.delete(route('products.destroy', product.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-normal">Products</h1>
                        <p className="text-muted-foreground text-sm">Manage your product catalog and SKUs.</p>
                    </div>

                    <Button asChild>
                        <Link href={route('products.create')} prefetch>
                            <Plus />
                            New product
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-muted-foreground border-b text-left">
                                <tr>
                                    <th className="px-4 py-3 font-medium">SKU</th>
                                    <th className="px-4 py-3 font-medium">Name</th>
                                    <th className="px-4 py-3 font-medium">Category</th>
                                    <th className="px-4 py-3 font-medium">Unit</th>
                                    <th className="px-4 py-3 font-medium">Price</th>
                                    <th className="px-4 py-3 font-medium">Stock</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b last:border-b-0">
                                        <td className="px-4 py-3 font-mono text-xs font-medium">{product.sku}</td>
                                        <td className="px-4 py-3 font-medium">{product.name}</td>
                                        <td className="text-muted-foreground px-4 py-3">{product.category ?? '—'}</td>
                                        <td className="px-4 py-3">{product.unit}</td>
                                        <td className="px-4 py-3">{Number(product.price).toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            {product.inventory ? (
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        product.inventory.is_low_stock
                                                            ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300'
                                                            : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                                                    }
                                                >
                                                    {product.inventory.quantity} {product.unit}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild aria-label={`View ${product.sku}`}>
                                                    <Link href={route('products.show', product.id)} prefetch>
                                                        <Eye />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild aria-label={`Edit ${product.sku}`}>
                                                    <Link href={route('products.edit', product.id)} prefetch>
                                                        <Pencil />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Delete ${product.sku}`}
                                                    onClick={() => destroy(product)}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-muted-foreground px-4 py-12 text-center">
                                            No products have been added yet.
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
