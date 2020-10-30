const functions = require("firebase-functions");
const { GeoCollectionReference } = require("geofirestore");
let is_admin_initialized = false
let is_messaging_inititalized = false
let admin = null
let messaging = null

function initAdmin() {
    if (is_admin_initialized) return
    admin = require("firebase-admin");
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
    is_admin_initialized = true
}

function initMessaging() {
    if (is_admin_initialized && !is_messaging_inititalized) {
        messaging = admin.messaging();
        is_messaging_inititalized = true
    } else {
        initAdmin();
        initMessaging();
    }
}
exports.sendFCMbyToken = functions.https.onCall(async (data) => {
    initMessaging();
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
    initMessaging()
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
exports.createMerchantAccount = functions.https.onCall((data) => {
    initAdmin();
    let profile = Object.assign({}, data);
    profile.contact.phone = '+63' + profile.contact.phone
    return admin.auth().createUser({
        email: profile.contact.email,
        emailVerified: false,
        phoneNumber: profile.contact.phone,
        password: profile.pass1,
        displayName: profile.contact.person,
        disabled: false,
    }).then(function(userRecord) {
        return admin.auth().setCustomUserClaims(userRecord.uid, { merchant: true }).then(() => {
            delete profile.pass1
            profile.users = [userRecord.uid]
            return admin.firestore().collection('food_merchants').add(profile).then(() => {
                return {
                    success: true
                }
            })
        }).catch((error) => {
            console.log(error)
            return {
                success: false,
                message: error
            }
        });
    }).catch((error) => {
        console.log(error)
        return {
            success: false,
            message: error
        }
    })
})
exports.createNewRider = functions.https.onCall((data) => {
    initAdmin();
    let rider = new GeoCollectionReference(admin.firestore().collection("riders"));
    let profile = Object.assign({}, data);
    profile.coordinates = new admin.firestore.GeoPoint(0, 0);
    profile.contact = '+63' + profile.contact;
    let defaultpassword = 'JFRiderDefault'
    if (profile.hasOwnProperty('password')) {
        defaultpassword = profile.password
        delete profile.password
    }
    profile.balance = 0;
    profile.status = {
        job: "NA",
        profile: "PRE-REG",
    };
    return admin.auth().createUser({
        email: profile.email,
        emailVerified: false,
        phoneNumber: profile.contact,
        password: defaultpassword,
        displayName: profile.profile.firstname + ' ' + profile.profile.lastname,
        disabled: false,
    }).then(function(userRecord) {
        return rider.doc(userRecord.uid).set(profile).then(() => {
            admin.auth().setCustomUserClaims(userRecord.uid, { rider: true }).then(async () => {
                initMessaging();
                const message = {
                    name: data.name,
                    notification: {
                        title: 'New Rider',
                        body: 'New rider registration alert.',
                        image: '/icon-96px.png',
                    },
                    android: {},
                    webpush: {
                        headers: {
                            Urgency: "high",
                        },
                        notification: {
                            icon: "/favicon.png",
                            badge: "/icon-96px.png",
                            title: 'New Rider',
                            body: 'New rider registration alert',
                        },
                        fcm_options: {
                            link: 'https://admin.jiffyfavors.com/riders',
                        },
                    },
                    apns: {
                        fcm_options: {},
                    },
                    fcm_options: {},
                    topic: 'admin',
                };
                await messaging.send(message);
                return {
                    status: 'success',
                    msg: 'Create Rider Succcess',
                    success: true
                }
            });
        });
    }).catch(function(error) {
        return {
            status: 'success',
            msg: 'Create Rider Failed',
            success: false,
            error: error
        }
    });
});
exports.subscribeToTopic = functions.https.onCall(async (data) => {
    initMessaging();
    data.topics.forEach((topic) => {
        admin.messaging().subscribeToTopic(data.tokens, topic).then(function(response) {
            console.log("Successfully subscribed to topic:", response);
        }).catch(function(error) {
            console.log("Error subscribing to topic:", error);
        });
    });
});
exports.unsubscribeFromTopic = functions.https.onCall(async (data) => {
    initMessaging();
    data.topics.forEach((topic) => {
        admin.messaging().unsubscribeFromTopic(data.tokens, topic).then(function(response) {
            console.log("Successfully unsubscribed to topic:", response);
        }).catch(function(error) {
            console.log("Error unsubscribing to topic:", error);
        });
    });
});
exports.CustomClaims = functions.https.onCall(async (data) => {
    initAdmin();
    const uid = data.uid;
    let claims = {
        admin: false,
        rider: false,
        merchant: false,
        biller: false,
        shop_owner: false,
        areaMgr: false,
    };
    claims[data.type] = data.claim;
    admin.auth().setCustomUserClaims(uid, claims).then(() => {
        console.log(uid, "set as ", data.type);
    }).catch((error) => {
        console.log(uid, "error", error);
    });
});