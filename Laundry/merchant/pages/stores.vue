<template>
    <v-layout>
        <v-layout wrap justify-center align-center text-left>
            <store-card v-for="i in stores" :key="i.id" class="review-card" style="white-space:initial;" :data="i"></store-card>
            <v-speed-dial class="fabicon mb-5" v-model="fab" bottom fixed right direction="top" transition="slide-y-reverse-transition">
                <template v-slot:activator>
                    <v-btn v-model="fab" color="blue darken-2" dark fab>
                        <v-icon v-if="fab">mdi-close</v-icon>
                        <v-icon v-else>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <v-btn fab dark small @click.stop="dialog = true" color="indigo">
                    <v-icon>mdi-store</v-icon>
                </v-btn>
            </v-speed-dial>
        </v-layout>
        <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="title font-weight-light">Create a Store</span>
                </v-card-title>
                <v-card-text>

                     <v-img class="elevation-6" max-height="300px" min-height="200px" width="100%" :src="editedItem.backdrop" @click.stop="generareFileList">
                        <v-avatar style="position:absolute; bottom:0;">
                            <v-img class="elevation-6" :src="editedItem.logo" @click.stop="generareFileList" /> </v-list-item-avatar>
                        </v-avatar>
                    </v-img>

                    <v-layout wrap>
                        <v-flex xs8 sm8 md8>
                            <v-text-field v-model="editedItem.business_name" label="Business Name" /> </v-flex>
                        <v-flex xs4 sm4 md4>
                            <v-text-field v-model="editedItem.branch" label="Branch" /></v-flex>
                        <v-flex xs6 sm6 md6>
                            <v-text-field v-model="editedItem.opening_time" type="time" label="Opening Time" /> </v-flex>
                        <v-flex xs6 sm6 md6>
                            <v-text-field v-model="editedItem.closing_time" type="time" label="Closing Time" /> </v-flex>
                        <v-flex xs6 sm6 md6>
                            <v-select :items="currencies" v-model="editedItem.currency" label="Currency" item-text="code" item-value="code"></v-select>
                        </v-flex>
                          <v-flex xs6 sm6 md6>
                            <v-select :items="storeType" v-model="editedItem.storeType" label="Kind of Store">
                            </v-select>
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
                <v-dialog v-model="imagediag" max-width="400px">
            <v-card>
                <v-card-text>
                    <v-container>
                        <vuedropzone id="customdropzone" ref="imgDropZone" :options="dropzoneOptions" @vdropzone-complete="afterComplete" />
                        <vue-select-image ref="imageSelector" :data-images="images" :is-multiple="true" @onselectmultipleimage="onSelectMultipleImage" /> </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                 
                        <v-btn color="blue darken-1" text @click="deleteSelected"> Delete </v-btn>
                        <v-btn color="blue darken-1" text @click="setAsLogo"> Set as Logo </v-btn>
                        <v-btn color="blue darken-1" text @click="setAsBackdrop"> Set as Backdrop </v-btn>
                  
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-layout>
</template>
<script>
import RestoCard from '~/components/RestoCard'
import StoreCard from '~/components/StoreCard'
import {
    GeoFirestore
} from 'geofirestore'
export default {
    layout: 'default',
    components: {
        RestoCard,
        StoreCard
    },
    data() {
        return {
            restos: [],
            fab: null,
            claimDiag: false,
            images:[],
            selectedImages:[],
            imagediag:false,
            claimCode: '',
            editedIndex: 0,
               storeType:['Laundry Shop','Massage Spa','Beauty Salon','Restaurant','Food Takeout Business','Clinic','Law Office'],
            dialog: false,
            _editedItem:{},
            editedItem: {
                business_name: '',
                backdrop: '',
                branch: '',
                logo:'',
                draft: true,
                url: '',
                currency: 'USD',
                opening_time: '09:00:00',
                closing_time: '17:00:00'
            },
              dropzoneOptions: {
                url: '/',
                thumbnailWidth: 50,
                thumbnailHeight: 50,
                addRemoveLinks: false,
                acceptedFiles: '.jpg, .jpeg, .png',
                dictDefaultMessage: `<p class='text-default'><v-icon small color="blue">mdi-upload</v-icon> Drag Images or Click Here</p>
          <p class="form-text">Allowed Files: .jpg, .jpeg, .png</p>
          `
            },
        }
    },
    computed: {
        stores() {
            return this.$store.getters['store/getStores']
        },
        currencies() {
            return this.$store.getters['store/getCurrencies']
        }
    },
    watch:{
        dialog(){
            this.editedItem = Object.assign({}, this._editedItem)
        },
    },
    mounted() {
       this._editedItem = Object.assign({}, this.editedItem)
        this.$store.dispatch('store/fetchStores')
    },
    methods: {
          afterComplete(upload) {
            const imageName = uuid.v1()
            this.isLoading = true
            try {
                // save image
                const file = upload
                const ref = this.$fire.storage.ref(this.$store.getters['auth/getAccessInfo'][0].id + '/' + imageName + '-' + file.name)
                ref.put(file).then((snap) => {
                    snap.ref.getDownloadURL().then((url) => {
                        this.images.push({
                            id: snap.ref.fullPath,
                            src: url
                        })
                    })
                })
            } catch (error) {
                console.log(error)
            }
            this.$refs.imgDropZone.removeFile(upload)
            this.isLoading = false
        },
        deleteSelected() {
            this.selectedImages.forEach((a) => {
                this.$fire.storage.ref(a.id).delete().then(() => {
                    this.images.splice(this.images.indexOf(a), 1)
                })
            })
        },
        setAsLogo() {
            this.editedItem.logo = this.selectedImages[0].src
            this.imagediag = false
        },
     
        setAsBackdrop() {
            this.editedItem.backdrop = this.selectedImages[0].src
            this.imagediag = false
        },
        onSelectMultipleImage(data) {
            this.selectedImages = data
        },
                generareFileList() {
            this.images = []
            this.selectedImages = []
            this.$fire.storage.ref(this.$store.getters['auth/getAccessInfo'][0].id).listAll().then((res) => {
                res.items.forEach((itemRef) => {
                    itemRef.getDownloadURL().then((url) => {
                        this.images.push({
                            id: itemRef.fullPath,
                            src: url
                        })
                    })
                })
            })
            this.imagediag = true
        },
        save() {
            var data = this.editedItem
     
            var url = data.business_name.replace(' ', '_').replace("'", '').toLowerCase() + '_' + data.branch.replace(' ', '_').replace("'", '').toLowerCase()
            this.editedItem.url = url.replace(/ /g, '_').replace(/'/, '')
            this.editedItem.users_access = this.$store.getters['auth/getAccessInfo'][0].id
            this.editedItem.contact=[]
            this.$fire.firestore.collection('shops').add(this.editedItem).then((store) => {
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
