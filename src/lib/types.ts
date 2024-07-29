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