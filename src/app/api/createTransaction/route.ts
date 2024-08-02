import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
    const { email, amount, currency, reference,callback_url } = await req.json();
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
        return NextResponse.json({ status: 'error', message: 'Paystack secret key not found' }, { status: 500 });
    }

    try {
        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email,
                amount: amount * 100, // Paystack amount is in cents
                currency,
                reference,
                callback_url
            },
            {
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                },
            }
        );

        if (response.data.status) {
            return NextResponse.json({ status: 'success', data: response.data });
        } else {
            return NextResponse.json({ status: 'error', message: 'Transaction initialization failed' }, { status: 400 });
        }
    } catch (error) {
        console.error('Paystack transaction initialization error:', error);
        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                { status: 'error', message: error.response?.data.message || 'Unknown error from Paystack' },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json({ status: 'error', message: 'Server error' }, { status: 500 });
    }
}
