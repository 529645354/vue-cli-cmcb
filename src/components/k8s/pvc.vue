<template>
    <div>
      <createpvc :ctype="type" :show.sync="show" :title="title" @close="closepvc" :namespace="namespace"/>
        <el-card class="box-card">
  <div slot="header" class="clearfix">
    <el-row>
        <el-col :span="24"><el-tag>当前名称空间：{{ namespace }}</el-tag></el-col>
      </el-row>
      <el-divider></el-divider>
    <el-row>
      <el-col :span="4"><span>pvc</span></el-col>
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
      <el-col :span="10"><el-button @click="createpvcd" style="float: right; padding: 3px 0" type="text">创建pvc</el-button></el-col>
    </el-row>
  </div>
    <el-table
    max-height="400"
    :data="tableData"
    style="width: 100%">
    <el-table-column
       fixed
      label="名称"
      prop="name">
    </el-table-column>
    <el-table-column
      label="状态"
      prop="status">
    </el-table-column>
    <el-table-column
      label="绑定pv"
      prop="volume_name">
    </el-table-column>
    <el-table-column
      label="capacity"
      prop="capacity">
    </el-table-column>
    <el-table-column
      label="StorageClass"
      prop="storage_class">
    </el-table-column>
    <el-table-column
      label="ACCESS"
      width="140"
      >

      <template slot-scope="scope">
          <div slot="reference" class="name-wrapper" v-for="(access, index) in scope.row.access_mode" :key="index">
            <el-tag size="medium">{{ access }}</el-tag>
             <el-divider></el-divider>
          </div>
      </template>

    </el-table-column>
    <el-table-column
    fixed="right"
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
import createpvc from '@/components/k8s/createpv.vue'
export default {
  data () {
    return {
      namespace: 'default',
      getnamespace: [],
      tableData: [],
      show: false,
      title: 'PVC创建',
      type: 'pvc'
    }
  },
  components: {
    createpvc
  },
  methods: {
    createpvcd () {
      this.show = true
    },
    closepvc () {
      this.show = false
    },
    flush () {
      this.tableData = null
      this.getpvc()
      this.getnamespaces()
    },
    getpvc () {
      this.$axios.get('k8s/pvclist', { params: { namespace: this.namespace } })
        .then(res => {
          if (res.data.status === 200) {
            this.tableData = res.data.content
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
            this.getnamespace = res.data.namespace
          }
          console.log(this.getnamespace)
        })
        .catch(err => {
          console.error(err)
        })
    },
    handleDelete (index, row) {
      this.$axios.delete('k8s/detelepvc', { params: { namespace: this.namespace, pvc: row.name } })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '删除pvc' + row.name + '成功！'
            })
          } else {
            this.$notify.error({
              title: '失败！',
              message: '删除pvc' + row.name + '失败！'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    handleCommand (command) {
      this.namespace = command
      this.getpvc()
    }
  },
  mounted () {
    this.getpvc()
    this.getnamespaces()
  }
}
</script>
