import {Dates, Stay} from "@/lib/types";
import {auth, firestore} from "@/lib/firebase";
import {writeBatch} from "@firebase/firestore";
import {collection, doc, getDoc, getDocs, runTransaction} from "firebase/firestore";


export function getCurrentUser() {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No user is signed in');
    }
    return user;
}

export function generateID() {
    const document = doc(collection(firestore, 'bookings'))
    return document.id
}


interface BookingParams {
    userId: string,
    id: string,
    isConfirmed?: boolean,
    status?: string
}



export async function completeBooking({
                                          userId,
                                          id,
                                          isConfirmed = true,
                                          status = 'Confirmed'
                                      }: BookingParams) {
    try {
        const batch = writeBatch(firestore);
        const userDoc = doc(firestore, 'users', userId, 'bookings', id);
        const bookingSnap = await getDoc(userDoc);

        if (!bookingSnap.exists()) {
            throw new Error("Booking does not exist!");
        }

        const booking = bookingSnap.data();
        console.log(booking);
        if (booking.status === status && booking.isConfirmed === isConfirmed)  {
            throw new Error("Booking status or confirmation status is already set!");
        }
        const hostDoc = doc(firestore, 'hosts', booking.hostId, 'bookings', id);
        batch.update(userDoc, {status, isConfirmed});
        batch.set(hostDoc, {...booking, status, isConfirmed});

        const stayRef = doc(firestore, 'stays', booking.accommodationId);

        await runTransaction(firestore, async (transaction) => {
            const staySnap = await transaction.get(stayRef);

            if (!staySnap.exists()) {
                throw new Error("Accommodation document does not exist!");
            }

            const stayData = staySnap.data();
            const checkIn = new Date(booking.checkInDate);
            const checkOut = new Date(booking.checkOutDate);

            if (stayData.type === 'Hotel') {
                console.log('Transaction created!');
                console.log(stayData)
                const {updatedRooms, fullyBookedDates} = processHotelBooking(stayData, booking, checkIn, checkOut);
                console.log(updatedRooms, fullyBookedDates);
                transaction.update(stayRef, {rooms: updatedRooms, fullyBookedDates});
            } else if (stayData.type === 'Home') {
                const unavailableDates = processHomeBooking(stayData, checkIn, checkOut);
                console.log(unavailableDates)
                transaction.update(stayRef, {bookedDates: unavailableDates});
            }
        });

        await batch.commit();
        console.log('Booking completed successfully', booking);
    } catch (err) {
        console.error("Error completing booking:", err);
    }
}

function processHotelBooking(stayData: any, booking: any, checkIn: Date, checkOut: Date): {
    updatedRooms: any[],
    fullyBookedDates: string[]
} {
    const rooms = stayData.rooms;
    const bookedRooms = booking.rooms;
    const bookingIds = bookedRooms.map((room: any) => room.roomId);

    let updatedRooms: any[] = [];
    let fullyBookedDates: string[] = [];


    rooms.forEach((room: any) => {

        if (bookingIds.includes(room.id)) {
            console.log('Processing hb', bookingIds, room.id);
            const bookedRoomData = bookedRooms.find((r: any) => r.roomId === room.id);
            let {bookedDates, fullDates} = room;
            console.log(bookedDates,fullDates, room)

            bookedDates = bookedDates? {...bookedDates} : {};
            fullDates = fullDates? [...fullDates] : [];
            console.log(bookingIds);
            iterateDaysBetween(checkIn, checkOut, (date) => {
                const currentDateStr = date.toISOString().split('T')[ 0 ];
                console.log(currentDateStr)
                if (!bookedDates[ currentDateStr ]) {
                    bookedDates[ currentDateStr ] = bookedRoomData.numRooms;
                } else {
                    bookedDates[ currentDateStr ] += bookedRoomData.numRooms;
                }

                if (bookedDates[ currentDateStr ] >= room.available && !fullDates.includes(currentDateStr)) {
                    fullDates.push(currentDateStr);
                    fullyBookedDates.push(currentDateStr);
                }
            });

            updatedRooms.push({...room, bookedDates, fullDates});
        } else {
            updatedRooms.push(room);
        }
    });
    console.log(updatedRooms, fullyBookedDates);
    return {updatedRooms, fullyBookedDates};
}

function processHomeBooking(stayData: any, checkIn: Date, checkOut: Date): string[] {
    const unavailableDates = new Set<string>(stayData.bookedDates || []);

    iterateDaysBetween(checkIn, checkOut, (date) => {
        unavailableDates.add(date.toISOString().split('T')[ 0 ]);
    });

    return Array.from(unavailableDates);
}

function iterateDaysBetween(startDate: Date, endDate: Date, task: (date: Date) => void): void {
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        task(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
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



