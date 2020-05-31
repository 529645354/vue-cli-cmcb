<template>
<div v-if="this.$store.state.dView">
  <el-button type="text" @click="out">退出服务器</el-button>
<el-row :gutter="12">
  <el-col :span="8">
    <el-card shadow="always">
        <li class="el-icon-coin"></li>
      镜像数量：{{ num }}
    </el-card>
  </el-col>
  <el-col :span="8">
    <el-card shadow="always">
        <li class="el-icon-loading el-icon-refresh"></li>
      正在运行的容器：{{ run }}
    </el-card>
  </el-col>
  <el-col :span="8">
    <el-card shadow="always">
        <li class="el-icon-video-pause"></li>
      未运行的容器：{{ stop }}
    </el-card>
  </el-col>
</el-row>
<el-row class="server" :gutter="12">
  <el-col :span="12">
      <el-card class="run-docker">
  <div  class="text item">
    <dockerimage @imagenum="imageNum"/>
  </div>
</el-card>
  </el-col>

  <el-col :span="12">
      <el-card class="run-docker">
  <div class="text item">
    <runcontainers @RunAndStop="RunAndStopNumber"/>
  </div>
</el-card>
  </el-col>

</el-row>

<el-row class="server" :gutter="12">
  <el-col :span="10" >
      <el-card class="run-docker">
  <search />
</el-card>
  </el-col>

  <el-col :span="14">
      <el-card class="run-docker">
  <network />
</el-card>
  </el-col>
</el-row>
</div>
</template>

<script>
import dockerimage from '@/components/docker/image.vue'
import runcontainers from '@/components/docker/runcontainer.vue'
import search from '@/components/docker/search.vue'
import network from '@/components/docker/network.vue'
export default {
  data () {
    return {
      num: null,
      run: null,
      stop: null
    }
  },
  components: {
    dockerimage,
    runcontainers,
    search,
    network
  },
  methods: {
    RunAndStopNumber (run, stop) {
      this.run = run
      this.stop = stop
    },
    imageNum (data) {
      this.num = data
      console.log(this.num)
    },
    out () {
      this.$store.commit('outDockerServer')
      this.$router.replace('docker')
    }
  }
}
</script>
<style>
    .server {
        margin-top: 20px;
    }
</style>
