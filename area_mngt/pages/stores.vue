<template>
    <v-layout>
        <v-container fluid class="mb-10">
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
            <v-data-iterator :items="resto" :search="search" :page="page" :items-per-page.sync="itemsPerPage" hide-default-footer>
                <template v-slot:header>
                    <v-toolbar dense color="success" class="mb-1">
                        <v-text-field solo dense v-model="search" prepend-inner-icon="mdi-magnify" clearable hide-details label="Search"></v-text-field>
                        <v-btn icon color="blue" @click.stop="getStores(defaultArea.id)">
                            <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                    </v-toolbar>
                </template>
                <template v-slot:default="props">
                    <v-layout wrap justify-left align-left text-left>
                        <resto-card v-for="i in props.items" :key="i.id" class="review-card" style="white-space:initial;" :storeid="i.id"></resto-card>
                    </v-layout>
                </template>
                <template v-slot:footer>
                    <v-toolbar dense width="100%" max-width="100%" class="shopresponsive">
                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn dark text color="primary" v-bind="attrs" v-on="on"> {{ itemsPerPage }}
                                    <v-icon>mdi-chevron-down</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item v-for="(number, index) in itemsPerPageArray" :key="index" @click="updateItemsPerPage(number)">
                                    <v-list-item-title>{{ number }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn dark text color="primary" v-bind="attrs" v-on="on"> {{ flag }}
                                    <v-icon>mdi-chevron-down</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item v-for="(flag_data, index) in flags" :key="index" @click="flag = flag_data">
                                    <v-list-item-title>{{ flag_data }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <span class="mr-2 grey--text"> {{ resto.length }}</span>
                        <v-spacer></v-spacer>
                        <span class="mr-2 grey--text">{{ page }}/{{ numberOfPages }}</span>
                        <v-btn dense small text dark color="blue darken-3" @click="formerPage">
                            <v-icon>mdi-chevron-left</v-icon>
                        </v-btn>
                        <v-btn dense small text dark color="blue darken-3" @click="nextPage">
                            <v-icon>mdi-chevron-right</v-icon>
                        </v-btn>
                    </v-toolbar>
                </template>
            </v-data-iterator>
        </v-container>
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

                             <v-flex xs6 sm6 md6>
                            <v-text-field v-model.number="editedItem.rates.cr" type="number" label="Commision Rate(%)" /> </v-flex>
                        <v-flex xs6 sm6 md6>
                            <v-text-field v-model.number="editedItem.rates.sc" type="number" label="Store Markup(%)" /> </v-flex>
                        <v-flex xs12 sm12 md12>
                            <v-autocomplete v-model="editedItem.tags" dense text :items="defaultArea.data.tags" filled chips color="blue-grey lighten-2" label="Tags" multiple>
                                <template v-slot:selection="{item, index}">
                                    <v-chip small dense color="blue" small close @click:close="editedItem.tags.splice(editedItem.tags.indexOf(item),1)"> {{ item }} </v-chip>
                                </template>
                                <template v-slot:item="data">
                                    <v-list-item-content v-text="data.item"></v-list-item-content>
                                </template>
                            </v-autocomplete>
                        </v-flex>

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
            itemsPerPageArray: [20, 50, 100],
            search: '',
            filter: {},
            flag: 'All',
            flags: ['All', 'Draft', 'Live'],
            restos: [],
            sortDesc: false,
            page: 1,
            itemsPerPage: 20,
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
        numberOfPages() {
            return Math.ceil(this.resto.length / this.itemsPerPage)
        },
        resto() {
            let resto = []
            this.restos.forEach((biz) => {
                resto.push({
                    id: biz.id,
                    data: biz.d
                })
            })
            resto = resto.sort((a, b) => a.data.business_name > b.data.business_name ? 1 : b.data.business_name > a.data.business_name ? -1 : 0)
            if (this.flag === 'All') return resto
            else if (this.flag === 'Draft') return resto.filter(x => x.data.draft === true)
            else return resto.filter(x => x.data.draft === false)
        },
        defaultArea() {
            return this.$store.getters['auth/getDefaultArea']
        }
    },
    watch: {
        defaultArea(val) {
            this.getStores(val.id)
        }
    },
    mounted() {
        this.getStores(this.defaultArea.id)
    },
    methods: {
        nextPage() {
            if (this.page + 1 <= this.numberOfPages) this.page += 1
        },
        formerPage() {
            if (this.page - 1 >= 1) this.page -= 1
        },
        updateItemsPerPage(number) {
            this.itemsPerPage = number
        },
        startClaim() {
            this.$fireStoreObj().collection('merchant').where('d.claimCode', '==', 'CLAIM-' + this.claimCode).get().then((snap) => {
                snap.docs.forEach(store => {
                    let update = {}
                    if (!store.data().d.managed_by) {
                        update = {
                            'd.managed_by': [this.defaultArea.id]
                        }
                    } else {
                        update = {
                            'd.managed_by': this.$fireStoreObj.FieldValue.arrayUnion(this.defaultArea.id)
                        }
                    }
                    this.$fireStoreObj().collection('merchant').doc(store.id).update(update).then(() => {
                        alert(store.data().d.business_name + ' is claim successfully')
                        this.claimDiag = false
                    })
                })
            })
        },
        getStores(area) {
            let stores = this.$fireStoreObj().collection('merchant').where('d.area', '==', area)
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
            this.editedItem.area = this.defaultArea.id
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
