<template>
    <v-flex xs12 md4 sm6 lg3 class="pa-2">
        <v-lazy v-model="isActive" :options="{threshold: .6}" min-height="200" transition="fade-transition">
            <v-card width="100%" @click.stop="actionSheet= true">
                <v-img :src="data.backdrop" height="200px" min-width="100%" width="100%">
                    <span class="bestseller">{{data.storeType}}</span>
                </v-img>
                <v-card-actions>
                    <v-list-item three-line dense>
                        <v-list-item-avatar color="grey darken-3">
                            <v-img class="elevation-6" :src="data.logo"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>{{ data.business_name }}</v-list-item-title>
                            <v-list-item-subtitle>
                                <small>{{ data.branch }} branch</small>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-list-item-action-text>
                                <!--  <span class="caption grey--text">CR: </span>
                                <span class="red--text subtitle-2">{{data.rates.cr }} %</span> -->
                            </v-list-item-action-text>
                            <!-- <v-chip dense :color="data.draft ? 'error' : 'success'" small> {{ data.draft ? 'Close' : 'Live' }} </v-chip> --></v-list-item-action>
                    </v-list-item>
                </v-card-actions>
            </v-card>
        </v-lazy>
        <v-bottom-sheet inset v-model="actionSheet">
            <v-list single-line dense>
                <v-subheader>Manage {{editedItem.business_name}} {{editedItem.branch}}</v-subheader>
                <v-list-item-group>
                    <v-list-item @click="mode='store', selectedImages=[], editItem(editedItem)">
                        <v-list-item-icon>
                            <v-icon small color="blue"> mdi-pencil </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Edit Shop</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                <v-list-item-group>
                    <v-list-item @click.stop="mode='cover', getServices(), servicesDiag = true">
                        <v-list-item-icon>
                            <v-icon small color="blue"> mdi-food </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Manage Services</v-list-item-title>
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
                    <v-list-item @click="coordiag = true">
                        <v-list-item-icon>
                            <v-icon small color="indigo"> mdi-map-marker </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Shop Location</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                <v-list-item-group>
                    <v-list-item @click.stop="deleteDiag = true">
                        <v-list-item-icon>
                            <v-icon small color="red"> mdi-delete </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Delete Shop</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-bottom-sheet>
        <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="title font-weight-light">Update Shop Information</span>
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
                            <v-select :items="storeType" v-model="editedItem.storeType" label="Kind of Store"> </v-select>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
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
                    <template v-if="mode==='store'">
                        <v-btn color="blue darken-1" text @click="deleteSelected"> Delete </v-btn>
                        <v-btn color="blue darken-1" text @click="setAsLogo"> Set as Logo </v-btn>
                        <v-btn color="blue darken-1" text @click="setAsBackdrop"> Set as Backdrop </v-btn>
                    </template>
                    <template v-else>
                        <v-btn color="blue darken-1" text @click="imagediag = false">Cancel</v-btn>
                        <v-btn color="blue darken-1" text @click="setAsImage">Set as Image</v-btn>
                    </template>
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
        <v-dialog v-model="deleteDiag" max-width="290">
            <v-card>
                <v-card-title class="headline">Confirm deletion</v-card-title>
                <v-card-text>Are you sure you want to delete this {{editedItem.business_name}} - {{editedItem.branch}}?
                    <v-alert type="error">All encoded services/menu will be deleted.</v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="deleteDiag = false">Close</v-btn>
                    <v-btn color="green darken-1" text @click="deleteItem(), deleteDiag = false">Ok</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="foodDiag" max-width="500">
            <v-card>
                <v-card-title>
                    <span class="headline">{{currentServiceId===''? 'Add Service' : 'Update Service'}}</span>
                </v-card-title>
                <v-card-text>
                    <v-img min-width="200px" max-height="200px" min-height="50px" class="elevation-6" :src="serviceData.img" @click.stop="generareFileList" contain />
                    <v-layout wrap>
                        <v-flex xs12 md12 sm12>
                            <v-text-field label="Name" v-model="serviceData.name" /> </v-flex>
                        <v-flex xs6 md6 sm6>
                            <v-text-field type="Number" label="Rate" v-model="serviceData.price" /> </v-flex>
                        <v-flex xs6 md6 sm6>
                            <v-text-field label="Unit" v-model="serviceData.unit" /> </v-flex>
                        <v-flex xs12>
                            <wysiwyg placeholder="Description" v-model="serviceData.desc" label="Description"> </wysiwyg>
                        </v-flex>
                    </v-layout>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click.stop="foodDiag=false">Cancel</v-btn>
                        <v-btn text @click.stop="deleteService" v-if="currentServiceId!=''">Delete</v-btn>
                        <v-btn text @click.stop="saveService()">{{currentServiceId===''? 'Save' : 'Update'}}</v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="servicesDiag" persistent fullscreen>
            <v-card width="100%" height="100%">
                <v-app-bar app fixed dark color="#00aff0">
                    <v-btn icon @click.stop="servicesDiag=false">
                        <v-icon> mdi-arrow-left-bold</v-icon>
                    </v-btn>
                    <v-toolbar-title>Manage Services</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click.stop="serviceData = Object.assign({}, defaultService), foodDiag=true">
                        <v-icon> mdi-plus</v-icon>
                    </v-btn>
                </v-app-bar>
                <v-card-text>
                    <v-container fluid>
                        <v-content>
                            <v-card flat>
                                <v-layout wrap align-center>
                                    <v-flex v-for="item in services" :key="item.name + '_' + item" xs12 md4 sm4 lg4 class="pa-1" @click.stop="serviceData = Object.assign({},item), currentServiceId = item.id, foodDiag = true">
                                        <v-lazy v-model="isActive" :options="{threshold: .6}" transition="fade-transition">
                                            <service-card :item="item"></service-card>
                                        </v-lazy>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-content>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script>
const uuid = require('uuid')
import ServiceCard from '~/components/ServiceCard.vue'
export default {
    components: {
        ServiceCard
    },
    data() {
        return {
            services: [],
            serviceData: {},
            coordiag: false,
            foodDiag: false,
            servicesDiag: false,
            deleteDiag: false,
            imagediag: false,
            isActive: false,
            dialog: false,
            selectedImages: [],
            storeType: ['Laundry Shop', 'Massage Spa', 'Beauty Salon', 'Restaurant', 'Food Takeout Business', 'Clinic', 'Law Office'],
            mode: 'store',
            actionSheet: false,
            mylocation: {
                lat: 9.7941185,
                lng: 118.7322599
            },
            defaultService: {
                img: '',
                name: '',
                price: 0,
                unit: '',
                desc: '',
            },
            editedItem: {
                currency: 'PHP',
                business_name: '',
                backdrop: '',
                branch: '',
                rates: {
                    sc: 0,
                    cr: 0
                },
                draft: true,
                url: '',
            },
            currentServiceId: '',
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
            images: [],
            selectedmarker: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHUSURBVHgB5VU7SwNBEJ7LmZBgMC+UdKKx0MZCG2srwcbCB2glpFDQ3to/IegvSAIWPrBJIySlipUKKqYLaHJ3iWIelzu/DTk8j71H7MQPltmZnflmZ3b3juivQ3BzCIfDI4FAYBvTRV3XR7tBglCCOIP9oFwuv/46QSwWWwfZIaaDNi7vGOlqtZqhfhPE4/EViAy5V6ljE8uVSuXYc4JkMjncarUeMR0ib5Db7fZEvV6vWBd8PG+Q73LIFYyj3lAsa1G/37/D4+JWgPbcQkybd9jpdGYVRXlmSiQSSYmieMWmhgMuwI0kSTPkpQJgzKJnDfJuKYryBJH7sVNBSPGI7BKoFl3n+GguMY4JHiz6GtoybiisRczmEtPFAM+Ifl6i5DmTKYqeX+Nssj19lUz9N2J4XNxDTiQSkwi4oz6ADU3hLdxb7dwW9RyL5B0FHrltAgZUsEce4eRrmwB3ugCRJ3fk4VvsOwEDHtcWxKeDy4emaWmHdRKdFpvNphQKhdhFmOet42D3sftTJw7X/wHgw/U8h1ywkJ/gYJeI/wi/g8kdmqqqG5Alk62Er+emG7nXBFSr1aroNSNknwOVzZnNS6xIHtFoNF6CweAbpheyLOfo3+ALfrSuzJ1F8EsAAAAASUVORK5CYII=',
        }
    },
    props: {
        data: Object
    },
    mounted() {
        this.editedItem = Object.assign({}, this.data)
        console.log(this.editedItem)
    },
    computed: {
        currencies() {
            return this.$store.getters['store/getCurrencies']
        },
    },
    watch: {
        services(val) {
            console.log(val)
        },
        imagediag(val){
        	this.selectedImages=[]
        },
        isMapLoaded(val) {
            this.actionSheet = false
            if (val) {
                this.$nextTick(() => {
                    this.$refs.gMap.map.setCenter({
                        lat: this.editedItem.location.latitude,
                        lng: this.editedItem.location.longitude
                    })
                })
            }
        }
    },
    methods: {
        deleteService() {
            this.$fire.firestore.collection('shops').doc(this.data.id).collection('services').doc(this.currentServiceId).delete().then(() => {
                this.foodDiag = false
                this.currentServiceId = ''
            })
        },
        saveService() {
            if (this.currentServiceId === '') {
                this.$fire.firestore.collection('shops').doc(this.data.id).collection('services').add(this.serviceData).then(() => {
                    this.foodDiag = false
                    this.currentServiceId = ''
                })
            }
            else {
                this.$fire.firestore.collection('shops').doc(this.data.id).collection('services').doc(this.currentServiceId).update(this.serviceData).then(() => {
                    this.foodDiag = false
                    this.currentServiceId = ''
                })
            }
        },
        centerChange() {
            const coordinates = this.$refs.gMap.map.getCenter()
            this.$refs.gmapmarker.marker.setPosition({
                lat: coordinates.lat(),
                lng: coordinates.lng()
            })
        },
        getServices() {
            this.$bind('services', this.$fire.firestore.collection('shops').doc(this.data.id).collection('services'))
        },
        deleteItem() {
            this.$fire.firestore.collection('shops').doc(this.data.id).delete()
        },
        editItem(item) {
            this.editedItem = 0
                //this.editedIndex = this.merchants.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        save() {
            var data = Object.assign({}, this.editedItem)
            var url = data.business_name.replace(' ', '_').replace("'", '').toLowerCase() + '_' + data.branch.replace(' ', '_').replace("'", '').toLowerCase()
            data.url = url.replace(/ /g, '_').replace(/'/g, '')
            console.log(data)
            this.$fire.firestore.collection('shops').doc(this.data.id).update(data).then(() => {
                this.close();
            })
        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.data)
                this.editedIndex = -1
                this.coordiag = false
                this.actionSheet = false
            })
        },
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
        setAsImage() {
            this.serviceData.img = this.selectedImages[0].src
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
        updateMapLocation() {
            const data = Object.assign({}, this.editedItem)
            const coordinates = this.$refs.gMap.map.getCenter()
            data.location = new this.$fireModule.firestore.GeoPoint(coordinates.lat(), coordinates.lng())
            this.$fire.firestore.collection('shops').doc(this.data.id).update(data)
            this.close()
        },
    }
};
</script>
