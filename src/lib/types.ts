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
    location: Location;
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
    bookedDates?: string[];
}

export interface Home extends Stay {
    type: 'Home';
    maxGuests: number;
    bathrooms: number;
    beds: number;
    price: number;
    bedrooms: number;
    homeType: string;
    pricing?: {
        base: number;
        weekly?: number;
        yearly?: number;
        monthly?: number;
    }

}

export interface Hotel extends Stay {
    type: 'Hotel';
    rooms: Room[];

}

export interface Location {
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
    fullDates?: string[];
    pricing?: {
        base: number;
        weekly?: number;
        yearly?: number;
        monthly?: number;
    }
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

export interface Host {
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
    balance?: Balance,
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

export interface Booking {
    acceptedAt: string;
    accommodationId: string;
    accountId: string;
    checkInDate: string;
    checkOutDate: string;
    createdAt: string;
    currency: string;
    fees: number;
    grandTotal: number;
    hostId: string;
    id: string;
    isConfirmed: boolean;
    numGuests: number;
    paymentCurrency: string;
    paymentData: PaymentData;
    paymentMethod: string;
    paymentRate: number;
    specialRequest: string;
    status: string;
    subtotal: number;
    totalPrice: number;
    usedRate: number;
    user: BookingUser;
    rooms?: BookingRoom[];
}

export interface BookingRoom {
    roomId: string;
    numRooms: number;
    name: string;
    price: number
}

interface PaymentData {
    data: {
        paidAt: string;
        plan: string | null;
        created_at: string;
        paid_at: string;
        createdAt: string;
    }
    // Add other properties that might be inside the paymentData object
    message: string;
    status: boolean;
    refunded?: boolean
}

export interface BookingUser {
    country: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
}
