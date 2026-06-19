import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type InventoryItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

type EditForm = {
    minimum_quantity: string;
    location: string;
};

export default function EditInventory({ inventory }: { inventory: InventoryItem }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Inventory', href: '/inventory' },
        { title: inventory.product?.name ?? 'Item', href: route('inventory.show', inventory.id) },
        { title: 'Edit', href: route('inventory.edit', inventory.id) },
    ];

    const { data, setData, put, errors, processing } = useForm<EditForm>({
        minimum_quantity: String(inventory.minimum_quantity),
        location: inventory.location ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('inventory.update', inventory.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit inventory – ${inventory.product?.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-normal">Edit inventory settings</h1>
                        <p className="text-sm text-muted-foreground">{inventory.product?.name}</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={route('inventory.show', inventory.id)} prefetch>
                            <ArrowLeft />
                            Back
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="max-w-xl space-y-6">
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="minimum_quantity">Minimum stock quantity</Label>
                            <Input
                                id="minimum_quantity"
                                type="number"
                                min="0"
                                value={data.minimum_quantity}
                                onChange={(e) => setData('minimum_quantity', e.target.value)}
                                required
                            />
                            <p className="text-xs text-muted-foreground">An alert will show when stock falls at or below this value.</p>
                            <InputError message={errors.minimum_quantity} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="location">Storage location</Label>
                            <Input
                                id="location"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                placeholder="e.g. Warehouse A, Shelf B3"
                            />
                            <InputError message={errors.location} />
                        </div>
                    </div>

                    <Button disabled={processing}>
                        <Save />
                        Update settings
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
