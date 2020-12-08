<template>
  <div class="text-center">
    <v-bottom-sheet v-model="sheet">
      <v-list light>
        <v-subheader>Delivery Location</v-subheader>
        <v-list-item
          v-for="tile in tiles"
          :key="tile.title"
          @click="sheet = false"
        >
          <v-list-item-avatar>
            <v-avatar size="32px" tile>
              <img
                :src="`https://cdn.vuetifyjs.com/images/bottom-sheets/${tile.img}`"
                :alt="tile.title"
              >
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-title>{{ tile.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-bottom-sheet>
  </div>
</template>

<script>
  export default {
    props:{
      sheet:{
        type: Boolean,
        default:false
      }
    },
    data: () => ({
      tiles: [
        { img: 'keep.png', title: 'Current Location' },
        { img: 'inbox.png', title: 'Select Location' },
      ],
    }),
  }
</script>