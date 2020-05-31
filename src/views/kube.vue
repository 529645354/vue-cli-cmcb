<template>
<div class="kube">
<headers />
<node class="row" />
<el-divider  content-position="left">DeployMent And Pod</el-divider>
<el-row class="row" :gutter="20">
  <el-col :span="12">
      <deployment />
  </el-col>
  <el-col :span="12">
    <pod />
  </el-col>
</el-row>
<el-divider  content-position="left">Service And Ingress</el-divider>
<el-row class="row" :gutter="20">
  <el-col :span="12"><service /></el-col>
  <el-col :span="12"><ingress /></el-col>
</el-row>
<el-divider  content-position="left">Pv And Pvc</el-divider>
<el-row class="row" :gutter="20">
  <el-col :span="13"><pv /></el-col>
  <el-col :span="11"><pvc /></el-col>
</el-row>
</div>
</template>

<script>
import deployment from '@/components/k8s/deployment.vue'
import pod from '@/components/k8s/pod.vue'
import service from '@/components/k8s/service.vue'
import ingress from '@/components/k8s/ingress.vue'
import pv from '@/components/k8s/pv.vue'
import pvc from '@/components/k8s/pvc.vue'
import headers from '@/components/k8s/header.vue'
import node from '@/components/k8s/node.vue'
export default {
  components: {
    deployment,
    pod,
    service,
    ingress,
    pv,
    pvc,
    headers,
    node
  }
}
</script>
<style>
.row {
  margin-top: 20px;
}
.kube {
        position: absolute;
        height: 1080px;
        width: 85%;
        overflow-y: scroll;
}
.kube::-webkit-scrollbar{
        width: 0px;
    }
</style>
