export const useCurrentBusinessStore = defineStore('businessName', {
    state: () => ({
        businessId: 0,
        businessName: '',
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
    },
});
