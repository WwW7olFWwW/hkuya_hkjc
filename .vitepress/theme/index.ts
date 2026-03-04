import type { App } from 'vue'
import Layout from './Layout.vue'
import HomePage from '../../components/HomePage.vue'
import AdminPage from '../../components/admin/AdminPage.vue'
import '../../styles/global.css'
import '../../styles/formkit-admin.css'

function enhanceApp(context: { app: App }) {
  context.app.component('HomePage', HomePage)
  context.app.component('AdminPage', AdminPage)

  if (typeof window !== "undefined") {
    import("@formkit/vue").then(function (formkit) {
      import("../../lib/admin/formkitConfig").then(function (config) {
        context.app.use(formkit.plugin, formkit.defaultConfig(config.default))
      })
    })
  }
}

export default {
  Layout: Layout,
  enhanceApp: enhanceApp
}
