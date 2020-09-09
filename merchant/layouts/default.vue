<template>
    <v-app id="e3">
        <v-app-bar color="blue" class="white--text text-center" dense app>
            <v-app-bar-nav-icon color="white" @click.stop="drawer=!drawer"></v-app-bar-nav-icon>
            <v-toolbar-title v-if="$route.fullPath!='/'">{{$route.fullPath.replace('/','').toUpperCase()}}</v-toolbar-title>
            <v-toolbar-title v-else>Home</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon color="green" @click.stop="storeSelect=true">
                <v-icon>mdi-store</v-icon>
            </v-btn>
            <v-btn icon color="red" @click.stop="$fireAuth.signOut()">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" clipped floating temporary app color="blue" app dark>
            <v-list dense nav class="py-0">
                <v-list-item two-line>
                    <v-list-item-avatar rounded size="35" class="mr-2"> <img src="/icon.png"> </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>Jiffy Favors</v-list-item-title>
                        <v-list-item-subtitle>Merchant System</v-list-item-subtitle>
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

                <v-list-item to="/voucher">
                    <v-list-item-icon>
                        <v-icon>mdi-ticket-percent</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Promo Codes</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

            </v-list>
        </v-navigation-drawer>
        <v-content>
            <nuxt></nuxt>
            <permission></permission>
        </v-content>
        <v-row justify="center">
            <v-bottom-sheet v-model="storeSelect" inset scrollable max-width="400">
                <v-card>
                    <v-card-title>Select Business</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 300px;">
                        <v-list dense>
                            <v-list-item v-for="item in businesses" :key="item.id" @click.stop="setDefaultBusiness(item)">
                                <v-list-item-title> {{ item.data.business_name }}</v-list-item-title>
                                <v-divider></v-divider>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-bottom-sheet>
        </v-row>
    </v-app>
</template>
<script>
import Permission from  '~/components/Permission'
export default {
    middleware: 'auth',
    components:{
        Permission
    },
    mounted(){
       // this.$fireAuth.signOut()
    },
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
        businesses() {
            return this.$store.getters['auth/getBusinesses']
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
        setDefaultBusiness(item) {
            this.$store.commit('auth/setDefaultBusiness', item)
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
