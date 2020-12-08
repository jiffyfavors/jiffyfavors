<template>
  <v-layout wrap fill-height pa-1>
    <v-flex xs12 sm6 md6 class="pa-1">
      <Pendings/>
    </v-flex>
    <v-flex xs12 sm6 md6 class="pa-1">
      <Banking/>
    </v-flex>
  </v-layout>
</template>

<script>
import Pendings from '../components/Pendings'
import Banking from '../components/Banking'
export default {
  name: 'Dashboard',
  components: {
    Pendings,
    Banking
  }
}
</script>
