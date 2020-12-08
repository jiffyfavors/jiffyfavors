<template>
  <v-container fluid>
    <v-btn small icon color="success" @click="print">
      <v-icon>fas fa-print</v-icon>
    </v-btn>
    <div class="divbody" id="idSOA">
      <header>
        <h1>Statement of Account</h1>
        <address>
          <h2 style="font-size: 16px;"><strong>Diskubre Transport and Travel Palawan</strong></h2>
          <p>Unit 3, GF ARL Building 6, Baltan Street</p>
          <p>Puerto Princesa City, Palawan</p>
          <p>Philippines, 5300</p>
          <p><a href="tel:+639176309830">+63 917 630 9830</a></p>
          <p><a href="tel:+639399391913">+63 939 939 1913</a></p>
          <p><a href="mailto:reservations@diskubre.com">reservations@diskubre.com</a></p>
          <p><a href="https://www.diskubre.com">https://www.diskubre.com</a></p>
        </address>
        <span><img alt="" src="https://www.diskubre.com/images/shop-icon-384.png" style="width: 150px;">
            <img alt="" src="https://www.diskubre.com/images/ttlogo.jpg" style="width: 150px;"></span>
      </header>
      <article>
        <table class="bk" style="float: left;width: 50%">
          <tr>
            <th><span>Bill To</span></th>
            <td><span> <strong>{{soa.receiver.business_name}}</strong></span></td>
          </tr>
          <tr>
            <th><span>Address</span></th>
            <td><span>{{soa.receiver.address}}, {{soa.receiver.country}}, {{soa.receiver.zipcode}}</span></td>
          </tr>
          <tr>
            <th><span>Reference</span></th>
            <td><span style="color:red;"><strong> {{soa.info.ref}}</strong></span></td>
          </tr>
          <tr>
            <th><span>Billing Period</span></th>
            <td><span> {{soa.info.bill_start}} to {{soa.info.bill_end}}</span></td>
          </tr>
        </table>
        <table class="meta">
          <tr>
            <tr>
              <th><span>Due Date</span></th>
              <td><span> {{soa.info.due_date}}</span></td>
            </tr>
            <tr>
              <th><span>Total Amount</span></th>
              <td><span> {{parseFloat(soa.info.amount_due)|toPHP}} </span></td>
            </tr>
            <tr>
              <th><span>Payments</span></th>
              <td><span> {{parseFloat(soa.info.payments)|toPHP}} </span></td>
            </tr>
            <tr>
              <th><span>Amount Due</span></th>
              <td><span> {{parseFloat(soa.info.balance)|toPHP}}</span></td>
            </tr>
        </table>
      </article>
      <table v-for="(g,index) in soa.items" class="vantrans" style="margin-bottom:5px; margin-top:5px;" :key="index">
        <thead>
          <tr>
            <th style="width:15%"><span>Date</span></th>
            <th style="width:25%"><span>Lead Guest</span></th>
            <th style="width:50%"><span>Service</span></th>
            <th style="width:10%"><span>Rate</span></th>
          </tr>
        </thead>
        <tbody style="border:1px solid;">
          <tr>
            <td><span>{{g.traveldate}} {{g.time}} </span>
            </td>
            <td><span><strong>{{g.participants[0].name}}</strong> </span></td>
            <td><span><small>{{g.type}} {{g.service}}</small><br/></span>
              <span><small>{{basepricing(g)|toPHP}} - {{g.pax}} pax  </small><br/></span>
              <span v-for="fee in g.rates.extra.fees"><small>{{fee.name}} - {{parseFloat(fee.rate)|toPHP}} x {{g.pax}}</small><br/></span>
            </td>
            <td><span><strong>{{pricing(g)|toPHP}}</strong></span></td>
          </tr>
          <tr>
            <td colspan="12">
              <table>
                <thead>
                  <tr>
                    <th style="width:35%"><span>Pickup</span></th>
                    <th style="width:35%"><span>Drop</span></th>
                    <th style="width:15%"><span>Payment&Collection</span></th>
                    <th style="width:15%"><span>Subtotal</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="font-size:10px;"><span>{{g.rates.extra.pickup.location}}</span>
                      <br/>
                      <span v-if="parseFloat(g.rates.extra.pickup.rate)>0">{{g.rates.extra.pickup.area}} (+ {{parseFloat(g.rates.extra.pickup.rate)|toPHP}})</span>
                    </td>
                    <td style="font-size:10px;"><span>{{g.rates.extra.dropoff.location}}</span>
                      <br/>
                      <span v-if="parseFloat(g.rates.extra.dropoff.rate)>0">{{g.rates.extra.dropoff.area}} (+ {{parseFloat(g.rates.extra.dropoff.rate)|toPHP}})</span></td>
                    <td style="font-size: 12px; font-weight:bold;">
                      <span><strong>{{parseFloat(g.payments)|toPHP}}</strong></span>
                    </td>
                    <td style="font-size: 12px; font-weight:bold;">
                      <span><strong>{{parseFloat(g.balance)|toPHP}}</strong></span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table v-if="soa.soa_payment.length>0">
        <caption>Payment History</caption>
        <thead>
          <tr>
            <th style="width:20%;"><span>Date</span></th>
            <th><span>Mode</span></th>
            <th><span>Amount</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(g,index) in soa.soa_payment" :key="index">
            <td><span>{{g.entrydate}}</span></td>
            <td><span>{{g.mode}}</span></td>
            <td><span></span></td>
          </tr>
          <tr>
            <td></td>
            <td> <strong><span>Total Payment</span></strong></td>
            <td><strong><span>{{parseFloat(soa.info.soa_pay)|toPHP}}</span>  </strong></td>
          </tr>
        </tbody>
      </table>
      <aside>
        <p>Thank you for doing business with us.</p>
      </aside>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ViewSoa',
  data() {
    return {
      soa: {
        ref: 'NA'
      }
    }
  },
  computed: {
    ...mapGetters(['getCurrentUser']),
  },
  mounted() {


    fetch('https://api.diskubrepalawan.com/index_dev.php/view-ds-soa/' + this.$route.params.ref).then((data) => {
      return data.json()
    }).then((data) => {
      this.soa = data
    });
  },
  methods: {



    basepricing(item) {

      var balance = 0
      balance = parseInt(item.pax) < parseInt(item.rateinfo.ceil) ? parseFloat((item.rateinfo.base)) : (parseFloat(item.rateinfo.base) + ((parseInt(item.pax) - parseInt(item.rateinfo.ceil)) * parseFloat(item.rateinfo.price)))


      return balance
    },

    pricing(item) {

      var balance = 0
      balance = parseInt(item.pax) < parseInt(item.rateinfo.ceil) ? parseFloat((item.rateinfo.base)) : (parseFloat(item.rateinfo.base) + ((parseInt(item.pax) - parseInt(item.rateinfo.ceil)) * parseFloat(item.rateinfo.price)))


      if (typeof item.rates.extra.fees !== 'undefined') {
        item.rates.extra.fees.forEach(a => {
          balance = balance + (parseFloat(a.rate) * parseInt(item.pax))
        })

      }
      return balance
    },
    print() {




      const win = window.open('_blank');

      const element = document.getElementById('idSOA');
      win.document.write(`
        <html>
          <head>
            <title>${this.soa.ref}</title>
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `);

      let link = win.document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      link.setAttribute('href', 'https://www.diskubrepalawan.com/print.css');
      win.document.getElementsByTagName('head')[0].appendChild(link);




      setTimeout(() => {
        win.document.close();
        win.focus();
        win.print();
        win.close();

      }, 1000);


    }
  }
}
</script>

<style scoped>
address p {
  font-size: 14px;
}


/* reset */

* {
  border: 0;
  box-sizing: content-box !important;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  line-height: inherit;
  list-style: none;
  margin: 0;
  padding: 0;
  text-decoration: none;
  vertical-align: top;
}


/* content editable */


/* heading */

h1 {
  font: bold 100% sans-serif;
  letter-spacing: 0.5em;
  text-align: center;
  text-transform: uppercase;
}


/* table */

table {
  font-size: 75%;
  width: 100%;
}

table {
  border-collapse: separate;
  border-spacing: 2px;
}

th,
td {
  border-width: 1px;
  padding: 0.5em;
  position: relative;
  text-align: left;
}

th,
td {
  border-radius: 0.25em;
  border-style: solid;
}

th {
  background: #EEE;
  border-color: #BBB;
}

td {
  border-color: #DDD;
}


/* page */

li {
  margin-top: 10px;
}

.divbody {
  display: block;
  box-sizing: border-box !important;
  -webkit-box-sizing: border-box !important;
  min-height: 11in;
  margin: 0 auto;
  overflow: hidden;
  padding: .5in;
  width: 8.5in;
}

.divbody {
  background: #fff;
  border-radius: 1px;
  box-shadow: 0 0 1in -.25in rgba(0, 0, 0, .5)
}


/* header */

header {
  margin: 0 0 3em;
}

header:after {
  clear: both;
  content: "";
  display: table;
}

header h1 {
  background: #000;
  border-radius: 0.25em;
  color: #FFF;
  margin: 0 0 1em;
  padding: 0.5em 0;
}

header address {
  float: left;
  font-size: 75%;
  font-style: normal;
  line-height: 1.25;
  margin: 0 1em 1em 0;
}

header address p {
  margin: 0 0 0.25em;
}

header span,
header img {
  display: block;
  float: right;
}

header span {
  margin: 0 0 1em 1em;
  max-height: 25%;
  max-width: 60%;
  position: relative;
}

header img {
  max-height: 100%;
  max-width: 100%;
}

header input {
  cursor: pointer;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
  height: 100%;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  width: 100%;
}


/* article */

article,
article address,
table.meta,
table.inventory {
  margin: 0
}

article:after {
  clear: both;
  content: "";
  display: table;
}

article h1 {
  clip: rect(0 0 0 0);
  position: absolute;
}

article address {
  float: left;
  font-size: 125%;
  font-weight: bold;
}


/* table meta & balance */

table.pvt {
  width: 50%;
}

table.pvt:after {
  clear: both;
  content: "";
  display: table;
}

table.meta,
table.balance {
  float: right;
  width: 50%;
}

table.meta:after,
table.balance:after {
  clear: both;
  content: "";
  display: table;
}


/* table meta */

table.meta th {
  width: 30%;
}

table.meta td {
  width: 50%;
}

table.bk,
table.balance {
  float: right;
  width: 50%;
}

table.bk:after,
table.balance:after {
  clear: both;
  content: "";
  display: table;
}


/* table meta */

table.bk th {
  width: 25%;
}

table.bk td {
  width: 75%;
}


/* table items */

table.inventory {
  clear: both;
  width: 100%;
}

table.inventory th {
  font-weight: bold;
  text-align: center;
}

.pickup_drop th {
  width: 50%;
}

table.inventory th:nth-child(1) {
  width: 30%;
  min-width: 30%;
}

table.inventory th:nth-child(2) {
  width: 15%;
}

table.inventory th:nth-child(3) {
  width: 5%;
}

table.inventory th:nth-child(4) {
  width: 20%;
}

table.inventory th:nth-child(5) {
  width: 20%;
}

table.inventory td:nth-child(1) {
  width: 40%;
  min-width: 40%;
}

table.inventory td:nth-child(2) {
  width: 15%;
}

table.inventory td:nth-child(3) {
  text-align: right;
  width: 5%;
}

table.inventory td:nth-child(4) {
  text-align: right;
  width: 20%;
}

table.inventory td:nth-child(5) {
  text-align: right;
  width: 20%;
}

table.vantrans {
  clear: both;
  width: 100%;
}

table.vantrans th {
  font-weight: bold;
  text-align: center;
}


/*
    .pickup_drop th {
        width: 50%;
    }

    table.vantrans th:nth-child(1) {
        width: 5%;
        min-width: 5%;
    }

    table.vantrans th:nth-child(2) {
        width: 10%;
    }

    table.vantrans th:nth-child(3) {
        width: 15%;
    }

    table.vantrans th:nth-child(4) {
        width: 10%;
    }

    table.vantrans th:nth-child(5) {
        width: 10%;
    }

    table.vantrans th:nth-child(6) {
        width: 10%;
    }

    table.vantrans td:nth-child(1) {
        width: 5%;
        min-width: 5%;
    }

    table.vantrans td:nth-child(2) {
        width: 10%;
    }

    table.vantrans td:nth-child(3) {
       
        width: 15%;
    }

    table.vantrans td:nth-child(4) {
       
        width: 15%;
    }

    table.vantrans td:nth-child(5) {
        text-align: right;
        width: 10%;
    }

    table.vantrans td:nth-child(6) {
        text-align: right;
        width: 10%;
    }
*/


/* table balance */

table.balance th,
table.balance td {
  width: 70%;
}

table.balance td {
  text-align: right;
}


/* aside */

aside {
  margin-top: 20px;
}

aside h1 {
  border: none;
  border-width: 0 0 1px;
  margin: 0 0 1em;
}

aside h1 {
  border-color: #999;
  border-bottom-style: solid;
}

@media print {
  * {
    -webkit-print-color-adjust: exact;
  }
  html {
    background: none;
    padding: 0;
  }
  body {
    box-shadow: none;
    margin: 0;
  }
  span:empty {
    display: none;
  }
  .add,
  .cut {
    display: none;
  }
}

@page {
  margin: 0;
}

caption {
  font-size: 16px;
}

strong {
  font-weight: bold;
}

#tos p {
  font-size: 12px;
}

a:link {
  color: red;
}

a:visited {
  color: green;
}

a:hover {
  color: hotpink;
}

a:active {
  color: blue;
}

.inventory {
  margin-top: 15px;
}

.notation {
  font-size: 12px;
  position: absolute;
  font-style: italic;
}
</style>
