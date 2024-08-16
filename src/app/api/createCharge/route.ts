import {NextRequest, NextResponse} from "next/server";
import axios from "axios";


export async function POST(req: NextRequest) {
    const {email, amount,  reference} = await req.json()
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
        return NextResponse.json({ status: 'error', message: 'Paystack secret key not found' }, { status: 500 });
    }
    try {
        console.log(secretKey);
        const response = await axios.post(
            'https://api.paystack.co/charge',
            {
            email,
            amount,
            reference
        }, {
            headers: {
                Authorization: `Bearer ${secretKey}`,
            },
        })
        console.log(response)
        if (response.data.status) {
            return NextResponse.json({ status: 'success', data: response.data });
        } else {
            return NextResponse.json({ status: 'error', message: 'Transaction initialization failed' }, { status: 400 });
        }
    } catch (error) {
        console.log(error)
        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                { status: 'error', message: error.response?.data.message || 'Unknown error from Paystack' },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json({ status: 'error', message: 'Server error' }, { status: 500 });
    }
}