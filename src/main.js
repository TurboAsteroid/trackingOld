import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'
import L from 'leaflet/dist/leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'
// import io from 'socket.io-client'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

// eslint-disable-next-line
String.prototype.replaceAll = function (target, replacement) {
    return this.split(target).join(replacement)
}
// eslint-disable-next-line
Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length)
    this.length = from < 0 ? this.length + from : from
    return this.push.apply(this, rest)
}

// const mainSocket = {
//   connect: () => {
//     console.log('socket connected')
//   },
//   disconnect: () => {
//     console.log('socket disconnected. we are so sorry. reconnecting...')
//   },
// }
// const sockets = Object.assign({}, mainSocket)
// Vue.prototype.$socket = io('http://admin:admin@10.1.255.208:9999/api/socket')
// const keys = Object.keys(sockets)
// for (let i = 0; i < keys.length; i++) {
//   Vue.prototype.$socket.on(keys[i], async (res) => {
//     await sockets[keys[i]](res)
//   })
// }

Vue.use(Vuetify)
Vue.config.productionTip = false
Vue.prototype.$l = L
Vue.prototype.$app_version = 0.1
Vue.prototype.$axios = axios
Vue.prototype.$axios.defaults.auth = {
    username: 'admin',
    password: 'admin'
}

new Vue({
    render: h => h(App),
}).$mount('#app')
