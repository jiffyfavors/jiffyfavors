<template>
    <v-app id="e3">
        <v-app-bar color="blue" class="white--text text-center" dense app>
            <v-app-bar-nav-icon color="white" @click.stop="drawer=!drawer"></v-app-bar-nav-icon>
            <v-toolbar-title v-if="$route.fullPath!='/'">{{$route.fullPath.replace('/','').toUpperCase()}}</v-toolbar-title>
            <v-toolbar-title v-else>Home</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon color="green" v-if="areas.length>0" @click.stop="storeSelect=true">
                <v-icon>mdi-map-marker</v-icon>
            </v-btn>
            <v-btn icon color="red" @click.stop="logOut()">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" clipped floating temporary app color="blue" app dark>
            <v-list dense nav class="py-0">
                <v-list-item two-line>
                    <v-list-item-avatar rounded size="35" class="mr-2"> <img src="/icon.png"> </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>Area Manager</v-list-item-title>
                        <v-list-item-subtitle>Area: {{defaultArea.data.name}}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item to="/">
                    <v-list-item-icon>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <!-- <v-list-item to="/sales">
                    <v-list-item-icon>
                        <v-icon>mdi-cash</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Sales Report</v-list-item-title>
                    </v-list-item-content>
                </v-list-item> -->
                <v-list-item to="/orders">
                    <v-list-item-icon>
                        <v-icon>mdi-history</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Orders</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item to="/stores">
                    <v-list-item-icon>
                        <v-icon>mdi-store</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Stores</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item to="/riders">
                    <v-list-item-icon>
                        <v-icon>mdi-motorbike</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Riders</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <!--   <v-list-item to="/voucher">
                    <v-list-item-icon>
                        <v-icon>mdi-ticket-percent</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Promo Codes</v-list-item-title>
                    </v-list-item-content>
                </v-list-item> --></v-list>
        </v-navigation-drawer>
        <v-content>
            <nuxt></nuxt>
        </v-content>
        <v-row justify="center">
            <v-bottom-sheet v-model="storeSelect" inset scrollable max-width="400">
                <v-card>
                    <v-card-title>Select Area</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 300px;">
                        <v-list dense>
                            <v-list-item v-for="item in areas" :key="item.id" @click.stop="setDefaultArea(item)">
                              
                                <v-list-item-content>
                                    <v-list-item-title> <v-icon v-if="item.id === defaultArea.id" small color="green">mdi-check</v-icon> {{ item.data.name }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-bottom-sheet>
        </v-row>
    </v-app>
</template>
<script>
export default {
    middleware: 'auth',
    components: {},
    data() {
        return {
            storeSelect: false,
            date: new Date().toISOString().substr(0, 10),
            modal: false,
            drawer: false,
            isLoading: false,
        }
    },
    computed: {
        defaultArea() {
            return this.$store.getters['auth/getDefaultArea']
        },
        areas() {
            let area = this.$store.getters['auth/getAreas'].slice()
            return area.sort((a, b) => (a.data.name > b.data.name ? 1 : b.data.name > a.data.name ? -1 : 0))
        },
        user() {
            return this.$store.getters['auth/getUser']
        }
    },
    watch: {
        user() {
            if (!this.user) {
                this.$router.push('/login')
            }
        }
    },
    methods: {
        logOut() {
            localStorage.removeItem('vuex')
            this.$fireAuth.signOut()
        },
        setDefaultArea(item) {
            console.log(item)
            this.$store.commit('auth/setDefaultArea', item)
            this.storeSelect = false
        },
        getBooking() {
            this.$store.dispatch('auth/getMyTransaction', {
                start: this.$generateTimestamp(this.date),
                end: this.$generateTimestamp(this.date, '11:59 PM')
            })
        }
    }
};
</script>
