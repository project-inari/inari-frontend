import type { Supplier } from '~/model/Supplier';

export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId');
    const fetchList = await $fetch<{ suppliers: any[] }>(
        `${process.env.BACKEND_API_BASE_URL}/v1/supplier/list/${businessId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    const fetchSuppliers = fetchList.suppliers;

    const data: Supplier[] = fetchSuppliers.map(supplier => {
        return {
            id: supplier.id,
            name: supplier.name,
            description: supplier.description,
            type: supplier.type,
            contacts: supplier.supplierContacts.map(
                (contact: {
                    id: any;
                    fullName: any;
                    phoneNo: any;
                    email: any;
                    address: any;
                    remarks: any;
                    status: any;
                }) => {
                    return {
                        id: contact.id,
                        fullName: contact.fullName,
                        phoneNo: contact.phoneNo,
                        email: contact.email,
                        address: contact.address,
                        remarks: contact.remarks,
                        status: contact.status,
                    };
                },
            ),
        };
    });

    // const data: Supplier[] = [
    //     {
    //         id: 1,
    //         name: 'Supplier A',
    //         description: 'Leading beverage supplier',
    //         type: 'Beverage',
    //         contacts: [
    //             {
    //                 id: 'c1',
    //                 fullName: 'John Doe',
    //                 phoneNo: '098-765-4321',
    //                 email: 'john@example.com',
    //                 address: '123 Main St',
    //                 remarks: 'Active',
    //                 status: 'Active',
    //             },
    //             {
    //                 id: 'c2',
    //                 fullName: 'Jane Smith',
    //                 phoneNo: '098-111-2222',
    //                 email: 'jane@example.com',
    //                 address: '456 Oak Ave',
    //                 remarks: 'Pending',
    //                 status: 'Pending',
    //             },
    //         ],
    //     },
    //     {
    //         id: 2,
    //         name: 'Supplier B',
    //         description: 'Quality ingredients supplier',
    //         type: 'Food',
    //         contacts: [
    //             {
    //                 id: 'c3',
    //                 fullName: 'Alice Johnson',
    //                 phoneNo: '098-333-4444',
    //                 email: 'alice@example.com',
    //                 address: '789 Pine Rd',
    //                 remarks: 'Active',
    //                 status: 'Active',
    //             },
    //         ],
    //     },
    //     {
    //         id: 3,
    //         name: 'Supplier C',
    //         description: 'Wholesale supplier',
    //         type: 'General',
    //         contacts: [],
    //     },
    // ];

    return data;
});
