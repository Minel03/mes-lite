import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type Machine, type ProductionLog } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';
import ReactSelect from 'react-select';

type ProductionLogForm = {
    machine_id: string;
    operator_id: string;
    quantity_produced: string;
    timestamp: string;
};

export default function EditProductionLog({
    productionLog,
    machines,
    users,
}: {
    productionLog: ProductionLog;
    machines: Machine[];
    users: { id: number; name: string }[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Production Logs',
            href: '/production-logs',
        },
        {
            title: `Log #${productionLog.id}`,
            href: route('production-logs.show', productionLog.id),
        },
        {
            title: 'Edit',
            href: route('production-logs.edit', productionLog.id),
        },
    ];

    // Format log timestamp (YYYY-MM-DD HH:MM:SS) to (YYYY-MM-DDTHH:MM) for HTML input
    const formattedTimestamp = productionLog.timestamp ? productionLog.timestamp.replace(' ', 'T').slice(0, 16) : '';

    const { data, setData, put, errors, processing } = useForm<ProductionLogForm>({
        machine_id: String(productionLog.machine_id),
        operator_id: String(productionLog.operator_id),
        quantity_produced: String(productionLog.quantity_produced),
        timestamp: formattedTimestamp,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        put(route('production-logs.update', productionLog.id));
    };

    const operatorOptions = users.map((user) => ({
        label: user.name,
        value: String(user.id),
    }));

    const selectedOperator = operatorOptions.find((option) => option.value === data.operator_id) || null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Log #${productionLog.id}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-normal">Edit Production Log #{productionLog.id}</h1>
                        <p className="text-muted-foreground text-sm">Update the production log details.</p>
                    </div>

                    <Button variant="outline" asChild>
                        <Link href={route('production-logs.show', productionLog.id)} prefetch>
                            <ArrowLeft />
                            Back
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="max-w-3xl space-y-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="machine_id">Machine</Label>
                            <Select value={data.machine_id} onValueChange={(value) => setData('machine_id', value)}>
                                <SelectTrigger id="machine_id">
                                    <SelectValue placeholder="Select machine..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {machines.map((machine) => (
                                        <SelectItem key={machine.id} value={String(machine.id)}>
                                            {machine.machine_name} ({machine.machine_code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.machine_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="operator_id">Operator</Label>
                            <ReactSelect
                                unstyled
                                id="operator_id"
                                options={operatorOptions}
                                value={selectedOperator}
                                onChange={(option) => setData('operator_id', option ? option.value : '')}
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
                                    menu: () =>
                                        'mt-2 border border-input bg-popover text-popover-foreground rounded-md shadow-md overflow-hidden z-50',
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
                            <InputError message={errors.operator_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="quantity_produced">Quantity Produced</Label>
                            <Input
                                id="quantity_produced"
                                type="number"
                                min="1"
                                value={data.quantity_produced}
                                onChange={(event) => setData('quantity_produced', event.target.value)}
                                required
                            />
                            <InputError message={errors.quantity_produced} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="timestamp">Timestamp</Label>
                            <Input
                                id="timestamp"
                                type="datetime-local"
                                value={data.timestamp}
                                onChange={(event) => setData('timestamp', event.target.value)}
                                required
                            />
                            <InputError message={errors.timestamp} />
                        </div>
                    </div>

                    <Button disabled={processing}>
                        <Save />
                        Save Changes
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
