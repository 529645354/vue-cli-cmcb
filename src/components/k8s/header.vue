<template>
    <div>
        <el-breadcrumb separator="/">
  <el-breadcrumb-item>
    <el-dropdown  @command="handleCommand">
    <span class="el-dropdown-link">
        ConfigMap<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu  slot="dropdown">
        <el-dropdown-item   v-for="(item, index) in namespace" :command="item" :key="index">{{ item }}</el-dropdown-item>
    </el-dropdown-menu>
    </el-dropdown>
</el-breadcrumb-item>

  <el-breadcrumb-item>
    <el-dropdown  @command="handleCommandSecret">
    <span class="el-dropdown-link">
        Secret<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu  slot="dropdown">
        <el-dropdown-item   v-for="(item, index) in namespace" :command="item" :key="index">{{ item }}</el-dropdown-item>
    </el-dropdown-menu>
    </el-dropdown>
</el-breadcrumb-item>

<el-breadcrumb-item>
    <el-dropdown  @command="handleCommandEvent">
    <span class="el-dropdown-link">
        Event<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu  slot="dropdown">
        <el-dropdown-item   v-for="(item, index) in namespace" :command="item" :key="index">{{ item }}</el-dropdown-item>
    </el-dropdown-menu>
    </el-dropdown>
</el-breadcrumb-item>

 <el-breadcrumb-item><a href="#" @click="CreateNameSpace">创建命名空间</a></el-breadcrumb-item>
  <el-breadcrumb-item><a href="#" @click="flushnamespace">刷新命名空间</a></el-breadcrumb-item>
   <el-breadcrumb-item><a href="#" @click="deletenamespace()">删除命名空间</a></el-breadcrumb-item>
  <el-breadcrumb-item></el-breadcrumb-item>

</el-breadcrumb>
<configmapdata @flush="flushconfigmapdata" :namespace="datanamespace" :content.sync="configdata"/>
<secret @flush="flushsecretdata" :namespace="datanamespace" :content.sync="secretdata"/>
<event @flush="flushevent" :namespace="datanamespace" :content.sync="eventdata"/>
<createnamespace :show.sync="show" @close="closecreatenamespace" />
<deletenamespace :namespace="namespace" :show.sync="deleteshow" @close="closedeletenamespace"/>
    </div>
</template>

<script>
import configmapdata from '@/components/k8s/configmapdata.vue'
import secret from '@/components/k8s/secretdata.vue'
import event from '@/components/k8s/event.vue'
import createnamespace from '@/components/k8s/createnamespace.vue'
import deletenamespace from '@/components/k8s/deletenamespace.vue'
export default {
  data () {
    return {
      namespace: [],
      datanamespace: null,
      configdata: null,
      secretdata: null,
      eventdata: null,
      show: false,
      deleteshow: false
    }
  },
  components: {
    secret,
    configmapdata,
    event,
    createnamespace,
    deletenamespace
  },
  methods: {
    closedeletenamespace () {
      this.deleteshow = false
    },
    deletenamespace () {
      this.deleteshow = true
    },
    flushnamespace () {
      this.getnamespaces()
      this.$notify.success({
        title: '成功！',
        message: '刷新成功！'
      })
    },
    CreateNameSpace () {
      this.show = true
    },
    closecreatenamespace () {
      this.show = false
    },
    handleCommandEvent (command) {
      this.$axios.get('k8s/eventlist', { params: { namespace: command } })
        .then(res => {
          if (res.data.status === 200) {
            this.eventdata = res.data.content
            this.datanamespace = command
            this.$store.commit('showeventdialog')
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    handleCommandSecret (command) {
      this.$axios.get('k8s/secretlist', { params: { namespace: command } })
        .then(res => {
          if (res.data.status === 200) {
            this.secretdata = res.data.content
            this.datanamespace = command
            this.$store.commit('showsecretdata')
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    flushevent () {
      this.$axios.get('k8s/eventlist', { params: { namespace: this.datanamespace } })
        .then(res => {
          if (res.data.status === 200) {
            this.eventdata = res.data.content
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    flushsecretdata () {
      this.$axios.get('k8s/secretlist', { params: { namespace: this.datanamespace } })
        .then(res => {
          if (res.data.status === 200) {
            this.secretdata = res.data.content
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    flushconfigmapdata () {
      this.$axios.get('k8s/configmaplist', { params: { namespace: this.datanamespace } })
        .then(res => {
          if (res.data.status === 200) {
            this.configdata = res.data.content
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    handleCommand (command) {
      this.$axios.get('k8s/configmaplist', { params: { namespace: command } })
        .then(res => {
          if (res.data.status === 200) {
            this.datanamespace = command
            this.configdata = res.data.content
            this.$store.commit('showconfigmapdata')
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    getnamespaces () {
      this.$axios.get('k8s/namespace')
        .then(res => {
          if (res.data.status === 200) {
            this.namespace = res.data.namespace
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  mounted () {
    this.getnamespaces()
  }
}
</script>
