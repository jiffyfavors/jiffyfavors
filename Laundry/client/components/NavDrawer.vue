<template>
    <v-navigation-drawer v-model="localDrawer" clipped floating temporary app dark app color="#00aff0">
        <v-list dense nav class="py-0">
            <v-list-item two-line>
                <v-list-item-avatar rounded size="50" class="mr-2"> <img src="/icon.png"> </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title><strong>Jiffy Favors</strong></v-list-item-title>
                    <v-list-item-subtitle>Your request, our ride!</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item to="/account">
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
                    <v-list-item-title>Transactions</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
   
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
    props: {
        value: {
            type: Boolean
        }
    },
    watch: {
        value() {
            this.localDrawer = true
        }
    },
    localDrawer: function() {
        this.$emit('input', this.localDrawer)
    },
    data() {
        return {
            localDrawer: this.value,
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
    }
};
</script>
