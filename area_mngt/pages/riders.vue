<template>
    <v-layout>
        <v-container fluid>
            <v-data-iterator :items="riders" :search="search" :page="page" :items-per-page.sync="itemsPerPage" hide-default-footer>
                <template v-slot:header>
                    <v-toolbar dense color="success" class="mb-1">
                        <v-text-field solo dense v-model="search" prepend-inner-icon="mdi-magnify" clearable hide-details label="Search"></v-text-field>
                        <v-btn icon color="blue" @click.stop="">
                            <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                        <v-btn icon color="blue" @click.stop="dialog = true">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-toolbar>
                </template>
                <template v-slot:default="props">
                    <v-card flat style="min-height: 85vh; overflow:auto">
                        <v-list dense>
                            <v-list-item-group v-for="rider in props.items" :key="rider.id">
                                <v-list-item flat @click.stop="current_rider = rider, actionSheet = true">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ rider.profile.firstname}} {{ rider.profile.lastname}}</v-list-item-title>
                                        <v-list-item-subtitle>
                                            <small>Fullname</small>
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-list-item-action-text> {{rider.balance|toPHP}} </v-list-item-action-text>
                                        <v-list-item-icon>
                                            <v-chip :color="rider.status.profile==='ACTIVE' ? 'info' : 'warning'" small> {{rider.status.profile}} </v-chip>
                                        </v-list-item-icon>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-card>
                </template>
            </v-data-iterator>
        </v-container>
        <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="title font-weight-light">Rider Registration</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form" v-model="valid">
                        <v-layout wrap>
                            <v-flex xs6>
                                <v-text-field v-model="firstname" :rules="[v => !!v || 'Firstname is required']" required name="First Name" label="First Name"></v-text-field>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field name="Last Name" v-model="lastname" required :rules="[v => !!v || 'Lastname is required']" label="Last Name"></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field dense v-model="email" type="email" :rules="emailRules" placeholder="Email Address" outlined></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field dense v-model="phoneNumber" type="number" prefix="+63" placeholder="Phone Number" :rules="phonRules" outlined></v-text-field>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field name="Birthdate" v-model="birthdate" :rules="[v => !!v || 'Birthday is required']" required label="Birthdate" type="date"></v-text-field>
                            </v-flex>
                            <v-flex xs6>
                                <v-select :items="gender_data" item-text="name" item-value="value" v-model="gender" label="Gender" :rules="[v => !!v || 'Gender is required']"></v-select>
                               <!--  <v-radio-group dense mandatory row v-model="gender" :rules="[v => !!v || 'Gender is required']" required label="Gender">
                                    <v-radio label="Male" value="M"></v-radio>
                                    <v-radio label="Female" value="F"></v-radio>
                                </v-radio-group> -->
                            </v-flex>
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
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="dialog = false"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="createRider"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-bottom-sheet inset v-model="actionSheet">
            <v-list single-line dense>
             <!--    <v-list-item-group>
                    <v-list-item @click="">
                        <v-list-item-icon>
                            <v-icon small color="blue"> mdi-pencil </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Update Profile </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group> -->
                <v-list-item-group>
                    <v-list-item @click="setProfileStatus(), actionSheet=false">
                        <v-list-item-icon>
                            <v-icon small color="blue"> mdi-pencil </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{current_rider.status.profile==='PRE-REG' ? 'Activate' : current_rider.status.profile==='ACTIVE' ? 'Deactivate' : current_rider.status.profile==='SUSPENDED' ? 'Activate' :'Suspend' }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                <v-list-item-group>
                    <v-list-item @click.stop="topUpDiag = true, actionSheet = false">
                        <v-list-item-icon>
                            <v-icon small color="blue"> mdi-food </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Top Up</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-bottom-sheet>
        <v-dialog v-model="topUpDiag" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="title font-weight-light">Rider Top Up</span>
                </v-card-title>
                <v-card-text>
                    <v-select :items="topUpAmount" v-model="topupCredit" label="Amount"></v-select>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="topUpDiag = false"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text :disabled="topupCredit<500" @click="topUpCredit(), topUpDiag = false"> Record </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>
<script>
export default {
    layout: 'default',
    data() {
        return {
            topUpDiag:false,
            topUpAmount: [500, 1000, 1500, 2000],
            topupCredit: 0,
            actionSheet: false,
            dialog: false,
            itemsPerPageArray: [20, 50, 100],
            search: '',
            gender_data:[{
                name:'Male',
                value:'M'
            },
            {
                name:'Female',
                value:'F'
            }],
            page: 1,
            itemsPerPage: 20,
            activeBtn: 0,
            ifvalidated: false,
            email: '',
            phoneNumber: '',
            firstname: '',
            current_rider: {
                status: {
                    profile: 'ACTIVE'
                }
            },
            lastname: '',
            gender: 'M',
            birthdate: '',
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
        }
    },
    methods: {
        createRider() {
            this.$fireFunc.httpsCallable('createNewRider')(this.registration_payload).then(() => {
                this.dialog = false
            });
        },
        setProfileStatus() {
            let status = this.current_rider.status.profile === 'ACTIVE' ? 'SUSPENDED' : this.current_rider.status.profile === 'PRE-REG' ? 'ACTIVE' : this.current_rider.status.profile === 'SUSPENDED' ? 'ACTIVE' :'SUSPENDED'
            this.$fireStoreObj().collection('riders').doc(this.current_rider.id).update({
                'd.status.profile': status
            })
        },
        topUpCredit(){
              this.$fireStoreObj().collection('riders').doc(this.current_rider.id).collection('balances').add({
                type:'top-up',
                desc:'Top Up',
                amount: this.topupCredit,
                timestamp: new Date().getTime()
              })
        },
    },
    computed: {

        area() {
            return this.$store.getters['auth/getDefaultArea']
        },
        riders() {
            return this.$store.getters['rider/getRiders']
        },
        registration_payload() {
            return {
                profile: {
                    firstname: this.firstname,
                    lastname: this.lastname,
                    gender: this.gender,
                    birthdate: this.birthdate
                },
                area: this.area.id,
                contact: '+63' + this.phoneNumber,
                email: this.email,
                vehicle_info: this.vehicle_info
            }
        }
    },
    watch: {
        area(val) {
            this.$store.dispatch('rider/getRiders', {
                area: this.area.id
            })
        }
    },
    mounted() {
        this.$store.dispatch('rider/getRiders', {
            area: this.area.id
        })
    }
};
</script>
