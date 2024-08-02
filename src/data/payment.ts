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
                    Authorization: `Bearer sk_test_41938c09430fc78c21e169c1b49b23d464d90603`,
                },
            }
        );

        return response.data
    } catch (error) {
        console.log(error)
    }
}


export async function verifyPayment(accessCode: string) {


}
