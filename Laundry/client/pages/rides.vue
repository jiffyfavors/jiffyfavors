<template>
 <rides></rides>
</template>
<script>
import Rides from '~/components/Rides.vue'
export default {
  components: {
    Rides
  },
  layout: 'menu',
     mounted(){
    	this.$fireAnalytics.logEvent('page_view')
    }
};
</script>
