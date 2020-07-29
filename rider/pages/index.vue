<template>
    <v-layout text-left align-center fill-height justify-center>
        <v-card>
            <v-alert type="error" v-if="status.profile==='SUSPENDED'"> Your Account is Suspended </v-alert>
            <v-card-title primary-title> Hi {{profile.firstname}} ,</v-card-title>
            <v-card-text> Your balances
                <v-layout text-center align-center fill-height justify-center>
                    <v-flex xs4 sm4 md4>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>{{balance|toPHP}}</v-list-item-title>
                                    <v-list-item-subtitle>Current</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>{{ongoing_balance|toPHP}}</v-list-item-title>
                                    <v-list-item-subtitle>On Hold</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>{{balance-ongoing_balance|toPHP}}</v-list-item-title>
                                    <v-list-item-subtitle>Available</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-flex>
                </v-layout>
                <v-list dense v-if="status.profile!='SUSPENDED'">
                    <v-list-item-group>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Top Up Balance</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon>
                                    <v-icon color="pink"> mdi-chevron-right </v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list-item-group>
                    <v-list-item-group>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Balance Transfer</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                    <v-list-item-group>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Withdrawal Request</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                    <v-list-item-group>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Transaction Logs</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-card-text>
        </v-card>
    </v-layout>
</template>
<script>
export default {
    computed: {
        status() {
            return this.$store.getters['auth/getStatus']
        },
        user() {
            return this.$store.getters['auth/getUser']
        },
        profile() {
            return this.$store.getters['auth/getProfile']
        },
        ongoing_balance() {
            return this.$store.getters['rider/getAccBalance']
        },
        balance() {
            return this.$store.getters['auth/getBalance']
        }
    },
    beforeMount() {
        if (this.user) this.$store.dispatch('auth/getProfile')
    }
};
</script>
