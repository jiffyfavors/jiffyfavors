module.exports = {

  mode: 'spa',
  pwa:{
    meta:{viewport:'width=device-width, initial-scale=1, user-scalable=no'},
    manifest: {
      name:'JF Rider',
      lang:'en',
      display:'standalone',
      background_color:'#ffff'

    }
  },
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/Loading.vue',

  /*
   ** Global CSS
   */
  css: [
    '@assets/main.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/main', { src: '~/plugins/localStorage.js', ssr: false }],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
 
    '@nuxtjs/pwa',
    ['nuxt-gmaps', {
      key: 'AIzaSyDX-atoLm6nQpMgQ_GYHIo1kiscAe5txXc'
    }],
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: 'AIzaSyDX-atoLm6nQpMgQ_GYHIo1kiscAe5txXc',
          authDomain: 'sound-aileron-279710.firebaseapp.com',
          databaseURL: 'https://sound-aileron-279710.firebaseio.com',
          projectId: 'sound-aileron-279710',
          storageBucket: 'sound-aileron-279710.appspot.com',
          messagingSenderId: '953894101400',
          appId: '1:953894101400:web:c06b9af64f518a17f14bed',
          measurementId: 'G-RLCD9YBDHX'
        },
        services: {
          storage: true,
          firestore: {
            memoryOnly: false,
            enablePersistence: true
          },
          auth: {
            persistence: 'local',
            initialize: {
              onAuthStateChangedAction: 'auth/onAuthStateChanged'
            }
          }
        }
      }
    ]
  ],

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: '#1976d2',
          accent: '#37474f',
          secondary: '#ff8f00',
          info: '#26a69a',
          warning: '#ffc107',
          error: '#dd2c00',
          success: '#00e676'
        }
      }
    }
  },
  buildDir: 'nuxt',

  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    /*
     ** You can extend webpack config here
     */
    extend (config, ctx) {}
  }
}
