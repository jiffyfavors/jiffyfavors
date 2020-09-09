<template>
    <v-layout>
        <v-layout wrap justify-center align-center text-left>
            <resto-card v-for="i in resto" :key="i.id" class="review-card" style="white-space:initial;" :storeid="i.id"></resto-card>
            <v-speed-dial class="fabicon mb-10" v-model="fab" bottom fixed right direction="top" transition="slide-y-reverse-transition">
                <template v-slot:activator>
                    <v-btn v-model="fab" color="blue darken-2" dark fab>
                        <v-icon v-if="fab">mdi-close</v-icon>
                        <v-icon v-else>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <v-btn fab dark small @click.stop="claimDiag = true" color="blue">
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>
                <v-btn fab dark small @click.stop="dialog = true" color="indigo">
                    <v-icon>mdi-store</v-icon>
                </v-btn>
            </v-speed-dial>
        </v-layout>
        <v-dialog v-model="claimDiag" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="title font-weight-light">Claim a Store</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="claimCode" prefix="CLAIM-" label="Claim Code" /> </v-flex>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="claimDiag = false"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="startClaim"> Claim </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="title font-weight-light">Create a Store</span>
                </v-card-title>
                <v-card-text>
                    <v-layout wrap>
                        <v-flex xs8 sm8 md8>
                            <v-text-field v-model="editedItem.business_name" label="Business Name" /> </v-flex>
                        <v-flex xs4 sm4 md4>
                            <v-text-field v-model="editedItem.branch" label="Branch" /></v-flex>
                        <v-flex xs6 sm6 md6>
                            <v-text-field v-model="editedItem.delivery_time.open" type="time" label="Opening Time" /> </v-flex>
                        <v-flex xs6 sm6 md6>
                            <v-text-field v-model="editedItem.delivery_time.close" type="time" label="Closing Time" /> </v-flex>
                       
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="dialog = false"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>
<script>
import RestoCard from '~/components/RestoCard'
import {
    GeoFirestore
} from 'geofirestore'
export default {
    layout: 'default',
    components: {
        RestoCard
    },
    data() {
        return {
            restos: [],
            fab: null,
            claimDiag: false,
            claimCode: '',
            editedIndex: 0,
            dialog: false,
            editedItem: {
                business_name: '',
                backdrop: '',
                branch: '',
                rates: {
                    sc: 15,
                    cr: 0
                },
                draft: true,
                url: '',
                delivery_time: {
                    open: '09:00',
                    close: '17:00'
                }
            }
        }
    },
    computed: {
        resto() {
            let resto = []
            this.restos.forEach((biz) => {
                resto.push({
                    id: biz.id,
                    data: biz.d
                })
            })
            return resto
        },
        getCurrentBusiness() {
            return this.$store.getters['auth/getDefaultBusiness']
        }
    },
    watch: {
        getCurrentBusiness(val) {
            this.getStores()
        }
    },
    mounted() {
        this.getStores()
    },
    methods: {
        startClaim() {
            this.$fireStoreObj().collection('merchant').where('d.claimCode', '==', 'CLAIM-' + this.claimCode).get().then((snap) => {
            
                snap.docs.forEach(store => {
                    let update = {}
                    if (!store.data().d.managed_by) {
                        update = {
                            'd.managed_by': [this.getCurrentBusiness.id]
                        }
                    }else{
                          update = {
                         'd.managed_by' : this.$fireStoreObj.FieldValue.arrayUnion(this.getCurrentBusiness.id) }
                    }
                    this.$fireStoreObj().collection('merchant').doc(store.id).update(update).then(()=>{
                        alert(store.data().d.business_name + ' is claim successfully')
                        this.claimDiag = false
                    })
                })
            })
        },
        getStores() {
            let stores = this.$fireStoreObj().collection('merchant').where('d.managed_by', 'array-contains', this.getCurrentBusiness.id)
            this.$bind('restos', stores)
        },
        save() {
            const firestore = this.$fireStoreObj()
            const geofirestore = new GeoFirestore(firestore)
            const geocollection = geofirestore.collection('merchant')
            var data = this.editedItem
            var coord = {
                latitude: 0,
                longitude: 0
            }
            var url = data.business_name.replace(' ', '_').replace("'", '').toLowerCase() + '_' + data.branch.replace(' ', '_').replace("'", '').toLowerCase()
            this.editedItem.url = url.replace(/ /g, '_').replace(/'/, '')
            this.editedItem.flags = ['Pre-Apply']
            this.editedItem.coordinates = new this.$fireStoreObj.GeoPoint(coord.latitude, coord.longitude)
            this.editedItem.managed_by = [this.getCurrentBusiness.id]
            geocollection.add(this.editedItem).then((store) => {
                this.dialog = false
            })
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
  
  .v-input--selection-controls {
      padding: 0px !important;
      margin: 0px !important;
    }
    
    .v-messages {
        display: none;
      }
      
      #create .v-speed-dial {
          position: absolute;
        }
        
        #create .v-btn--floating {
            position: relative;
          }
</style>
