import * as admin from 'firebase-admin';
import * as serviceAccount from '../serviceaccount/chicken-tracker-83ef8-firebase-adminsdk-dwql3-6f33babbee.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export {
    resultsUpdated,
} from './flocks';

export {
    onNewLog,
} from './logs';