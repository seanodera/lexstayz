import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

type Data = {
    status: 'success' | 'error';
    message: string;
};

export async function POST(req: NextRequest) {
    const { reference } = await req.json();
    const secretKey = process.env.PAYSTACK_SECRET_KEY as string;

    try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${secretKey}`,
            },
        });

        if (response.data.data.status === 'success') {
            return NextResponse.json({ status: 'success', message: 'Transaction verified successfully' });
        } else {
            return NextResponse.json({ status: 'error', message: 'Transaction verification failed' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ status: 'error', message: 'Server error' }, { status: 500 });
    }
}
