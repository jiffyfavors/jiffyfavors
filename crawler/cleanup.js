const admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert("../key.json"),
    databaseURL: "https://sound-aileron-279710.firebaseio.com",
    storageBucket: "sound-aileron-279710.appspot.com",
});
const defaultBucket = admin.storage().bucket();
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
    projectId: "sound-aileron-279710",
    keyFilename: "../key.json",
});
var bucket = storage.bucket(defaultBucket.name);
//cleanUp()
setDraft()
function setDraft(){
      admin.firestore().collection('merchant').get().then(snap=>{
        snap.docs.forEach(d=>{
              admin.firestore().collection('merchant').doc(d.id).update({
                'd.draft':true
              })
        })
      })
}
function cleanUp() {
    let merchant = []
    admin.firestore().collection('merchant').where('d.flags', 'array-contains', 'foodline').get().then((snap) => {
        snap.docs.forEach(d => {
            deleteDb(d.id)
        })
    })
}

function deleteDb(uid) {
    deleteFood(uid)
    cleanFile(uid)
    admin.firestore().collection('merchant').doc(uid).delete()
}

function deleteFood(uid) {
    admin.firestore().collection('foods').where('owner', '==', uid).get().then((snap) => {
        snap.docs.forEach(d => {
            admin.firestore().collection('foods').doc(d.id).delete()
        })
    })
}

function cleanFile(uid) {
    return bucket.deleteFiles({
        prefix: `${uid}/`
    }, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log(`All the Firebase Storage files in users/${uid}/ have been deleted`);
        }
    });
    blobs = bucket.list_blobs(prefix = `${uid}/`)
    blobs.forEach(blob => {
        blob.delete()
    })
}