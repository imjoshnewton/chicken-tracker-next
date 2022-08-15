"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var admin = require("firebase-admin");
var serviceAccount = require("../serviceaccount/chicken-tracker-83ef8-firebase-adminsdk-dwql3-6f33babbee.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();
function updateFlockSchema() {
    return __awaiter(this, void 0, void 0, function () {
        var flockCol;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.collection("flocks").get()];
                case 1:
                    flockCol = _a.sent();
                    return [2 /*return*/, Promise.all(flockCol.docs.map(function (doc) {
                            var docData = doc.data();
                            var brreds = docData.breeds.map(function (b) {
                                return {
                                    name: b.breed,
                                    count: b.count,
                                    averageProduction: b.averageProduction,
                                    imageUrl: b.imageUrl
                                };
                            });
                            return doc.ref.update({
                                name: docData.name,
                                description: docData.description,
                                owner: docData.owner,
                                type: docData.type,
                                imageUrl: docData.imageUrl,
                                "default": docData["default"],
                                breeds: brreds
                            });
                        }))];
            }
        });
    });
}
function getLastWeekandThisWeek() {
    return __awaiter(this, void 0, void 0, function () {
        var thisWeek, lastWeek, thisWeeksLogs, lastWeeksLogs, thisWeeksAverage, lastWeeksAverage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    thisWeek = getThisWeek();
                    lastWeek = getLastWeek();
                    return [4 /*yield*/, db
                            .collection("logs")
                            .where("date", ">=", thisWeek[0])
                            .where("date", "<=", thisWeek[1])
                            .get()];
                case 1:
                    thisWeeksLogs = _a.sent();
                    return [4 /*yield*/, db
                            .collection("logs")
                            .where("date", ">=", lastWeek[0])
                            .where("date", "<=", lastWeek[1])
                            .get()];
                case 2:
                    lastWeeksLogs = _a.sent();
                    console.log("This week: ", thisWeek[0].toDate().toLocaleDateString(), thisWeek[1].toDate().toLocaleDateString());
                    console.log(thisWeeksLogs.size);
                    console.log("Last week: ", lastWeek[0].toDate().toLocaleDateString(), lastWeek[1].toDate().toLocaleDateString());
                    console.log(lastWeeksLogs.size);
                    thisWeeksAverage = thisWeeksLogs.docs.map(function (d) { return d.data().count; }).reduce(function (a, b) { return a + b; }) /
                        thisWeeksLogs.docs.length;
                    lastWeeksAverage = lastWeeksLogs.docs.map(function (d) { return d.data().count; }).reduce(function (a, b) { return a + b; }) /
                        lastWeeksLogs.docs.length;
                    console.log(thisWeeksAverage);
                    console.log(lastWeeksAverage);
                    return [2 /*return*/];
            }
        });
    });
}
function getThisWeek() {
    var today = admin.firestore.Timestamp.now().toDate();
    today.setHours(0, 0, 0, 0);
    var tempDate = new Date(today);
    var dayOfWeek = today.getDay();
    var endOfWeek = new Date(tempDate.setDate(tempDate.getDate() + (6 - dayOfWeek)));
    tempDate = new Date(today);
    var beginningOfWeek = new Date(tempDate.setDate(tempDate.getDate() - dayOfWeek));
    return [
        admin.firestore.Timestamp.fromDate(beginningOfWeek),
        admin.firestore.Timestamp.fromDate(endOfWeek),
    ];
}
function getLastWeek() {
    var dayLastWeek = admin.firestore.Timestamp.now().toDate();
    dayLastWeek.setDate(dayLastWeek.getDate() - 7);
    dayLastWeek.setHours(0, 0, 0, 0);
    var tempDate = new Date(dayLastWeek);
    var dayOfWeek = dayLastWeek.getDay();
    var endOfWeek = new Date(tempDate.setDate(tempDate.getDate() + (6 - dayOfWeek)));
    tempDate = new Date(dayLastWeek);
    var beginningOfWeek = new Date(tempDate.setDate(tempDate.getDate() - dayOfWeek));
    return [
        admin.firestore.Timestamp.fromDate(beginningOfWeek),
        admin.firestore.Timestamp.fromDate(endOfWeek),
    ];
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            //   const result = await updateFlockSchema();
            return [4 /*yield*/, getLastWeekandThisWeek()];
            case 1:
                //   const result = await updateFlockSchema();
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
