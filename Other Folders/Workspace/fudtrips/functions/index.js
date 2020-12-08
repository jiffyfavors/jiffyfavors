const functions = require("firebase-functions");
const { Nuxt } = require("nuxt-start");
const express = require("express");
const admin = require("firebase-admin");
const firebaseConfig = {
  apiKey: 'AIzaSyDX-atoLm6nQpMgQ_GYHIo1kiscAe5txXc',
  authDomain: 'sound-aileron-279710.firebaseapp.com',
  databaseURL: 'https://sound-aileron-279710.firebaseio.com',
  projectId: 'sound-aileron-279710',
  storageBucket: 'sound-aileron-279710.appspot.com',
  messagingSenderId: '953894101400',
  appId: '1:953894101400:web:c06b9af64f518a17f14bed',
  measurementId: 'G-RLCD9YBDHX'
}
admin.initializeApp(firebaseConfig);
const messaging = admin.messaging();
const app = express();
const nuxtConfig = require("./nuxt.config.js");
const config = { ...nuxtConfig, dev: false, buildDir: "nuxt" };
const nuxt = new Nuxt(config);
let isReady = false;
const readyPromise = nuxt
  .ready()
  .then(() => {
    isReady = true;
  })
  .catch(() => {
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
// exports.sendFCMbyTopic = functions.https.onCall(async (data) => {
//   const message = {
//     name: data.name,
//     topic:data.topic,
//     data: {},
//     notification: {
//       title: data.title,
//       body:  data.body,
//       image: data.image
//     },
//     android: {},
//     webpush: {
//       notification: {
//         icon: data.icon,
//         actions: data.actions
//       },
//       fcm_options: {
//         link: data.link,
//       },
//     },
//     apns: {
//       fcm_options: {},
//     },
//     fcm_options: {},
//     token: data.token,
//   };
//   try {
//     await messaging.send(message);
//   } catch (e) {
//     console.error(e);
//   }
// });
exports.subscribeToTopic = functions.https.onCall(async (data) => {
  data.topics.forEach((topic) => {
    admin
      .messaging()
      .subscribeToTopic(data.tokens, topic)
      .then(function (response) {
        // See the MessagingTopicManagementResponse reference documentation
        // for the contents of response.
        console.log("Successfully subscribed to topic:", response);
      })
      .catch(function (error) {
        console.log("Error subscribing to topic:", error);
      });
  });
});
exports.unsubscribeFromTopic = functions.https.onCall(async (data) => {
  data.topics.forEach((topic) => {
    admin
      .messaging()
      .subscribeToTopic(data.tokens, topic)
      .then(function (response) {
        // See the MessagingTopicManagementResponse reference documentation
        // for the contents of response.
        console.log("Successfully unsubscribed to topic:", response);
      })
      .catch(function (error) {
        console.log("Error unsubscribing to topic:", error);
      });
  });
});
// exports.newOrder = functions.firestore
//   .document('orders/{doc-id}')
//   .onWrite((change, context) => {
//   });
// exports.newBillsPayRequest = functions.firestore
//   .document('billspay_request/{doc-id}')
//   .onWrite((change, context) => {
//   });
// exports.newShopRequest = functions.firestore
//   .document('billspay_request/{doc-id}')
//   .onWrite((change, context) => {
//   });
