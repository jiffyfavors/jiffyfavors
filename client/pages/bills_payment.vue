<template>
 <bills-payment/>
</template>
<script>
import BillsPayment from '~/components/BillsPayment.vue'
export default {
  components: {
    BillsPayment
  },
  layout: 'menu',
     mounted(){
    	this.$fireAnalytics.logEvent('page_view')
    }
}
</script>
