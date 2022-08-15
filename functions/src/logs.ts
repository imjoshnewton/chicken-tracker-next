import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Flock } from "../../models/models";
import { getFlockStats } from "./logs-controllers/logs-controllers";

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

    console.log("Flock stats: ", flockStats);

    return flock.ref.update({
      stats: flockStats,
    });
  });
