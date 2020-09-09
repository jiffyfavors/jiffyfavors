<template>
    <v-layout>
        <v-container fluid>
            <v-list dense>
            	<v-list-item v-for="(code,i) in codes" :key="code.id" >
            		<v-list-item-content @click.stop="EditCode = code, editIndex = i, diag = true">
            			<v-list-item-title>{{code.promoCode}}</v-list-item-title>
            			<v-list-item-subtitle><span v-if="code.type=='Monetary'"> {{code.value |toPHP}} </span> <span v-else>{{code.value}}</span>{{code.type=='Percent' ? '% Discount' : 'Less'}} for MOV of {{code.MOV|toPHP}}</v-list-item-subtitle>
            			<v-divider></v-divider>
            		</v-list-item-content>
            		<v-list-item-icon>
            			<v-icon color="red" @click.stop="EditCode = code,deleteDiag = true">mdi-delete</v-icon>
            		</v-list-item-icon>
            	</v-list-item>
            </v-list>
            <v-fab-transition>
                <v-btn fab small fixed bottom color="blue" right @click.stop="editIndex = -1, diag = true" class="fabicon mb-5">
                    <v-icon class="white--text">mdi-plus</v-icon>
                </v-btn>
            </v-fab-transition>
        </v-container>
        <v-dialog v-model="diag" persistent max-width="500px">
            <v-card>
                <v-card-title>{{editIndex>-1 ? 'Edit Promo Code' : 'Create a Promo Code'}} </v-card-title>
                <v-card-text>
                    <v-layout wrap justify-center align-center text-left>
                        <v-flex xs12>
                            <v-text-field :rules="rules" v-model.trim="EditCode.promoCode" counter="15" dense label="Promo Code"></v-text-field>
                        </v-flex>
                        <v-flex xs4>
                            <v-text-field label="MOV" v-model.number="EditCode.MOV" dense type="number"></v-text-field>
                        </v-flex>
                        <v-flex xs4>
                            <v-text-field label="Code Value" v-model.number="EditCode.value" dense type="number"></v-text-field>
                        </v-flex>
                        <v-flex xs4>
                            <v-select :items="['Percent', 'Monetary']" v-model="EditCode.type" label="Type" dense small></v-select>
                        </v-flex>
                       
                        <v-flex xs12>
                            <v-list flat dense>
                                <v-subheader>Affected Stores</v-subheader>
                                <small>All Branches will accept this code if none selected</small>
                                <v-list-item-group v-model="EditCode.stores" multiple>
                                    <template v-for="(_item, i) in resto">
                                        <v-list-item :key="`item-${i}`" :value="_item.id" active-class="deep-purple--text text--accent-4">
                                            <template v-slot:default="{ active, toggle }">
                                                <v-list-item-action>
                                                    <v-checkbox :input-value="active" :true-value="_item" color="deep-purple accent-4" @click="toggle"></v-checkbox>
                                                </v-list-item-action>
                                                <v-list-item-content>
                                                    <v-list-item-title>{{_item.data.business_name}} -
                                                        <small>{{_item.data.branch}}</small>
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </template>
                                        </v-list-item>
                                    </template>
                                </v-list-item-group>
                            </v-list>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="diag = false"> Cancel </v-btn>
                    <v-btn color="blue darken-1" :disabled="EditCode.promoCode.length<5 || EditCode.value<=0" text @click="createCode()"> {{editIndex>-1 ? 'Update' : 'Create'}} </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

                   <v-dialog v-model="deleteDiag" max-width="290">
                <v-card>
                    <v-card-title class="headline">Confirm deletion</v-card-title>
                    <v-card-text>Are you sure you want to delete this {{EditCode.promoCode}} promo code?</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="deleteDiag = false">Close</v-btn>
                        <v-btn color="green darken-1" text @click="deleteItem(), deleteDiag = false">Ok</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

    </v-layout>
</template>
<script>
export default {
    data() {
            return {
                diag: false,
                deleteDiag:false,
                restos: [],

                 rules: [v =>v.length <= 15 || 'Max 15 characters', v =>v.length>=5|| 'Min 5 characters'],

                promoCode: '',
                codes:[],
                defaultCode: {
                    promoCode: '',
                    type: 'Percent',
                    MOV: 0,
                    value: 0,
                    stores: []
                },
                editIndex: -1,
                EditCode: {
                    promoCode: '',
                    type: 'Percent',
                    MOV: 0,
                    value: 0,
                    stores: []
                }
            }
        },
        computed: {
            getCurrentBusiness() {
                return this.$store.getters['auth/getDefaultBusiness']
            },
            resto() {
                let resto = []
                this.restos.forEach((biz) => {
                    resto.push({
                        id: biz.id,
                        data: biz.d
                    })
                })
                return resto
            }
        },
        watch: {
            getCurrentBusiness(val) {
                this.getStores()
            },
            diag(val) {
                if (val) {
                    if (this.editIndex < 0) this.EditCode = Object.assign({}, this.defaultCode)
                    this.getStores()
                }
            }
        },
        mounted(){
        	this.getCodes()
        },
        methods: {
        	deleteItem(){
        		 this.$fireStoreObj().collection('voucher_codes').doc(this.EditCode.id).delete()
        	},
        	getCodes(){
        		        	 let codes = this.$fireStoreObj().collection('voucher_codes').where('owner','==', this.getCurrentBusiness.id)
        	 this.$bind('codes', codes)
        	},
            createCode() {

                this.EditCode.promoCode = this.EditCode.promoCode.toUpperCase().replace(/ /g,'')
                this.EditCode.merchantCode = true
                if (this.EditCode.stores.length === 0) {
                    this.restos.forEach((biz) => {
                        this.EditCode.stores.push(biz.id)
                    })
                }
                this.EditCode.owner = this.getCurrentBusiness.id
                if (this.editIndex < 0) {
                    this.$fireStoreObj().collection('voucher_codes').add(this.EditCode)
                }else{
                	 this.$fireStoreObj().collection('voucher_codes').doc(this.EditCode.id).update(this.EditCode)
                }
                this.diag = false
            },
            getStores() {
                let stores = this.$fireStoreObj().collection('merchant').where('d.managed_by', 'array-contains', this.getCurrentBusiness.id)
                this.$bind('restos', stores)
            }
        }
};
</script>
<style scoped>
  .fabicon {
    position: fixed;
    bottom: 15%;
    right: 5%;
  }
</style>
