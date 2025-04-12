import type { Supplier } from '~/model/Supplier';

export default defineEventHandler(async event => {
    const data: Supplier[] = [
        {
            id: 1,
            name: 'Supplier A',
            description: 'Leading beverage supplier',
            type: 'Beverage',
            contacts: [
                {
                    id: 'c1',
                    fullName: 'John Doe',
                    phoneNo: '098-765-4321',
                    email: 'john@example.com',
                    address: '123 Main St',
                    remarks: 'Active',
                    status: 'Active'
                },
                {
                    id: 'c2',
                    fullName: 'Jane Smith',
                    phoneNo: '098-111-2222',
                    email: 'jane@example.com',
                    address: '456 Oak Ave',
                    remarks: 'Pending',
                    status: 'Pending'
                }
            ]
        },
        {
            id: 2,
            name: 'Supplier B',
            description: 'Quality ingredients supplier',
            type: 'Food',
            contacts: [
                {
                    id: 'c3',
                    fullName: 'Alice Johnson',
                    phoneNo: '098-333-4444',
                    email: 'alice@example.com',
                    address: '789 Pine Rd',
                    remarks: 'Active',
                    status: 'Active'
                }
            ]
        },
        {
            id: 3,
            name: 'Supplier C',
            description: 'Wholesale supplier',
            type: 'General',
            contacts: []
        }
    ]


    return data;
});
