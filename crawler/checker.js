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

genClaim();
// admin.firestore().collection('foods').where('owner','==','qqp8ndMeN0v2CMIEU4re').get().then(snap=>{
//     snap.docs.forEach(food=>{
//         admin.firestore().collection('foods').doc(food.id).update({
//             owner: [food.data().owner]
//         })
//     })
// })
//setTime();
//getToken()
async function getToken(){
     let tokens = await  admin.firestore().collection('tokens').doc('admin').get()
     console.log()

     tokens.data().tokens.map((token)=>{
        console.log(token)
     })
     // tokens.forEach(async (token)=>{
     //    console.log(token)
     // })
}
function genClaim(){
  admin.firestore().collection('merchant').get().then(snap => {
    snap.docs.forEach(i=>{
         admin.firestore().collection('merchant').doc(i.id).update({
            'd.claimCode': generateBookingId()
         })
  })  
})
}


        function generateBookingId() {
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            let result = 'CLAIM-'
            for (let i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
            return result
        }


// var bucket = storage.bucket(defaultBucket.name);
// admin.firestore().collection('merchant').get().then(snap => {
//     let food = []
//     let merchant = []
//     snap.docs.forEach(data => {
//     	merchant.push(data.id)
//     })
//      admin.firestore().collection('foods').get().then(food => {
//         	food.docs.forEach(f=>{
//         		let index = merchant.findIndex(x=>x==f.data().owner)
//         		if(index<0){
//         			  cleanFile(f.data().owner)
//         			admin.firestore().collection('foods').doc(f.id).delete()
//         		}
//         	})
//         })

// })





// function deleteDb(uid) {
//     deleteFood(uid)
//     cleanFile(uid)
//     admin.firestore().collection('merchant').doc(uid).delete()
// }

// function deleteFood(uid) {
//     admin.firestore().collection('foods').where('owner', '==', uid).get().then((snap) => {
//         snap.docs.forEach(d => {
//             admin.firestore().collection('foods').doc(d.id).delete()
//         })
//     })
// }

// function cleanFile(uid) {
//     return bucket.deleteFiles({
//         prefix: `${uid}/`
//     }, function(err) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(`All the Firebase Storage files in users/${uid}/ have been deleted`);
//         }
//     });
//     blobs = bucket.list_blobs(prefix = `${uid}/`)
//     blobs.forEach(blob => {
//         blob.delete()
//     })
// }