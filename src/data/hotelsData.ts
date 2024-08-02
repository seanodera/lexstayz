import {collection, getDocs, getFirestore} from "firebase/firestore";
import {firestore} from "@/lib/firebase";


export async function getStaysFirebase() {
    try {
        const staysRef = collection(firestore, 'stays');
        const stays: Array<any> = [];
        const snapshot = await getDocs(staysRef);
        for (const doc1 of snapshot.docs) {
            stays.push(doc1.data());
        }
        return stays;
    } catch (error) {
        console.error('Error getting stays:', error);
        return [];
    }
}