<template>
	<v-card>
            <v-card-title>Available Token</v-card-title>
            <v-card-text>
            	{{tokens}} 
              
            </v-card-text>
            <v-card-actions>
               
                <v-btn text block color="success"icon><v-icon>mdi-plus</v-icon>Top Up</v-btn>
            </v-card-actions>
        </v-card>
</template>
<script>
	export default{
		computed: {
        tokens() {
            return this.$store.getters['auth/getToken']
        }
    },
	};
</script>