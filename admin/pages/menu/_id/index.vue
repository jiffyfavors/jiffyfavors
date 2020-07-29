<template>
    <v-card flat id="create" class="overflow-hidden">
        <v-app-bar absolute color="#43a047" dark fixed app>
            <v-btn icon dark @click.stop="$router.go(-1)">
                <v-icon> mdi-arrow-left-bold</v-icon>
            </v-btn>
            <v-toolbar-title>{{ merchant.business_name }} - {{ merchant.branch }} Menu</v-toolbar-title>
            <template v-slot:extension>
                <v-tabs v-model="tab" background-color="transparent" color="basil" centered show-arrows>
                    <v-tab v-for="cat in categories" dense :key="cat.name" @click.stop="current_cat = cat"> {{ cat.name }} </v-tab>
                </v-tabs>
            </template>
        </v-app-bar>
        <v-sheet class="overflow-y-auto mb-10" min-height="100vh" max-height="100vh">
            <v-content>
                <v-tabs-items v-model="tab">
                    <v-tab-item v-if="categories.length>0" :key="categories[0].name">
                        <v-card>
                            <v-card-title> Drafts
                                <v-spacer></v-spacer>
                                <v-select v-model="selectedCat" :items="categories" label="Category" item-value="name" item-text="name" multiple>
                                    <template v-slot:selection="{ item, index }">
                                        <v-chip small dense close @click:close="selectedCat.splice(index,1)" class="white--text" color="blue">
                                            <span>{{ item.name }}</span>
                                        </v-chip>
                                    </template>
                                </v-select>
                            </v-card-title>
                            <v-card-text>
                                <v-data-table v-model="selected" :headers="headers" :items="getFood(categories[0])" item-key="id" show-select class="elevation-1">
                                    <template v-slot:item.actions="{ item }">
                                        <v-icon @click.stop="editedFoodIndex =0, _editFoodItem(item)" color="blue">mdi-pencil</v-icon>
                                    </template>
                                </v-data-table>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item v-for="(cat,index) in categories" :key="cat.name" v-if="index>0">
                        <v-layout wrap align-center>
                            <v-flex xs12 md4 sm4 lg4 class="pa-1" v-for="fooditem in getFood(cat)" :key="fooditem.id">
                                <v-card class="mx-auto" max-width="100%" outlined>
                                    <v-list-item three-line dense>
                                        <v-list-item-content>
                                            <h3>{{ fooditem.name }}</h3>
                                            <small>
                                                <p style="font-style:italic" v-html="fooditem.desc"></p>
                                            </small>
                                            <div class="pl-2 subtitle-1 red--text">
                                                <span class="caption grey--text"> From</span>
                                                <div class="ml-2">
                                                    <strong>{{ fooditem.base_price|toPHP }}</strong>
                                                </div>
                                            </div>
                                        </v-list-item-content>
                                        <v-list-item-avatar tile size="100">
                                            <v-img @click.stop="editedFoodIndex =0, editFoodItem = Object.assign({}, fooditem), editFoodItem.id = fooditem.id, applyImg = true, imagediag = true" :src="fooditem.img"></v-img>
                                        </v-list-item-avatar>
                                    </v-list-item>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn icon>
                                            <v-icon @click.stop="deleteFoodItem(fooditem)" color="red">mdi-delete</v-icon>
                                        </v-btn>
                                        <v-btn icon>
                                            <v-icon @click.stop="editedFoodIndex =-1, _createDup(fooditem)" color="blue">mdi-content-copy</v-icon>
                                        </v-btn>
                                        <v-btn icon>
                                            <v-icon @click.stop="editedFoodIndex =0, _editFoodItem(fooditem)" color="blue">mdi-pencil</v-icon>
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-tab-item>
                </v-tabs-items>
            </v-content>
        </v-sheet>
        <v-speed-dial class="fabicon" v-model="fab" bottom right direction="top" transition="slide-y-reverse-transition">
            <template v-slot:activator>
                <v-btn v-model="fab" color="blue darken-2" dark fab>
                    <v-icon v-if="fab">mdi-close</v-icon>
                    <v-icon v-else>mdi-plus</v-icon>
                </v-btn>
            </template>
            <v-btn fab dark @click.stop="editItem(current_cat)" small color="green">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn fab dark small @click.stop="dialog =true" color="yellow">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn fab dark @click.stop="optionapply = true" small color="orange">
                <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn fab dark small @click.stop="fooddialog =true" color="indigo">
                <v-icon>mdi-food</v-icon>
            </v-btn>
            <v-btn fab dark small @click.stop="deleteItem(current_cat)" color="red">
                <v-icon>mdi-delete</v-icon>
            </v-btn>
        </v-speed-dial>
        <v-dialog v-model="dialog" :fullscreen="$isFullscreen()" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field v-model="editedItem.name" label="Category Name" /> </v-col>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="close()">Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="save()">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="copydiag" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Duplicator</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-layout wrap>
                            <v-flex xs8 sm8>
                                <v-text-field v-model="editFoodItem.name" label="Food Name" /> </v-flex>
                            <v-flex xs4 sm4>
                                <v-text-field type="number" v-model.number="editFoodItem.base_price" label="Base Price" /> </v-flex>
                            <v-flex xs12 sm12>
                                <wysiwyg v-model="editFoodItem.desc" placehold er="Description" label="Description"> </wysiwyg>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="saveFood"> Duplicate </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-row justify="center">
            <v-dialog v-model="imagediag" max-width="400px">
                <v-card>
                    <v-card-text>
                        <v-container>
                            <vuedropzone id="customdropzone" ref="imgDropZone" :options="dropzoneOptions" @vdropzone-complete="afterComplete" />
                            <vue-select-image ref="vSelect" :data-images="images" :is-multiple="true" @onselectmultipleimage="onSelectMultipleImage" /> </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="blue darken-1" text @click="deleteSelected"> Delete </v-btn>
                        <v-btn color="blue darken-1" text @click="setAsBackground"> Set as Image </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
        </v-row>
        <v-bottom-sheet v-model="optionapply" inset>
            <v-card>
                <v-card-title>
                    <span class="headline">Option Applicator</span>
                </v-card-title>
                <v-card-text>
                    <v-select v-model="selectedoptions" :items="options" label="Select Option" return-object item-text="name" multiple>
                        <template v-slot:selection="{ item, index }">
                            <v-chip small dense close @click:close="selectedoptions.splice(index,1)" class="white--text" color="blue">
                                <span>{{ item.name }}</span>
                            </v-chip>
                        </template>
                    </v-select>
                </v-card-text>
                <v-card-actions>
                    <v-btn block @click.stop="optionApply()" color="blue">Apply Changes</v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="fooddialog" :fullscreen="$isFullscreen()" scrollable inset>
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formFoodTitle }}</span>
                </v-card-title>
                <v-card-text id="foodcard" style="height: 500px;">
                    <v-img v-if="editedFoodIndex>-1" min-width="200px" max-height="200px" min-height="50px" class="elevation-6" :src="editFoodItem.img" @click.stop="imagediag= true" contain />
                    <v-container>
                        <v-row>
                            <v-col cols="8" sm="8" md="8">
                                <v-text-field v-model="editFoodItem.name" label="Food Name" /> </v-col>
                            <v-col cols="4" sm="4" md="4">
                                <v-text-field v-model="editFoodItem.base_price" type="Number" label="Base Price" /> </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <wysiwyg v-model="editFoodItem.desc" placehold er="Description" label="Description"> </wysiwyg>
                            </v-col>
                            <v-col cols="12" xs="12" sm="6" md="4">
                                <v-select v-model="editFoodItem.categories" :items="categories" label="Category" item-value="name" item-text="name" multiple>
                                    <template v-slot:selection="{ item, index }">
                                        <v-chip small dense close @click:close="editFoodItem.categories.splice(index,1)" class="white--text" color="blue">
                                            <span>{{ item.name }}</span>
                                        </v-chip>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12" xs="12" sm="6" md="4">
                                <v-select v-model="editFoodItem.options" :items="options" label="Select Option" return-object item-text="name" multiple>
                                    <template v-slot:selection="{ item, index }">
                                        <v-chip small dense close @click:close="editFoodItem.options.splice(index,1)" class="white--text" color="blue">
                                            <span>{{ item.name }}</span>
                                        </v-chip>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="6" sm="6" md="4">
                                <v-icon @click.stop="editFoodItem.options.push({name:'New Option',min:1,max:1,values:[]})" color="blue">mdi-plus</v-icon>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-tabs dense color="blue" centered>
                                    <v-tab v-for="(option,i) in editFoodItem.options" :key="i"> {{ option.name }} </v-tab>
                                    <v-tab-item v-for="(option,i) in editFoodItem.options" :key="i">
                                        <v-card flat tile>
                                            <v-card-text>
                                                <v-row>
                                                    <v-col cols="6" sm="6" md="6">
                                                        <v-text-field v-model="option.name" label="Name" /> </v-col>
                                                    <v-col cols="2" sm="2" md="2">
                                                        <v-text-field v-model="option.min" type="number" label="Min" /> </v-col>
                                                    <v-col cols="2" sm="3" md="2">
                                                        <v-text-field v-model="option.max" type="number" label="Max" /> </v-col>
                                                    <v-col cols="2" sm="2" md="2">
                                                        <v-icon small color="red" @click.stop="editFoodItem.options.splice(i,1)"> mdi-minus </v-icon>
                                                    </v-col>
                                                </v-row>
                                                <v-simple-table dense fixed-header>
                                                    <template v-slot:default>
                                                        <thead>
                                                            <tr>
                                                                <th class="text-left"> Name </th>
                                                                <th class="text-left"> Price </th>
                                                                <th class="text-left">
                                                                    <v-icon small color="blue" v-if="option.values.length<=0" @click.stop="option.values.push({name:'',price:0})"> mdi-plus </v-icon>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="(val, index) in option.values" :key="index">
                                                                <td>
                                                                    <input v-model="val.name" type="text" width="100px"> </td>
                                                                <td>
                                                                    <input v-model="val.price" type="number" size="10" style="width:70px"> </td>
                                                                <td>
                                                                    <v-icon small color="red" @click.stop="option.values.splice(index,1)"> mdi-minus </v-icon>
                                                                    <v-icon small color="blue" v-if="index==option.values.length - 1" @click.stop="option.values.push({name:'',price:0})"> mdi-plus </v-icon>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </template>
                                                </v-simple-table>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>
                                </v-tabs>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="saveFood"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        </v-row>
    </v-card>
</template>
<script>
import map from 'lodash.map'
import cloneDeep from 'lodash.clonedeep'
import isInclude from 'lodash.includes'
import isEqual from 'lodash.isequal'
const uuid = require('uuid')
export default {
    layout: 'menu',
    data: () => {
        return {
            applyImg: false,
            current_cat: {},
            copydiag: false,
            search: '',
            current_option: null,
            selectedoptions: [],
            optionapply: false,
            tab: 0,
            fab: false,
            activeBtn: 0,
            selection: [],
            selected: [],
            headers: [
            {
                text: 'Name',
                align: 'start',
                value: 'name',
            },
            {
                text: 'Price',
                value: 'base_price'
            },
            {
                text: '',
                value: 'actions'
            }, ],
            selectedCat: [],
            dropzoneOptions: {
                url: '/',
                thumbnailWidth: 50,
                thumbnailHeight: 50,
                addRemoveLinks: false,
                acceptedFiles: '.jpg, .jpeg, .png',
                dictDefaultMessage: `<p class='text-default'><v-icon small color="blue">mdi-upload</icon> Drag Images or Click Here</p>
          <p class="form-text">Allowed Files: .jpg, .jpeg, .png</p>
          `
            },
            imagediag: false,
            images: [],
            selectedImages: [],
            fooddialog: false,
            editedIndex: -1,
            editedFoodIndex: -1,
            editFoodItem: {
                name: '',
                base_price: 0,
                options: [],
                categories: [],
                desc: '',
                img: ''
            },
            defaultFoodItem: {
                name: '',
                base_price: 0,
                options: [],
                categories: [],
                desc: '',
                img: ''
            },
            defaultItem: {
                name: '',
                values: []
            },
            editedItem: {
                name: '',
                values: []
            },
            dialog: false,
        }
    },
    computed: {
        options() {
            var options = []
            this.food.forEach(f => {
                f.options.forEach(op => {
                    var vals = []
                    op.values.forEach(val => {
                        vals.push({
                            name: val.name,
                            price: parseFloat(val.price)
                        })
                    })
                    var dep = {
                        name: op.name,
                        min: parseInt(op.min),
                        max: parseInt(op.max),
                        values: vals
                    }
                    if (!isInclude(options, dep)) options.push(dep)
                })
            })
            return options
        },
        food() {
            return this.$store.getters['admin/getFood']
        },
        area() {
            return this.$store.getters['admin/getCurrentArea']
        },
        formFoodTitle() {
            return this.editedFoodIndex > -1 ? 'Edit Food' : 'New Food'
        },
        formTitle() {
            return this.editedIndex > -1 ? 'Edit Category' : 'New Category'
        },
        merchant() {
            return this.$store.getters['admin/getBusinessInfo']
        },
        categories() {
            return this.$store.getters['admin/getCategories']
        }
    },
    watch: {
        imagediag(val) {
            if (val) {
                this.$nextTick(() => {
                    this.$refs.vSelect.resetMultipleSelection()
                })
            }
        },
        selected(val) {
            console.log(val)
            if (this.selected.length > 0) setTimeout(() => {
                this.applyCat()
            }, 500)
        },
        current_cat(val) {
            this.editFoodItem.categories = [val.name]
        },
        fooddialog(val) {
            val || this.close()
        },
        dialog(val) {
            val || this.close()
        }
    },
    mounted() {
        this.$store.dispatch('admin/getMerchantbyID', {
            merchant_id: this.$route.params.id
        }).then(() => {
            this.generareFileList()
        })
    },
    methods: {
        applyCat() {
            if (this.selectedCat.length > 0 && this.selected.length > 0) {
                var cats = cloneDeep(this.selectedCat)
                var _food = cloneDeep(this.selected[0])
                _food.id = this.selected[0].id
                _food.merchant_id = this.$route.params.id
                _food.categories = cats
                this.$store.dispatch('admin/editFoodItem', _food).then(() => {
                    this.selected.splice(0, 1)
                })
            }
        },
        getFood(cat) {
            return this.food.filter(a => cat.values.indexOf(a.id) > -1).sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
        },
        optionApply() {
            this.food.forEach(f => {
                var found = this.findCategory(f).indexOf(this.current_cat.name) > -1
                console.log(this.current_cat)
                if (found) {
                    this.editedFoodIndex = this.food.indexOf(f)
                    this.editFoodItem = cloneDeep(f)
                    this.editFoodItem.id = f.id
                    this.editFoodItem.categories = this.findCategory(f)
                    this.selectedoptions.forEach(option => {
                        var foundcat = this.editFoodItem.options.indexOf(option) > -1
                        if (!foundcat) this.editFoodItem.options.push(option)
                    })
                    this.saveFood()
                }
            })
            this.optionapply = false
        },
        onSelectMultipleImage(data) {
            this.selectedImages = data
        },
        afterComplete(upload) {
            const imageName = uuid.v1()
            this.isLoading = true
            try {
                // save image
                const file = upload
                const ref = this.$fireStorage.ref(this.$route.params.id + '/' + imageName + '-' + file.name)
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
        },
        deleteSelected() {
            this.selectedImages.forEach((a) => {
                this.$fireStorage.ref(a.id).delete().then(() => {
                    this.$fireStoreObj().collection('foods').where('img', '==', a.src).get().then(snap => {
                        snap.docs.forEach(food => {
                            this.$fireStoreObj().collection('foods').doc(food.id).update({
                                img: ''
                            })
                        })
                    })
                    this.images.splice(this.images.indexOf(a), 1)
                })
            })
        },
        setAsBackground() {
            this.editFoodItem.img = this.selectedImages[0].src
            this.imagediag = false
            if (this.applyImg) {
                this.editFoodItem.categories = this.findCategory(this.editFoodItem)
                this.saveFood()
                this.applyImg = false
            }
        },
        saveFood() {
            if (this.editFoodItem.categories.length > 0) {
                this.editFoodItem.merchant_id = this.$route.params.id
                if (this.editedFoodIndex == -1) {
                    this.$store.dispatch('admin/addFoodItem', this.editFoodItem)
                } else {
                    this.$store.dispatch('admin/editFoodItem', this.editFoodItem)
                }
                this.selectedImages = []
                this.selectedCat = []
                this.copydiag = false
                this.fooddialog = false
            } else {
                alert('Category is required')
            }
        },
        deleteItem(item) {
            const c = confirm(`Are you sure you want to delete ${item.name} category?`)
            if (c) {
                this.$store.commit('admin/deleteMenu', item)
                this.$store.dispatch('admin/updateMenu', {
                    merchant_id: this.$route.params.id,
                    food_id: 'NA'
                }).then(() => {
                    this.tab = 0
                })
            }
        },
        findCategory(item) {
            const categories = []
            this.categories.forEach((c) => {
                c.values.forEach((d) => {
                    if (d === item.id) {
                        categories.push(c.name)
                    }
                })
            })
            return categories
        },
        generareFileList() {
            this.images = []
            this.$fireStorage.ref(this.$route.params.id).listAll().then((res) => {
                res.items.forEach((itemRef) => {
                    itemRef.getDownloadURL().then((url) => {
                        this.images.push({
                            id: itemRef.fullPath,
                            src: url
                        })
                    })
                })
            })
            if (this.merchant.hasOwnPropery('main')) {
                this.$fireStorage.ref(this.merchant.main).listAll().then((res) => {
                    res.items.forEach((itemRef) => {
                        itemRef.getDownloadURL().then((url) => {
                            this.images.push({
                                id: itemRef.fullPath,
                                src: url
                            })
                        })
                    })
                })
            }
            this.selectedImages = []
        },
        deleteFoodItem(item) {
            const c = confirm('Are you sure you want to delete this Food?')
            if (c) {
                this.$store.dispatch('admin/updateMenu', {
                    merchant_id: this.$route.params.id,
                    food_id: item.id
                })
            }
        },
        editItem(item) {
            this.editedIndex = this.categories.findIndex((val, index) => {
                return val.name === item.name
            }) - 1
            this.editedItem = cloneDeep(item)
            this.editedItem.old_name = item.name
            this.dialog = true
        },
        _createDup(item) {
            this.editFoodIndex = -1
            this.editFoodItem = cloneDeep(item)
            this.editFoodItem.categories = this.findCategory(item)
            this.copydiag = true
        },
        _editFoodItem(item) {
            this.editFoodItem = cloneDeep(item)
            this.editFoodItem.id = item.id
            this.editFoodItem.categories = this.findCategory(item)
            this.fooddialog = true
        },
        save() {
            console.log(this.editedIndex)
            if (this.editedIndex < 0) {
                const firestore = this.$fireStoreObj()
                const owner = firestore.collection('merchant').doc(this.$route.params.id)
                try {
                    owner.update({
                        'd.menu': this.$fireStoreObj.FieldValue.arrayUnion(this.editedItem)
                    })
                } catch (e) {
                    owner.update({
                        'd.menu': [{
                            name: this.editedItem.name,
                            values: []
                        }]
                    })
                }
            } else {
                this.$store.commit('admin/updateMenuName', this.editedItem)
                this.$store.dispatch('admin/updateMenu', {
                    merchant_id: this.$route.params.id,
                    food_id: 'NA'
                })
            }
            this.tab = 0
            this.close()
        },
        close() {
            if (this.fooddialog) {
                document.getElementById('foodcard').scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                })
            }
            this.copydiag = false
            this.fab = false
            this.dialog = false
            this.fooddialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editFoodItem = Object.assign({}, this.defaultFoodItem)
                this.editFoodItem.categories = [this.current_cat.name]
                this.editedIndex = -1
                this.editedFoodIndex = -1
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
