<template>
 <location-selector/>
</template>
<script>
import LocationSelector from '~/components/LocationSelector.vue'
export default {
  components: {
    LocationSelector
  },
  layout: 'menu',
   mounted(){
    	this.$fireAnalytics.logEvent('page_view')
    }
};
</script>
