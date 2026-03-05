import type { App } from 'vue'
import Layout from './Layout.vue'
import HomePage from '../../components/HomePage.vue'
import AdminPage from '../../components/admin/AdminPage.vue'
import '../../styles/global.css'

function enhanceApp(context: { app: App }) {
  context.app.component('HomePage', HomePage)
  context.app.component('AdminPage', AdminPage)
}

export default {
  Layout: Layout,
  enhanceApp: enhanceApp
}
