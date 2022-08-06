import { auth, firestore } from '../libs/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query, QuerySnapshot, where } from 'firebase/firestore';
import { useRouter } from 'next/router';

// Custom hook to read  auth record and user profile doc
export function useUserData() {
    const [user] = useAuthState(auth);
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
                setFlock(doc.data());
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
    const { flockId } = router.query;

    const [logs, setLogs] = useState(null);

    useEffect(() => {
        let unsubLogs;

        if (flockId) {
            const logCol = collection(firestore, 'logs');
            const q = query(logCol, where('flock', '==', flockId), orderBy('date', 'desc'), limit(7));

            unsubLogs = onSnapshot(q, (docs) => {
                setLogs(docs.docs.map(doc => doc.data()));
            })
        }
        else {
            setLogs(null);
        }

        return unsubLogs;
    }, [flockId])

    return { logs };
}