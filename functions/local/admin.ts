import * as admin from 'firebase-admin';
import * as serviceAccount from '../serviceaccount/chicken-tracker-83ef8-firebase-adminsdk-dwql3-6f33babbee.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

async function updateFlockSchema() {
    const flockCol = await db.collection('flocks').get();

    return Promise.all(flockCol.docs.map(doc => {
        const docData = doc.data();
        const brreds = docData.chickens.map((b: any) => {
            return {
                name: b.breed,
                count: b.count,
                averageProduction: b.averageProduction,
                imageUrl: b.imageUrl,
            }
        })

        return doc.ref.update({
            name: docData.name,
            description: docData.description,
            owner: docData.owner,
            type: docData.type,
            imageUrl: docData.imageUrl,
            default: docData.default,
            breeds: brreds
        })
    }));
}

(async () => {
    const result = await updateFlockSchema();

    console.log("Result: ", result);
    
})()