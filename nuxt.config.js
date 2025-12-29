export default defineNuxtConfig({
  app: {
    head: {
      title: 'roi-calculator-nuxt',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },

  css: ['~/assets/css/main.css'],

  components: true,

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n'
  ],

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    lazy: true,
    langDir: 'locales',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'zh', name: '简体中文', file: 'zh.json' }
    ]
  },

  build: {}
})
