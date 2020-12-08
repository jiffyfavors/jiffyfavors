<template>
<account/>
</template>
<script>
import Account from '~/components/Account.vue'
export default {
  components: {
    Account
  },
  layout: 'menu',
     mounted(){
    	this.$fireAnalytics.logEvent('page_view')
    }
}
</script>
