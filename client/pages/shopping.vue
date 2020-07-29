<template>
 <shop/>
</template>
<script>
import Shop from '~/components/Shop.vue'
export default {
  components: {
    Shop
  },
  layout: 'menu',
     mounted(){
    	this.$fireAnalytics.logEvent('page_view')
    }
}
</script>
