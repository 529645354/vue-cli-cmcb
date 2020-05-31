<template>
<div>
  <createnetwork @commitNet="flush"/>
  <el-table
    :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%">
    <h3>容器网络</h3>
    <el-table-column
      label="id"
      prop="id">
    </el-table-column>
    <el-table-column
      label="Name"
      prop="name">
    </el-table-column>
    <el-table-column
      label="子网网段"
      prop="subnet">
    </el-table-column>
    <el-table-column
      label="网关"
      prop="gateway">
    </el-table-column>
    <el-table-column
      label="模式"
      prop="mode">
    </el-table-column>
    <el-table-column
      align="right">
       <template  slot="header">
        <el-tooltip class="item" effect="dark" content="添加网络" placement="left">
          <el-button type="primary" @click="addNetWork()"  icon="el-icon-circle-plus" circle></el-button>
        </el-tooltip>
      </template>
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import createnetwork from '@/components/docker/createnetwork.vue'
export default {
  data () {
    return {
      tableData: [],
      search: ''
    }
  },
  components: {
    createnetwork
  },
  methods: {
    flush () {
      this.getnetwork()
    },
    getnetwork () {
      this.$axios.get('api/container-network/', { params: { addr: this.$store.state.remoteaddr } })
        .then(res => {
          if (res.data.status === 200) {
            this.tableData = res.data.content
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    addNetWork () {
      this.$store.commit('showCreateNetWork')
    },
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      this.axios.delete('api/container-network/', { data: { addr: this.$store.state.remoteaddr, id: row.id } })
        .then(res => {
          if (res.data.status === 200) {
            this.tableData.splice(index, 1)
            this.$notify.success({
              title: '成功！',
              message: '成功删除！'
            })
          }
          if (res.data.status === 33341) {
            this.$notify.error({
              title: '错误！',
              message: '无法删除网络！'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  mounted () {
    this.getnetwork()
  }
}
</script>
