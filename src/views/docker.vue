<template>
    <div element-loading-text="正在链接中．．．" v-loading="loading">
        <el-button type="text" @click="addDockeServer">添加docker服务器</el-button>
        <el-card shadow="hover" v-for="(docker,index) in dockerData" :key="index">
            <div class="name conf"><li class="el-icon-monitor"></li><span>服务器名：{{ docker.name }}</span></div>
            <div class="ip conf"><li class="el-icon-s-promotion"></li><span>docker链接：{{ docker.ipaddr }}</span></div>
            <div class="port conf"><li class="el-icon-full-screen"></li><span>链接端口：{{ docker.port }}</span></div>
            <div class="conf">
                <el-tooltip content="进入" placement="left">
                <el-button @click="ConnServer(docker.id)"  type="primary" icon="el-icon-connection" circle></el-button></el-tooltip>
                <el-tooltip content="删除" placement="right">
                <el-button @click="deleteServer(docker.id)" type="danger" icon="el-icon-delete" circle></el-button></el-tooltip>
            </div>
        </el-card>
        <dockerdialog v-on:MyRefreshData="RefreshData" />
    </div>
</template>

<script>
import dockerdialog from '@/components/dockerdialog.vue'
export default {
  data () {
    return {
      dockerData: [],
      loading: false
    }
  },
  components: {
    dockerdialog
  },
  methods: {
    ConnServer (id) {
      this.loading = true
      this.$axios.post('api/conn-docker-server/', { id: id })
        .then(res => {
          this.loading = false
          console.log(res.data.status)
          if (res.data.status === 200) {
            this.$store.commit('dockerServerView', res.data.addr)
            console.log(this.$store.state.remoteaddr)
            this.$router.replace('docker-server')
          }
          if (res.data.status === 33342) {
            this.$notify.error({
              title: '错误',
              message: '链接超时！'
            })
          }
          if (res.data.status === 33341) {
            this.$notify.error({
              title: '错误',
              message: '无法链接到服务器！'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    RefreshData () {
      console.log('111')
      this.getData()
    },
    getData () {
      this.$axios.get('api/docker/')
        .then(res => {
          if (res.data.status === 200) {
            this.dockerData = res.data.content
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    addDockeServer () {
      this.$store.commit('showDockerDialog')
    },
    deleteServer (id) {
      this.$axios.delete('api/docker/', { data: { serverid: id } })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '删除成功！'
            })
          }
          this.getData()
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style>
    .conf {
        padding-top: 20px;
        padding-left: 10px;
    }
    .el-card {
        margin-top: 10px;
    }
</style>
