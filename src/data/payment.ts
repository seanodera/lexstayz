import axios from "axios";
import {handler_url} from "@/lib/utils";



export async function verifyPayment(id: string, method: string) {
    try {
        const res = await axios.post(`${handler_url}/api/payments/verifyTransaction`, {reference: id,method: method});

        if (res.data.status === 'success') {
            return res.data
        } else {
            alert('Payment verification failed');
        }


    } catch (err) {
        console.log(err)
    }


}
