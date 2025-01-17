export interface Stay {
    type: 'Home' | 'Hotel';
    id: string;
    hostId: string;
    facilities: string[];
    smoking: string;
    checkInTime: string;
    checkOutTime: string;
    currency: string;
    published: boolean;
    poster: string;
    description: string;
    rating: number;
    publishedDate: string;
    location: Location ;
    images: string[];
    name: string;
    numReviews: number;
    parties: string;
    cancellation: {
        timeSpace: string;
        preDate: boolean;
        time: number;
        cancellation: string;
        rate: number;
    };
    pets: string;
    minAge: number;
}

export interface Home extends Stay {
    type: 'Home';
    maxGuests: number;
    bathrooms: number;
    beds: number;
    price: number;
    bedrooms: number;
    homeType: string;
    bookedDates?: string[];
}

export interface Hotel extends Stay {
    type: 'Hotel';
    rooms: Room[];
    fullyBookedDates?: string[];
}

export interface Location
    {
        latitude: number;
        longitude: number;
        zipCode: string;
        street2: string;
        fullAddress: string;
        district: string;
        country: string;
        street: string;
        city: string;
    }


export interface Room {
    poster: string;
    beds: Array<{
        number: number;
        type: string;
    }>;
    description: string;
    amenities: string[];
    name: string;
    maxGuests: number;
    available: number;
    id: string;
    price: number;
    images: string[];
    bookedDates?: { [ key: string ]: number;};
    fullDates?: string[]
}


export interface Dates {
    startDate: string;
    endDate: string;
    length: number;
}

export interface Balance {
    available: number;
    prevAvailable: number;
    pending: number;
    prevPending: number;
}

export interface WithdrawAccount {
    method: string;
    account: string;
}

export interface Withdraw {
    account: WithdrawAccount;
    withdrawals: any[];
}

export interface Host{
    organization?: string;
    "email": string,
    "phone": string,
    "uid": string,
    "firstName": string,
    "published": string[],
    companyName: string,
    "accountType": "Individual" | "Organization",
    "lastName": string,
    "wishlist": string[]
    onboarded: string[],
    joined: string,
}

export interface OperationType {
    operationType: string;
    minTransactionLimit: string;
    maxTransactionLimit: string;
}

export interface Correspondent {
    correspondent: string;
    currency: string;
    ownerName: string;
    operationTypes: OperationType[];
}

export interface PawaPayCountryData {
    country: string;
    correspondents: Correspondent[];
}
