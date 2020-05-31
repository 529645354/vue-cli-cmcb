<template>
    <div>
      <createpv :ctype="type" :show.sync="show" :title="title" @close="closepv"/>
<el-card class="box-card">
    <div slot="header" class="clearfix">
    <el-row>
      <el-col :span="4"><span>PV</span></el-col>
      <el-col :span="4">
          <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button @click="flush()" icon="el-icon-refresh-right" circle></el-button>
          </el-tooltip>
          </el-col>
      <el-col :span="10"><el-button @click="createpvd" style="float: right; padding: 3px 0" type="text">创建pv</el-button></el-col>
    </el-row>
    </div>
      <el-table
     height="400"
     max-height="400"
    :data="tableData"
    style="width: 100%">
    <el-table-column
      label="名称"
      prop="name">
    </el-table-column>
    <el-table-column
      label="状态"
      prop="status">
    </el-table-column>
    <el-table-column
      label="capacity"
      prop="capacity">
    </el-table-column>
    <el-table-column
      label="回收策略"
      prop="policy">
    </el-table-column>
    <el-table-column
      label="StorageClass"
      prop="storage_class">
    </el-table-column>
    <el-table-column
      label="Access">

      <template slot-scope="scope">
          <div slot="reference" class="name-wrapper" v-for="(a, index) in scope.row.access_mode" :key="index">
            <el-tag size="medium">{{ a }}</el-tag>
            <el-divider></el-divider>
          </div>
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
import createpv from '@/components/k8s/createpv.vue'
export default {
  data () {
    return {
      tableData: [],
      show: false,
      type: 'pv',
      title: 'PV创建'
    }
  },
  components: {
    createpv
  },
  mounted () {
    this.getpv()
  },
  methods: {
    createpvd () {
      this.show = true
    },
    closepv () {
      this.show = false
    },
    flush () {
      this.tableData = null
      this.getpv()
    },
    getpv () {
      this.$axios.get('k8s/pvlist')
        .then(res => {
          if (res.data.status === 200) {
            this.tableData = res.data.content
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    handleDelete (index, row) {
      this.$axios.delete('k8s/deletepv', { params: { namespace: this.namespace, pv: row.name } })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '删除pv' + row.name + '成功！'
            })
          } else {
            this.$notify.error({
              title: '失败！',
              message: '删除pv' + row.name + '失败！'
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
