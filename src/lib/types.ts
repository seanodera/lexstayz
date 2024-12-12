export interface Stay {
    id: string;
    rooms: any[];

    [ key: string ]: any;
}

export interface Dates {
    startDate: string;
    endDate: string;
    length: number;
}

export interface Balance {
    available: number;
    pending: number;
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
