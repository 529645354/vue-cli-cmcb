import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    visit: true,
    dockerdialogfrom: false,
    dockerServer: '',
    dView: false,
    remoteaddr: null,
    tagdialog: false,
    runcontainer: false,
    createnetwork: false,
    kubeyaml: false,
    configmapdata: false,
    secretdata: false,
    eventdialog: false
  },
  mutations: {
    showeventdialog (state) {
      state.eventdialog = true
    },
    hideeventdialog (state) {
      state.eventdialog = false
    },
    hidesecretdata (state) {
      state.secretdata = false
    },
    showsecretdata (state) {
      state.secretdata = true
    },
    showconfigmapdata (state) {
      state.configmapdata = true
    },
    hideconfigmapdata (state) {
      state.configmapdata = false
    },
    showkubeyaml (state) {
      state.kubeyaml = true
    },
    hidekubeyaml (state) {
      state.kubeyaml = false
    },
    showv (state) {
      state.visit = false
    },
    hidev (state) {
      state.visit = true
    },
    showDockerDialog (state) {
      state.dockerdialogfrom = true
    },
    hideDockerDialog (state) {
      state.dockerdialogfrom = false
    },
    dockerServerView (state, addr) {
      state.dView = true
      state.remoteaddr = addr
    },
    outDockerServer (state) {
      state.dView = false
      state.remoteaddr = null
    },
    showTagdialog (state) {
      state.tagdialog = true
    },
    hideTagdialog (state) {
      state.tagdialog = false
    },
    showRunContainer (state) {
      state.runcontainer = true
    },
    hideRunContainer (state) {
      state.runcontainer = false
    },
    showCreateNetWork (state) {
      state.createnetwork = true
    },
    hideCreateNetWork (state) {
      state.createnetwork = false
    }
  },
  actions: {
  },
  modules: {
  }
})
