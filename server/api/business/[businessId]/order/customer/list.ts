import type { Customer } from '~/model/Customer';

export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId');
    console.log(businessId);

    const customerList: Customer[] = [
        {
            id: 1,
            name: 'John Doe',
            type: 'Retail',
            address: '123 Main St, Cityville',
            phoneNo: '123-456-7890',
        },
        {
            id: 2,
            name: 'Jane Smith',
            type: 'Wholesale',
            address: '456 Elm St, Townsville',
            phoneNo: '987-654-3210',
        },
        {
            id: 3,
            name: 'Alice Johnson',
            type: 'Retail',
            address: '789 Oak St, Villageburg',
            phoneNo: '555-123-4567',
        },
        {
            id: 4,
            name: 'Bob Brown',
            type: 'Wholesale',
            address: '321 Pine St, Hamletton',
            phoneNo: '444-987-6543',
        },
    ];

    return customerList;
});
