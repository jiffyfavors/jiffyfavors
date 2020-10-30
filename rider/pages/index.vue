<template>
    <v-layout wrap text-left align-center fill-height justify-center>
        <v-card>
            <v-alert type="error" v-if="status.profile === 'SUSPENDED'"> Your Account is Suspended </v-alert>
            <v-card-title primary-title> Hi {{ profile.firstname }} ,</v-card-title>
            <v-card-text> Your Wallet Balances
                <v-layout text-center align-center fill-height justify-center>
                    <v-flex xs4 sm4 md4>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>{{ balance | toPHP }}</v-list-item-title>
                                    <v-list-item-subtitle>Current</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>{{ ongoing_balance | toPHP }}</v-list-item-title>
                                    <v-list-item-subtitle>On Hold</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>{{ (balance - ongoing_balance) | toPHP }}</v-list-item-title>
                                    <v-list-item-subtitle>Available</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider> Your Earnings
                <v-layout text-center align-center fill-height justify-center>
                    <v-flex xs4 sm4 md4>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>{{ 0 | toPHP }}</v-list-item-title>
                                    <v-list-item-subtitle>Today</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>{{ 0 | toPHP }}</v-list-item-title>
                                    <v-list-item-subtitle>This week</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>{{ 0 | toPHP }}</v-list-item-title>
                                    <v-list-item-subtitle>This month</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-flex>
                </v-layout>
                <v-layout text-start v-if="status.profile==='ACTIVE'" wrap align-start fill-height text-start justify-start>
                    <v-card v-for="req in topUps.filter((x) => x.status === 'PENDING')" :key="req.id">
                        <span class="bestseller">{{ req.status }}</span>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <h3>
                      <strong>{{ req.amount | toPHP }}</strong>
                    </h3></v-list-item-title>
                                    <v-list-item-subtitle>Top Up Request requested amount</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card>
                    <v-flex xs6>
                        <v-btn :disabled="topUps.filter((x) => x.status === 'PENDING').length>0" text outlined block @click.top="topUpDiag = true">Top Up Balance</v-btn>
                    </v-flex>
                    <v-flex xs6>
                        <v-btn text outlined block>Widrawal Request</v-btn>
                    </v-flex>
                    <v-flex xs6>
                        <v-btn @click.stop="balanceTransfer = true" text outlined block>Balance Transfer</v-btn>
                    </v-flex>
                    <v-flex xs6>
                        <v-btn text outlined block @click.stop="translogs = true">Transaction Logs</v-btn>
                    </v-flex>
                    <v-flex xs12>
                        <v-card class="mt-2">
                            <v-divider></v-divider>
                            <v-card-title primary-title>Ways para kumita</v-card-title>
                            <v-card-text>
                                <ul>
                                    <li>Kumita ng P35-P70 bawat isang successful food delivery.</li>
                                    <li>Kumita ng P30-P90 bawat maihahatid na parahero na nagbook ng BackRide o Angkas.</li>
                                    <li>Kumita ng P50-P120 bawat maihahatid na pasahero ng nagbooking ng Tricycle Hire, P70-P150 naman para sa nagbook ng Car Hire</li>
                                    <li>Karagdagang Incentives at Bonus kapag nakaHit ka ng Target.</li>
                                </ul>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
        <v-flex xs12 sm6 v-if="status.profile==='PRE-REG'">
            <onboarding-checklist></onboarding-checklist>
        </v-flex>
        <v-flex xs12 sm6 v-else>
            <v-row justify="center">
                <v-bottom-sheet v-model="topUpDiag">
                    <v-card width="400">
                        <v-card-title>Top Up Wallet</v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <v-select :items="[300, 500, 750, 1000]" v-model="amount" label="Amount"></v-select>
                                </v-flex>
                                <div>
                                    <p> We will send Money Request to your registered Mobile Number. Top up is available from
                                        <strong>8:00AM-5:00PM Monday to Saturday Only.</strong>
                                    </p>
                                    <p>
                                        <strong>Go To GCASH App > Show More > Request Money > Requests Received</strong>
                                    </p>
                                </div>
                            </v-layout>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click.stop="TopUpRequest()" text color="blue">Send Request</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-bottom-sheet>
                <v-bottom-sheet v-model="balanceTransfer">
                    <v-card>
                        <v-card-title>Balance Transfer</v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                            <v-layout wrap>
                                <v-flex xs8>
                                    <v-select v-model="trans_type" :items="['Widthraw to GCASH', 'Send to Rider']" label="Transfer Type"></v-select>
                                </v-flex>
                                <v-flex xs4>
                                    <v-text-field prefix="PHP" v-model.Number="trans_amt" type="number" :max="available_balance" label="Amount" placeholder="Amount"></v-text-field>
                                </v-flex>
                                <v-flex xs12 v-if="trans_type === 'Send to Rider'">
                                    <v-text-field dense v-model="phoneNumber" type="number" prefix="+63" placeholder="Rider Registered Phone Number" :rules="phonRules" outlined></v-text-field>
                                </v-flex>
                                <div>
                                    <p>
                                        <strong>The transaction will be recorded in your Withdrawal Request</strong>
                                    </p>
                                    <p v-if="trans_type === 'Widthraw to GCASH'"> For
                                        <strong>Widthraw to GCASH</strong>, you will received the amount to your GCASH Account within
                                        <strong>30 minutes</strong>
                                    </p>
                                    <p v-else> For
                                        <strong>Send to Rider</strong>, receiver will received the wallet balance
                                        <strong>immediately</strong>
                                    </p>
                                </div>
                            </v-layout>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click.stop="sendRequest()" text color="blue">Submit</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-bottom-sheet>
                <v-dialog v-model="translogs" fullscreen>
                    <v-card>
                        <v-card-title>
                            <v-icon @click.stop="translogs = false">mdi-close</v-icon> Transaction Logs</v-card-title>
                        <v-card-text>
                            <v-list dense>
                                <v-list-item v-for="req in topUps" :key="req.id">
                                    <span class="bestseller">{{ req.status }}</span>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ req.amount | toPHP }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ req.desc }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="topUpDiagStatus">
                    <v-card>
                        <v-card-title>Top Up Request</v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                            <div>
                                <p> Check the Status in your
                                    <strong>Transaction Logs</strong>
                                </p>
                                <p> We will send Money Request to your registered Mobile Number. Top up is available from
                                    <strong>8:00AM-5:00PM Monday to Saturday Only.</strong>
                                </p>
                                <p> Once Payment is confirmed. We will add balance to your wallet immediately. </p>
                            </div>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click.stop="topUpDiag = false" text color="blue">Send Request</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </v-flex>
    </v-layout>
</template>
<script>
import {
    GeoCollectionReference
} from 'geofirestore'
import OnboardingChecklist from '~/components/OnboardingChecklist'
export default {
    components: {
        OnboardingChecklist
    },
    data() {
        return {
            toPHP: 0,
            amount: 500,
            topUpDiag: false,
            balanceTransfer: false,
            topUpDiagStatus: false,
            topUps: [],
            translogs: false,
            phoneNumber: '',
            trans_type: 'Widthraw to GCASH',
            trans_amt: 0,
            phonRules: [
                (v) => !!v || 'Phone number is required', (v) => (v && v.length == 10) || 'Name must be 10 characters'
            ]
        }
    },
    computed: {
        available_balance() {
            return this.balance - this.ongoing_balance
        },
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
    mounted() {
        if (this.status.profile !== 'PRE-REG') this.getPendingTopUPRequest()
    },
    methods: {
        sendRequest() {
            let payload = {
                type: this.trans_type,
                amount: this.trans_amt,
                receiver: this.trans_type === 'Send to Rider' ? this.phoneNumber : this.user.phoneNumber,
                status: 'PENDING',
                request: new Date().getTime()
            }
            let profile = this.$fireStoreObj().collection('TransferRequest')
            profile.add(payload).then(() => {
                this.balanceTransfer = false
            })
        },
        getPendingTopUPRequest() {
            let request = this.$fireStoreObj().collection('TopUpRequest').where('rider', '==', this.user.id).orderBy('request', 'desc').limit(20)
            this.$bind('topUps', request)
        },
        TopUpRequest() {
            let profile = this.$fireStoreObj().collection('TopUpRequest')
            profile.add({
                rider: this.user.id,
                amount: this.amount,
                desc: 'Top Up Request',
                number: this.user.phoneNumber,
                status: 'PENDING',
                request: new Date().getTime()
            }).then(() => {
                this.topUpDiagStatus = true
                this.topUpDiag = false
            })
        }
    }
};
</script>
