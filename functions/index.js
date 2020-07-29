const functions = require("firebase-functions");
const { Nuxt } = require("nuxt-start");
const express = require("express");
const admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});
const runtimeOptions = {
    timeeoutSeconds: 15,
};
const messaging = admin.messaging();
exports.sendFCMbyToken = functions.runWith(runtimeOptions).https.onCall(async (data) => {
    const message = {
        name: data.name,
        notification: {
            title: data.title,
            body: data.body,
            image: data.image,
        },
        android: {},
        webpush: {
            headers: {
                Urgency: "high",
            },
            notification: {
                icon: "/icon-96px.png",
                badge: "/favicon.png",
                title: data.title,
                body: data.body,
                image: data.image,
            },
            fcm_options: {
                link: data.link,
            },
        },
        apns: {
            fcm_options: {},
        },
        fcm_options: {},
        token: data.token,
    };
    try {
        await messaging.send(message);
    } catch (e) {
        console.error(e.code, e.message);
    }
});
const app = express();
const nuxtConfig = require("./nuxt.config.js");
const config = { ...nuxtConfig, dev: false, buildDir: "nuxt" };
const nuxt = new Nuxt(config);
let isReady = false;
const readyPromise = nuxt.ready().then(() => {
    isReady = true;
}).catch(() => {
    process.exit(1);
});
async function handleRequest(req, res) {
    if (!isReady) {
        await readyPromise;
    }
    res.set("Cache-Control", "public, max-age=3600, s-maxage=14400");
    await nuxt.render(req, res);
}
app.get("*", handleRequest);
app.use(handleRequest);
exports.nuxtssr = functions.region("us-central1").https.onRequest(app);
exports.sendFCMbyToken = functions.https.onCall(async (data) => {
    const message = {
        name: data.name,
        notification: {
            title: data.title,
            body: data.body,
            image: data.image,
        },
        android: {},
        webpush: {
            headers: {
                Urgency: "high",
            },
            notification: {
                icon: "/favicon.png",
                badge: "/icon-96px.png",
                title: data.title,
                body: data.body,
            },
            fcm_options: {
                link: data.link,
            },
        },
        apns: {
            fcm_options: {},
        },
        fcm_options: {},
        token: data.token,
    };
    try {
        await messaging.send(message);
    } catch (e) {
        console.error(`Did not work to send a message to token ${message.token}`);
        console.error(e);
    }
});
exports.sendFCMbyTopic = functions.https.onCall(async (data) => {
    const message = {
        name: data.name,
        data: {},
        notification: {
            title: data.title,
            body: data.body,
            image: data.image,
        },
        android: {},
        webpush: {
            headers: {
                Urgency: "high",
            },
            notification: {
                icon: data.icon,
                actions: data.actions,
            },
            fcm_options: {
                link: data.link,
            },
        },
        apns: {
            fcm_options: {},
        },
        fcm_options: {},
        topic: data.topic,
    };
    try {
        await messaging.send(message);
    } catch (e) {
        console.error(e);
    }
});
exports.subscribeToTopic = functions.https.onCall(async (data) => {
    data.topics.forEach((topic) => {
        admin.messaging().subscribeToTopic(data.tokens, topic).then(function(response) {
            console.log("Successfully subscribed to topic:", response);
        }).catch(function(error) {
            console.log("Error subscribing to topic:", error);
        });
    });
});
exports.unsubscribeFromTopic = functions.https.onCall(async (data) => {
    data.topics.forEach((topic) => {
        admin.messaging().unsubscribeFromTopic(data.tokens, topic).then(function(response) {
            console.log("Successfully unsubscribed to topic:", response);
        }).catch(function(error) {
            console.log("Error unsubscribing to topic:", error);
        });
    });
});
exports.newOrder = functions.firestore.document("orders/{doc_id}").onCreate((snap, context) => {
    let area = snap.data().d.area
     notifyAdmin("Food Order", context.params.doc_id, area);
});
exports.newBillsPayRequest = functions.firestore.document("billspay_request/{doc_id}").onCreate((snap, context) => {
      let area = snap.data().d.area
     notifyAdmin("Bills Payment Job", context.params.doc_id,area);
});
exports.newShopRequest = functions.firestore.document("shop_request/{doc_id}").onCreate((snap, context) => {
      let area = snap.data().d.area
     notifyAdmin("Shopping Job", context.params.doc_id, area);
});
exports.CustomClaims = functions.https.onCall(async (data) => {
    const uid = data.uid;
    let claims = {
        admin: false,
        rider: false,
        merchant: false,
        biller: false,
        shop_owner: false,
    };
    claims[data.type] = data.claim;
    admin.auth().setCustomUserClaims(uid, claims).then(() => {
        console.log(uid, "set as ", data.type);
    }).catch((error) => {
        console.log(uid, "error", error);
    });
});
async function notifyAdmin(type, id, area) {
    const message = {
        name: "New Transaction",
        data: {},
        notification: {
            title: "New " + type + " received " + id,
            body: "We received new " + type,
            image: null,
        },
        android: {},
        webpush: {
            headers: {
                Urgency: "high",
            },
            notification: {
                icon: null,
                actions: null,
            },
            fcm_options: {
                link: "/",
            },
        },
        apns: {
            fcm_options: {},
        },
        fcm_options: {},
    };
    try {
        
        let tokens = await admin.firestore().collection("tokens").doc("admin").get();
        tokens.data().tokens.map(async (token) => {
           message.token = token
           await messaging.send(message)
           
        });
        let rider_msg = Object.assign({}, message)
        rider_msg.name = 'Rider Job Notification'
        rider_msg.notification.title = type + ' Job Available'
        rider_msg.notification.body = 'New ' + type + ' job available on your area.'
        rider_msg.webpush.fcm_options.link = '/jobs'
        let rider_tokens = await admin.firestore().collection('tokens').doc('riders').collection('tokens').doc(area).get()
        rider_tokens.data().tokens.map(async (token) => {
            rider_msg.token = token;
            await messaging.send(rider_msg)
            
        });
       return 'success';
    } catch (e) {
        console.error(e);
        
    }
}