<template>
 <home/>
</template>
<script>
import Home from '~/components/Home.vue'
export default {
  components: {
    Home
  },
  layout: 'menu',
     mounted(){
    	this.$fireAnalytics.logEvent('page_view')
    }
};
</script>
