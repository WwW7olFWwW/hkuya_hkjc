import type { App } from 'vue'
import Layout from './Layout.vue'
import HomePage from '../../components/HomePage.vue'
import '../../styles/global.css'

function enhanceApp(context: { app: App }) {
  context.app.component('HomePage', HomePage)
}

export default {
  Layout: Layout,
  enhanceApp: enhanceApp
}
