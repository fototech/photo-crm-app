import { boot } from 'quasar/wrappers'
import axios from 'axios'

axios.defaults.baseURL = 'http://192.168.29.89:8000/api/crm'

export default boot(({ app }) => {
    // Optional: you can add axios globally to Vue
    app.config.globalProperties.$axios = axios
})

export { axios }