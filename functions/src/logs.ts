import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import { Flock } from "../../models/models";

const db = admin.firestore();

export const onNewLog = functions.firestore.document('logs/{flogId}').onCreate(async (snapshot) => {
    // const userId = context.auth?.uid;
    const flockId = snapshot.data().flockId;

    const flock = await db.collection('/flocks').doc(flockId).get();

    const flockStats = await getFlockStats(flock.data() as Flock);

    return flock.ref.update(flockStats);
    
})

async function getFlockStats(flock: Flock) {
    const breedTargetAverage = flock.breeds.map(
      (breed) => (breed.averageProduction * breed.count) / 7
    );
    const targetDailyAverage = breedTargetAverage.reduce((a, b) => a + b);

    return {
        targetDailyAverage,
    };
}