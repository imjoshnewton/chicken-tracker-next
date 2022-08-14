import { auth, firestore } from '../libs/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, doc, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { useRouter } from 'next/router';

// Custom hook to read  auth record and user profile doc
export function useUserData() {
    const [user] = useAuthState(auth, );
    const [defaultFlock, setDefaultFlock] = useState(null);

    useEffect(() => {
        // turn off realtime subscription
        let unsubscribe;

        if (user) {
            const ref = doc(firestore, `users/${user.uid}`);

            unsubscribe = onSnapshot(ref, (doc) => {
                setDefaultFlock(doc.data()?.defaultFlock);
            });
        } else {
            setDefaultFlock(null);
        }

        return unsubscribe;
    }, [user]);

    return { user, defaultFlock };
}

export function useFlockData() {
    const router = useRouter();
    const { flockId } = router.query;

    const [flock, setFlock] = useState(null);

    useEffect(() => {
        let unsubFlock;

        if (flockId) {
            const flockDoc = doc(firestore, `flocks/${flockId}`);

            unsubFlock = onSnapshot(flockDoc, (doc) => {
                setFlock({
                    ...doc.data(),
                    id: doc.id,
                });
            });
        }
        else {
            setFlock(null);
        }

        return unsubFlock;
    }, [flockId])

    return { flockId, flock };
}

export function useLogsData() {
    const router = useRouter();
    const { flockId, statsRange } = router.query;
    const range = statsRange ? Number(statsRange) : 7;

    const [logs, setLogs] = useState(null);

    var today = new Date(Date.now())
    var pastDate = new Date(today);
    pastDate.setDate(pastDate.getDate() - range);

    // console.log("Today: ", today);
    // console.log("Past Date: ", pastDate);

    useEffect(() => {
        let unsubLogs;

        if (flockId) {
            const logCol = collection(firestore, 'logs');
            const q = query(logCol, where('flock', '==', flockId), where('date', '<=', Timestamp.fromDate(today)), where('date', '>=', Timestamp.fromDate(pastDate)), orderBy('date', 'desc'));

            unsubLogs = onSnapshot(q, (docs) => {
                setLogs(docs.docs.map(doc => doc.data()));
            })
        }
        else {
            setLogs(null);
        }

        return unsubLogs;
    }, [flockId, range])

    return { logs, range };
}

export function useAllLogsData() {
    const router = useRouter();
    const { flockId } = router.query;

    const [logs, setLogs] = useState(null);

    useEffect(() => {
        let unsubLogs;

        if (flockId) {
            const logCol = collection(firestore, 'logs');
            const q = query(logCol, where('flock', '==', flockId), orderBy('date', 'desc'));

            unsubLogs = onSnapshot(q, (docs) => {
                const docsWithIds = docs.docs.map(doc => {
                    return {
                        id: doc.id,
                        count: doc.data().count,
                        date: doc.data().date,
                        notes: doc.data().notes,
                    }
                });
                setLogs(docsWithIds);
            })
        }
        else {
            setLogs(null);
        }

        return unsubLogs;
    }, [flockId])

    return { logs };
}

export function useAllExpensesData() {
    const router = useRouter();
    const { flockId } = router.query;

    const [expenses, setExpenses] = useState(null);

    useEffect(() => {
        let unsubLogs;

        if (flockId) {
            const expCol = collection(firestore, 'expenses');
            const q = query(expCol, where('flock', '==', flockId), orderBy('date', 'desc'));

            unsubLogs = onSnapshot(q, (docs) => {
                const docsWithIds = docs.docs.map(doc => {
                    return {
                        id: doc.id,
                        amount: doc.data().amount,
                        date: doc.data().date,
                        memo: doc.data().memo,
                    }
                });
                setExpenses(docsWithIds);
            }, (error) => {
                console.log("Error: ", error);
                
            })
        }
        else {
            setExpenses(null);
        }

        return unsubLogs;
    }, [flockId])

    return { expenses };
}