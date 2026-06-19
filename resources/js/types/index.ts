import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Machine {
    id: number;
    machine_code: string;
    machine_name: string;
    status: 'Running' | 'Offline' | 'Maintenance' | 'Idle';
    location: string;
    last_maintenance: string | null;
    next_maintenance: string | null;
    created_at: string | null;
}

export interface ProductionOrder {
    id: number;
    order_number: string;
    product_name: string;
    quantity: number;
    completed_quantity: number;
    status: 'Pending' | 'Running' | 'Completed' | 'Cancelled';
    assigned_operator: string;
    deadline: string;
    created_at: string | null;
}

export interface InventoryTransaction {
    id: number;
    type: 'In' | 'Out' | 'Adjustment';
    quantity: number;
    reference: string | null;
    notes: string | null;
    user_name: string;
    created_at: string | null;
}

export interface InventoryItem {
    id: number;
    quantity: number;
    minimum_quantity: number;
    location: string | null;
    is_low_stock: boolean;
    product: {
        id: number;
        sku: string;
        name: string;
        unit: string;
        category: string | null;
    } | null;
    transactions?: InventoryTransaction[];
}

export interface Product {
    id: number;
    sku: string;
    name: string;
    description: string | null;
    unit: string;
    price: number | string;
    category: string | null;
    created_at: string | null;
    inventory?: InventoryItem | null;
}

export interface ProductionLog {
    id: number;
    machine_id: number;
    machine_name: string;
    machine_code: string;
    operator_id: number;
    operator_name: string;
    quantity_produced: number;
    timestamp: string;
    created_at: string | null;
}
