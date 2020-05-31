<template>
<div>
  <createingress :show.sync="show" :namespace="namespace" @close="closeingress"/>
    <el-card class="box-card">
    <div slot="header" class="clearfix">
        <el-row>
        <el-col :span="24"><el-tag>当前名称空间：{{ namespace }}</el-tag></el-col>
      </el-row>
      <el-divider></el-divider>
    <el-row>
      <el-col :span="4"><span>ingress</span></el-col>
      <el-col :span="4">
          <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button @click="flush()" icon="el-icon-refresh-right" circle></el-button>
          </el-tooltip>
          </el-col>
      <el-col :span="6"><el-button style="float: right; padding: 3px 0" type="text">
          <el-dropdown  @command="handleCommand" type="primary">
  <span class="el-dropdown-link">
    切换名称空间<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item v-for="(item,index) in getnamespace" :key="index" :command="item">{{ item }}</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown></el-button></el-col>
      <el-col :span="10"><el-button @click="createingressd" style="float: right; padding: 3px 0" type="text">创建ingress</el-button></el-col>
    </el-row>
    </div>

    <el-table
    v-loading="loading"
    height="400"
    max-height="400"
    :data="tableData"
    style="width: 100%">
    <el-table-column
      label="名称"
      prop="name">
    </el-table-column>
    <el-table-column
      label="rule">
      <template slot-scope="scope">
        <el-popover trigger="hover" v-for="(rule,index) in scope.row.rules" :key="index" placement="left">
          <p v-for="(b,index) in rule.backends" :key="index">path：{{ b.path }}, ｜service名称：{{ b.service_name }}, ｜service端口：{{ b.service_port }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ rule.host }}</el-tag>
            <el-divider></el-divider>
          </div>
        </el-popover>
      </template>
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
import createingress from '@/components/k8s/createingress.vue'
export default {
  data () {
    return {
      loading: true,
      namespace: 'default',
      tableData: [],
      getnamespace: [],
      show: false
    }
  },
  components: {
    createingress
  },
  methods: {
    closeingress () {
      this.show = false
    },
    createingressd () {
      this.show = true
    },
    flush () {
      this.tableData = null
      this.getnamespaces()
      this.getingress()
    },
    getnamespaces () {
      this.$axios.get('k8s/namespace')
        .then(res => {
          if (res.data.status === 200) {
            this.getnamespace = res.data.namespace
          }
          console.log(this.getnamespace)
        })
        .catch(err => {
          console.error(err)
        })
    },
    getingress () {
      this.loading = true
      this.$axios.get('k8s/ingresslist', { params: { namespace: this.namespace } })
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
      this.getingress()
    },
    handleDelete (index, row) {
      this.$axios.delete('k8s/deleteingress', { params: { namespace: this.namespace, ingress: row.name } })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '删除ingress' + row.name + '成功！'
            })
          } else {
            this.$notify.error({
              title: '失败！',
              message: '删除ingress' + row.name + '失败！'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
      this.flush()
    }
  },
  mounted () {
    this.getnamespaces()
    this.getingress()
  }
}
</script>
