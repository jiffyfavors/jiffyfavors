<template>
    <v-layout wrap>
        <v-flex xs12>
            <v-card class="mt-2">
                <v-card-title primary-title>Onboarding Checklist</v-card-title>
                <v-card-text>
                    <v-alert dense type="success"> Kumpletohin ang mga may mark na
                        <v-icon color="red" small>mdi-close</v-icon> upang makapagsimula tumanggap ng booking. </v-alert>
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
                        <v-list-item @click.stop="vehiDiag = true">
                            <v-list-item-icon>
                                <v-icon :color="vehicles.length>0 ? 'green' :'red'">{{vehicles.length>0 ? 'mdi-check' : 'mdi-close'}}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Impormasyon ng Sasakyan</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item @click.stop="veriDiag = true">
                            <v-list-item-icon>
                                <v-icon :color="available_balance>=500 ? 'green': 'red'">{{available_balance>=500 ? 'mdi-check': 'mdi-close' }}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Verified GCASH Account</v-list-item-title>
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
                    </v-list>
                    <v-btn block color="info" @click.stop="faqDiag = true">Mga Katanungan</v-btn>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12>
            <v-card class="mt-2">
                <v-card-title primary-title>Uri ng mga pagkakakitaan</v-card-title>
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
        <v-row justify="center">
            <v-dialog v-model="vehiDiag">
                <v-card width="400">
                    <v-card-title>Vehicle Information</v-card-title>
                    <v-card-text>
                        <v-layout wrap>
                            <v-flex xs6>
                                <v-select v-model="vehicle_data.type" :items="['Motorbike','Scotter','Tricycle','Small Car']" label="Type" placeholder="Vehicle Type"></v-select>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field v-model="vehicle_data.plate" label="Plate No." placeholder="Plate No."></v-text-field>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field v-model="vehicle_data.brand" label="Brand" placeholder="Brand"></v-text-field>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field v-model="vehicle_data.model" label="Model" placeholder="Model"></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-list dense>
                                    <v-list-item @click.stop="upload_data = {text:'Front Image', code:'FI'}, vehiImageDiag = true">
                                        <v-list-item-avatar tile size="25">
                                            <v-img tile width="100%" v-if="vehicle_info['FI']" color="grey" :src="vehicle_info['FI'].img"> </v-img>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>{{vehicle_info['FI'] ? 'Image Uploaded': 'No Image Selected'}}</v-list-item-title>
                                            <v-list-item-subtitle>Front Image</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item @click.stop="upload_data = {text:'Back Image', code:'BI'}, vehiImageDiag = true">
                                        <v-list-item-avatar tile size="25">
                                            <v-img tile width="100%" v-if="vehicle_info['BI']" color="grey" :src="vehicle_info['BI'].img"> </v-img>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>{{vehicle_info['BI'] ? 'Image Uploaded': 'No Image Selected'}}</v-list-item-title>
                                            <v-list-item-subtitle>Back Image with Plate No.</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item @click.stop="upload_data = {text:'Side Image', code:'SI'}, vehiImageDiag = true">
                                        <v-list-item-avatar tile size="25">
                                            <v-img tile width="100%" v-if="vehicle_info['SI']" color="grey" :src="vehicle_info['SI'].img"> </v-img>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>{{vehicle_info['SI'] ? 'Image Uploaded': 'No Image Selected'}}</v-list-item-title>
                                            <v-list-item-subtitle>Side Image</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item @click.stop="upload_data = {text:'OR CR or Franchise', code:'ORCR'}, vehiImageDiag = true">
                                        <v-list-item-avatar tile size="25">
                                            <v-img tile width="100%" v-if="vehicle_info['ORCR']" color="grey" :src="vehicle_info['ORCR'].img"> </v-img>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>{{vehicle_info['ORCR'] ? 'Image Uploaded': 'No Image Selected'}}</v-list-item-title>
                                            <v-list-item-subtitle>OR CR or Franchise</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click.stop="vehiDiag = false">Cancel</v-btn>
                        <v-btn text :disabled="vehicles.length>0" @click.stop="startEncode()">Encode</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="veriDiag">
                <v-card width="400">
                    <v-card-title>Verify Your GCash Account</v-card-title>
                    <v-card-text> Iverify ang iyong GCASH Account sa GCASH App
                        <ol type="number">
                            <li>Idownload at iOpen GCASH App</li>
                            <li>Pindutin ang
                                <strong>Verfiy</strong> under sa Account</li>
                        </ol>
                        <p>Maari ka lamang magTop Up ng iyong Balance kapag ang iyong GCASH Account ay verified na.</p>
                    </v-card-text>
                </v-card>
            </v-dialog>
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
            <v-dialog v-model="vehiImageDiag">
                <v-card width="400">
                    <v-card-title>{{upload_data.text}}</v-card-title>
                    <v-card-text>
                        <vuedropzone v-if="dropShow" id="customdropzone" ref="imgDropZone" :options="dropzoneOptions" @vdropzone-complete="afterCompleteVehi"></vuedropzone>
                        <v-img tile width="100%" height="200" @click.stop="dropShow = true" color="grey" v-if="!dropShow" :src="vehicle_info[upload_data.code].img"> </v-img>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text :disabled="dropShow" @click.stop="vehiImageDiag =false">Done</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog fullscreen v-model="faqDiag">
                <v-card>
                    <v-app-bar app fixed dark color="#00aff0">
                        <v-btn icon @click.stop="faqDiag = false">
                            <v-icon> mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Mga Katanungan</v-toolbar-title>
                    </v-app-bar>
                    <v-content>
                        <v-card-text v-html="riderText"></v-card-text>
                    </v-content>
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
    </v-layout>
</template>
<script>
export default {
    data() {
            return {
                faqDiag: false,
                veriDiag: false,
                topUpDiag: false,
                vehiImageDiag: false,
                vehiDiag: false,
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
                vehicle_data: {
                    plate: '',
                    type: 'Motorbike',
                    brand: '',
                    model: '',
                    images: [],
                },
                vehicles: [],
                vehicle_info: {},
            }
        },
        computed: {
            riderText() {
                return `<p><strong>Ano ang mga requirements para maging isang Jiffy Rider?</strong></p>
<ul>
<li>Driver's License(Pro and Non-Pro). Pro for Tricycle Drivers. </li>
<li>NBI Clearance</li>
<li>18 Gulang o Pataas(Babae o Lalaki)</li>
<li>Litrato ng harap, gilid at likod na kita ang plate number na gagamiting sasakyan.</li>
<li>Para sa Tricycle driver, kopya ng ORCR at Prangkisa</li>
<li>Para sa Small Car owners, kopya lamang ng ORCR o dokumento na pag-aari ang sasakyan at Year Model na hindi bababa sa 2016.</li>
<li>For motorbike rider, Extra helmet para makatanggap ng BackRide(Angkas) Booking</li>
<li>Verified GCASH Account, para maipadala namin ang inyong incentives at bonuses. Pwede ka naming tulungan sa pagrerehistro ng iyong GCASH Account.</li>
<li>Android Smart Phone na may latest version ng Google Chrome, ito ay para makatanggap ka ng booking.</li>
<li>Kopya ng inyong BIR-Tax Identification Number(TIN Card)</li>
<li>Selfie Verification, kumuha ng litrato kasama ang inyong Driver's License.<br /><br /></li>
</ul>
<p><strong>Ano ang benepisyo ng isang rider?</strong></p>
<ul>
<li>Hawak mo ang iyong oras, magtrabaho lamang sa iyong maluwag na oras.</li>
<li>Free Accident Insurance hanggang ang P100,000 Coverage.</li>
<li>Para sa mga tricycle driver, mas malaking kikitain dahil hindi mo na kinakailangang umikot ikot para maghanap ng pasahero. Mas makakatipid ka sa gasolina.</li>
</ul>
<p>&nbsp;</p>
<p><strong>Magkano ang maaring kitain sa loob ng isang buwan?</strong></p>
<p>&nbsp; &nbsp; &nbsp;Kumita ng mula sa halagang P10,000 to P30,000 depense sa iyong sipag at tiyaga.</p>
<p><strong>Paano kumikita ang isang rider?</strong></p>
<p>&nbsp; &nbsp; &nbsp; &nbsp;May iba't ibang paraan para kumita ang isang rider. Mas maraming tanggap ng booking o jobs mas malaki ang kita. Ito ay CASH na babayaran sa inyo ng customer.&nbsp;</p>
<ul>
<li>Kumita ng P35-P70 bawat isang successful food delivery.</li>
<li>Kumita ng P30-P90 bawat maihahatid na parahero na nagbook ng BackRide o Angkas.</li>
<li>Kumita ng P50-P120 bawat maihahatid na pasahero ng nagbooking ng Tricycle Hire, P70-P150 naman para sa nagbook ng Car Hire</li>
<li>Karagdagang Incentives at Bonus kapag nakaHit ka ng Target.</li>
</ul>
<p><strong>May kailangan bang bayaran?</strong></p>
<p>&nbsp; &nbsp; Kailangan lamang magTop Up ng halagang P650 sa inyong GCASH Account. May instruction kung saan pwede magTopUp o maglagay ng balanse sa iyong GCASH Account.</p>
<p><strong>Para saan ang P650 na babayaran?</strong><br />&nbsp; &nbsp; &nbsp; Ang P150 ay mapupunta para sa inyong GCASH mastercard, para mas mabilis makuha ang iyong incentives at bonuses at maiwidraw ito sa pinakamalapit na ATM Machine. Ito ay oorderin online at idedeliver sa inyo mismo or makukuha sa pinakamalapit LBC Branch.</p>
<p>Ang P500 ay mapupunta naman sa inyong WALLET BALANCE.</p>
<p><strong>Ano ang Wallet Balance?</strong><br />&nbsp; &nbsp; &nbsp; &nbsp;Ito ang balanse sa inyong account na nababawasan or madagdagan depende sa iba't ibang sitwasyon. Ito ang halaga na pwede mong maitransfer sa iyong GCASH Account para maiwidraw sa iyong GCASH MasterCard ATM.</p>
<p>&nbsp; &nbsp; &nbsp; Ito ay madagdagan kada topup sa inyong Balance. Ito ay kinakailangan upang makatanggap ka ng booking o jobs sa platform. Madadagdagan rin ito kapag nagpadala kmi ng inyong incentives at bonus.</p>
<p>&nbsp; &nbsp; &nbsp;Ito ay mababawasan ng maliit na halaga paunti unti kada successful booking. Ito ay magsisilbing commission sa bawat booking na maibibigay ng platform.</p>
<p>&nbsp;</p>`
            },
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
            vehiImageDiag(val) {
                if (val && this.vehicle_info[this.upload_data.code]) {
                    this.img = this.vehicle_info[this.upload_data.code].img
                    this.dropShow = false
                } else {
                    this.dropShow = true
                }
            },
            vehicles(val) {
                if (val.length > 0) {
                    this.vehicle_data = val[0]
                    val[0].images.forEach(img => {
                        this.vehicle_info[img.code] = img
                    })
                }
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
            let vehi = this.$fireStoreObj().collection('riders').doc(this.user.id).collection('vehicles')
            this.$bind('vehicles', vehi)
            this.$bind('docs', ref)
        },
        methods: {
            afterCompleteVehi(upload) {
                this.vehicle_info[this.upload_data.code] = {
                    img: upload.dataURL,
                    data: upload,
                    metadata: this.upload_data
                }
                this.img = this.vehicle_info[this.upload_data.code].img
                this.dropShow = false
            },
            afterComplete(upload) {
                this.currentUploadData = {
                    data: upload,
                    metadata: this.upload_data
                }
                this.vehicle_info[this.upload_data.code] = {
                    img: upload.dataURL,
                    data: upload,
                    metadata: this.upload_data
                }
                this.img = this.vehicle_info[this.upload_data.code].img
                this.dropShow = false
            },
            async startEncode() {
                let maps = ['SI', 'BI', 'FI', 'ORCR']
                const promises = maps.map(async(map) => {
                    let file = this.vehicle_info[map].data
                    let store_ref = this.user.id + '/vehicle_info/' + file.upload.uuid + '-' + file.name
                    const ref = this.$fireStorage.ref(store_ref)
                    const upSnap = await ref.put(file)
                    let url = await upSnap.ref.getDownloadURL()
                    this.vehicle_data.images.push({
                        code: map,
                        desc: this.vehicle_info[map].metadata.text,
                        store_ref: store_ref,
                        img: url
                    })
                })
                await Promise.all(promises)
                this.$fireStoreObj().collection('riders').doc(this.user.id).collection('vehicles').add(this.vehicle_data)
                this.vehiDiag = false
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
        }
};
</script>
