<template>
<div>
  <createsvc :show.sync='showcreate' :namespace="namespace" @close="closecreate"/>
    <el-card class="box-card">
<div slot="header" class="clearfix">
    <el-row>
        <el-col :span="24"><el-tag>当前名称空间：{{ namespace }}</el-tag></el-col>
      </el-row>
      <el-divider></el-divider>
    <el-row>
      <el-col :span="4">Service</el-col>
    <el-col :span="4">
          <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button @click="flush()" icon="el-icon-refresh-right" circle></el-button>
          </el-tooltip>
          </el-col>
    <el-col :span="8">
<el-dropdown @command="handleCommand" type="primary">
  <span class="el-dropdown-link">
    切换名称空间<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
    <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item, index) in namespacelist" :key="index" :command="item">{{ item }}</el-dropdown-item>
    </el-dropdown-menu>
</el-dropdown>
    </el-col>
    <el-col :span="8">
        <el-button @click="createsvc()" style="float: right; padding: 3px 0" type="text">创建Service</el-button>
    </el-col>
    </el-row>
  </div>

  <el-table
    v-loading="loading"
    :data="tableData"
    height="400"
    style="width: 100%">
    <el-table-column
      label="名称"
      prop="name">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="left">
          <p>service: {{ scope.row.name }}</p>
          <p>selector: {{ scope.row.selector }}</p>
          <pre>port: {{ scope.row.port }}</pre>
          <p v-if="scope.row.external_name!= ''">external_name: {{ scope.row.external_name }}</p>
          <p v-for="(ep ,index) in scope.row.endpoints" :key="'e'+index">后端Pod集群地址：{{ ep }}</p>
          <div slot="reference" class="name-wrapper">
            {{ scope.row.name }}
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      label="类型"
      prop="type">
    </el-table-column>
    <el-table-column
      label="集群通信地址"
      prop="cluster_ip">
    </el-table-column>
      <el-table-column
      label="selector"
      prop="selector">
    </el-table-column>
    <el-table-column
      align="right">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
    </el-card>
  </div>
</template>

<script>
import createsvc from '@/components/k8s/createsvc.vue'
export default {
  data () {
    return {
      loading: true,
      tableData: [],
      namespace: 'default',
      namespacelist: [],
      showcreate: false
    }
  },
  components: {
    createsvc
  },
  mounted () {
    this.getservice()
    this.getnamespace()
  },
  methods: {
    closecreate () {
      this.showcreate = false
    },
    createsvc () {
      this.showcreate = true
    },
    flush () {
      this.tableData = null
      this.getservice()
      this.getnamespace()
    },
    getservice () {
      this.loading = true
      this.$axios.get('k8s/servicelist', { params: { namespace: this.namespace } })
        .then(res => {
          if (res.data.status === 200) {
            this.tableData = res.data.content
          }
        })
        .catch(err => {
          console.error(err)
        })
      this.loading = false
    },
    handleCommand (command) {
      this.namespace = command
      this.getservice()
    },
    getnamespace () {
      this.$axios.get('k8s/namespace')
        .then(res => {
          if (res.data.status === 200) {
            this.namespacelist = res.data.namespace
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    handleDelete (index, row) {
      this.$axios.delete('k8s/deleteservice', { params: { namespace: this.namespace, service: row.name } })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '删除service' + row.name + '成功！'
            })
          } else {
            this.$notify.error({
              title: '失败！',
              message: '删除service' + row.name + '失败！'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
      this.flush()
    }
  }
}
</script>
