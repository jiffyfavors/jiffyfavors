const axios = require("axios");
const fs = require("fs");
getRestaurant()
async function getRestaurant() {
    let response = await axios.post("https://foodline.ph/public/api/get-delivery-restaurants", {
        latitude: "9.7429782",
        longitude: "118.7384205",
    });
    for (const [key, value] of Object.entries(response.data)) {
        let link = "https://foodline.ph/public/api/get-restaurant-info/" + value.slug;
        let res = await axios.post(link)
        let payload = res.data
        fs.readFile("foodline.json", function(err, data) {
            var slugs = JSON.parse(data);
            slugs.push(payload);
            fs.writeFile("foodline.json", JSON.stringify(slugs), async function(err, result) {
                if (err) console.log("error", err);
                console.log(payload.name,'encoded')
                await sleep(1000);
            });
        });
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}