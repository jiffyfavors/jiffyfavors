<template>
    <v-layout>
        <v-container>
            <v-layout justify-center align-center class="text-xs-center">
                <v-flex xs12>
                    <v-container style="position: relative;top: 13%;" class="text-xs-cente mx-auto">
                        <v-card flat max-width="100%" class="mx-auto">
                            <v-layout flat wrap justify-center align-center text-left>
                                <v-flex xs12 md4 sm4 lg3 class="text-center" v-if="!isAdmin&&!isAuth">
                                    <v-avatar size="250">
                                        <v-img src="/icon.png"></v-img>
                                    </v-avatar>
                                    <blockquote class="blockquote mb-5">
                                        <h4>Admin System Access</h4> </blockquote>
                                    <footer>
                                        <fire-ui></fire-ui>
                                    </footer>
                                </v-flex>
                            </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-container>
                </v-flex>
            </v-layout>
        </v-container>
        <v-snackbar v-model="snackbar" :color="color" :timeout="timeout"> {{text}} </v-snackbar>
    </v-layout>
</template>
<script>
import FireUi from '~/components/FireUi.vue'
export default {
    layout: 'menu',
    middleware({
        store,
        redirect
    }) {
        if (store.getters['auth/isAuth'] && store.getters['auth/getUser'].admin) {
            return redirect('/')
        }
    },
    data() {
        return {
            login: true,
            snackbar: false,
            text: '',
            color: '',
            timeout: 3500
        }
    },
    components: {
        FireUi
    },
    computed: {
        isAuth() {
            return this.$store.getters['auth/isAuth']
        },
        isAdmin() {
            return this.$store.getters['auth/isAuth']
        },
    },
    mounted() {
        localStorage.removeItem('vuex')
        this.$store.commit('auth/setLastUpdate',0)
        this.$store.commit('auth/setIsAdmin', true)
    },
    watch: {
        isAuth(val) {
            if (val) {
                this.$fireAuth.currentUser.getIdTokenResult().then((idTokenResult) => {
                    this.$store.commit('auth/setIsAdmin', idTokenResult.claims.admin)
                    if (idTokenResult.claims.admin) {
                        this.snackbar = true
                        this.color = 'sucesss'
                        this.text = 'Login Successful'
                        setTimeout(() => {
                            this.$router.push('/')
                        }, 1000)
                    } else {
                        this.snackbar = true
                        this.color = 'error'
                        this.text = 'Unauthorized Access'
                        setTimeout(() => {
                            this.$fireAuth.signOut()
                        }, 1000)
                    }
                })
            }
        }
    }
};
</script>
