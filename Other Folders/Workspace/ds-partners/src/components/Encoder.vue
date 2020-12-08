<template>
  <v-container>
    <v-stepper v-model="e6">
      <v-stepper-header>
        <v-stepper-step :complete="e6 > 1" step="1">
          Name
        </v-stepper-step>
        <v-stepper-step :complete="e6 > 2" step="2">
          Pricing
        </v-stepper-step>
        <v-stepper-step :complete="e6 > 3" step="3">
          Desti & It
        </v-stepper-step>
        <v-stepper-step :complete="e6 > 4" step="4">
          Inc & Exc
        </v-stepper-step>
        <v-stepper-step :complete="e6 > 5" step="5">
          Sched & Notes
        </v-stepper-step>
      </v-stepper-header>
      <v-container>
        <v-layout wrap>
          <v-flex xs2 sm2 md2>
            <v-btn icon small>
              <v-icon small @click="newData" color="red">fas fa-plus</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs2 sm2 md2>
            <v-select :items="['Load Transfer','Load Tour']" v-model="loadedData"></v-select>
          </v-flex>
          <v-flex xs8 sm8 md8>
            <v-select :items="firebasedata" v-model="curdata" return-object :item-text="(x)=>{return x.name +'['+x.code+']'}"></v-select>
          </v-flex>
        </v-layout>
      </v-container>
      <v-stepper-content step="1">
        <v-layout wrap>
          <v-flex sm12 md12 xs12>
            <v-text-field flat name="name" label="Name" v-model="curdata.name"></v-text-field>
          </v-flex>
          <v-flex sm6 md6 xs6>
            <v-text-field flat name="name" label="URL" v-model="curdata.url"></v-text-field>
          </v-flex>
          <v-flex sm4 md4 xs4>
            <v-text-field flat name="name" label="Type" v-model="curdata.type"></v-text-field>
          </v-flex>
          <v-flex sm2 md2 xs2>
            <v-switch :label="isTour==true?'Tour':'Transfer'" v-model="isTour"></v-switch>
          </v-flex>
          <v-flex sm12 md12 xs12>
            <v-textarea v-model="curdata.desc" label="Description"></v-textarea>
          </v-flex>
          <v-btn color="primary" @click="e6 = 2">Continue</v-btn>
        </v-layout>
      </v-stepper-content>
      <v-stepper-content step="2">
        <v-layout wrap>
          <v-flex sm4 md4 xs4>
            <v-text-field flat v-model="curdata.code" label="Code"></v-text-field>
          </v-flex>
          <v-flex sm4 md4 xs4>
            <v-text-field flat v-model="curdata.origin" label="Origin"></v-text-field>
          </v-flex>
          <v-flex sm4 md4 xs4>
            <v-text-field flat v-model="curdata.desti" label="Destination"></v-text-field>
          </v-flex>
          <v-flex sm4 md4 xs4>
            <v-text-field flat type="number" v-model="curdata.base" label="Base"></v-text-field>
          </v-flex>
          <v-flex sm4 md4 xs4>
            <v-text-field flat type="number" v-model="curdata.price" label="Price"></v-text-field>
          </v-flex>
          <v-flex sm4 md4 xs4>
            <v-text-field flat type="number" v-model="curdata.ceil" label="Ceil"></v-text-field>
          </v-flex>
          <v-flex sm4 md4 xs4>
            <v-text-field flat type="number" v-model="curdata.booked" label="Book"></v-text-field>
          </v-flex>
          <v-flex sm4 md4 xs4>
            <v-text-field flat type="number" v-model="curdata.min" label="Min"></v-text-field>
          </v-flex>
          <v-flex sm4 md4 xs4>
            <v-text-field flat type="number" v-model="curdata.max" label="Max"></v-text-field>
          </v-flex>
          <v-flex sm4 md4 xs4>
            <v-switch label="Name Required" v-model="curdata.nameRequired"></v-switch>
          </v-flex>
          <v-flex sm4 md4 xs4>
            <v-switch label="Bestseller" v-model="curdata.bestseller"></v-switch>
          </v-flex>
          <v-flex sm4 md4 xs4>
            <v-switch label="On Sale" v-model="curdata.onsale"></v-switch>
          </v-flex>
          <v-btn text @click="e6=1">Back</v-btn>
          <v-btn color="primary" @click="e6 = 3">Continue</v-btn>
        </v-layout>
      </v-stepper-content>
      <v-stepper-content step="3">
        <v-layout wrap>
          <v-flex xs6 sm6>
            <v-text-field flat name="name" v-model="curdata.thumb.alt" label="Thumb Alt" id="id"></v-text-field>
          </v-flex>
          <v-flex xs2 sm2>
            <v-select :items="imgurls" v-model="curdata.thumb.url" item-text="name" item-value="url"></v-select>
          </v-flex>
          <v-flex xs2 sm2>
            <v-img :src="curdata.thumb.url"></v-img>
          </v-flex>
          <v-flex xs6 sm6>
            Destinations
            <v-layout wrap v-for="(i,index) in curdata.destinations" :key="index">
              <v-flex xs6 sm6>
                <v-text-field flat name="name" label="Name" v-model="curdata.destinations[index].name"></v-text-field>
              </v-flex>
              <v-flex xs4 sm4>
                <v-select :items="imgurls" v-model="curdata.destinations[index].url" item-text="name" item-value="url"></v-select>
              </v-flex>
              <v-flex xs2 sm2>
                <v-img :src="curdata.destinations[index].url"></v-img>
              </v-flex>
              <v-flex xs2 sm2>
                <v-btn icon small>
                  <v-icon small @click="curdata.destinations.splice(index,1)" color="red">far fa-trash-alt</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-flex xs2 sm2>
              <v-btn icon small>
                <v-icon small @click="destiPush" color="red">fas fa-plus</v-icon>
              </v-btn>
            </v-flex>
          </v-flex>
          <v-flex xs6 sm6>
            Itinerary
            <v-layout wrap v-for="(i,index) in curdata.itinerary" :key="index">
              <v-flex xs10 sm10>
                <v-text-field flat name="name" label="Name" v-model="curdata.itinerary[index]"></v-text-field>
              </v-flex>
              <v-flex xs2 sm2>
                <v-btn icon small>
                  <v-icon small @click="curdata.itinerary.splice(index,1)" color="red">far fa-trash-alt</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-flex xs2 sm2>
              <v-btn icon small>
                <v-icon small @click="curdata.itinerary.push('')" color="red">fas fa-plus</v-icon>
              </v-btn>
            </v-flex>
          </v-flex>
          <v-btn text @click="e6=2">Back</v-btn>
          <v-btn color="primary" @click="e6 = 4">Continue</v-btn>
        </v-layout>
      </v-stepper-content>
      <v-stepper-content step="4">
        <v-layout wrap>
          <v-flex xs6 sm6>
            Inclusions
            <v-layout wrap v-for="(i,index) in curdata.inclusions" :key="index">
              <v-flex xs10 sm10>
                <v-text-field flat name="name" label="Name" v-model="curdata.inclusions[index]"></v-text-field>
              </v-flex>
              <v-flex xs2 sm2>
                <v-btn icon small>
                  <v-icon small @click="curdata.inclusions.splice(index,1)" color="red">far fa-trash-alt</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-flex xs2 sm2>
              <v-btn icon small>
                <v-icon small @click="curdata.inclusions.push('')" color="red">fas fa-plus</v-icon>
              </v-btn>
            </v-flex>
          </v-flex>
          <v-flex xs6 sm6>
            Exclusions
            <v-layout wrap v-for="(i,index) in curdata.exclusions" :key="index">
              <v-flex xs10 sm10>
                <v-text-field flat name="name" label="Name" v-model="curdata.exclusions[index]"></v-text-field>
              </v-flex>
              <v-flex xs2 sm2>
                <v-btn icon small>
                  <v-icon small @click="curdata.exclusions.splice(index,1)" color="red">far fa-trash-alt</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-flex xs2 sm2>
              <v-btn icon small>
                <v-icon small @click="curdata.exclusions.push('')" color="red">fas fa-plus</v-icon>
              </v-btn>
            </v-flex>
          </v-flex>
          <v-btn text @click="e6=3">Back</v-btn>
          <v-btn color="primary" @click="e6 = 5">Continue</v-btn>
        </v-layout>
      </v-stepper-content>
      <v-stepper-content step="5">
        <v-layout wrap>
          <v-flex xs3 sm3>
            Schedule
            <v-layout wrap v-for="(i,index) in curdata.schedule" :key="index">
              <v-flex xs10 sm10>
                <v-text-field flat name="name" label="Name" v-model="curdata.schedule[index]"></v-text-field>
              </v-flex>
              <v-flex xs2 sm2>
                <v-btn icon small>
                  <v-icon small @click="curdata.schedule.splice(index,1)" color="red">far fa-trash-alt</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-flex xs2 sm2>
              <v-btn icon small>
                <v-icon small @click="curdata.schedule.push('')" color="red">fas fa-plus</v-icon>
              </v-btn>
            </v-flex>
          </v-flex>
          <v-flex xs9 sm9>
            Notations
            <v-layout wrap v-for="(i,index) in curdata.notations" :key="index">
              <v-flex xs10 sm10>
                <v-text-field flat name="name" label="Name" v-model="curdata.notations[index]"></v-text-field>
              </v-flex>
              <v-flex xs2 sm2>
                <v-btn icon small>
                  <v-icon small @click="curdata.notations.splice(index,1)" color="red">far fa-trash-alt</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-flex xs2 sm2>
              <v-btn icon small>
                <v-icon small @click="curdata.notations.push('')" color="red">fas fa-plus</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs12 sm12>
              Cancellation Policy
              <v-layout wrap v-for="(i,index) in curdata.cancellation" :key="index">
                <v-flex xs10 sm10>
                  <v-text-field flat name="name" label="Name" v-model="curdata.cancellation[index]"></v-text-field>
                </v-flex>
                <v-flex xs2 sm2>
                  <v-btn icon small>
                    <v-icon small @click="curdata.cancellation.splice(index,1)" color="red">far fa-trash-alt</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-flex xs2 sm2>
                <v-btn icon small>
                  <v-icon small @click="curdata.cancellation.push('')" color="red">fas fa-plus</v-icon>
                </v-btn>
              </v-flex>
            </v-flex>
          </v-flex>
        </v-layout>
        <v-btn text @click="e6=4">Back</v-btn>
        <v-btn color="primary" @click="deleteData">Delete</v-btn>
        <v-btn color="primary" @click="updateData">Update</v-btn>
        <v-btn color="primary" @click="saveNewData">Save New</v-btn>
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { svc, tours, fs } from '../firebase'


export default {
  name: 'Encoder',
  computed: {

    ...mapGetters(['getTourResult', 'getTransResult'])
  },
  data() {
    return {
      e6: 1,
      initData: {},
      imgurls: [],
      loadedData: 'Load Transfer',
      firebasedata: [],
      isTour: false,
      curdata: {
        base: 0,
        price: 0,
        booked: 0,
        max: 0,
        ceil: 0,
        min: 1,
        nameRequired: false,
        bestseller: true,
        onsale: false,
        code: '',
        desc: '',
        desti: '',
        type: '',
        url: '',
        name: '',
        origin: '',
        cancellation: [],
        destinations: [{
          name: '',
          url: '',
        }],
        exclusions: [],
        inclusions: [],
        itinerary: [],
        notation: [],
        schedule: [],
        thumb: {
          alt: '',
          url: ''
        }
      }

    }
  },
  mounted() {
    this.initData = Object.assign({}, this.curdata)
    this.firebasedata = this.getTransResult

   // this.fixer(this.getTransResult, svc)
   //  this.fixer(this.getTourResult, tours)

    var paths = [];
    fs.child('/').listAll().then(d => {
      d.items.forEach(a => {
        a.getDownloadURL().then(b => {
          this.imgurls.push({ name: a.name, url: b })
        })
      })
      d.prefixes.forEach(a => {
        fs.child('/' + a.fullPath + '/').listAll().then(sub => {
          sub.items.forEach(sub_a => {
            sub_a.getDownloadURL().then(sub_url => {


              this.imgurls.push({ name: sub_a.name, url: sub_url })
            })
          })

          sub.prefixes.forEach(subs => {

            fs.child(subs.fullPath).listAll().then(sub => {
              sub.items.forEach(sub_a => {
                sub_a.getDownloadURL().then(sub_url => {

                  this.imgurls.push({ name: sub_a.name, url: sub_url })

                })
              })
            })
          })
        })

      })

    });
  },

  methods: {
    fixer(data,db) {
      data.forEach(a => {

        this.curdata = a
        this.curdata.base = parseFloat(this.curdata.base)
        this.curdata.ceil = parseFloat(this.curdata.ceil)
        this.curdata.price = parseFloat(this.curdata.price)
        this.curdata.booked = parseFloat(this.curdata.booked)
        this.curdata.url = this.curdata.url.substr(this.curdata.url.lastIndexOf('/') + 1)
     
        db.doc(this.curdata.id).update(this.curdata).then(() => {
console.log(this.curdata.id,'updated')

        })

      })


    },
    onSelectImage(e) {
      console.log(e)
    },
    newData() {
      this.curdata = Object.assign({}, this.initData)
    },
    titleVal() {
      return this.curdata.name + '[' + this.curdata.code + ']'
    },
    initBegin() {
      this.e6 = 1

      var res = [];

      svc.get().then(snap => {

        snap.docs.forEach((a) => {
          var c = Object.assign(a.data());
          c.id = a.id
          transcod.push(c.code)
          if (typeof c.destinations === 'undefined')
            c.destinations = []
          if (typeof c.inclusions === 'undefined')
            c.inclusions = []
          if (typeof c.exclusions === 'undefined')
            c.exclusions = []
          if (typeof c.schedule === 'undefined')
            c.schedule = []
          if (typeof c.notations === 'undefined')
            c.notations = []
          if (typeof c.cancellation === 'undefined')
            c.cancellation = []
          res.push(c)
        })

        this.$store.commit('updateTransResult', res)

        var tour = []
        tours.get().then(snap => {

          snap.docs.forEach((a) => {
            var c = Object.assign(a.data());
            c.id = a.id
            if (typeof c.destinations === 'undefined')
              c.destinations = []
            if (typeof c.inclusions === 'undefined')
              c.inclusions = []
            if (typeof c.exclusions === 'undefined')
              c.exclusions = []
            if (typeof c.schedule === 'undefined')
              c.schedule = []
            if (typeof c.notations === 'undefined')
              c.notations = []
            if (typeof c.cancellation === 'undefined')
              c.cancellation = []
            tour.push(c)

          })

          this.$store.commit('updateTourResult', tour)

        }).catch(e => {
          console.log(e)
        })
      }).catch(e => {
        console.log(e)
      })
    },
    deleteData() {
      if (this.isTour)
        var db = tours
      else
        var db = svc

      db.doc(this.curdata.id).delete().then(() => {
        alert('Data Deleted')
        this.initBegin()
      })
    },
    updateData() {
      if (this.isTour)
        var db = tours
      else
        var db = svc

      this.curdata.base = parseFloat(this.curdata.base)
      this.curdata.ceil = parseFloat(this.curdata.ceil)
      this.curdata.price = parseFloat(this.curdata.price)
      this.curdata.booked = parseFloat(this.curdata.booked)
      db.doc(this.curdata.id).update(this.curdata).then(() => {
        alert('Data Updated')
        this.initBegin()
      })

    },

    saveNewData() {
      if (this.isTour)
        var db = tours
      else
        var db = svc

      delete this.curdata.id

      this.curdata.base = parseFloat(this.curdata.base)
      this.curdata.ceil = parseFloat(this.curdata.ceil)
      this.curdata.price = parseFloat(this.curdata.price)
      this.curdata.booked = parseFloat(this.curdata.booked)
      this.curdata.min = parseFloat(this.curdata.min)
      this.curdata.pax = parseFloat(this.curdata.pax)
      db.add(this.curdata).then(() => {
        alert('Data Added')
        this.initBegin()
      })

    },

    destiPush() {
      if (typeof this.curdata.destinations === 'undefined') {
        this.curdata.destinations = []
      }
      this.curdata.destinations.push({ name: '', url: '' })
    },
    newData() {
      this.curdata = Object.assign({}, this.initData)
    }
  },
  watch: {
    loadedData(val) {

      if (val === 'Load Tour') {
        this.firebasedata = this.getTourResult
        this.isTour = true
      } else {
        this.firebasedata = this.getTransResult
        this.isTour = false
      }
    },
    curdata(val) {
      if (typeof this.curdata.destinations === 'undefined') {
        this.curdata.destinations = []
        this.curdata.destinations.push({ name: '', url: '' })
      }

    }
  }
}
</script>
