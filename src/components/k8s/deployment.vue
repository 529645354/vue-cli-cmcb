<template>
<div>
  <createdeploy :show.sync="show" :namespace="namespace" :createtype="ctype" :title="title" @close="close" />
    <el-card class="box-card">
  <div slot="header" class="clearfix">
      <el-row>
        <el-col :span="24"><el-tag>当前名称空间：{{ namespace }}</el-tag></el-col>
      </el-row>
      <el-divider></el-divider>
    <el-row>
      <el-col :span="4"><span>deployment</span></el-col>
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
      <el-col :span="10"><el-button @click="createdeployment()" style="float: right; padding: 3px 0" type="text">创建Deployment</el-button></el-col>
    </el-row>
  </div>
    <el-table
    v-loading="loading"
    height="400"
    :data="tableData"
    style="width: 90%；box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
    <el-table-column
      label="名称">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="left">
          <p>deployment: {{ scope.row.name }}</p>
          <p>label: {{ scope.row.label }}</p>
          <div slot="reference" class="name-wrapper">
            {{ scope.row.name }}
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      label="label"
      prop="label">
    </el-table-column>
      <el-table-column
        label="就绪副本数/总副本数"
        prop="ready">
      </el-table-column>
      <el-table-column
        label="selector"
        prop="selector">
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
import createdeploy from '@/components/k8s/createpod.vue'
export default {
  data () {
    return {
      loading: true,
      namespace: 'default',
      tableData: [],
      getnamespace: [],
      show: false,
      title: '创建Deployment',
      ctype: 'deploy'
    }
  },
  components: {
    createdeploy
  },
  computed: {
    ns () {
      return this.namespace
    }
  },
  methods: {
    createdeployment () {
      this.show = true
    },
    close () {
      this.show = false
    },
    getDeployMent (namespace) {
      this.loading = true
      this.$axios.get('k8s/deployment', {
        params: {
          namespace: namespace
        }
      })
        .then(res => {
          if (res.data.status === 200) {
            this.tableData = res.data.content
          }
        })
      this.loading = false
    },
    flush () {
      this.tableData = null
      this.getDeployMent(this.namespace)
      this.getnamespaces()
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
    handleCommand (command) {
      this.namespace = command
      this.getDeployMent(command)
    },
    handleDelete (index, row) {
      this.$axios.delete('k8s/deletedeploy', { params: { deployment: row.name, namespace: this.namespace } })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '删除deployment' + row.name + '成功！'
            })
          } else {
            this.$notify.error({
              title: '失败！',
              message: '删除deployment' + row.name + '失败！'
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
    this.getDeployMent('default')
  }
}
</script>
