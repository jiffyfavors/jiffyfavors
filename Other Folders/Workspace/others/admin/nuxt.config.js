module.exports = {
  mode: 'spa',
  parallel: true,
  // server:{
  //   port:8000,
  //   host:'0.0.0.0'
  // },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_long_name,
    title: process.env.npm_package_long_name || '',
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, user-scalable=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/Loading.vue',
  /*
   ** Global CSS
   */
  css: ['@assets/main.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/main',
    {
      src: '~/plugins/localStorage.js',
      ssr: false
    },
    {
      src: '~/plugins/vselectimg',
      mode: 'client'
    },
    {
      src: '~/plugins/fns',
      mode: 'client'
    }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/vuetify'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    'vue-social-sharing/nuxt',
    '@nuxtjs/proxy',
    '@nuxtjs/pwa',
    [
      'nuxt-gmaps',
      {
        key: 'AIzaSyDX-atoLm6nQpMgQ_GYHIo1kiscAe5txXc'
      }
    ],
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
          functions: {
            location: 'us-central1',
            emulatorPort: 5001
          },
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
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true
  },
  proxy: {
    '/distance/': {
      target: 'https://maps.googleapis.com/maps/api/distancematrix/json',
      pathRewrite: {
        '^/distance/': ''
      },
      changeOrigin: true
    }
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module

    vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

   */
  vuetify: {
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
    extend(config, ctx) {}
  }
}
