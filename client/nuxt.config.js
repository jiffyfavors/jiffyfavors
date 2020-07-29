module.exports = {
  mode: 'universal',
  parallel: true,
  pwa: {
    meta: { viewport: 'width=device-width, initial-scale=1, user-scalable=no' },
    manifest: {
      name: 'Jiffy Favors',
      lang: 'en',
      short_name: 'Jiffy Favors',
      categories: ['bills payment', 'online shopping', 'food delivery'],
      display: 'standalone',
      orientation: 'portrait',
      description: 'Food Delivery, Bills Payment and Virtual Shopping',
      background_color: '#ffff',
      theme_color:'#00aff0',
      icons: [
        {
          src: '/icon.png',
          type: 'image/png',
          sizes: '512x512'
        },
        {
          src: '/icon-96px.png',
          type: 'image/png',
          sizes: '96x96'
        },
        {
          src: '/icon-192px.png',
          type: 'image/png',
          sizes: '192x192'
        }
      ]
    }
  },

  head: {
    titleTemplate: '%s - ' + process.env.npm_package_long_name,
    title: process.env.npm_package_long_name || '',
    meta: [
      { charset: 'utf-8' },
      {
        hid: 'og:locale',
        name: 'og:locale',
        content: 'en_PH'
      },
      {
        hid: 'facebook-domain-verification-1',
        name: 'facebook-domain-verification',
        content: 'wj2a5oesll4fu44nent9v7b4965dnv'
      },
      {
        hid: 'facebook-domain-verification-2',
        name: 'facebook-domain-verification',
        content: 'l4enhrriob3txta60i0drvtlq3pg2k'
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
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
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
    { src: '~/plugins/localStorage.js', ssr: false },
    { src: '~/plugins/fns.js', mode: 'client' },
      { src: '~/plugins/ga.js', mode: 'client' }
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
          measurementId: 'G-RLCD9YBDHX',
          fcmPublicVapidKey:'BMoNvS6eRymi6FLK_wyxXPs5AMR_s67WiBSZMM1Re3-Amh3dpP_BwhbMZqMkUiNc6HjXQwjxJBTF83m1yjGka7s'
        },
        onFirebaseHosting: true,
        services: {
          analytics: true,
          functions:true,
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
          },
          messaging: true
        }
      }
    ]
  ],

  axios: {
    proxy: true,
    baseUrl: '/'
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
    extend(config, ctx) {
      // if (ctx.isDev && ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: [/(node_modules)/, /(nuxt)/, /(public)/]
      //   })
      // }
    }
  }
}
