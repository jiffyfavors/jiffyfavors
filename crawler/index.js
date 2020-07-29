const axios = require("axios");
const fs = require("fs");
const request = require("request");
const path = require("path");
const admin = require("firebase-admin");
const uuidv4 = require("uuid/v4");
const { GeoFirestore, GeoCollectionReference } = require("geofirestore");
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
uploadedMerchant = [];
let counter = 0;
let current = 0;
let total = 0;
getRestoInfo('mcdonalds-2TAs7mkvMx6GCdb');

function StartCrawl() {
    uploadedMerchant = [];
    admin.firestore().collection("merchant").where("d.flags", "array-contains", "foodline").get().then((snap) => {
        snap.docs.forEach((d) => {
            uploadedMerchant.push({ id: d.id, data: d.data().d });
        });
        getRestaurant();
    });
}
async function getRestaurant() {
    response = await axios.post("https://foodline.ph/public/api/get-delivery-restaurants", {
        latitude: "9.7429782",
        longitude: "118.7384205",
    });
    await sleep(1000);
    for (const [key, value] of Object.entries(response.data)) {
        let rawdata = fs.readFileSync("slug.json");
        let slugs = JSON.parse(rawdata);
        let index = slugs.findIndex((x) => x === value.slug);
        if (index < 0) {
            await getRestoInfo(value.slug);
        }
        current = ++current;
        let progress = parseFloat(
            (current / response.data.length) * 100).toFixed(2);
        console.log("Progress", current + "/" + response.data.length, progress, "%");
        counter = ++counter;
    }
}

function genOptions(_item) {
    let options = [];
    _item.forEach((item) => {
        let min = 0,
            max = 0;
        if (item.type === "MULTI") {
            min = 0;
            max = item.addons.length;
        } else {
            min = 1;
            max = 1;
        }
        options.push({
            min: min,
            max: max,
            name: item.name,
            values: [],
        });
        item.addons.forEach((i) => {
            options[options.length - 1].values.push({
                name: i.name.replace("+ ", ""),
                price: parseFloat(i.price),
            });
        });
    });
    return options;
}
async function generateMenu(slug, uid) {
    let link = "https://foodline.ph/public/api/get-restaurant-items/" + slug;
    let data = await axios.post(link);
    counter = ++counter;
    let items = data.data.items;
    let menu = [];
    for (const [key, value] of Object.entries(items)) {
        let foods = [];
        for (const [_food, item] of Object.entries(value)) {
            let options = [];
            if (item.addon_categories.length > 0) options = genOptions(item.addon_categories);
            let file = item.image;
            file = file.substring(file.lastIndexOf("/") + 1, file.length);
            let url = "https://foodline.ph/assets/img/items/" + file;
            let dl_path = path.join(__dirname, "images", file);
            let img = "";
            let rawdata = fs.readFileSync("uploaded.json");
            let uploaded = JSON.parse(rawdata);
            if (uploaded.findIndex((x) => x.file === file) < 0) {
                img = await FileGenerator("generateMenu", url, file, dl_path, uid);
            } else {
                img = uploaded[uploaded.findIndex((x) => x.file === file)].url;
            }
            let food = {
                flags: ["foodline"],
                name: item.name,
                base_price: item.price,
                desc: item.desc,
                img: img,
                owner: uid,
                options: options,
            };
            let encode = await admin.firestore().collection("foods").add(food);
            foods.push(encode.id);
        }
        menu.push({ name: key, values: foods });
    }
    return menu;
}

function getItem(slug) {
    axios.post(link).then(function(response) {
        console.log(response.data.items);
    }).catch(function(error) {
        console.log(error);
    });
}
async function getRestoInfo(slug) {
    let link = "https://foodline.ph/public/api/get-restaurant-info/" + slug;
    let resto = await axios.post(link);
    counter = ++counter;
    let file = resto.data.image;
    console.log("Checking:", resto.data.name);
    file = file.substring(file.lastIndexOf("/") + 1, file.length);
    let url = "https://foodline.ph/assets/img/restaurants/" + file;
    let dl_path = path.join(__dirname, "images", file);
    let data = resto.data;
    const ref = new GeoFirestore(admin.firestore()).collection("merchant");
    var _url = data.name.replace(" ", "_").replace("'", "").toLowerCase() + "_" + data.address.replace(" ", "_").replace("'", "").toLowerCase().replace(/ /g, "_").replace(/'/g, "");
    console.log(resto.data.name, "started");
    let coord = new admin.firestore.GeoPoint(parseFloat(data.latitude), parseFloat(data.longitude));
    let store = await ref.add({
        business_name: data.name,
        branch: data.address,
        coordinates: coord,
        menu: [],
        flags: ["foodline"],
        draft: true,
        rates: {
            cr: 0,
            sc: 5,
        },
        delivery_time: {
            open: "9:00:00",
            close: "18:00:00",
        },
        url: _url.replace(/ /g, "_").replace(/'/g, ""),
    });
    let logo = "";
    let rawdata = fs.readFileSync("uploaded.json");
    let uploaded = JSON.parse(rawdata);
    if (uploaded.findIndex((x) => x.file === file) < 0) {
        logo = await FileGenerator("getRestoInfo", url, file, dl_path, store.id);
    } else {
        logo = uploaded[uploaded.findIndex((x) => x.file === file)].url;
    }
    let menu = await generateMenu(slug, store.id);
    ref.doc(store.id).update({
        delivery_time: {
            open: "09:00:00",
            close: "18:00:00",
        },
        menu: menu,
        logo: logo,
        backdrop: logo,
    }).then(async () => {
        fs.readFile("slug.json", function(err, data) {
            var slugs = JSON.parse(data);
            slugs.push(slug);
            fs.writeFile("slug.json", JSON.stringify(slugs), async function(err, result) {
                if (err) console.log("error", err);
                console.log(data.name, "finished");
                await sleep(1000);
            });
        });
    });
    //let img = await upload(dl_path, file)
}
const download = async (url, path) => {
    await request.head(url, async (err, res, body) => {
        let file = await request(url);
        await new Promise((resolve, reject) => {
            file.pipe(fs.createWriteStream(path)).on("close", resolve).on("error", console.error);
        });
    });
};
const FileGenerator = async (callee, url, file, file_path, uid) => {
    if (!fs.existsSync(file_path)) {
        await request.head(url, async (err, res, body) => {
            let _file = await request(url);
            counter = ++counter;
            await new Promise((resolve, reject) => {
                _file.pipe(fs.createWriteStream(file_path)).on("close", resolve).on("error", async (e) => {
                    deleteDb(uid);
                    console.log("Error:", e.code);
                    console.log("UID:", uid);
                });
            });
        });
        if (counter % 15 === 0) {
            console.log("Counter Reached. Pausing");
            await sleep(3000);
        }
    }
    while (!fs.existsSync(file_path)) {
        await sleep(100);
    }
    const uuid = uuidv4();
    let file_url = await bucket.upload(file_path, {
        destination: uid + "/" + file,
        gzip: true,
        metadata: {
            metadata: {
                firebaseStorageDownloadTokens: uuid,
            },
        },
    }).then(async (data) => {
        let f = data[0];
        let img = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(f.name) + "?alt=media&token=" + uuid;
        fs.readFile("uploaded.json", function(err, data) {
            var uploaded = JSON.parse(data);
            uploaded.push({ file: file, url: img });
            fs.writeFile("uploaded.json", JSON.stringify(uploaded), function(err, result) {
                if (err) console.log("error", err);
            });
        });
        await sleep(200);
        return Promise.resolve(img);
    }).catch((error) => {
        console.log("Error", error);
        return "";
    });
    return file_url;
};
const upload = async (dl_path, file, uid) => {
    const uuid = uuidv4();
    return await bucket.upload(dl_path, {
        destination: uid + "/" + file,
        gzip: true,
        metadata: {
            metadata: {
                firebaseStorageDownloadTokens: uuid,
            },
        },
    }).then((data) => {
        let file = data[0];
        return Promise.resolve("https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid);
    });
};

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function deleteDb(uid) {
    deleteFood(uid);
    cleanFile(uid);
    admin.firestore().collection("merchant").doc(uid).delete();
}

function deleteFood(uid) {
    admin.firestore().collection("foods").where("owner", "==", uid).get().then((snap) => {
        snap.docs.forEach((d) => {
            admin.firestore().collection("foods").doc(d.id).delete();
        });
    });
}

function cleanFile(uid) {
    return bucket.deleteFiles({
        prefix: `${uid}/`,
    }, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log(`All the Firebase Storage files in users/${uid}/ have been deleted`);
        }
    });
    blobs = bucket.list_blobs((prefix = `${uid}/`));
    blobs.forEach((blob) => {
        blob.delete();
    });
}
// FileGenerator('generateMenu','https://foodline.ph/assets/img/items/1593937522Q5StQydRHj.jpg','1593937522Q5StQydRHj.jpg','/home/akocberting/Desktop/Jiffy Favors/Source Code/crawler/images/1593937522Q5StQydRHj.jpg','bt5qaYmR8C9bcZKR2riD').then((img)=>{
// 	console.log(img)
// })