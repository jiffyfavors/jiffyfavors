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
    if (is_admin_initialized && !is_messaging_inititalized)
    {
        messaging = admin.messaging();
        is_messaging_inititalized = true

    }else{
        initAdmin();
        initMessaging();
    }

}

exports.riderBalance = functions.firestore.document("riders/{doc_id}/balances/{balance_id}").onCreate((snap, context) => {
    initAdmit();
    let balance = snap.data().amount
    if (snap.data().type === 'top-up') {
        let remit = balance * 0.7
        let area_fee = balance - remit
        admin.firestore().collection('riders').doc(context.params.doc_id).get().then((data) => {
            let area = data.data().d.area
            admin.firestore().collection('areas').doc(area).collection('balances').add({
                remitted: false,
                platform: remit,
                area_manager: area_fee,
                rider: context.params.doc_id,
                desc: 'Top Up Revenue',
                timestamp: snap.data().timestamp
            })
        })
    }
    admin.firestore().collection('riders').doc(context.params.doc_id).update({
        'd.balance': admin.firestore.FieldValue.increment(balance)
    })
    return {
        msg: 'Function Done'
    }
});

exports.newAreaApplication = functions.firestore.document("area_application/{doc_id}").onCreate((snap, context) => {
    let data = snap.data();
    let msg = {
            name: "Area Manager Application",
            data: {},
            notification: {
                title:'Area Manager Signup',
                body: data.fullname +" apply for "+ data.city.name
            },
            android: {},
            webpush: {
                headers: {
                    Urgency: "high",
                },
                notification: {
                    title: "Area Manager Signup",
                    body: data.fullname +" apply for "+ data.city.name,
                    icon: "/icon-96px.png",
                    badge: "/badge.png"
                },
                fcm_options: {
                    link: "/",
                },
            },
            apns: {
                fcm_options: {},
            },
            fcm_options: {},
            topic: "admin"
        }
        initMessaging();
        messaging.send(msg);

});
exports.newOrder = functions.firestore.document("orders/{doc_id}").onCreate((snap, context) => {
    let area = snap.data().d.area;
    let merch_id = snap.data().d.order.merchant.id;
    initAdmin();
    admin.firestore().collection("merchant").doc(merch_id).get().then(async (store) => {
        if (store.data().d.hasOwnProperty("managed_by")) {
            let ids = store.data().d.managed_by;
            let messages = [];
            await Promise.all(ids.map(async (id) => {
                let merch = await admin.firestore().collection("food_merchants").doc(id).get();
                let tokens = merch.data().tokens;
                await Promise.all(tokens.map(async (token) => {
                    messages.push({
                        name: "New Transaction",
                        data: {},
                        notification: {
                            title: "New Order Received",
                            body: "You received new order for " + snap.data().d.order.merchant.name + "-" + snap.data().d.order.merchant.branch,
                            image: null,
                        },
                        android: {},
                        webpush: {
                            headers: {
                                Urgency: "high",
                            },
                            notification: {
                                icon: "/icon-96px.png",
                                badge: "/badge.png",
                                title: "New Order Received",
                                body: "You received new order for " + snap.data().d.order.merchant.name + "-" + snap.data().d.order.merchant.branch,
                                image: null,
                            },
                            fcm_options: {
                                link: "/",
                            },
                        },
                        apns: {
                            fcm_options: {},
                        },
                        fcm_options: {},
                        token: token,
                    });
                }));
            }));
            initMessaging();
            messaging.sendAll(messages);
        }
    });
    return notifyAdmin("Food Order", context.params.doc_id, area);
});
exports.newBillsPayRequest = functions.firestore.document("billspay_request/{doc_id}").onCreate((snap, context) => {
    let area = snap.data().d.area;
    return notifyAdmin("Bills Payment", context.params.doc_id, area);
});
exports.newShopRequest = functions.firestore.document("shop_request/{doc_id}").onCreate((snap, context) => {
    let area = snap.data().d.area;
    return notifyAdmin("Shopping", context.params.doc_id, area);
});
async function notifyAdmin(type, id, area) {
    let ridertopic = area + "_rider";
    try {
        let messages = [];
        messages.push({
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
                    icon: "/icon-96px.png",
                    badge: "/badge.png",
                    title: "New " + type + " received " + id,
                    body: "We received new " + type,
                    image: null,
                },
                fcm_options: {
                    link: "/",
                },
            },
            apns: {
                fcm_options: {},
            },
            fcm_options: {},
            topic: "admin",
        });
        messages.push({
            name: "Rider Job Notification",
            data: {},
            notification: {
                title: type + " Job Available",
                body: "New " + type + " job available on your area.",
            },
            android: {},
            webpush: {
                headers: {
                    Urgency: "high",
                },
                notification: {
                    title: type + " Job Available",
                    body: "New " + type + " job available on your area.",
                    icon: "/icon-96px.png",
                    badge: "/badge.png",
                },
                fcm_options: {
                    link: "/",
                },
            },
            apns: {
                fcm_options: {},
            },
            fcm_options: {},
            topic: ridertopic,
        });
        initMessaging()
        return await messaging.sendAll(messages).then((response) => {
            console.log(response);
            console.log(response.successCount + " messages were sent successfully");
        }).catch((error) => {
            console.log(error);
        });
    } catch (e) {
        console.error(e);
    }
}