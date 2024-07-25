import {collection, getDocs, getFirestore} from "firebase/firestore";
import {firestore} from "@/lib/firebase";


export async function getStaysFirebase() {
    try {
        const staysRef = collection(firestore, 'stays');
        console.log("Stays", staysRef);
        const stays: Array<any> = [];
        const snapshot = await getDocs(staysRef);
        for (const doc1 of snapshot.docs) {
            console.log(doc1);
            stays.push(doc1.data());
        }

        console.log(stays);
        return stays;
    } catch (error) {
        console.error('Error getting stays:', error);
        return [];
    }
}