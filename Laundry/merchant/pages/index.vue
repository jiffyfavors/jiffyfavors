<template>
    <v-layout>
<token-status></token-status>
    </v-layout>
</template>
<script>
import TokenStatus from '~/components/TokenStatus.vue'
export default {
    layout: 'default',
    components:{
        TokenStatus
    },
    mounted(){
        this.$store.dispatch('auth/getAccessInfo')
    },

};
</script>
