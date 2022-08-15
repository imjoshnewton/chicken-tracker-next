import * as functions from "firebase-functions";
import { removeDefaultFlagFromFlocks, setUsersDefaultFlock } from "./flocks-controllers/flocks-controllers";

export const resultsUpdated = functions.firestore.document('flocks/{flockId}').onUpdate(async (snapshot: functions.Change<functions.firestore.QueryDocumentSnapshot>) => {
    const beforeSnap = snapshot.before.data();
    const afterSnap  = snapshot.after.data();

    if(beforeSnap.default === false && afterSnap.default === true) {
        return Promise.all([
            setUsersDefaultFlock(afterSnap.owner, snapshot.after.id),
            removeDefaultFlagFromFlocks(snapshot.after.id),
        ]);
    }
    else {
        return;
    }
})