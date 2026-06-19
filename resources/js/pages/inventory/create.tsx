import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', href: '/inventory' },
    { title: 'Record transaction', href: '/inventory/create' },
];

type InventoryOption = { id: number; label: string; quantity: number };

type TransactionForm = {
    inventory_id: string;
    type: string;
    quantity: string;
    reference: string;
    notes: string;
};

export default function CreateInventoryTransaction({ inventories, types }: { inventories: InventoryOption[]; types: string[] }) {
    const { data, setData, post, errors, processing } = useForm<TransactionForm>({
        inventory_id: '',
        type: 'In',
        quantity: '',
        reference: '',
        notes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('inventory.store'));
    };

    const selected = inventories.find((i) => String(i.id) === data.inventory_id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Record transaction" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-normal">Record transaction</h1>
                        <p className="text-muted-foreground text-sm">Log a stock movement for an inventory item.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={route('inventory.index')} prefetch>
                            <ArrowLeft />
                            Back
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="max-w-3xl space-y-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="col-span-full grid gap-2">
                            <Label htmlFor="inventory_id">Product</Label>
                            <Select value={data.inventory_id} onValueChange={(v) => setData('inventory_id', v)}>
                                <SelectTrigger id="inventory_id">
                                    <SelectValue placeholder="Select a product…" />
                                </SelectTrigger>
                                <SelectContent>
                                    {inventories.map((inv) => (
                                        <SelectItem key={inv.id} value={String(inv.id)}>
                                            {inv.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selected && (
                                <p className="text-muted-foreground text-xs">
                                    Current stock: <span className="font-medium">{selected.quantity}</span>
                                </p>
                            )}
                            <InputError message={errors.inventory_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type">Transaction type</Label>
                            <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                <SelectTrigger id="type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {types.map((t) => (
                                        <SelectItem key={t} value={t}>
                                            {t === 'In' ? 'Stock In' : t === 'Out' ? 'Stock Out' : 'Adjustment'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.type} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={data.quantity}
                                onChange={(e) => setData('quantity', e.target.value)}
                                required
                            />
                            <InputError message={errors.quantity} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="reference">Reference (optional)</Label>
                            <Input
                                id="reference"
                                value={data.reference}
                                onChange={(e) => setData('reference', e.target.value)}
                                placeholder="e.g. PO-1001"
                            />
                            <InputError message={errors.reference} />
                        </div>

                        <div className="col-span-full grid gap-2">
                            <Label htmlFor="notes">Notes (optional)</Label>
                            <Textarea id="notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} rows={3} />
                            <InputError message={errors.notes} />
                        </div>
                    </div>

                    <Button disabled={processing}>
                        <Save />
                        Save transaction
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
