export interface Supplier {
    id?: number;
    name: string;
    type?: string;
    description?: string;
    contacts?: SupplierContact[];
}

export interface SupplierContact {
    id?: string;
    supplierId?: number;
    fullName: string;
    phoneNo?: string;
    email?: string;
    address?: string;
    remarks?: string;
    status?: string;
}
