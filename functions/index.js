const admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});
const messaging = admin.messaging();
const ssr = require('./ssr');
const callables = require('./callables');
const triggers = require('./triggers');

exports.nuxtssr = ssr.nuxtssr;

//callables
exports.sendFCMbyToken = callables.sendFCMbyToken;
exports.sendFCMbyTopic = callables.sendFCMbyTopic;
exports.createMerchantAccount = callables.createMerchantAccount;
exports.createNewRider = callables.createNewRider;
exports.subscribeToTopic = callables.subscribeToTopic;
exports.unsubscribeFromTopic = callables.unsubscribeFromTopic;
exports.CustomClaims = callables.CustomClaims;

//triggers
exports.riderBalance = triggers.riderBalance
exports.newOrder = triggers.newOrder
exports.newBillsPayRequest = triggers.newBillsPayRequest
exports.newShopRequest = triggers.newShopRequest