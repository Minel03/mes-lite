import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type ProductionOrder } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';
import ReactSelect from 'react-select';

type ProductionOrderForm = {
    order_number: string;
    product_name: string;
    quantity: string;
    completed_quantity: string;
    status: ProductionOrder['status'];
    assigned_operator: string;
    deadline: string;
};

export default function EditProductionOrder({
    productionOrder,
    statuses,
    users,
}: {
    productionOrder: ProductionOrder;
    statuses: ProductionOrder['status'][];
    users: { id: number; name: string }[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Production Orders',
            href: '/production-orders',
        },
        {
            title: productionOrder.order_number,
            href: route('production-orders.show', productionOrder.id),
        },
        {
            title: 'Edit',
            href: route('production-orders.edit', productionOrder.id),
        },
    ];

    const { data, setData, put, errors, processing } = useForm<ProductionOrderForm>({
        order_number: productionOrder.order_number,
        product_name: productionOrder.product_name,
        quantity: String(productionOrder.quantity),
        completed_quantity: String(productionOrder.completed_quantity),
        status: productionOrder.status,
        assigned_operator: productionOrder.assigned_operator,
        deadline: productionOrder.deadline,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        put(route('production-orders.update', productionOrder.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${productionOrder.order_number}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-normal">Edit {productionOrder.order_number}</h1>
                        <p className="text-muted-foreground text-sm">Update quantities, operator assignment, and order status.</p>
                    </div>

                    <Button variant="outline" asChild>
                        <Link href={route('production-orders.show', productionOrder.id)} prefetch>
                            <ArrowLeft />
                            Back
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="max-w-3xl space-y-6">
                    <ProductionOrderFields data={data} errors={errors} statuses={statuses} users={users} setData={setData} />

                    <Button disabled={processing}>
                        <Save />
                        Save changes
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}

function ProductionOrderFields({
    data,
    errors,
    statuses,
    users,
    setData,
}: {
    data: ProductionOrderForm;
    errors: Partial<Record<keyof ProductionOrderForm, string>>;
    statuses: ProductionOrder['status'][];
    users: { id: number; name: string }[];
    setData: <K extends keyof ProductionOrderForm>(key: K, value: ProductionOrderForm[K]) => void;
}) {
    const operatorOptions = users.map((user) => ({
        label: user.name,
        value: user.name,
    }));

    const selectedOperator = operatorOptions.find((option) => option.value === data.assigned_operator) || null;

    return (
        <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
                <Label htmlFor="order_number">Order number</Label>
                <Input id="order_number" value={data.order_number} onChange={(event) => setData('order_number', event.target.value)} required />
                <InputError message={errors.order_number} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="product_name">Product name</Label>
                <Input id="product_name" value={data.product_name} onChange={(event) => setData('product_name', event.target.value)} required />
                <InputError message={errors.product_name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={data.quantity}
                    onChange={(event) => setData('quantity', event.target.value)}
                    required
                />
                <InputError message={errors.quantity} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="completed_quantity">Completed quantity</Label>
                <Input
                    id="completed_quantity"
                    type="number"
                    min="0"
                    value={data.completed_quantity}
                    onChange={(event) => setData('completed_quantity', event.target.value)}
                    required
                />
                <InputError message={errors.completed_quantity} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={data.status} onValueChange={(value) => setData('status', value as ProductionOrder['status'])}>
                    <SelectTrigger id="status">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.status} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="assigned_operator">Assigned operator</Label>
                <ReactSelect
                    unstyled
                    id="assigned_operator"
                    options={operatorOptions}
                    value={selectedOperator}
                    onChange={(option) => setData('assigned_operator', option ? option.value : '')}
                    placeholder="Select operator..."
                    classNames={{
                        control: ({ isFocused }) =>
                            cn(
                                'border-input bg-background ring-offset-background flex h-10 w-full items-center justify-between rounded-md border px-3 text-sm transition-colors',
                                isFocused && 'ring-ring ring-2 ring-offset-2 outline-hidden',
                            ),
                        placeholder: () => 'text-muted-foreground text-sm',
                        input: () => 'text-foreground text-sm',
                        valueContainer: () => 'flex items-center gap-1',
                        singleValue: () => 'text-foreground text-sm',
                        indicatorsContainer: () => 'flex items-center gap-1',
                        dropdownIndicator: () => 'text-muted-foreground hover:text-foreground',
                        menu: () => 'mt-2 border border-input bg-popover text-popover-foreground rounded-md shadow-md overflow-hidden z-50',
                        menuList: () => 'p-1',
                        option: ({ isFocused, isSelected }) =>
                            cn(
                                'relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors select-none',
                                isFocused && 'bg-accent text-accent-foreground',
                                isSelected && 'bg-primary text-primary-foreground',
                            ),
                        noOptionsMessage: () => 'text-muted-foreground py-6 text-center text-sm',
                    }}
                />
                <InputError message={errors.assigned_operator} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" type="date" value={data.deadline} onChange={(event) => setData('deadline', event.target.value)} required />
                <InputError message={errors.deadline} />
            </div>
        </div>
    );
}
