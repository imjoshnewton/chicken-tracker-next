import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Flock } from "../../models/models";

const db = admin.firestore();

export const onNewLog = functions.firestore
  .document("logs/{logId}")
  .onCreate(async (snapshot) => {
    // const userId = context.auth?.uid;
    const flockId = snapshot.data().flock;

    const flock = await db.collection("/flocks").doc(flockId).get();

    const flockStats = await getFlockStats({
      id: flockId,
      ...flock.data(),
    } as Flock);

    return flock.ref.update({
      stats: flockStats,
    });
  });

async function getFlockStats(flock: Flock) {
  const breedTargetAverage = flock.breeds.map(
    (breed) => (breed.averageProduction * breed.count) / 7
  );
  const targetDailyAverage = breedTargetAverage.reduce((a, b) => a + b);
  const logs = await db
    .collection("logs")
    .where("flock", "==", flock.id)
    .limit(120)
    .get();
  const logDocs = logs.docs;
  const actualDailyAverage =
    logDocs.map((l) => l.data().count).reduce((a, b) => a + b) / logDocs.length;

  const beginendThisWeek = thisWeek();
  const beginendLastWeek = lastWeek();

  console.log(
    "This week: ",
    beginendThisWeek[0].toDate().toLocaleDateString(),
    beginendThisWeek[1].toDate().toLocaleDateString()
  );
  console.log(
    "Last week: ",
    beginendLastWeek[0].toDate().toLocaleDateString(),
    beginendLastWeek[1].toDate().toLocaleDateString()
  );

  return {
    targetDailyAverage,
    actualDailyAverage,
  };
}

function thisWeek(): [
  beginningofWeek: admin.firestore.Timestamp,
  endofWeek: admin.firestore.Timestamp
] {
  const today = admin.firestore.Timestamp.now();
  let tempDate = new Date(today.toDate());
  const dayOfWeek = today.toDate().getDay();
  const endOfWeek = new Date(
    tempDate.setDate(tempDate.getDate() + (6 - dayOfWeek))
  );
  tempDate = new Date(today.toDate());
  const beginningOfWeek = new Date(
    tempDate.setDate(tempDate.getDate() - dayOfWeek)
  );

  return [
    admin.firestore.Timestamp.fromDate(beginningOfWeek),
    admin.firestore.Timestamp.fromDate(endOfWeek),
  ];
}

function lastWeek(): [
  beginningofWeek: admin.firestore.Timestamp,
  endOfWeek: admin.firestore.Timestamp
] {
  const dayLastWeek = admin.firestore.Timestamp.now().toDate();
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

  return [
    admin.firestore.Timestamp.fromDate(beginningOfWeek),
    admin.firestore.Timestamp.fromDate(endOfWeek),
  ];
}
