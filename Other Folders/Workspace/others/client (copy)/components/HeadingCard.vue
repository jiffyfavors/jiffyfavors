<template>
 
   <v-container>
     
  
    <v-layout text-center wrap align-center fill-height justify-center>
      <v-flex xs12 sm12 md12>
        <div class="toursection ast">
          <div class="rg-img rg-img-bg bg-img-ast">
          </div>
          <article class="article">
            <p style="margin: 10px 0; font-size:24px;">Choose restaurant</p>
            <p style="margin: 10px 0; white-space: normal;">Pay CASH on delivery
            </p>
          </article>
        </div>
          
            <v-layout wrap justify-start align-start text-left>
         
            <resto-card  class="review-card" style="white-space:initial;" v-for="i in 10" :key="i">
            </resto-card>
       
         </v-layout>
         
       
       
       
      </v-flex>
    </v-layout>
   </v-container>

   

</template>
<script>
import RestoCard from '~/components/RestoCard.vue'
export default{
  components:{
    RestoCard
  }
}
</script>
