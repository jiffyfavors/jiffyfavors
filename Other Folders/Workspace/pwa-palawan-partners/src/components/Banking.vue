<template>
  <v-card>
    <v-card>
      <v-card-title primary-title>
        Your Balance
      </v-card-title>
      <v-card-text>
        <strong>{{balance|toPHP}}</strong><br/>
           <small>Please see your generated SOA under Billing Section</small>
      </v-card-text>
      
    </v-card>
    <v-card-text>
      
  
    <small>You can settle your balance to our official bank accounts</small>
    <v-simple-table dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Bank</th>
            <th class="text-left"></th>
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-size:10px;" class="text-left"><strong>Banco de Oro(BDO)</strong></td>
            <td style="font-size:10px;" class="text-left"><strong>Account Name</strong></td>
            <td style="font-size:10px;" class="text-left">
              Diskubre Transport Services
            </td>
          </tr>
          <tr>
            <td style="font-size:10px;" class="text-left"><small>SM Puerto Princesa Branch</small></td>
            <td style="font-size:10px;" class="text-left"><strong>Account No.</strong></td>
            <td style="font-size:10px;" class="text-left">
              011 950 0460 26
            </td>
          </tr>
          <tr>
            <td style="font-size:10px;"></td>
            <td style="font-size:10px;" class="text-left"><strong>Swift Code</strong></td>
            <td style="font-size:10px;" class="text-left">
              BNORPHMM
            </td>
          </tr>
          <tr>
            <td style="font-size:10px;" class="text-left"><strong>Security Bank</strong></td>
            <td style="font-size:10px;" class="text-left"><strong>Account Name</strong></td>
            <td style="font-size:10px;" class="text-left">
              Diskubre Transport Services
            </td>
          </tr>
          <tr>
            <td style="font-size:10px;" class="text-left"><small>Puerto Princesa - Rizal Branch</small></td>
            <td style="font-size:10px;" class="text-left"><strong>Account No.</strong></td>
            <td style="font-size:10px;" class="text-left">
              00000 2159 2321
            </td>
          </tr>
          <tr>
            <td style="font-size:10px;"></td>
            <td style="font-size:10px;" class="text-left"><strong>Swift Code</strong></td>
            <td style="font-size:10px;" class="text-left">
              SETCPHMM
            </td>
          </tr>
          <tr>
            <td style="font-size:10px;" class="text-left"><strong>Metrobank</strong></td>
            <td style="font-size:10px;" class="text-left"><strong>Account Name</strong></td>
            <td style="font-size:10px;" class="text-left">
              Gilbert C. Palmeras
            </td>
          </tr>
          <tr>
            <td style="font-size:10px;" class="text-left"><small>Puerto Princesa - Rizal Branch</small></td>
            <td style="font-size:10px;" class="text-left"><strong>Account No.</strong></td>
            <td style="font-size:10px;" class="text-left">
              130 3 130 406 280
            </td>
          </tr>
          <tr>
            <td style="font-size:10px;"></td>
            <td style="font-size:10px;" class="text-left"><strong>Swift Code</strong></td>
            <td style="font-size:10px;" class="text-left">
              MBTCPHMM
            </td>
          </tr>
          <tr>
            <td style="font-size:10px;" class="text-left"><strong>Bank of Philippine Islands(BPI)</strong></td>
            <td style="font-size:10px;" class="text-left"><strong>Account Name</strong></td>
            <td style="font-size:10px;" class="text-left">
              Gilbert Palmeras
            </td>
          </tr>
          <tr>
            <td style="font-size:10px;" class="text-left"><small>Puerto Princesa - San Pedro Branch</small></td>
            <td style="font-size:10px;" class="text-left"><strong>Account No.</strong></td>
            <td style="font-size:10px;" class="text-left">
              3489 0972 99
            </td>
          </tr>
          <tr>
            <td style="font-size:10px;"></td>
            <td style="font-size:10px;" class="text-left"><strong>Swift Code</strong></td>
            <td style="font-size:10px;" class="text-left">
              BOPIPHMM
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
      </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default { name: 'Banking',data(){
  return {
    balance : 0
  }
} ,
computed:{
   ...mapGetters(['getCurrentUser']),
},
mounted(){
  fetch('https://api.diskubrepalawan.com/index_dev.php/get-my-bill/'+this.getCurrentUser.entity.id).then((data) => {
        return data.json()
      }).then((data) => {

        data.forEach(a=>{
          this.balance = this.balance + parseFloat(a.balance)
        })

      })
} }
</script>
