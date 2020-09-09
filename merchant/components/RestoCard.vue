<template>
    <v-flex xs12 md4 sm6 lg3 class="pa-2" v-if="loaded">
        <v-lazy v-model="isActive" :options="{threshold: .6}" min-height="200" transition="fade-transition">
            <v-card width="100%" :disabled="editedItem.flags.indexOf('Request for Deletion')>-1" @click.stop="actionSheet = true">
                <v-img :src="data.backdrop" height="200px" min-width="100%" width="100%" @error="backDropError = true">
                    <v-chip :color="data.main ? 'warning' : 'info'" label class="onsale" small> {{ data.main ? 'Branch' : 'Main' }} </v-chip>
<v-chip color="red" v-if="editedItem.flags.indexOf('Request for Deletion')>-1" label class="onsale" small>For Deletion</v-chip>
                    
                    <span v-if="data.rates.cr>0" class="bestseller">Recommended</span>
                </v-img>
                <v-card-actions>
                    <v-list-item three-line dense>
                        <v-list-item-avatar color="grey darken-3">
                            <v-img class="elevation-6" :src="data.logo" @error="logoError = true" /> </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>{{ data.business_name }}</v-list-item-title>
                            <v-list-item-subtitle>
                                <small>{{ data.branch }}</small>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-list-item-action-text>
                                <span class="caption grey--text">CR: </span>
                                <span class="red--text subtitle-2">{{data.rates.cr }} %</span>
                            </v-list-item-action-text>
                            <v-chip dense :color="data.draft ? 'error' : 'success'" small> {{ data.draft ? 'Close' : 'Live' }} </v-chip>
                        </v-list-item-action>
                    </v-list-item>
                </v-card-actions>
            </v-card>
        </v-lazy>
        <v-bottom-sheet inset v-model="actionSheet">
            <v-list single-line dense>
                <v-subheader>Manage {{editedItem.business_name}} {{editedItem.branch}}</v-subheader>
                <v-list-item-group>
                    <v-list-item @click="selectedImages=[], editedIndex=0, editItem(editedItem)">
                        <v-list-item-icon>
                            <v-icon small color="blue"> mdi-pencil </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Edit Store</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                <v-list-item-group>
                    <v-list-item v-if="!editedItem.main" @click="createBranch()">
                        <v-list-item-icon>
                            <v-icon small color="blue"> mdi-store </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Create Branch</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                <v-list-item-group>
                    <v-list-item :to="'/menu/'+storeid">
                        <v-list-item-icon>
                            <v-icon small color="blue"> mdi-food </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Manage Food & Menu</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                <v-list-item-group>
                    <v-list-item :href="'https://m.jiffyfavors.com/resto/'+editedItem.url" target="_blank">
                        <v-list-item-icon>
                            <v-icon small color="blue"> mdi-food </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Show Menu</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                <v-list-item-group>
                    <v-list-item @click.stop="publisher()">
                        <v-list-item-icon>
                            <v-icon :color="editedItem.draft ? 'green' : 'red'" small> {{ editedItem.draft ? 'mdi-check' : 'mdi-close' }} </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title> {{editedItem.draft ? 'Publish' : 'Unpublish' }} </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                <v-list-item-group>
                    <v-list-item @click="editedIndex = 0, setCenter(), coordiag = true">
                        <v-list-item-icon>
                            <v-icon small color="indigo"> mdi-map-marker </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Update Location</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                <v-list-item-group>
                    <v-list-item @click.stop="deleteDiag = true">
                        <v-list-item-icon>
                            <v-icon small color="red"> mdi-delete </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Delete Store</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-bottom-sheet>
        <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="title font-weight-light">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <v-img v-if="editedIndex>-1" class="elevation-6" max-height="300px" min-height="200px" width="100%" :src="editedItem.backdrop" @click.stop="generareFileList">
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
                            <v-text-field v-model="editedItem.delivery_time.open" type="time" label="Opening Time" /> </v-flex>
                        <v-flex xs6 sm6 md6>
                            <v-text-field v-model="editedItem.delivery_time.close" type="time" label="Closing Time" /> </v-flex>
                     
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-bottom-sheet v-model="coordiag" persistent max-width="400px">
            <v-card>
                <v-card-title primary-title> Update Store Location </v-card-title>
                <v-card-text>
                    <div class="mapcontainer">
                        <GMap id="gmap" ref="gMap" :center="mylocation" :options="{fullscreenControl: false, streetViewControl: false, mapTypeControl: true, zoomControl: true, gestureHandling: 'greedy'}" :zoom="15" @center_changed="centerChange" @loaded="isMapLoaded = true">
                            <GMapMarker ref="gmapmarker" :position="mylocation" :options="{icon:selectedmarker}"> </GMapMarker>
                        </GMap>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="coordiag = false"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="updateMapLocation"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-row justify="center">
            <v-dialog v-model="publishChecklist" max-width="400px">
                <v-card>
                    <v-card-title>Publishing Checklist</v-card-title>
                    <v-card-text>
                        <v-list dense flat>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon small :color="logoError ? 'red' : 'green'"> {{logoError ? 'mdi-close' : 'mdi-check'}} </v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Store Logo</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon small :color="backDropError ? 'red' : 'green'">> {{backDropError ? 'mdi-close' : 'mdi-check'}}</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Store Background Image</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon small :color="menuError ? 'red' : 'green'"> {{menuError ? 'mdi-close' : 'mdi-check'}} </v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Menu Setup</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon small :color="rateError ? 'red' :'green'"> {{ rateError ? 'mdi-close' :'mdi-check' }} </v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Agreed Commission Rate</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon small :color="locationError ? 'red' :'green'"> {{ locationError ? 'mdi-close' :'mdi-check' }} </v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Store Location</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text small dense @click.stop="publishChecklist = false">Close</v-btn>
                        <v-btn text small :disabled="!allowedPublish" @click.stop="publishStore()" dense>Publish</v-btn>
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
            <v-dialog v-model="deleteDiag" max-width="290">
                <v-card>
                    <v-card-title class="headline">Confirm deletion</v-card-title>
                    <v-card-text>Are you sure you want to delete this {{editedItem.business_name}} - {{editedItem.branch}}?</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="deleteDiag = false">Close</v-btn>
                        <v-btn color="green darken-1" text @click="deleteItem(), deleteDiag = false">Ok</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-flex>
</template>
<script>
import {
    GeoFirestore
} from 'geofirestore'
const uuid = require('uuid')
export default {
    data() {
            return {
                data: {},
                serverData:null,
                loaded:false,
                backDropError: false,
                logoError: false,
                publishChecklist: false,
                rateError: false,
                locationError: false,
                isActive: false,
                dialog: false,
                actionSheet: false,
                deleteDiag: false,
                menuError: false,
                editedIndex: 0,
                editedItem: {
                    business_name: '',
                    backdrop: '',
                    branch: '',
                    rates: {
                        sc: 0,
                        cr: 0
                    },
                    draft: true,
                    url: '',
                    delivery_time: {
                        open: 900,
                        close: 1700
                    }
                },
                images: [],
                imagediag: false,
                coordiag: false,
                selectedImages: [],
                selectedmarker: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHUSURBVHgB5VU7SwNBEJ7LmZBgMC+UdKKx0MZCG2srwcbCB2glpFDQ3to/IegvSAIWPrBJIySlipUKKqYLaHJ3iWIelzu/DTk8j71H7MQPltmZnflmZ3b3juivQ3BzCIfDI4FAYBvTRV3XR7tBglCCOIP9oFwuv/46QSwWWwfZIaaDNi7vGOlqtZqhfhPE4/EViAy5V6ljE8uVSuXYc4JkMjncarUeMR0ib5Db7fZEvV6vWBd8PG+Q73LIFYyj3lAsa1G/37/D4+JWgPbcQkybd9jpdGYVRXlmSiQSSYmieMWmhgMuwI0kSTPkpQJgzKJnDfJuKYryBJH7sVNBSPGI7BKoFl3n+GguMY4JHiz6GtoybiisRczmEtPFAM+Ifl6i5DmTKYqeX+Nssj19lUz9N2J4XNxDTiQSkwi4oz6ADU3hLdxb7dwW9RyL5B0FHrltAgZUsEce4eRrmwB3ugCRJ3fk4VvsOwEDHtcWxKeDy4emaWmHdRKdFpvNphQKhdhFmOet42D3sftTJw7X/wHgw/U8h1ywkJ/gYJeI/wi/g8kdmqqqG5Alk62Er+emG7nXBFSr1aroNSNknwOVzZnNS6xIHtFoNF6CweAbpheyLOfo3+ALfrSuzJ1F8EsAAAAASUVORK5CYII=',
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
                mylocation: {
                    lat: 9.7941185,
                    lng: 118.7322599
                },
            }
        },
        props: {
            storeid: {
                type: String
            }
        },
        computed: {
            allowedPublish() {
                if (this.logoError || this.backDropError || this.menuError || this.rateError || this.locationError) return false
                else return true
            },
            formTitle() {
                return this.editedIndex === -1 ? 'New Branch' : 'Edit Store Info'
            }
        },
        watch: {
            serverData(){
              this.loaded = false
                this.data = Object.assign({}, this.serverData.d)
              
                this.getDataInfo()
            },
            backDropError() {
                console.log('Backdrop Error', this.backDropError)
            },
            imagediag() {
                if (this.imagediag)
                {
                    this.$nextTick(() => {
                        this.$refs.imageSelector.resetMultipleSelection()
                    })
                }
                this.actionSheet = false
            },
            editedItem() {
                if (!this.editedItem.hasOwnProperty('delivery_time')) {
                    this.editedItem.delivery_time = {
                        open: '09:00:00',
                        close: '17:00:00'
                    }
                }
                if (!this.editedItem.hasOwnProperty('rates')) {
                    this.editedItem.rates = {
                        cr: 0,
                        sc: 0
                    }
                }
                 if (!this.editedItem.hasOwnProperty('flags')) {
                  this.editedItem.flags = []
                }
            },
            coordiag(val) {
                this.actionSheet = false
                if (val) {
                    if (this.isMapLoaded) {
                        this.$nextTick(() => {
                            this.$refs.gMap.map.setCenter({
                                lat: this.editedItem.coordinates.latitude,
                                lng: this.editedItem.coordinates.longitude
                            })
                        })
                    }
                }
            },
            isMapLoaded(val) {
                this.actionSheet = false
                if (val) {
                    this.$nextTick(() => {
                        this.$refs.gMap.map.setCenter({
                            lat: this.editedItem.coordinates.latitude,
                            lng: this.editedItem.coordinates.longitude
                        })
                    })
                }
            },
            dialog(val) {
                this.actionSheet = false
                val || this.close()
            },
        },
        mounted() {
              let stores = this.$fireStoreObj().collection('merchant').doc(this.storeid)
              this.$bind('serverData', stores)
        },
        methods: {
            getDataInfo() {
                if (this.data) {
                    this.editedIndex = 0
                    this.editedItem = Object.assign({}, this.data)
                   
                    if (this.data.backdrop === '' || !this.data.backdrop) this.backDropError = true
                    if (this.data.logo === '' || !this.data.logo) this.logoError = true
                    if (!this.data.menu || this.data.menu.length === 0) this.menuError = true
                    if (this.data.coordinates.latitude == 0 || this.data.coordinates.longitude == 0) this.locationError = true
                    if (this.data.rates.cr < 0) this.rateError = true
                          this. loaded = true
                }
            },
            publisher() {
                if (!this.editedItem.draft) {
                    this.editedIndex = 0;
                    this.editedItem.draft = !this.editedItem.draft
                    this.save()
                } else
                {
                    this.publishChecklist = true
                }
            },
            publishStore() {
                this.editedIndex = 0;
                this.editedItem.draft = !this.editedItem.draft
                this.save()
                this.publishChecklist = false
            },
            createBranch() {
                this.editedIndex = -1
                this.editedItem.draft = true
                this.dialog = true
            },
            nextPage() {
                if (this.page + 1 <= this.numberOfPages) this.page += 1
            },
            formerPage() {
                if (this.page - 1 >= 1) this.page -= 1
            },
            updateItemsPerPage(number) {
                this.itemsPerPage = number
            },
            deleteItem() {
                this.$fireStore.collection('foods').where('owner', 'array-contains', this.storeid).get().then(d => {
                    d.docs.forEach(doc => {
                        this.$fireStore.collection('foods').doc(doc.id).update({
                            owner: this.$fireStoreObj.FieldValue.arrayRemove(this.storeid)
                        })
                    })
                })
                this.$fireStore.collection('merchant').doc(this.storeid).update({
                    'd.flags':['Request for Deletion'],
                    'd.draft': true
                })
                this.close()
            },
            editItem(item) {
                this.editedItem = 0
                    //this.editedIndex = this.merchants.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },
            setCenter() {
                // this.$refs.gMap.map.setCenter({
                //                   lat: this.editedItem.coordinates.latitude,
                //                   lng: this.editedItem.coordinates.longitude
                //               })
            },
            centerChange() {
                const coordinates = this.$refs.gMap.map.getCenter()
                this.$refs.gmapmarker.marker.setPosition({
                    lat: coordinates.lat(),
                    lng: coordinates.lng()
                })
            },
            afterComplete(upload) {
                const imageName = uuid.v1()
                this.isLoading = true
                try {
                    // save image
                    const file = upload
                    const ref = this.$fireStorage.ref(this.storeid + '/' + imageName + '-' + file.name)
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
                    this.$fireStorage.ref(a.id).delete().then(() => {
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
                this.$fireStorage.ref(this.storeid).listAll().then((res) => {
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
            close() {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                    this.coordiag = false
                    this.actionSheet = false
                })
            },
            save() {
                const firestore = this.$fireStoreObj()
                const geofirestore = new GeoFirestore(firestore)
                const geocollection = geofirestore.collection('merchant')
                if (this.editedIndex > -1) {
                    var data = Object.assign({}, this.editedItem)
                    var url = data.business_name.replace(' ', '_').replace("'", '').toLowerCase() + '_' + data.branch.replace(' ', '_').replace("'", '').toLowerCase()
                    data.url = url.replace(/ /g, '_').replace(/'/g, '')
                    const coordinates = data.coordinates
                    data.coordinates = new this.$fireStoreObj.GeoPoint(coordinates.latitude, coordinates.longitude)
                    delete data.menu
                    geocollection.doc(this.storeid).update(data)
                } else {
                    var data = this.editedItem
                    var coord = {
                        latitude: 0,
                        longitude: 0
                    }
                    var url = data.business_name.replace(' ', '_').replace("'", '').toLowerCase() + '_' + data.branch.replace(' ', '_').replace("'", '').toLowerCase()
                    this.editedItem.url = url.replace(/ /g, '_').replace(/'/, '')
                    this.editedItem.coordinates = new this.$fireStoreObj.GeoPoint(coord.latitude, coord.longitude)
                    const storePayload = Object.assign({}, this.editedItem)
                    if (storePayload.hasOwnProperty('id')) {
                        storePayload.main = storePayload.id
                        delete storePayload.id
                    }
                    geocollection.add(storePayload).then((store) => {
                        if (storePayload.hasOwnProperty('main')) {
                            const storeid = store.id
                            firestore.collection('foods').where('owner', 'array-contains', storePayload.main).get().then(snap => {
                                snap.docs.forEach(food => {
                                    firestore.collection('foods').doc(food.id).update({
                                        owner: this.$fireStoreObj.FieldValue.arrayUnion(storeid)
                                    })
                                })
                            })
                        }
                    })
                }
                this.close()
            },
            updateMapLocation() {
                const firestore = this.$fireStoreObj()
                const geofirestore = new GeoFirestore(firestore)
                const geocollection = geofirestore.collection('merchant')
                const data = Object.assign({}, this.editedItem)
                const coordinates = this.$refs.gMap.map.getCenter()
                data.coordinates = new this.$fireStoreObj.GeoPoint(coordinates.lat(), coordinates.lng())
                geocollection.doc(this.storeid).update(data)
                this.close()
            },
            showMerchant() {
                var area = this.current_area
                this.isLoading = true
                this.$store.dispatch('map/getStoreByArea', {
                    lat: area.coordinates.latitude,
                    lng: area.coordinates.longitude
                }).then(() => {
                    this.isLoading = false
                })
            }
        },
};
</script>
<style scoped>
      .onsale {
    padding-right: 20px;
    padding-left: 20px;
    color: white !important;
    background-color: #3f51b5;
    font-size: 12px !important;
    bottom: 0;
    right: 0;
    position: absolute;
    margin-bottom: 10px;
    margin-right: 10px;
  }
  
  .transtype {
      padding-right: 20px;
      padding-left: 20px;
      color: white !important;
      background-color: #3f51b5;
      font-size: 12px !important;
      bottom: 0;
      right: 0;
      position: absolute;
      margin-bottom: 10px;
      margin-right: 10px;
    }
    
    .v-card__title {
        font-size: 14px;
      }
</style>
