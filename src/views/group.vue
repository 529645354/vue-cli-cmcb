<template>
<div>
  <!-- 查看主机组下的主机 -->
  <el-dialog :title="groupname" :visible.sync="dialogGroupTableVisible">
    <el-button type="text" @click="addServer">添加主机到当前组</el-button>
       <el-dialog
      width="35%"
      title="添加主机到该组"
      :visible.sync="addServerToGroup"
      append-to-body>
      <el-row>
        <el-col :span="24"><el-transfer v-model="value" :titles="['所有主机', '选中主机']" :data="data"></el-transfer></el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="10"><el-button type="primary" @click="commitAddServer" round :disabled="disable_play">提交</el-button></el-col>
      </el-row>

    </el-dialog>
    <el-table
    :data="gridData"
    style="width: 100%;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)"
    height="500">
    <el-table-column
      label="ID"
      prop="id">
    </el-table-column>
    <el-table-column
      label="主机名"
      prop="name">
    </el-table-column>
    <el-table-column
      label="主机ip"
      prop="ipaddr">
    </el-table-column>
    <el-table-column
      align="right">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handleGroupDelete(scope.row)">踢出该组</el-button>
      </template>
    </el-table-column>
  </el-table>
</el-dialog>
<!-- 查看主机组下的主机 -->

    <el-button type="text" @click="dialogFormVisible = true">添加主机组</el-button>
<el-dialog title="添加主机组" :visible.sync="dialogFormVisible">
  <el-form :model="group">
    <el-form-item label="组名" :label-width="formLabelWidth">
      <el-input v-model="group.name" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleCommit">确 定</el-button>
  </div>
</el-dialog>

<el-dialog title="编辑" :visible.sync="dialogeditFormVisible">
  <el-form :model="group">
    <el-form-item label="组名" :label-width="formLabelWidth">
      <el-input v-model="group2.name" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogeditFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleEditCommit">确 定</el-button>
  </div>
</el-dialog>

  <el-table
    :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
    <el-table-column
      label="ID"
      prop="id">
    </el-table-column>
    <el-table-column
      label="主机组"
      prop="name">
    </el-table-column>
    <el-table-column
      align="right">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="manServer(scope.row)">主机管理</el-button>
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除组</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-row>
    <el-col :span="12" :offset="12">
      <el-pagination id="page"
  background
  layout="prev, pager, next"
  :total="allServerCount"
   @current-change="handleCurrentChange"
   >
</el-pagination>
    </el-col>
  </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: [],
      value: [],
      //
      addServerToGroup: false,
      // 当前主机组rowid
      groupid: {
        id: ''
      },
      // 弹出对话框中的title
      groupname: '',
      formLabelWidth: '',
      // 主机信息
      gridData: '',
      // 对话款
      dialogGroupTableVisible: false,
      // 总页数
      allServerCount: 0,
      // 当前页
      page: 1,
      group: {
        name: ''
      },
      group2: {
        id: '',
        name: ''
      },
      dialogFormVisible: false,
      dialogeditFormVisible: false,
      tableData: [],
      search: ''
    }
  },
  computed: {
    disable_play () {
      if (this.value.length === 0) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    addServer () {
      this.value = []
      this.data = []
      this.addServerToGroup = true
      this.axios.get('/api/get-server-no-group/')
        .then(res => {
          if (res.data.status === 200) {
            for (let i = 0; i < res.data.content.length; i++) {
              this.data.push({
                key: res.data.content[i].id,
                label: res.data.content[i].name
              })
            }
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    commitAddServer () {
      this.axios.post('/api/manage/', { group: this.groupid.id, server: this.value })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '通知',
              message: '添加成功！'
            })
            this.addServerToGroup = false
            this.manServer(this.groupid)
          } else {
            this.$notify.success({
              title: '错误',
              message: '添加失败！'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    handleGroupDelete (row) {
      this.axios.delete('/api/manage/', { data: { id: row.id } })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '通知',
              message: '成功踢出'
            })
            this.manServer(this.groupid)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    manServer (row) {
      this.groupid.id = row.id
      this.groupname = row.name
      this.dialogGroupTableVisible = true
      this.axios.get('/api/manage/', { params: { id: row.id } })
        .then(res => {
          if (res.data.status === 200) {
            this.gridData = res.data.content
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    handleCurrentChange (val) {
      this.page = val
      this.get(val)
      this.currentPage = val
    },
    handleEditCommit () {
      this.axios.put('/api/group/', { id: this.group2.id, name: this.group2.name })
        .then(res => {
          if (res.data.status === 200) {
            this.dialogeditFormVisible = false
            this.$notify.success({
              title: '通知',
              message: '编辑成功！'
            })
          }
          if (res.data.status === 33334) {
            this.$notify.error({
              title: '错误',
              message: '有未填项！'
            })
          }
          this.get(this.page)
        })
        .catch(err => {
          console.error(err)
        })
    },
    get (val) {
      this.axios.get('/api/group/', { params: { page: val } })
        .then(res => {
          this.tableData = res.data.content
          this.allServerCount = res.data.count
        })
        .catch(err => {
          console.error(err)
        })
    },
    handleCommit () {
      this.axios.post('/api/group/', { name: this.group.name })
        .then(res => {
          if (res.data.status === 200) {
            this.dialogFormVisible = false
            this.$notify.success({
              title: '通知',
              message: '添加成功！'
            })
            this.get(this.page)
          }
          if (res.data.status === 33334) {
            this.$notify.error({
              title: '错误',
              message: '有未填选项！'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    handleEdit (index, row) {
      this.dialogeditFormVisible = true
      this.group2.id = row.id
    },
    handleDelete (index, row) {
      this.axios.delete('/api/group/', { data: { id: row.id } })
        .then(res => {
          if (res.data.status === 200) {
            this.get(this.page)
            this.$notify.success({
              title: '通知',
              message: '删除成功！'
            })
          }
          if (res.data.status === 33337) {
            this.$notify.warning({
              title: '警告',
              message: '无法删除。该组下有主机存在，请先踢出所有主机'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  mounted () {
    this.axios.get('/api/group/')
      .then(res => {
        this.tableData = res.data.content
        this.allServerCount = res.data.count
      })
      .catch(err => {
        console.error(err)
      })
  }

}
</script>
