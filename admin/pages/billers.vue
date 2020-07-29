<template>
    <v-layout>
        <v-container fluid>
            <v-tabs v-model="tab" color="blue" center-active background-color="transparent" grow>
                <v-tab v-for="item in areas" :key="item.id" dense> {{ item.name }} </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
                <v-tab-item v-for="item in areas" :key="item.id">
                    <v-card color="basil" flat>
                        <v-tabs v-model="areatab" center-active background-color="transparent" color="basil" grow>
                            <v-tab v-for="area in item.areas" :key="area.id" dense> {{ area.name }} </v-tab>
                        </v-tabs>
                        <v-tabs-items v-model="areatab">
                            <v-tab-item v-for="area in item.areas" :key="area.id">
                                <v-data-iterator :items="merchants" :search="search" :items-per-page.sync="itemsPerPage" hide-default-footer>
                                    <template v-slot:header>
                                        <v-toolbar dense color="success" class="mb-1">
                                            <v-text-field solo dense v-model="search" prepend-inner-icon="mdi-magnify" clearable hide-details label="Search"></v-text-field>
                                            <v-btn icon color="blue" @click.stop="showMerchant()">
                                                <v-icon>mdi-refresh</v-icon>
                                            </v-btn>
                                            <v-btn icon color="blue" @click.stop="dialog =true">
                                                <v-icon>mdi-plus</v-icon>
                                            </v-btn>
                                        </v-toolbar>
                                    </template>
                                    <template v-slot:default="props">
                                        <v-card flat style="min-height: 85vh; overflow:auto">
                                            <v-list dense>
                                                <v-list-item-group v-for="store in props.items" :key="store.id">
                                                    <v-list-item @click.stop="editedIndex=0,editedItem = store, actionSheet = true">
                                                        <v-list-item-avatar>
                                                            <v-img class="elevation-6" :src="store.logo"></v-img>
                                                        </v-list-item-avatar>
                                                        <v-list-item-content>
                                                            <v-list-item-title>{{ store.business_name }}</v-list-item-title>
                                                            <v-list-item-subtitle>
                                                                <small>{{ store.branch }}</small>
                                                            </v-list-item-subtitle>
                                                        </v-list-item-content>
                                                        <v-list-item-icon>
                                                            <v-chip :color="store.draft ? 'error' : 'success'" small> {{ store.draft ? 'Draft' : 'Live' }} </v-chip>
                                                        </v-list-item-icon>
                                                    </v-list-item>
                                                </v-list-item-group>
                                            </v-list>
                                        </v-card>
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
                                            <span class="mr-2 grey--text"> {{ merchants.length }}</span>
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
                            </v-tab-item>
                        </v-tabs-items>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-container>
        <v-dialog v-model="dialog" persistent max-width="500px" fullscreen>
            <v-card class="mx-auto" max-width="400">
                <v-card-title>
                    <span class="title font-weight-light">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <v-img v-if="editedIndex>-1" class="elevation-6" min-height="100px" width="100%" :src="editedItem.backdrop" @click.stop="generareFileList">
                        <v-avatar style="position:absolute; bottom:0;">
                            <v-img class="elevation-6" :src="editedItem.logo" @click.stop="generareFileList" /> </v-list-item-avatar>
                        </v-avatar>
                    </v-img>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field v-model="editedItem.business_name" label="Business Name" /> </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.branch" label="Branch" /> </v-col>
                        <v-col cols="6" xs="6" sm="6" md="4">
                            <v-text-field v-model="editedItem.delivery_time.open" type="time" label="Open" /> </v-col>
                        <v-col cols="6" xs="6" sm="6" md="4">
                            <v-text-field v-model="editedItem.delivery_time.close" type="time" label="Close" /> </v-col>
                        <v-col cols="4" xs="4" sm="4" md="4">
                            <v-text-field v-model.number="editedItem.rates.cr" type="number" label="CR" /> </v-col>
                        <v-col cols="4" xs="4" sm="4" md="4">
                            <v-text-field v-model.number="editedItem.rates.sc" type="number" label="SC" /> </v-col>
                        <v-col cols="4" xs="4" sm="4" md="4">
                            <v-text-field v-model.number="editedItem.rates.sf" type="number" label="SF" /> </v-col>
                    </v-row>
                    <v-layout wrap>
                        <v-flex xs12 sm12 md12>
                            <v-autocomplete v-model="editedItem.tags" dense text :items="tags" filled chips color="blue-grey lighten-2" label="Tags" multiple>
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
                    <v-toolbar dense width="100%" max-width="100%" class="shopresponsive">
                        <v-spacer />
                        <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
                        <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                    </v-toolbar>
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
            <v-dialog v-model="imagediag" max-width="400px">
                <v-card>
                    <v-card-text>
                        <v-container>
                            <vuedropzone id="customdropzone" ref="imgDropZone" :options="dropzoneOptions" @vdropzone-complete="afterComplete" />
                            <vue-select-image :data-images="images" :is-multiple="true" @onselectmultipleimage="onSelectMultipleImage" /> </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="blue darken-1" text @click="deleteSelected"> Delete </v-btn>
                        <v-btn color="blue darken-1" text @click="setAsLogo"> Set as Logo </v-btn>
                        <v-btn color="blue darken-1" text @click="setAsBackdrop"> Set as Backdrop </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
        <v-bottom-sheet inset v-model="actionSheet">
            <v-list single-line dense>
                <v-subheader>Manage {{editedItem.business_name}} {{editedItem.branch}}</v-subheader>
                <v-list-item-group>
                    <v-list-item @click="editedIndex=0, editItem(editedItem)">
                        <v-list-item-icon>
                            <v-icon small color="blue"> mdi-pencil </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Edit Biller</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                <v-list-item-group>
                    <v-list-item @click="editedIndex = 0, editedItem.draft = !editedItem.draft, save()">
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
                            <v-list-item-title>Delete Biller</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-bottom-sheet>
        <v-row justify="center">
            <v-dialog v-model="deleteDiag" max-width="290">
                <v-card>
                    <v-card-title class="headline">Confirm deletion</v-card-title>
                    <v-card-text>Are you sure you want to delete this {{editedItem.business_name}} - {{editedItem.branch}}?</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="deleteDiag = false">Close</v-btn>
                        <v-btn color="green darken-1" text @click="deleteItem(editedItem.id), deleteDiag = false">Ok</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-layout>
</template>
<script>
import {
    GeoFirestore
} from 'geofirestore'
const uuid = require('uuid')
export default {
    layout: 'default',
    data() {
        return {
            fab: null,
            itemsPerPageArray: [20, 50, 100],
            search: '',
            filter: {},
            flag:'All',
            flags:['All','Draft','Live'],
            sortDesc: false,
            page: 1,
            itemsPerPage: 20,
            sortBy: 'name',
            isFetch: false,
            deleteDiag: false,
            actionSheet: false,
            isMapLoaded: false,
            selectedImages: [],
            selectedmarker: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHUSURBVHgB5VU7SwNBEJ7LmZBgMC+UdKKx0MZCG2srwcbCB2glpFDQ3to/IegvSAIWPrBJIySlipUKKqYLaHJ3iWIelzu/DTk8j71H7MQPltmZnflmZ3b3juivQ3BzCIfDI4FAYBvTRV3XR7tBglCCOIP9oFwuv/46QSwWWwfZIaaDNi7vGOlqtZqhfhPE4/EViAy5V6ljE8uVSuXYc4JkMjncarUeMR0ib5Db7fZEvV6vWBd8PG+Q73LIFYyj3lAsa1G/37/D4+JWgPbcQkybd9jpdGYVRXlmSiQSSYmieMWmhgMuwI0kSTPkpQJgzKJnDfJuKYryBJH7sVNBSPGI7BKoFl3n+GguMY4JHiz6GtoybiisRczmEtPFAM+Ifl6i5DmTKYqeX+Nssj19lUz9N2J4XNxDTiQSkwi4oz6ADU3hLdxb7dwW9RyL5B0FHrltAgZUsEce4eRrmwB3ugCRJ3fk4VvsOwEDHtcWxKeDy4emaWmHdRKdFpvNphQKhdhFmOet42D3sftTJw7X/wHgw/U8h1ywkJ/gYJeI/wi/g8kdmqqqG5Alk62Er+emG7nXBFSr1aroNSNknwOVzZnNS6xIHtFoNF6CweAbpheyLOfo3+ALfrSuzJ1F8EsAAAAASUVORK5CYII=',
            editedIndex: -1,
            imagediag: false,
            coordiag: false,
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
            editedItem: {
                business_name: '',
                backdrop: '',
                branch: '',
                rates: {
                    sc: 0,
                    cr: 0,
                    sf: 0
                },
                draft: true,
                url: '',
                delivery_time: {
                    open: 900,
                    close: 1700
                }
            },
            defaultItem: {
                business_name: '',
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
            dialog: false,
            db_areas: [],
            tab: null,
            areatab: null,
            isLoading: false,
            mylocation: {
                lat: 9.7941185,
                lng: 118.7322599
            },
            foods: [],
        }
    },
    computed: {
        tags() {
            return ['Electric', 'Water', 'Telcos', 'Loans', 'Motorcycle', 'Insurane', 'Real Estate']
        },
        numberOfPages() {
            return Math.ceil(this.merchants.length / this.itemsPerPage)
        },
        formTitle() {
            return this.editedIndex === -1 ? 'New Biller' : 'Edit Biller Info'
        },
        current_area() {
            return this.$store.getters['admin/getCurrentArea']
        },
        merchants() {
            if (this.flag === 'All') return this.$store.getters['map/getBillersAsc']
            else if (this.flag === 'Draft') return this.$store.getters['map/getBillersAsc'].filter(x => x.draft === true)
            else return this.$store.getters['map/getBillersAsc'].filter(x => x.draft === false)
        },
        areas() {
            var areas = []
            var values = []
            this.db_areas.forEach(area => {
                areas.push(area.d.country)
                var a = Object.assign({}, area.d)
                a.id = area.id
                values.push(a)
            })
            const result = [];
            const map = new Map();
            for (const item of areas) {
                if (!map.has(item.code)) {
                    map.set(item.code, true); // set any value to Map
                    result.push({
                        code: item.code,
                        name: item.name,
                        areas: []
                    });
                }
            }
            result.forEach((country, index) => {
                values.forEach(area => {
                    if (country.code == area.country.code) result[index].areas.push(area)
                })
                country.areas = country.areas.sort((a, b) => {
                    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                })
            })
            console.log(result)
            return result
        }
    },
    watch: {
        editedItem() {
            if (!this.editedItem.hasOwnProperty('delivery_time')) {
                console.log('adding property')
                this.editedItem.delivery_time = {
                    open: '09:00:00',
                    close: '17:00:00'
                }
            }
        },
        coordiag(val) {
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
            val || this.close()
        },
        merchants(val) {
            if (val.length > 0) this.isLoading = false
        },
        areatab() {
            var area = this.areas[this.tab].areas[this.areatab]
            this.$store.commit('admin/setCurrentArea', area)
        }
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
        deleteItem(id) {
            // var ref = this.$fireStore.collection('billers').doc(id)
            // this.$fireStore.collection('foods').where('owner', '==', ref).get().then(d => {
            //     d.docs.forEach(doc => {
            //         this.$fireStore.collection('foods').doc(doc.id).delete()
            //     })
            // })
            this.$fireStore.collection('billers').doc(id).delete()
            this.close()
        },
        editItem(item) {
            this.editedItem = 0
                //this.editedIndex = this.merchants.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.editedItem.id = item.id
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
                const ref = this.$fireStorage.ref(this.editedItem.id + '/' + imageName + '-' + file.name)
                ref.put(file).then((snap) => {
                    console.log(snap.ref.fullPath)
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
            this.$fireStorage.ref(this.editedItem.id).listAll().then((res) => {
                res.prefixes.forEach((folderRef) => {
                    console.log(folderRef)
                })
                res.items.forEach((itemRef) => {
                    console.log(itemRef.fullPath)
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
            const geocollection = geofirestore.collection('billers')
            if (this.editedIndex > -1) {
                var data = Object.assign({}, this.editedItem)
                var url = data.business_name.replace(' ', '_').replace("'", '').toLowerCase() + '_' + data.branch.replace(' ', '_').replace("'", '').toLowerCase()
                data.url = url.replace(' ', '_').replace("'", '')
                const coordinates = data.coordinates
                data.coordinates = new this.$fireStoreObj.GeoPoint(coordinates.latitude, coordinates.longitude)
                delete data.menu
                geocollection.doc(this.editedItem.id).update(data)
            } else {
                var data = this.editedItem
                var coord = this.areas[this.tab].areas[this.areatab].coordinates
                var url = data.business_name.replace(' ', '_').replace("'", '').toLowerCase() + '_' + data.branch.replace(' ', '_').replace("'", '').toLowerCase()
                this.editedItem.url = url.replace(' ', '_').replace("'", '')
                this.editedItem.coordinates = new this.$fireStoreObj.GeoPoint(coord.latitude, coord.longitude)
                geocollection.add(this.editedItem)
            }
            this.close()
        },
        updateMapLocation() {
            console.log('updated map location', this.editedItem.id)
            const firestore = this.$fireStoreObj()
            const geofirestore = new GeoFirestore(firestore)
            const geocollection = geofirestore.collection('billers')
            const data = Object.assign({}, this.editedItem.d)
            const coordinates = this.$refs.gMap.map.getCenter()
            data.coordinates = new this.$fireStoreObj.GeoPoint(coordinates.lat(), coordinates.lng())
            geocollection.doc(this.editedItem.id).update(data)
            this.close()
        },
        showMerchant() {
            var area = this.current_area
            this.isLoading = true
            this.$store.dispatch('map/getBillersByArea', {
                lat: area.coordinates.latitude,
                lng: area.coordinates.longitude
            }).then(() => {
                this.isLoading = false
            })
        },
    },
    mounted() {
        const firestore = this.$fireStoreObj()
        var q = firestore.collection('areas')
        this.$bind('db_areas', q)
    }
};
</script>
<style scoped>
          .fabicon {
    position: fixed;
    bottom: 15%;
    right: 5%;
  }
  
  .mapcontainer,
  .GMap,
  .GMap__Wrapper {
      height: auto !important;
      width: 100% !important;
    }
    
    .bestseller {
        float: left;
        padding-right: 20px;
        padding-left: 20px;
        color: white !important;
        background-color: #f44336;
        font-size: 16px !important;
        margin-top: 10px;
        margin-left: 10px;
        text-align: center;
        min-width: 50%;
      }
      
      @media screen and (min-width: 320px) and (max-width: 768px) {
          *>>>.mapcontainer,
          *>>>.GMap,
          *>>>.GMap__Wrapper {
              height: 70vw !important;
              width: 100vw !important;
              max-width: 100% !important;
            }
          }
</style>
