<template>
<div>
  <el-row>
    <el-col :span="24">
<!-- Form -->
<el-button type="text" @click="dialogFormVisible = true">添加主机</el-button>
<!--增加主机对话框-->
<el-dialog title="添加主机" :visible.sync="dialogFormVisible" v-loading="loading">
  <el-form :model="form">
    <el-form-item label="主机" :label-width="formLabelWidth">
      <el-input v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="主机地址" :label-width="formLabelWidth">
      <el-input v-model="form.ip" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="主机ssh账号" :label-width="formLabelWidth">
      <el-input v-model="form.sshuser" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="主机ssh密码" :label-width="formLabelWidth">
      <el-input v-model="form.sshpasswd" autocomplete="off" type="password"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleCommit">确 定</el-button>
  </div>
</el-dialog>
<!--编辑对话框-->
<el-dialog title="编辑主机" :visible.sync="editdialog" v-loading="loadingedit">
  <el-form :model="form2">
    <el-form-item label="主机名称" :label-width="formLabelWidth">
      <el-input v-model="form2.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="主机地址" :label-width="formLabelWidth">
      <el-input v-model="form2.ip" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="主机ssh账号" :label-width="formLabelWidth">
      <el-input v-model="form2.sshuser" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="主机ssh密码" :label-width="formLabelWidth">
      <el-input v-model="form2.sshpasswd" type="password" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="editdialog = false">取 消</el-button>
    <el-button type="primary" @click="handleEditCommit">确 定</el-button>
  </div>
</el-dialog>
<!--编辑对话框-->
<!-- vnc对话框 -->
<el-dialog title="vnc" :visible.sync="vncdialog" width="50%"><vnc :addr="this.remoteaddr"  v-if="vncdialog" center/></el-dialog>

<!-- vnc对话框 -->
<!--主机列表-->
    <el-table
    :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
    <el-table-column
      label="ID"
      prop="id">
    </el-table-column>
    <el-table-column
      label="主机名称"
      prop="name">
    </el-table-column>
        <el-table-column
      label="主机地址"
      prop="ipaddr">
    </el-table-column>
    <el-table-column
      label="主机组"
      prop="group">
    </el-table-column>
    <el-table-column
      align="right">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.row)">删除</el-button>
          <el-button
          size="mini"
          type="primary"
          @click="handleInstallVnc(scope.row)">安装vnc</el-button>
          <el-button
          size="mini"
          type="success"
          @click="handleConnectVnc(scope.row)">打开vnc</el-button>
      </template>
    </el-table-column>
  </el-table>
  </el-col>
  </el-row>
  <el-row>
    <el-col :span="12" :offset="12">
      <el-pagination id="page"
  background
  layout="prev, pager, next"
  :total="allServerCount"
  :hide-on-single-page="value"
   @current-change="handleCurrentChange"
   >
</el-pagination>
    </el-col>
  </el-row>
</div>
</template>
<!--主机列表-->
<script>
import vnc from '@/components/vuc.vue'
export default {
  components: {
    vnc
  },
  data () {
    return {
      remoteaddr: '',
      vncdialog: false,
      loadingedit: false,
      loading: false,
      // 当前页
      currentPage: 1,
      value: false,
      tableData: [],
      search: '',
      allServerCount: 0,
      dialogFormVisible: false,
      form: {
        name: '',
        ip: '',
        sshuser: '',
        sshpasswd: '',
        group: ''
      },
      formLabelWidth: '120px',
      editdialog: false,
      form2: {
        id: '',
        name: '',
        ip: '',
        sshuser: '',
        sshpasswd: ''
      }
    }
  },
  methods: {
    handleInstallVnc (row) {
      this.$axios.post('/api/install_vnc/', { server: row.id })
        .then(res => {
          console.log(res)
          if (res.data.status === 200) {
            this.$message({
              showClose: true,
              message: '已该任务到添加任务清单'
            })
          } else {
            this.$message({
              showClose: true,
              message: '无法添加任务',
              type: 'error'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    handleConnectVnc (row) {
      this.remoteaddr = ''
      this.vncdialog = true
      this.remoteaddr = 'ws://' + row.ipaddr + ':' + 6080
    },
    handleCurrentChange (val) {
      this.get(val)
      console.log(val)
      this.currentPage = val
    },

    handleEditCommit () {
      this.loadingedit = true
      this.axios.put('/api/server/', { id: this.form2.id, name: this.form2.name, ip: this.form2.ip, sshuser: this.form2.sshuser, sshpasswd: this.form2.sshpasswd })
        .then(res => {
          console.log(res.data.status)
          if (res.data.status === 200) {
            this.$notify.success({
              title: '通知',
              message: '编辑成功！'
            })
            this.editdialog = false
            this.get(this.currentPage)
            this.loadingedit = false
          }
          if (res.data.status === 33334) {
            this.$notify.error({
              title: '错误',
              message: '有未填选项！'
            })
            this.loadingedit = false
          }
          if (res.data.status === 33338) {
            this.$notify.error({
              title: '错误',
              message: '主机名已存在'
            })
            this.loadingedit = false
          }
          if (res.data.status === 33339) {
            this.$notify.error({
              title: '错误',
              message: '主机ip地址已存在'
            })
            this.loadingedit = false
          }
          if (res.data.status === 33342) {
            this.$notify.error({
              title: '错误',
              message: '连接超时，请检查该ip地址是否可以通信'
            })
            this.loadingedit = false
          }
          if (res.data.status === 33343) {
            this.$notify.error({
              title: '错误',
              message: '认证失败，检查用户名密码是否正确'
            })
            this.loadingedit = false
          }
          if (res.data.status === 33341) {
            this.$notify.error({
              title: '错误',
              message: '内部错误'
            })
            this.loadingedit = false
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    handleEdit (row) {
      this.editdialog = true
      console.log(row)
      this.form2.id = row.id
      this.form2.name = row.name
      this.form2.ip = row.ipaddr
      this.form2.sshuser = ''
      this.form2.sshpasswd = ''
    },
    handleDelete (row) {
      this.axios.delete('/api/server/', { data: { id: row.id } })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '通知',
              message: '删除成功！'
            })
            this.get(this.currentPage)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    handleCommit () {
      this.loading = true
      this.axios.post('/api/server/', { name: this.form.name, ip: this.form.ip, sshuser: this.form.sshuser, sshpasswd: this.form.sshpasswd })
        .then(res => {
          console.log(res.data.status)
          if (res.data.status === 200) {
            this.dialogFormVisible = false
            this.$notify.success({
              title: '通知',
              message: '添加成功！'
            })
            console.log(this.currentPage)
            this.get(this.currentPage)
            this.loading = false
          }
          if (res.data.status === 33334) {
            this.$notify.error({
              title: '错误',
              message: '有未填写项'
            })
            this.loading = false
          }
          if (res.data.status === 33333) {
            this.$notify.error({
              title: '错误',
              message: '主机地址格式有误'
            })
            this.loading = false
          }
          if (res.data.status === 33338) {
            this.$notify.error({
              title: '错误',
              message: '主机名存在'
            })
            this.loading = false
          }
          if (res.data.status === 33339) {
            this.$notify.error({
              title: '错误',
              message: '主机地址已存在'
            })
            this.loading = false
          }
          if (res.data.status === 33342) {
            this.$notify.error({
              title: '错误',
              message: '连接超时，请检查该ip地址是否可以通信'
            })
            this.loading = false
          }
          if (res.data.status === 33343) {
            this.$notify.error({
              title: '错误',
              message: '认证失败，检查用户名密码是否正确'
            })
            this.loading = false
          }
          if (res.data.status === 33341) {
            this.$notify.error({
              title: '错误',
              message: '内部错误'
            })
            this.loading = false
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    get: function (page) {
      this.axios.get('/api/server/', { params: { page: page } })
        .then(res => {
        // console.log()
          console.log(page)
          this.tableData = res.data.content
          this.allServerCount = res.data.count
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  mounted () {
    this.axios.get('/api/server/', { params: { page: 1 } })
      .then(res => {
        console.log(res)
        this.tableData = res.data.content
        this.allServerCount = res.data.count
      })
      .catch(err => {
        console.error(err)
      })
  }
}

</script>
<style>
  #page {
    padding-top: 10px;
  }
</style>
