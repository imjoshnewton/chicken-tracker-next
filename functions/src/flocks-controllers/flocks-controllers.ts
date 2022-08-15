// import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const setUsersDefaultFlock = async (userId: string, flockId: string ) => {
    const userDoc = await db.collection('users').doc(userId).get();

    return userDoc.ref.update({
        defaultFlock: flockId,
    });
}

export const removeDefaultFlagFromFlocks = async (newDefaultFlockId: string) => {
    const flockDocs = await db.collection('flocks').where('default', '==', true).where(admin.firestore.FieldPath.documentId.toString(), '!=', newDefaultFlockId).get();

    return Promise.all(flockDocs.docs.map(doc => {
        return doc.ref.update({
            default: false,
        });
    }))
}