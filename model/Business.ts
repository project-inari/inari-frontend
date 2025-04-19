export interface Business {
    id: number;
    name: string;
    industryType: string;
    businessType: string;
    description?: string;
    phoneNo: string;
    operatingHours?: OperatingHours;
    address: string;
    businessImageUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface OperatingHours {
    monday: {
        open: boolean;
        openTime?: string;
        closeTime?: string;
    };
    tuesday: {
        open: boolean;
        openTime?: string;
        closeTime?: string;
    };
    wednesday: {
        open: boolean;
        openTime?: string;
        closeTime?: string;
    };
    thursday: {
        open: boolean;
        openTime?: string;
        closeTime?: string;
    };
    friday: {
        open: boolean;
        openTime?: string;
        closeTime?: string;
    };
    saturday: {
        open: boolean;
        openTime?: string;
        closeTime?: string;
    };
    sunday: {
        open: boolean;
        openTime?: string;
        closeTime?: string;
    };
}
