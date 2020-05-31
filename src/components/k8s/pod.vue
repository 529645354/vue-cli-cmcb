<template>
<div>
    <kubeyaml  :pod="podname" :content="podspec"/>
    <createpod @close="closecreatepod" :createtype="ctype" :title="title" :show.sync="show" :namespace="namespace"/>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
    <el-row>
        <el-col :span="24"><el-tag>当前名称空间：{{ namespace }}</el-tag></el-col>
      </el-row>
      <el-divider></el-divider>
    <el-row>
      <el-col :span="4">Pod</el-col>
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
        <el-button @click="createpod()" style="float: right; padding: 3px 0" type="text">创建Pod</el-button>
    </el-col>
    </el-row>
  </div>
  <el-table
    empty-text="该名称空间下没有pod"
    v-loading="loading"
    :data="tableData"
    height="400"
    style="width: 100%；box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)"
    max-height="400">
    <el-table-column
      fixed
      label="名称"
      width="150">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="left">
          <p>pod: {{ scope.row.name }}</p>
          <p>label: {{ scope.row.label }}</p>
          <div slot="reference" class="name-wrapper">
            {{ scope.row.name }}
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      prop="label"
      label="label"
      width="150">
    </el-table-column>
    <el-table-column
      prop="host_ip"
      label="运行节点ip"
      width="120">
    </el-table-column>
    <el-table-column
      prop="node_name"
      label="节点名称"
      width="120">
    </el-table-column>
    <el-table-column
      prop="pod_ip"
      label="pod地址"
      width="120">
    </el-table-column>
    <el-table-column
      prop="pod_status"
      label="pod状态"
      width="300">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="120">
      <template slot-scope="scope">
          <el-button
          @click.native.prevent="GetJson(scope.$index, tableData)"
          type="text"
          size="small">
          查看json
        </el-button>
        <el-button
          @click.native.prevent="deleteRow(scope.$index, tableData)"
          type="text"
          size="small">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
    </el-card>
</div>
</template>
<script>
import kubeyaml from '@/components/k8s/kubeyaml.vue'
import createpod from '@/components/k8s/createpod.vue'
export default {
  components: {
    kubeyaml,
    createpod
  },
  mounted () {
    this.getpod()
    this.getnamespace()
  },
  methods: {
    closecreatepod () {
      this.show = false
    },
    createpod () {
      // this.$store.commit('showcreatdpod')
      this.show = true
    },
    GetJson (index, tableData) {
      this.$axios.get('k8s/getpod', { params: { namespace: this.namespace, pod: tableData[index].name } })
        .then(res => {
          if (res.data.status === 200) {
            this.podspec = res.data.content
            this.$store.commit('showkubeyaml')
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    flush () {
      this.tableData = null
      this.getpod()
      this.getnamespace()
    },
    handleCommand (command) {
      this.namespace = command
      this.getpod()
    },
    deleteRow (index, rows) {
      this.$axios.delete('k8s/deletepod', { params: { namespace: this.namespace, pod: rows[index].name } })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '删除pod' + rows[index].name + '成功！'
            })
          } else {
            this.$notify.error({
              title: '错误！',
              message: '删除pod' + rows[index].name + '失败！'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
      this.flush()
    },
    getpod () {
      this.loading = true
      this.$axios.get('k8s/podlist', { params: { namespace: this.namespace } })
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
    }
  },
  data () {
    return {
      podspec: null,
      podname: null,
      loading: true,
      namespace: 'default',
      namespacelist: [],
      tableData: [],
      show: false,
      title: '创建Pod',
      ctype: 'pod'
    }
  }
}
</script>
<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
