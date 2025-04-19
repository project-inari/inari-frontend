import type { Business } from '~/model/Business';

export default defineEventHandler(async event => {
    const userId = getRouterParam(event, 'userId');
    console.log(userId);

    const business: Business[] = [
        {
            id: 1,
            name: 'Beer Garden',
            industryType: 'Beverage',
            businessType: 'Retail',
            description: 'We sell beer and other alcoholic beverages',
            phoneNo: '+66999999990',
            operatingHours: {
                monday: {
                    open: true,
                    openTime: '09:00',
                    closeTime: '17:00',
                },
                tuesday: {
                    open: true,
                    openTime: '09:00',
                    closeTime: '17:00',
                },
                wednesday: {
                    open: true,
                    openTime: '09:00',
                    closeTime: '17:00',
                },
                thursday: {
                    open: true,
                    openTime: '09:00',
                    closeTime: '17:00',
                },
                friday: {
                    open: true,
                    openTime: '09:00',
                    closeTime: '17:00',
                },
                saturday: {
                    open: false,
                },
                sunday: {
                    open: false,
                },
            },
            address: '123/456',
            businessImageUrl: 'https://www.google.com',
            createdAt: '2021-07-01T00:00:00+07:00',
            updatedAt: '2025-01-27T13:54:20+07:00',
        },
        {
            id: 2,
            name: 'Coffee Shop',
            industryType: 'Beverage',
            businessType: 'Retail',
            description: 'We sell coffee and other beverages',
            phoneNo: '+66999999991',
            operatingHours: {
                monday: {
                    open: true,
                    openTime: '09:00',
                    closeTime: '17:00',
                },
                tuesday: {
                    open: true,
                    openTime: '09:00',
                    closeTime: '17:00',
                },
                wednesday: {
                    open: true,
                    openTime: '09:00',
                    closeTime: '17:00',
                },
                thursday: {
                    open: true,
                    openTime: '09:00',
                    closeTime: '17:00',
                },
                friday: {
                    open: true,
                    openTime: '09:00',
                    closeTime: '17:00',
                },
                saturday: {
                    open: false,
                },
                sunday: {
                    open: false,
                },
            },
            address: '123/457',
            businessImageUrl: 'https://www.google.com',
            createdAt: '2021-07-01T00:00:00+07:00',
            updatedAt: '2025-01-27T13:54:20+07:00',
        },
    ];

    return business;
});
