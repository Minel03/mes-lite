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
    { title: 'Products', href: '/products' },
    { title: 'Create', href: '/products/create' },
];

type ProductForm = {
    sku: string;
    name: string;
    description: string;
    unit: string;
    price: string;
    category: string;
};

export default function CreateProduct({ units }: { units: string[] }) {
    const { data, setData, post, errors, processing } = useForm<ProductForm>({
        sku: '',
        name: '',
        description: '',
        unit: 'pcs',
        price: '',
        category: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('products.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create product" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-normal">Create product</h1>
                        <p className="text-sm text-muted-foreground">Add a new product to the catalog.</p>
                    </div>

                    <Button variant="outline" asChild>
                        <Link href={route('products.index')} prefetch>
                            <ArrowLeft />
                            Back
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="max-w-3xl space-y-6">
                    <ProductFields data={data} errors={errors} units={units} setData={setData} />

                    <Button disabled={processing}>
                        <Save />
                        Save product
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}

function ProductFields({
    data,
    errors,
    units,
    setData,
}: {
    data: ProductForm;
    errors: Partial<Record<keyof ProductForm, string>>;
    units: string[];
    setData: <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => void;
}) {
    return (
        <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" value={data.sku} onChange={(e) => setData('sku', e.target.value)} required placeholder="PRD-0001" />
                <InputError message={errors.sku} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={data.category} onChange={(e) => setData('category', e.target.value)} placeholder="e.g. Raw Material" />
                <InputError message={errors.category} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Select value={data.unit} onValueChange={(value) => setData('unit', value)}>
                    <SelectTrigger id="unit">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {units.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                                {unit}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.unit} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" min="0" value={data.price} onChange={(e) => setData('price', e.target.value)} required />
                <InputError message={errors.price} />
            </div>

            <div className="col-span-full grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} />
                <InputError message={errors.description} />
            </div>
        </div>
    );
}
