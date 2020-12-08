<template>
  <v-app id="e3">
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar light :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer , sheet=false" />
      
      Deliver to:<small><span color="red">Current location</span></small>
      <v-btn icon @click.stop="sheet = !sheet">
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
      
     
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-basket-fill</v-icon>
      </v-btn>
      <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <select-location :sheet="sheet"/>
  </v-app>
</template>

<script>
import SelectLocation from '~/components/SelectLocation.vue'
export default {
  data() {
    return {
      sheet:false,
      clipped: false,
      drawer: false,
      fixed: false,
      watch_id:null,
      items: [{
        icon: 'mdi-apps',
        title: 'Welcome',
        to: '/'
      }, {
        icon: 'mdi-chart-bubble',
        title: 'Inspire',
        to: '/inspire'
      },
      {
        icon: 'mdi-chart-bubble',
        title: 'My orders',
        to: '/inspire'
      },
      {
        icon: 'mdi-chart-bubble',
        title: 'Invite friends',
        to: '/inspire'
      }],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Fudtrips'
    }
  },
  components:{
    SelectLocation
  }
}
</script>
