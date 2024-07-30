import {Stay} from "@/lib/types";
import {auth, firestore} from "@/lib/firebase";
import {writeBatch} from "@firebase/firestore";
import {collection, doc, getDocs} from "firebase/firestore";

export function getCurrentUser() {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No user is signed in');
    }
    return user;
}


async function createBookingFirebase({stay, checkInDate, checkOutDate, rooms, paymentData, contact, numGuests, specialRequest, totalPrice, currency, usedRate}: {
    stay: Stay,
    checkInDate: string,
    checkOutDate: string,
    rooms: object[],
    paymentData: any,
    contact: any,
    numGuests: number, specialRequest: string, totalPrice: number, currency: string, usedRate: number,
}) {
    try {
        const user = getCurrentUser()
        const batch = writeBatch(firestore);
        const hostDoc = doc(firestore, 'hosts', stay.hostId, 'bookings')
        const userDoc = doc(firestore, 'user', user.uid, 'bookings', hostDoc.id)
        const booking = {
            id: hostDoc.id,
            accommodationId: stay.id,
            accountId: user.uid,
            hostId: stay.hostId,
            user: {
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: contact.email,
                phone: contact.phone,
                country: contact.country,
            },
            checkInDate,
            checkOutDate,
            createdAt: new Date().toString(),
            rooms: rooms,
            status: 'Pending',
            numGuests: numGuests,
            isConfirmed: false,
            specialRequest: specialRequest,
            totalPrice: totalPrice,
            currency: currency ,
            usedRate: usedRate,
            paymentData: paymentData
        }
        batch.set(hostDoc, booking)
        batch.set(userDoc, booking)
        await batch.commit();
    } catch (error){
        console.log(error)
    }
}

export async function getBookings() {
    try {
        let bookings: any = []
        const user = getCurrentUser()
        const bookingsRef = collection(firestore, 'user', user.uid, 'bookings')
        const snapshot = await getDocs(bookingsRef)

        snapshot.docs.forEach((document) => {
            bookings.push(document.data())
        })

        return bookings;
    } catch (error) {
        console.log(error)
        return [];
    }
}