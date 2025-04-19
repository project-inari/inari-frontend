import type { Category } from '~/model/Category';
import type { Tag } from '~/model/Tag';

export const useCurrentBusinessStore = defineStore('businessName', {
    state: () => ({
        businessId: 0,
        businessName: '',
        businessCategories: [] as Category[],
        businessTags: [] as Tag[],
    }),
    actions: {
        setCurrentBusiness(businessId: number, businessName: string) {
            this.businessId = businessId;
            this.businessName = businessName;
        },
        clearCurrentBusiness() {
            this.businessId = 0;
            this.businessName = '';
        },
        async setCurrentBusinessCategoriesAndTags(businessId: number) {
            this.businessCategories = await $fetch<Category[]>(
                `/api/business/${businessId}/category/list`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            this.businessTags = await $fetch<Tag[]>(
                `/api/business/${businessId}/tag/list`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
        },
    },
});
