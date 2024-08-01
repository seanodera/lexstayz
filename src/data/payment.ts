import axios from "axios";


export async function initiatePayment({email, amount, userID, bookingID, currency}: {
    email: string,
    amount: number,
    currency: string,
    userID: string,
    bookingID: string
}) {
    try {
        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email,
                amount: amount * 100, // Paystack amount is in kobo
                callback_url: `https://lexstayz.vercel.app/checkout?userID=${userID}&booking=${bookingID}`,
                currency
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );
        return response.data
    } catch (error) {

    }
}


export async function verifyPayment(accessCode: string) {


}
