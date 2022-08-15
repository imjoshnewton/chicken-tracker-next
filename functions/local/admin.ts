import * as admin from "firebase-admin";
import { Timestamp } from "firebase/firestore";
import * as serviceAccount from "../serviceaccount/chicken-tracker-83ef8-firebase-adminsdk-dwql3-6f33babbee.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

async function updateFlockSchema() {
  const flockCol = await db.collection("flocks").get();

  return Promise.all(
    flockCol.docs.map((doc) => {
      const docData = doc.data();
      const brreds = docData.breeds.map((b: any) => {
        return {
          name: b.breed,
          count: b.count,
          averageProduction: b.averageProduction,
          imageUrl: b.imageUrl,
        };
      });

      return doc.ref.update({
        name: docData.name,
        description: docData.description,
        owner: docData.owner,
        type: docData.type,
        imageUrl: docData.imageUrl,
        default: docData.default,
        breeds: brreds,
      });
    })
  );
}

function getLastWeekandThisWeek() {}

function thisWeek(): [beginningofWeek: Timestamp, endofWeek: Timestamp] {
  const today = Timestamp.now();
  let tempDate = new Date(today.toDate());
  const dayOfWeek = today.toDate().getDay();
  const endOfWeek = new Date(
    tempDate.setDate(tempDate.getDate() + (6 - dayOfWeek))
  );
  tempDate = new Date(today.toDate());
  const beginningOfWeek = new Date(
    tempDate.setDate(tempDate.getDate() - dayOfWeek)
  );

  return [Timestamp.fromDate(beginningOfWeek), Timestamp.fromDate(endOfWeek)];
}

function lastWeek(): [beginningofWeek: Timestamp, endOfWeek: Timestamp] {
  const dayLastWeek = Timestamp.now().toDate();
  dayLastWeek.setDate(dayLastWeek.getDate() - 7);

  let tempDate = new Date(dayLastWeek);
  const dayOfWeek = dayLastWeek.getDay();
  const endOfWeek = new Date(
    tempDate.setDate(tempDate.getDate() + (6 - dayOfWeek))
  );
  tempDate = new Date(dayLastWeek);
  const beginningOfWeek = new Date(
    tempDate.setDate(tempDate.getDate() - dayOfWeek)
  );

  return [Timestamp.fromDate(beginningOfWeek), Timestamp.fromDate(endOfWeek)];
}

(async () => {
  const result = await updateFlockSchema();

  console.log("Result: ", result);
})();
