<template>
    <v-layout>
        <v-container>
            <v-layout justify-center align-center class="text-xs-center">
                <v-flex xs12 v-if="activeBtn === 1">
                    <v-container style="position: relative;top: 13%;" class="text-xs-cente mx-auto">
                        <v-card flat max-width="100%" class="mx-auto">
                            <v-card-title primary-title>
                                <h4>Login</h4> </v-card-title>
                            <v-card-text>
                                <fire-ui mode="login" :payload={}></fire-ui>
                            </v-card-text>
                        </v-card>
                    </v-container>
                </v-flex>
                <v-flex xs12 v-if="activeBtn === 0">
                    <v-container style="position: relative;top: 13%;" class="text-xs-center">
                        <v-card flat>
                            <v-card-title primary-title>
                                <h4>Become a Rider</h4> </v-card-title>
                            <v-card-text v-html="riderText"></v-card-text>
                        </v-card>
                    </v-container>
                </v-flex>
                <v-flex xs12 v-if="activeBtn === 2">
                    <v-container style="position: relative;top: 13%;" class="text-xs-center">
                        <v-card flat>
                            <v-card-title primary-title>
                                <h4>Rider Registration</h4> </v-card-title>
                            <v-card-text>
                                <v-form ref="form" v-model="valid" v-show="!ifvalidated">
                                    <v-layout wrap>
                                        <v-flex xs12>
                                            <v-select dense :items="cities" :rules="[v => !!v || 'City is required']" v-model="city" label="Where are you located?" item-text="data.name" item-value="id"></v-select>
                                        </v-flex>
                                        <v-flex xs6>
                                            <v-text-field v-model="firstname" :rules="[v => !!v || 'Firstname is required']" required name="First Name" label="First Name"></v-text-field>
                                        </v-flex>
                                        <v-flex xs6>
                                            <v-text-field name="Last Name" v-model="lastname" required :rules="[v => !!v || 'Lastname is required']" label="Last Name"></v-text-field>
                                        </v-flex>
                                        <v-flex xs6>
                                            <v-text-field name="Birthdate" v-model="birthdate" :rules="[v => !!v || 'Birthday is required']" required label="Birthdate" type="date"></v-text-field>
                                        </v-flex>
                                        <v-flex xs6>
                                            <v-select :items="[{name:'Male', value:'M'}, {name:'Female', value:'F'}]" item-text="name" item-value="value" v-model="gender" label="Gender" :rules="[v => !!v || 'Gender is required']"></v-select>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-card>
                                                <v-card-title>Create Login Account</v-card-title>
                                                <v-card-text>
                                                    <v-layout wrap>
                                                        <v-flex xs12>
                                                            <v-text-field dense v-model="email" type="email" :rules="emailRules" placeholder="Email Address" outlined></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs12>
                                                            <v-text-field dense v-model="phoneNumber" type="number" prefix="+63" placeholder="Phone Number" :rules="phonRules" outlined></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs6>
                                                            <v-text-field dense v-model="pass1" type="password" placeholder="Password" :rules="[  v => !!v || 'Password is required', (pass1 === pass2) || 'Password must match' ]" outlined></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs6>
                                                            <v-text-field dense v-model="pass2" type="password" placeholder="Confirm Password" :rules="[  v => !!v || 'Password is required', (pass1 === pass2) || 'Password must match' ]" outlined></v-text-field>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-card-text>
                                            </v-card>
                                        </v-flex>
                                        <!--                                  <v-flex xs12>
                                            <v-card class="mt-2">
                                                <v-card-title>Vehicle Information</v-card-title>
                                                <v-card-text>
                                                    <v-layout wrap>
                                                        <v-flex xs6>
                                                            <v-text-field name="Make" v-model="vehicle_info.make" :rules="[v => !!v || 'Field is required']" required label="Make" placeholder="eg. Suzuki"></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs6>
                                                            <v-text-field name="Model" v-model="vehicle_info.model" :rules="[v => !!v || 'Field is required']" required label="Model" placeholder="eg. Raider 150"></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs6>
                                                            <v-text-field name="Plate No." v-model="vehicle_info.plate" :rules="[v => !!v || 'Field is required']" required label="Plate No." placeholder="VO - 12345"></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs6>
                                                            <v-text-field name="Year release" v-model="vehicle_info.yearmodel" :rules="[v => !!v || 'Field is required']" required label="Year release" placeholder="2020"></v-text-field>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-card-text>
                                            </v-card>
                                        </v-flex> --></v-layout>
                                    <v-card-actions>
                                        <v-btn primary large @click.stop="validate" block>Next</v-btn>
                                    </v-card-actions>
                                </v-form>
                              <!--   <fire-ui v-show="ifvalidated" mode="register" :payload="registration_payload"></fire-ui> -->
                            </v-card-text>
                        </v-card>
                    </v-container>
                </v-flex>
            </v-layout>
        </v-container>
        <v-bottom-navigation :value="activeBtn" grow color="teal" fixed>
            <v-btn @click.stop="activeBtn=0">
                <span>Become a Rider</span>
                <v-icon>mdi-account</v-icon>
            </v-btn>
            <v-btn @click.stop="activeBtn=1">
                <span>Login</span>
                <v-icon>mdi-key</v-icon>
            </v-btn>
            <v-btn @click.stop="activeBtn=2">
                <span>Register</span>
                <v-icon>mdi-motorbike</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </v-layout>
</template>
<script>
import FireUi from '~/components/FireUi.vue'
export default {
    layout: 'menu',
    middleware({
        store,
        redirect
    }) {
        // If the user is not authenticated
        if (store.getters['auth/isAuth']) {
            return redirect('/')
        }
    },
    components: {
        FireUi
    },
    computed: {
        registration_payload() {
            return {
                profile: {
                    firstname: this.firstname,
                    lastname: this.lastname,
                    gender: this.gender,
                    birthdate: this.birthdate
                },
                area: this.city,
                contact: this.phoneNumber,
                email: this.email,
                vehicle_info: this.vehicle_info,
                password: this.pass1
            }
        },
        isAuth() {
            return this.$store.getters['auth/isAuth']
        },
    },
    mounted() {
        localStorage.removeItem('vuex')
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate();
        this.birthdate = new Date(year - 16, month, day).toISOString().substring(0, 10);
    },
    data() {
        return {
            pass1: '',
            pass2: '',
            riderText: `<p><strong>Ano ang mga requirements para maging isang Jiffy Rider?</strong></p>
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
<p>&nbsp;</p>`,
            activeBtn: 0,
            phoneNumber: '',
            ifvalidated: false,
            email: '',
            firstname: '',
            lastname: '',
            gender: 'M',
            birthdate: '',
            city: '',
            cities: [],
            vehicle_info: {
                make: '',
                model: '',
                plate: '',
                yearmodel: ''
            },
            valid: true,
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 10) || 'Name must be less than 10 characters',
            ],
            phonRules: [
                v => !!v || 'Phone number is required',
                v => (v && v.length == 10) || 'Name must be 10 characters',
            ],
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            passwordRules: [
                v => !!v || 'Password is required'
            ]
        }
    },
    methods: {
        getCities() {
            this.cities = []
            this.$fireStoreObj().collection('areas').get().then((snap) => {
                snap.docs.forEach(area => {
                    this.cities.push({
                        id: area.id,
                        data: area.data().d
                    })
                })
                this.cities.sort((a, b) => (a.data.name > b.data.name ? 1 : b.data.name > a.data.name ? -1 : 0))
            })
        },
        validate() {
            this.ifvalidated = this.$refs.form.validate()
            if (this.ifvalidated) {
               this.$fireFunc.httpsCallable('createNewRider')(this.registration_payload).then(() => {
                 this.$fireAuth.signInWithEmailAndPassword(this.preSignUp.contact.email, this.pass1).catch(error=>{
                  this.snackbar = true
                    this.color = 'error'
                    this.text = 'Account Not Exist'
               })
            });
            }
        }
    },
    watch: {
        city(val) {
            console.log(val)
        },
        activeBtn(val) {
            if (val === 2) this.getCities()
        },
        isAuth(val) {
            if (val) {
                this.$store.dispatch('auth/getProfile').then(() => {
                    this.$router.push('/')
                })
            }
        }
    }
};
</script>
