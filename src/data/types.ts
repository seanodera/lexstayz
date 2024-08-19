// types.ts
import store  from './store';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface PaymentMethod {
    card_type: string;
    last4: string;
    exp_month: number;
    exp_year: number;
    authorization_code: string;
}
