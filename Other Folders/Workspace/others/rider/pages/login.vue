<template>
    <v-layout>
        <v-container>
            <v-layout justify-center align-center class="text-xs-center">
                <v-flex xs12 v-if="activeBtn === 0">
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
                <v-flex xs12 v-if="activeBtn === 1">
                    <v-container style="position: relative;top: 13%;" class="text-xs-center">
                        <v-card flat>
                            <v-card-title primary-title>
                                <h4>Rider Registration</h4> </v-card-title>
                            <v-form ref="form" v-model="valid" v-show="!ifvalidated">
                                <v-layout wrap>
                                    <v-flex xs6>
                                        <v-text-field prepend-icon="mdi-account" v-model="firstname" :rules="[v => !!v || 'Firstname is required']" required name="First Name" label="First Name"></v-text-field>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-text-field name="Last Name" v-model="lastname" required :rules="[v => !!v || 'Lastname is required']" label="Last Name"></v-text-field>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-text-field name="Birthdate" v-model="birthdate" :rules="[v => !!v || 'Birthday is required']" required label="Birthdate" type="date"></v-text-field>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-radio-group dense row v-model="gender" :rules="[v => !!v || 'Gender is required']" required label="Gender">
                                            <v-radio label="Male" value="M"></v-radio>
                                            <v-radio label="Female" value="F"></v-radio>
                                        </v-radio-group>
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
                                <v-card-actions>
                                    <v-btn primary large @click.stop="validate" block>Next</v-btn>
                                </v-card-actions>
                            </v-form>
                            <fire-ui v-show="ifvalidated" mode="register" :payload="registration_payload"></fire-ui>
                        </v-card>
                    </v-container>
                </v-flex>
            </v-layout>
        </v-container>
        <v-bottom-navigation :value="activeBtn" grow color="teal" fixed>
            <v-btn @click.stop="activeBtn=0"> <span>Login</span>
                <v-icon>mdi-key</v-icon>
            </v-btn>
            <v-btn @click.stop="activeBtn=1"> <span>Register</span>
                <v-icon>mdi-account</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </v-layout>
</template>
<script>
import FireUi from '~/components/FireUi.vue'
export default {
    layout: 'menu',

    middleware ({ store, redirect }) {
    // If the user is not authenticated
    if (store.getters['auth/isAuth']) {
      return redirect('/')
    }
  },

    components: {
        FireUi
    },
    computed: {
        isAuth() {
            return this.$store.getters['auth/isAuth']
        },
        registration_payload() {
            return {
                status: 'pre_register',
                firstname: this.firstname,
                lastname: this.lastname,
                gender: this.gender,
                birthdate: this.birthdate,
                vehicle_info: this.vehicle_info
            }
        },
    },
    mounted(){
        console.log(this.isAuth)
    },
    data() {
        return {
            activeBtn: 0,
            ifvalidated: false,
            firstname: '',
            lastname: '',
            gender: '',
            birthdate: '30/01/1992',
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
        }
    },
    methods: {
        validate() {
            this.ifvalidated = this.$refs.form.validate()
            if (this.ifvalidated) {
                console.log(this.registration_payload)
            }
        }
    },
    watch: {
        isAuth(val) {
            if (val) this.$router.push('/')
        }
    }
}
</script>
