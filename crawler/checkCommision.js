const axios = require("axios");
getRestaurant()
async function getRestaurant() {
    response = await axios.post("https://foodline.ph/public/api/get-delivery-restaurants", {
        latitude: "9.7429782",
        longitude: "118.7384205",
    });
    let counter =0;
    for (const [key, value] of Object.entries(response.data)) {
    	 let resto = await getRestoInfo(value.slug);
    	 counter++;
    	 console.log(counter, resto.name, resto.rate)
    }
}

async function getRestoInfo(slug) {
    let link = "https://foodline.ph/public/api/get-restaurant-info/" + slug;
        let resto = await axios.post(link);
       return {
       	name: resto.data.name,
       	rate: parseFloat(resto.data.commission_rate) + '%'
       }
}