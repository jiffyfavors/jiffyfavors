<template>
    <v-card max-width="100%" outlined>
        <v-list-item dense>
            <v-list-item-content>
                <h3>
          <strong>{{ item.name }}</strong>
        </h3>
                <span style="font-style:italic;">
                    <small v-html="item.desc"></small>
                </span>
                <span class="caption grey--text">From</span>
                <div class="ml-2 red--text subtitle-1">
                    <strong>{{ item.price | toPHP }} </strong> per {{item.unit}} </div> 
            </v-list-item-content>
            <v-list-item-avatar v-if="item.img.length>0" tile size="100">
                <v-img :src="item.img"></v-img>
            </v-list-item-avatar>
        </v-list-item>
    </v-card>
</template>
<script>
export default {
   props:{
   	 item: Object
   }
};
</script>
