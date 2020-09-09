<template>
    <v-card class="ma-2">
        <v-card-title primary-title>Onboarding Checklist</v-card-title>
        <v-subheader> Only complete details will be process.</v-subheader>
        <v-card-text>
            <v-list dense>
                <v-list-item @click.stop="upload_data = {text:'Driver\'s License', code:'DL'}, uploadDiag = true">
                    <v-list-item-icon>
                        <v-icon :color="docs.findIndex(x=>x.code==='DL') >-1 ? 'green' :'red'">{{docs.findIndex(x=>x.code==='DL') >-1 ? 'mdi-check' :'mdi-close'}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Driver's License</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click.stop="upload_data = {text:'NBI Clearance', code:'NBI'}, uploadDiag = true">
                    <v-list-item-icon>
                        <v-icon :color="docs.findIndex(x=>x.code==='NBI') >-1 ? 'green' :'red'">{{docs.findIndex(x=>x.code==='NBI') >-1 ? 'mdi-check' :'mdi-close'}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>NBI Clearance</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click.stop="upload_data = {text:'BIR TIN Number', code:'BIR'}, uploadDiag = true">
                    <v-list-item-icon>
                        <v-icon :color="docs.findIndex(x=>x.code==='BIR') >-1 ? 'green' :'red'">{{docs.findIndex(x=>x.code==='BIR') >-1 ? 'mdi-check' :'mdi-close'}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Tax Identification Number(TIN)</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon color="red">mdi-close</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Atleast 1 Vehicle Data</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click.stop="topUpDiag = true">
                    <v-list-item-icon>
                        <v-icon :color="available_balance>=500 ? 'green': 'red'">{{available_balance>=500 ? 'mdi-check': 'mdi-close' }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Add Wallet Balance - P500</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                  <v-list-item>
                    <v-list-item-icon>
                        <v-icon :color="available_balance>=500 ? 'green': 'red'">{{available_balance>=500 ? 'mdi-check': 'mdi-close' }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Verified GCASH Account</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card-text>
        <v-row justify="center">
            <v-dialog v-model="uploadDiag">
                <v-card width="400">
                    <v-card-title>{{upload_data.text}}</v-card-title>
                    <v-card-text>
                        <vuedropzone v-if="dropShow" id="customdropzone" ref="imgDropZone" :options="dropzoneOptions" @vdropzone-complete="afterComplete"></vuedropzone>
                        <v-img tile width="100%" height="200" @click.stop="dropShow = true" color="grey" v-if="!dropShow" :src="img"> </v-img>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click.stop="uploadDiag = false">Close</v-btn>
                        <v-btn text :disabled="dropShow" @click.stop="startUpload()">Upload</v-btn>
                    </v-card-actions>
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
            <v-bottom-sheet v-model="topUpDiag">
                <v-card width="400">
                    <v-card-title>Top Up Wallet</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-select :items="[500, 750, 1000]" v-model="amount" label="Amount"></v-select>
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
        </v-row>
    </v-card>
</template>
<script>
export default {
    data() {
            return {
                topUpDiag: false,
                amount: 500,
                topUpDiagStatus: false,
                uploadDiag: false,
                imagediag: false,
                img: null,
                dropShow: true,
                upload_data: {
                    text: ''
                },
                currentUploadData: null,
                docs: [],
            }
        },
        computed: {
            available_balance() {
                return this.balance - this.ongoing_balance
            },
            ongoing_balance() {
                return this.$store.getters['rider/getAccBalance']
            },
            balance() {
                return this.$store.getters['auth/getBalance']
            },
            user() {
                return this.$store.getters['auth/getUser']
            },
            dropzoneOptions() {
                return {
                    url: '/',
                    thumbnailWidth: 50,
                    thumbnailHeight: 50,
                    addRemoveLinks: false,
                    acceptedFiles: '.jpg, .jpeg, .png',
                    dictDefaultMessage: `<p class='text-default'>Click to Select <strong>${this.upload_data.text}</strong></p>
          <p class="form-text">Allowed Files: .jpg, .jpeg, .png</p>
          `
                }
            }
        },
        watch: {
            docs(val) {
                console.log(val.findIndex(x => x.code === 'DL'))
            },
            uploadDiag(val) {
                if (val) {
                    let index = this.docs.findIndex(x => x.code === this.upload_data.code)
                    if (index > -1) {
                        this.dropShow = false
                        this.img = this.docs[index].url
                    } else
                    {
                        this.dropShow = true
                        this.img = null
                    }
                }
            }
        },
        mounted() {
            let ref = this.$fireStoreObj().collection('riders').doc(this.user.id).collection('rider_docs')
            this.$bind('docs', ref)
        },
        methods: {
            afterComplete(upload) {
                this.img = upload.dataURL
                this.currentUploadData = {
                    data: upload,
                    metadata: this.upload_data
                }
                this.dropShow = false
            },
            startUpload() {
                const file = this.currentUploadData.data
                let store_ref = '/rider_info/' + file.upload.uuid + '-' + file.name
                const ref = this.$fireStorage.ref(store_ref)
                ref.put(file).then((snap) => {
                    snap.ref.getDownloadURL().then((url) => {
                        this.$fireStoreObj().collection('riders').doc(this.user.id).collection('rider_docs').add({
                            code: this.currentUploadData.metadata.code,
                            store_ref: store_ref,
                            url: url
                        })
                    })
                })
                this.uploadDiag = false
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
        },
        beforeMount() {
            if (this.user) this.$store.dispatch('auth/getProfile')
        }
};
</script>
