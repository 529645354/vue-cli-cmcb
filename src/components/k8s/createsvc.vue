<template>
    <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
  title="Service创建"
  :show-close="false"
  :visible.sync="show"
  width="60%"
  >
<!-- ｓｖｃ名称 -->
  <el-row>
      <el-col :span="4">
          Service名称:
      <el-input v-model="name" placeholder="Service名称"></el-input>
      </el-col>

  </el-row>
<!-- ｓｖｃ名称 -->
<!-- ｓｖｃ类型 -->
 <el-divider content-position="left">Service 类型</el-divider>
<el-row>
  <el-radio v-model="svctype" label="clusterip">ClusterIP</el-radio>
  <el-radio v-model="svctype" label="nodeport">NodePort</el-radio>
  <el-radio v-model="svctype" label="externalname">ExternalName</el-radio>
</el-row>
<!-- ｓｖｃ类型 -->

<!-- clusterip  -->
<div class="type" v-if="svctype === 'clusterip'">
 <el-divider content-position="left">ClusterIP</el-divider>
 <el-row style="padding-top: 10px" :gutter="10">
     <el-col :span="4">
         置为无头服务:
         <el-switch content="置为无头服务" v-model="clusterips.headless" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
     </el-col>
 </el-row>

 <el-row style="padding-top: 10px" :gutter="10" v-for="(sk, index) in selector" :key="'1'+index">
     <el-col :span="4">Selector Key: <el-input v-model="sk.key"></el-input></el-col>
     <el-col :span="4">Selector Value: <el-input v-model="sk.value"></el-input></el-col>
     <el-col :span="4">
        <el-tooltip class="item" effect="dark" content="删除selector" placement="right">
        <el-button @click="deleteselector(index)" type="danger" icon="el-icon-delete" circle></el-button>
        </el-tooltip>
     </el-col>
 </el-row>

 <el-row style="padding-top: 10px" :gutter="10" v-for="(p ,pindex) in clusterips.ports" :key="'2'+pindex">
     <el-col :span="4">
         port:
         <el-input v-model.number="p.port" placeholder="暴露于集群的端口"></el-input>
     </el-col>
     <el-col :span="4">
         targetPort:
         <el-input v-model.number="p.targetPort" placeholder="容器内端口"></el-input>
     </el-col>
     <el-col :span="4">
         协议类型:
         <el-select v-model="p.protocol" placeholder="选择端口协议类型">
            <el-option
            v-for="item in protocoltype"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
     </el-col>
     <el-col :span="4">
        <el-tooltip class="item" effect="dark" content="删除port" placement="right">
        <el-button @click="deleteclusteripport(pindex)" type="danger" icon="el-icon-delete" circle></el-button>
        </el-tooltip>
     </el-col>
 </el-row>
    <!-- 增加port -->
    <el-row style="padding-top: 10px">
        <el-col :span="4">
            <el-tooltip class="item" effect="dark" content="增加port" placement="right">
            <el-button @click="addclusteripport()" icon="el-icon-plus" circle></el-button>
            </el-tooltip>
        </el-col>
        <el-col :span="4">
            <el-tooltip class="item" effect="dark" content="增加selector" placement="right">
            <el-button @click="addSelector()" icon="el-icon-top-right" circle></el-button>
            </el-tooltip>
        </el-col>
    </el-row>
    <!-- 增加port -->
</div>
<!-- clusterip  -->

<!-- externalnames -->
<div class="type" v-if="svctype === 'externalname'">
    <el-divider content-position="left">ExternalName</el-divider>
    <el-row style="padding-top: 10px">
        <el-col :span="8">
            输入Service映射的DNS:
            <el-input v-model="externalnames" placeholder="输入DNS"></el-input>
        </el-col>
    </el-row>
</div>
<!-- externalnames -->

<!-- nodeport  -->
<div class="type" v-if="svctype === 'nodeport'">
 <el-divider content-position="left">NodePort</el-divider>
 <el-row style="padding-top: 10px" :gutter="10" v-for="(sk, index) in selector" :key="'3'+index">
     <el-col :span="4">Selector Key: <el-input v-model="sk.key"></el-input></el-col>
     <el-col :span="4">Selector Value: <el-input v-model="sk.value"></el-input></el-col>
     <el-col :span="4">
        <el-tooltip class="item" effect="dark" content="删除selector" placement="right">
        <el-button @click="deleteselector(index)" type="danger" icon="el-icon-delete" circle></el-button>
        </el-tooltip>
     </el-col>
 </el-row>

 <el-row style="padding-top: 10px" :gutter="10" v-for="(p ,pindex) in nodeports.ports" :key="'4'+pindex">
     <el-col :span="4">
         port:
         <el-input v-model.number="p.port" placeholder="暴露于集群的端口"></el-input>
     </el-col>
     <el-col :span="4">
         targetPort:
         <el-input v-model.number="p.targetPort" placeholder="容器内端口"></el-input>
     </el-col>
     <el-col :span="4">
         协议类型:
         <el-select v-model="p.protocol" placeholder="选择端口协议类型">
            <el-option
            v-for="item in protocoltype"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
     </el-col>
     <el-col :span="4">
        <el-tooltip class="item" effect="dark" content="删除port" placement="right">
        <el-button @click="deletenodeportport(pindex)" type="danger" icon="el-icon-delete" circle></el-button>
        </el-tooltip>
     </el-col>
 </el-row>
    <!-- 增加port -->
    <el-row style="padding-top: 10px">
        <el-col v-if="svctype === 'clusterip'" :span="4">
            <el-tooltip class="item" effect="dark" content="增加port" placement="right">
            <el-button @click="addclusteripport()" icon="el-icon-plus" circle></el-button>
            </el-tooltip>
        </el-col>
        <el-col v-if="svctype === 'nodeport'" :span="4">
            <el-tooltip class="item" effect="dark" content="增加port" placement="right">
            <el-button @click="addnodeportport()" icon="el-icon-plus" circle></el-button>
            </el-tooltip>
        </el-col>
        <el-col v-if="svctype === 'nodeport'||svctype === 'clusterip'" :span="4">
            <el-tooltip class="item" effect="dark" content="增加selector" placement="right">
            <el-button @click="addSelector()" icon="el-icon-top-right" circle></el-button>
            </el-tooltip>
        </el-col>
    </el-row>
    <!-- 增加port -->
</div>
<!-- nodeport  -->

<el-row style="padding-top: 20px">
<span >
    <el-button @click="close()">取 消</el-button>
    <el-button type="primary" @click="submit()">确 定</el-button>
  </span>
  </el-row>
</el-dialog>
</template>

<script>
export default {
  props: {
    show: Boolean,
    namespace: String
  },
  methods: {
    submit () {
      if (this.svctype === 'clusterip') {
        this.$axios.post('k8s/createsvc', { name: this.name, type: this.svctype, clusterip: this.clusterips, selector: this.selector, namespace: this.namespace })
          .then(res => {
            if (res.data.status === 200) {
              this.$notify.success({
                title: '成功！',
                message: '提交成功！'
              })
              this.$emit('close')
            } else {
              (
                this.$notify.error({
                  title: '失败！',
                  message: '创建失败！内容格式错误或目标已存在'
                })
              )
            }
          })
          .catch(err => {
            console.error(err)
          })
      } else if (this.svctype === 'nodeport') {
        this.$axios.post('k8s/createsvc', { name: this.name, type: this.svctype, nodeport: this.nodeports, selector: this.selector, namespace: this.namespace })
          .then(res => {
            if (res.data.status === 200) {
              this.$notify.success({
                title: '成功！',
                message: '提交成功！'
              })
              this.$emit('close')
            } else {
              (
                this.$notify.error({
                  title: '失败！',
                  message: '创建失败！内容格式错误或目标已存在'
                })
              )
            }
          })
          .catch(err => {
            console.error(err)
          })
      } else {
        this.$axios.post('k8s/createsvc', { name: this.name, type: this.svctype, externalname: this.externalnames, namespace: this.namespace })
          .then(res => {
            if (res.data.status === 200) {
              this.$notify.success({
                title: '成功！',
                message: '提交成功！'
              })
              this.$emit('close')
            } else {
              (
                this.$notify.error({
                  title: '失败！',
                  message: '创建失败！内容格式错误或目标已存在'
                })
              )
            }
          })
          .catch(err => {
            console.error(err)
          })
      }
    },
    addSelector () {
      this.selector.push({
        key: null,
        value: null
      })
    },
    deleteselector (index) {
      this.selector.splice(index, 1)
    },
    close () {
      this.$emit('close')
    },
    addnodeportport () {
      this.nodeports.ports.push({
        protocol: null,
        targetPort: null,
        port: null
      })
    },
    deletenodeportport (index) {
      this.nodeports.ports.splice(index, 1)
    },
    addclusteripport () {
      this.clusterips.ports.push({
        protocol: null,
        targetPort: null,
        port: null
      })
    },
    deleteclusteripport (index) {
      this.clusterips.ports.splice(index, 1)
    }
  },
  data () {
    return {
      protocoltype: [{
        value: 'TCP',
        label: 'TCP'
      },
      {
        value: 'UDP',
        label: 'UDP'
      },
      {
        value: 'SCTP',
        label: 'SCTP'
      }],
      name: null,
      selector: [{
        key: null,
        value: null
      }],
      svctype: 'clusterip',
      clusterips: {
        headless: false,
        ports: [{
          protocol: null,
          targetPort: null,
          port: null
        }]
      },
      nodeports: {
        ports: [{
          protocol: null,
          targetPort: null,
          port: null
        }]
      },
      externalnames: null
    }
  }
}
</script>
<style>
.type {
    padding-top: 10px;
}
</style>
