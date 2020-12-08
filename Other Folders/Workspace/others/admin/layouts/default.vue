<template>
    <v-app id="e3">
        <v-app-bar color="blue" class="white--text text-center" dense app fixed>
            <v-app-bar-nav-icon color="white" @click.stop="drawer=!drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>{{$route.fullPath.replace('/','').toUpperCase()}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-on="on" v-bind="attrs">
                        <v-icon>mdi-calendar</v-icon>
                    </v-btn>
                </template>
                <v-date-picker v-model="date" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(date), getBooking()">OK</v-btn>
                </v-date-picker>
            </v-dialog>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" clipped temporary app color="blue" absolute app dark>
            <v-list dense nav class="py-0">
                <v-list-item two-line>
                    <v-list-item-avatar rounded size="35" class="mr-2"> <img src="/icon.png"> </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>Jiffy Favors</v-list-item-title>
                        <v-list-item-subtitle>Your request, our ride!</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item @click="">
                    <v-list-item-icon>
                        <v-icon>mdi-card-account-details</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Account</v-list-item-title>
                        <v-list-item-subtitle>Your account profile</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item to="/transactions">
                    <v-list-item-icon>
                        <v-icon>mdi-history</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Bookings</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="">
                    <v-list-item-icon>
                        <v-icon> mdi-motorbike</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Riders</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item to="/areas">
                    <v-list-item-icon>
                        <v-icon>mdi-map-marker</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Areas</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-group v-for="item in items" :key="item.title" v-model="item.active" :prepend-icon="item.action" no-action>
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.title"></v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item v-for="subItem in item.items" :to="subItem.link" :key="subItem.title" @click="">
                        <v-list-item-icon>
                            <v-icon>{{subItem.icon}}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="subItem.title"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>
        <v-content>
            <nuxt /> </v-content>
    </v-app>
</template>
<script>
export default {
    data() {
            return {
                date: new Date().toISOString().substr(0, 10),
                modal: false,
                drawer: false,
                isLoading: false,
                items: [{
                    action: 'mdi-store',
                    title: 'Partners',
                    active: false,
                    items: [
                    {
                        title: 'Restaurant',
                        icon: 'mdi-food',
                        link: '/merchants',
                    },
                    {
                        title: 'Billers',
                        icon: 'mdi-account-cash-outline',
                        link: '/billers',
                    },
                    {
                        title: 'Shops',
                        icon: 'mdi-shopping',
                        link: '/shops',
                    }],
                }]
            }
        },
        methods:{
            getBooking(){
                var start = this.$generateTimestamp(this.date)
                var end = this.$generateTimestamp(this.date, '11:59 PM')
                this.$store.dispatch('auth/getMyTransaction',{start: start, end: end})
            }
        }
};
</script>
