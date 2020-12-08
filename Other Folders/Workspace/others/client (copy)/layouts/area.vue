<template>
  
        <nuxt/> </nuxt>
 
</template>
<script>
import GoogleMapsApiLoader from 'google-maps-api-loader'
export default {
    mounted() {
        let GMapSettings = {
            apiKey: this.$GMaps.apiKey,
            language: this.language
        }
        const google = GoogleMapsApiLoader(GMapSettings)
        this.$GMaps.google = google;
    }
};
</script>
