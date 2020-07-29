<template>
    <v-app dark>
        <v-layout>
            <v-flex class="text-center">
                <v-icon class="mb-5" color="red" size="200"> mdi-alert </v-icon>
                <blockquote class="blockquote">
                    <template v-if="error.statusCode === 404"> &#8220;
                        <strong> {{ pageNotFound }}</strong> &#8221; </template>
                    <template v-else> &#8220;
                        <strong> {{ otherError }}</strong> &#8221; </template>
                    <footer>
                        <v-btn tile to="/" outlined class="ma-2" width="30%" color="red"> Home </v-btn>
                        <v-btn v-if="error.statusCode != 404" tile outlined class="ma-2" width="30%" color="red" @click.stop="$router.go()"> Try Again </v-btn>
                    </footer>
                </blockquote>
            </v-flex>
        </v-layout>
    </v-app>
</template>
<script>
export default {
    props: {
        error: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            pageNotFound: 'Are you lost? Page not found.',
            otherError: 'Something went wrong'
        }
    },
    head() {
        const title = this.error.statusCode === 404 ? this.pageNotFound : this.otherError
        return {
            title
        }
    }
}
</script>
<style scoped>
  h1 {
    font-size: 20px;
  }
</style>
