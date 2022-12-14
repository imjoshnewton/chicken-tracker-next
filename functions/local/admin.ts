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

async function getLastWeekandThisWeek() {
  const thisWeek = getThisWeek();
  const lastWeek = getLastWeek();

  const thisWeeksLogs = await db
    .collection("logs")
    .where("date", ">=", thisWeek[0])
    .where("date", "<=", thisWeek[1])
    .get();
  const lastWeeksLogs = await db
    .collection("logs")
    .where("date", ">=", lastWeek[0])
    .where("date", "<=", lastWeek[1])
    .get();

  console.log(
    "This week: ",
    thisWeek[0].toDate().toLocaleDateString(),
    thisWeek[1].toDate().toLocaleDateString()
  );

  console.log(thisWeeksLogs.size);

  console.log(
    "Last week: ",
    lastWeek[0].toDate().toLocaleDateString(),
    lastWeek[1].toDate().toLocaleDateString()
  );

  console.log(lastWeeksLogs.size);

  const thisWeeksAverage =
    thisWeeksLogs.docs.map((d) => d.data().count).reduce((a, b) => a + b) /
    thisWeeksLogs.docs.length;
  const lastWeeksAverage =
    lastWeeksLogs.docs.map((d) => d.data().count).reduce((a, b) => a + b) /
    lastWeeksLogs.docs.length;

  console.log(thisWeeksAverage);

  console.log(lastWeeksAverage);
}

function getThisWeek(): [
  beginningofWeek: admin.firestore.Timestamp,
  endofWeek: admin.firestore.Timestamp
] {
  const today = admin.firestore.Timestamp.now().toDate();
  today.setHours(0, 0, 0, 0);
  let tempDate = new Date(today);
  const dayOfWeek = today.getDay();
  const endOfWeek = new Date(
    tempDate.setDate(tempDate.getDate() + (6 - dayOfWeek))
  );
  tempDate = new Date(today);
  const beginningOfWeek = new Date(
    tempDate.setDate(tempDate.getDate() - dayOfWeek)
  );

  return [
    admin.firestore.Timestamp.fromDate(beginningOfWeek),
    admin.firestore.Timestamp.fromDate(endOfWeek),
  ];
}

function getLastWeek(): [
  beginningofWeek: admin.firestore.Timestamp,
  endOfWeek: admin.firestore.Timestamp
] {
  const dayLastWeek = admin.firestore.Timestamp.now().toDate();
  dayLastWeek.setDate(dayLastWeek.getDate() - 7);
  dayLastWeek.setHours(0, 0, 0, 0);

  let tempDate = new Date(dayLastWeek);
  const dayOfWeek = dayLastWeek.getDay();
  const endOfWeek = new Date(
    tempDate.setDate(tempDate.getDate() + (6 - dayOfWeek))
  );
  tempDate = new Date(dayLastWeek);
  const beginningOfWeek = new Date(
    tempDate.setDate(tempDate.getDate() - dayOfWeek)
  );

  return [
    admin.firestore.Timestamp.fromDate(beginningOfWeek),
    admin.firestore.Timestamp.fromDate(endOfWeek),
  ];
}

(async () => {
  //   const result = await updateFlockSchema();

  await getLastWeekandThisWeek();

  //   console.log("Result: ", result);
})();
