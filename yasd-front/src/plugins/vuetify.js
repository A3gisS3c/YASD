import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import i18n from './i18n'

export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          serverCard: '#F5F5F5', //grey-lighten-4
          scaCard: '#F5F5F5',    //grey-lighten-4
          custom1: '#0D47A1'     //blue-darken-4
        }
      },
      dark: {
        dark: true,
        colors: {
          background: '#212121', //grey-darken-4
          serverCard: '#353535',
          scaCard: '#353535',
          custom1: '#1976D2'
        }
      }
    }
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n: i18n.global }),
  },
})
