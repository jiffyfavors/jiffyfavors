<template>
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
            <!--    <v-list-item @click="">
                        <v-list-item-icon>
                            <v-icon> mdi-cards-heart</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Favorites</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item> -->
            <v-list-item to="/transactions">
                <v-list-item-icon>
                    <v-icon>mdi-history</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Transactions</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <!--        <v-list-group v-for="item in items" :key="item.title" v-model="item.active" :prepend-icon="item.action" no-action>
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
                    </v-list-group> -->
            <v-list-item href="https://m.me/jiffyfavors" target="_blank">
                <v-list-item-icon>
                    <v-icon>mdi-facebook-messenger</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Chat with Us</v-list-item-title>
                    <v-list-item-subtitle>Questions? Let us help!</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            </v-list-group>
            <v-bottom-sheet inset>
                <template v-slot:activator="{ on, attrs }">
                    <v-list-item v-on="on">
                        <v-list-item-icon>
                            <v-icon>mdi-share-variant</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Share us</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
                <v-list nav flat single-line dense>
                    <v-subheader>Share us</v-subheader>
                    <ShareNetwork v-for="network in networks" :key="network.network" :network="network.network" :style="{ backgroundColor: network.color }" :url="sharing.url" :title="sharing.title" :description="sharing.description" :hashtags="sharing.hashtags">
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon small :color="network.color"> {{ network.icon }} </v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>{{ network.name }}</v-list-item-title>
                        </v-list-item>
                    </ShareNetwork>
                </v-list>
            </v-bottom-sheet>
        </v-list>
    </v-navigation-drawer>
</template>
<script>
export default {
	props:{
		areas: Array,
		title: String
	},
        data() {
            return {
                sharing: {
                    url: 'https://m.jiffyfavors.com/',
                    title: 'Jiffy Favors',
                    description: 'Jiffy Favors- Food Delivery, Virtual Shopping & Bills Payment',
                    hashtags: 'jiffyfavors,bills,paybills,onlineorder'
                },
                networks: [{
                    network: 'facebook',
                    name: 'Facebook',
                    icon: 'mdi-facebook',
                    color: '#1877f2'
                }, {
                    network: 'email',
                    name: 'Email',
                    icon: 'mdi-gmail',
                    color: 'red'
                }, {
                    network: 'skype',
                    name: 'Skype',
                    icon: 'mdi-skype-business',
                    color: '#00aff0'
                }, {
                    network: 'sms',
                    name: 'SMS',
                    icon: 'mdi-android-messages',
                    color: '#333333'
                }, {
                    network: 'telegram',
                    name: 'Telegram',
                    icon: 'mdi-telegram',
                    color: '#0088cc'
                }, {
                    network: 'twitter',
                    name: 'Twitter',
                    icon: 'mdi-twitter',
                    color: '#1da1f2'
                }, {
                    network: 'whatsapp',
                    name: 'Whatsapp',
                    icon: 'mdi-whatsapp',
                    color: '#25d366'
                }],
                drawer: false,
                isLoading: false,
                items: [
                {
                    action: 'mdi-comment-alert-outline',
                    title: 'Reviews',
                    active: false,
                    items: [
                    {
                        title: 'Review Us',
                        icon: 'mdi-comment-check',
                        link: '',
                    },
                    {
                        title: 'Review Rider',
                        icon: 'mdi-motorbike',
                        link: '',
                    },
                    {
                        title: 'Review Merchant',
                        icon: 'mdi-store',
                        link: '',
                    }],
                }]
            }
        },
    
};
</script>
