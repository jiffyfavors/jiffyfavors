<template>
  <v-app id="e3">
    <nuxt />
    <permission/>
  </v-app>
</template>
<script>
import Permission from '~/components/Permission.vue'
export default{
    components:{
        Permission
    }
};
</script>
