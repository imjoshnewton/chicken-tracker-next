import { auth, firestore } from '../libs/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

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