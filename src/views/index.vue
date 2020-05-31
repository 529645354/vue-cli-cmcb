<template>
<div>
    <el-row :gutter="20">
      <el-col :span="6"><mem v-bind:memvalue="this.data.content.mem"></mem></el-col>
      <el-col :span="8"><cpu v-bind:cpu_state="this.data.content.cpu"></cpu></el-col>
      <el-col :span="10"><outputnet v-bind:network="this.data.content.network" title="网卡上行流量: kb/s" cid="c1"></outputnet></el-col>
    </el-row>
    <el-row id='row2' :gutter="40">
      <el-col :span="10"><outputnet v-bind:network="this.data.content.innetwork" title="网卡下行流量: kb/s" cid="c2"></outputnet></el-col>
      <el-col :span="7"><disk did="d1" title="磁盘已使用容量：G" :diskname="this.data.content.disk.device_name" :cap="this.data.content.disk.disk_free"></disk></el-col>
      <el-col :span="7"><disk did="d2" title="磁盘未使用容量：G" :diskname="this.data.content.disk.device_name" :cap="this.data.content.disk.disk_use"></disk></el-col>
    </el-row>
</div>
</template>

<script>
import mem from '@/components/mem.vue'
import cpu from '@/components/cpu.vue'
import outputnet from '@/components/net_output.vue'
import disk from '@/components/disk.vue'
export default {
  data () {
    return {
      load: null,
      websock: null,
      data: null
    }
  },
  name: 'index',
  components: {
    mem,
    cpu,
    outputnet,
    disk
  },
  methods: {
    initWebSocket () {
      this.websock = new WebSocket('ws://192.168.1.104:8080/deploy')
      this.websock.onmessage = this.websockMessage
      this.websock.onclose = this.websockGet
    },
    websockMessage (e) {
      this.data = JSON.parse(e.data)
    },
    websockGet () {
      this.websock.send(1)
    },
    websockonClose () {
      console.log('close')
      this.load.loading({
        lock: true,
        text: '与服务器断开正在重新加载',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.initWebSocket()
    }
  },
  created () {
    this.load = this.$loading({
      lock: true,
      text: '正在加载数据',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  },
  mounted () {
    this.initWebSocket()
    setInterval(() => {
      this.websockGet()
    }, 500)
    var getid = setInterval(() => {
      if (document.getElementById('mem')) {
        clearInterval(getid)
        this.load.close()
      }
    }, 1000)
  }
}

</script>
<style>
  #row2{
    margin-top: 20px;
  }
</style>
