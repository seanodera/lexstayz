import {NextRequest, NextResponse} from "next/server";
import axios from "axios";


export async function POST(req: NextRequest) {
    const {email, amount, reference, authorization_code} = await req.json()
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
        return NextResponse.json({status: 'error', message: 'Paystack secret key not found'}, {status: 500});
    }
    try {
        console.log(secretKey);
        const response = await axios.post(
            'https://api.paystack.co/transaction/charge_authorization',
            {
                email,
                amount: amount * 100,
                reference,
                authorization_code
            }, {
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                },
            })
        console.log(response)

        return NextResponse.json(response.data);

    } catch (error) {
        console.log(error)
        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                {status: 'error', message: error.response?.data.message || 'Unknown error from Paystack'},
                {status: error.response?.status || 500}
            );
        }
        return NextResponse.json({status: 'error', message: 'Server error'}, {status: 500});
    }
}