<template>
  <v-layout>
  	<client-only>
  <location-selector></location-selector>
</client-only>
  </v-layout>
</template>

<script>
import LocationSelector from '~/components/LocationSelector.vue'
export default {
	layout:'area',
  components:{
    LocationSelector
  }
}
</script>
