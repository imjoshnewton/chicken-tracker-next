import * as admin from "firebase-admin";
import { Flock } from "../../../models/models";

const db = admin.firestore();

export async function getFlockStats(flock: Flock) {
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

  const thisWeeksAverage = thisWeeksLogs.size
    ? thisWeeksLogs.docs.map((d) => d.data().count).reduce((a, b) => a + b) /
      thisWeeksLogs.docs.length
    : 0;
  const lastWeeksAverage = lastWeeksLogs.size
    ? lastWeeksLogs.docs.map((d) => d.data().count).reduce((a, b) => a + b) /
      lastWeeksLogs.docs.length
    : 0;

  return {
    targetDailyAverage,
    actualDailyAverage,
    thisWeeksAverage,
    lastWeeksAverage,
  };
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
  endOfWeek.setHours(23, 59, 59, 999);
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
  endOfWeek.setHours(23, 59, 59, 999);
  tempDate = new Date(dayLastWeek);
  const beginningOfWeek = new Date(
    tempDate.setDate(tempDate.getDate() - dayOfWeek)
  );

  return [
    admin.firestore.Timestamp.fromDate(beginningOfWeek),
    admin.firestore.Timestamp.fromDate(endOfWeek),
  ];
}
