<template>
  
    <v-card v-if="isLoaded" class="mx-auto ma-2" width="500" max-width="100%" outlined>
      <v-list-item three-line dense>
        <v-list-item-content>
          <small>{{data.service}}</small>
          <v-list-item-subtitle>{{data.traveldate}} {{data.time}} - {{data.pax}} pax</v-list-item-subtitle>
          <v-list-item two-line dense>
            <v-list-item-content>
              <div class="overline">Lead Participant: {{data.leadguest}}</div>
              <div class="overline">Pickup: {{data.rates.extra.pickup.location}}</div>
              <div class="overline">Drop: {{data.rates.extra.dropoff.location}}</div>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-content>
      </v-list-item>
      <v-layout align-center>
        <v-chip small class="ma-2 white--text" color="blue">
          {{data.ref}}
        </v-chip>
      </v-layout>
      <v-layout align-center>
        <v-chip small class="ma-2 white--text" :color="setColor(data.status)">
          {{data.status}}
        </v-chip>
        <v-chip small align="end" class="ma-2 white--text" color="green">
          Total {{price|toPHP}}
        </v-chip>
      </v-layout>
      <v-card-actions>
        <v-btn small v-if="data.status!='CANCELLED'" outlined @click="sheet = true" color="blue">
          Manage
        </v-btn>
        <v-btn small :to="'/ticket/'+data.ref+'/'+data.srv_code" outlined color="green">
          Ticket
        </v-btn>
      </v-card-actions>
   
    <v-bottom-sheet v-model="sheet">
      <v-list one dense>
        <v-subheader>Manage Booking</v-subheader>
        <v-list-item @click="infodiag = true, sheet = false">
          <v-list-item-title>Change Information</v-list-item-title>
        </v-list-item>
        <v-list-item @click="canceldiag = true, sheet = false" v-if="allowCancel()">
          <v-list-item-title>Cancel Booking</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-bottom-sheet>
    <v-row justify="center">
      <v-dialog v-model="infodiag" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Change Information</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="8" md="8">
                  <v-text-field label="Lead Guest*" v-model="data.leadguest" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="8" md="4">
                  <v-text-field label="Pax" type="number" v-model="data.pax"></v-text-field>
                </v-col>
                <v-col cols="6" sm="6" md="4">
                  <v-text-field label="Travel Date" type="date" v-model="data.traveldate" required></v-text-field>
                </v-col>
                <v-col cols="6" sm="6" md="4">
                  <v-text-field v-if="data.schedule.length==0" label="Time" type="time" v-model="data.time"></v-text-field>
                  <v-select v-if="data.schedule.length>0" label="Schedule" :items = "data.schedule" v-model="data.time"></v-select>
                  
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field label="Collect" type="number" v-model="data.rates.collect"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-textarea label="Pickup Location" v-model="data.rates.extra.pickup.location" outlined></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-textarea label="Drop Off Location" v-model="data.rates.extra.dropoff.location" outlined></v-textarea>
                </v-col>
                <!--   <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Legal last name*"
                  hint="example of persistent helper text"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col> -->
                <v-col cols="12">
                   <v-textarea label="Instruction/Special Request" v-model="data.instruction" outlined></v-textarea>
                </v-col>
               
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="blue darken-1" text @click="infodiag = false">Close</v-btn>
            <v-btn color="blue darken-1" text @click="infodiag = false, updateData()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="loadingdiag" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
        {{statustext}}       
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

     <v-dialog v-model="canceldiag" persistent max-width="290">
    
      <v-card>
        <v-card-title class="headline">Cancel Booking</v-card-title>
        <v-card-text>Please confirm cancellation of booking reference {{data.ref}}</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="canceldiag = false">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="cancelBooking()">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    </v-row>
     </v-card>
  
</template>

<script>
import { bookings, svc } from '../firebase'
import {mapGetters} from 'vuex'
export default {
  name: 'BookingItem',
  props: {
    bookingId: String
  },
  computed:{
    ...mapGetters(['getTourResult'])
  },
  data() {
    return {
      infodiag: false,
      loadingdiag:false,
      statustext:'',
      canceldiag:false,
      t_time:'09:30:00',
      data: {},
      isLoaded: false,
      sheet: false,
      total:0,
    }
  },
  mounted() {
    
    bookings.doc(this.bookingId).get().then(snap => {
      this.data = snap.data()
  
      this.recomputeTotal()

    })
  },
  methods:{
    recomputeTotal(){
var pax = parseInt(this.data.pax)
      var base = parseFloat(this.data.rateinfo.base)
      var ceil = parseInt(this.data.rateinfo.ceil)
      var rate = parseFloat(this.data.rateinfo.rate)
      console.log(base,ceil,rate)
  this.price = pax <= ceil ? base: (base + ((pax-ceil)*rate))
   
     this.price = this.price +  parseFloat(this.data.rates.extra.dropoff.rate) + parseFloat(this.data.rates.extra.pickup.rate)
    
      this.data.time  = new Date(this.data.traveldate+' '+this.data.time).toTimeString().substr(0,8)
      this.data.schedule = []
       this.getSchedule(this.data.srv_code)
  
      this.isLoaded = true
    },
    allowCancel(){
      var date =new Date(this.data.traveldate +' '+this.data.time).getTime()
      var now = new Date().getTime()
      if(now>date){
        return false
      }else if(this.data.status=='CANCELLED')
      return false
      else
        return true
    },

    cancelBooking(){
      this.loadingdiag = true
      this.canceldiag = false
      this.statustext='Cancellation in progress....'
      this.data.status='CANCELLED'

       bookings.doc(this.bookingId).set(this.data).then(()=>{
        alert('Booking cancelled')
        this.loadingdiag = false
        this.canceldiag = false
      })
    },
        setColor(status){
      if(status==='PENDING')
        return 'orange'
      else if(status==='CONFIRMED')
        return 'blue'
      else if(status==='CANCELLED')
        return 'red'
      else if(status==='NEED_PAYMENT')
        return 'green'
    },
    updateData(){
      this.loadingdiag = true
      this.statustext ='Updating booking information...'
      bookings.doc(this.bookingId).set(this.data).then(()=>{
        alert('Booking updated')
        this.recomputeTotal()
        this.loadingdiag = false
      })
    },
    getSchedule(code){
   
    
      if(code.startsWith('SV')||code.startsWith('PV')){
          svc.where('code', '==', code).get().then(snap => {
          snap.docs.forEach(d=>{

            this.data.schedule = d.data().schedule
          })
         
         })
        }else if(code.startsWith('TV')){
          this.data.schedule = []
        }
        else{
          this.data.schedule  = this.getTourResult.find((x)=>{return x.code == code}).schedule
          
        }

       
    }
  }
}
</script>
