<template>
  <v-container fluid>
    <v-card fill-height min-height="500">
      <v-layout wrap>
        <v-flex xs12 sm12>
          <ForApproval></ForApproval>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import ForApproval from './ForApproval'
import Balances from './Balances'
export default {
  name: 'Dashboard',
  components: {
    ForApproval,
    Balances
  }
};
</script>
