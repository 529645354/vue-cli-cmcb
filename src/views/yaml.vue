<template>
    <div>
        <el-row>
          <el-col :span="4"><el-upload
  class="upload-demo"
  ref="upload"
  action="http://127.0.0.1:8080/api/yaml/"
  :file-list="fileList"
  :on-success="UploadFile"
  :auto-upload="false">
  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
  <div slot="tip" class="el-upload__tip">只能上传yml或者yaml文件</div>
</el-upload></el-col>
</el-row>

  <el-table
    :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
    <el-table-column
      label="Name"
      prop="name">
    </el-table-column>
    <el-table-column
      align="right">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleCat(scope.row)">查看文件</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
  title="文件内容"
  :visible.sync="dialogVisible"
  width="30%">
  <div style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding-top: 10px;padding-left: 10px;padding-bottom: 10px;">
  <pre>{{ content }}</pre></div>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>

export default {

  data () {
    return {
      tableData: [],
      fileList: [],
      search: '',
      content: '',
      dialogVisible: false
    }
  },
  methods: {
    getyaml () {
      this.$axios.get('api/yaml/')
        .then(res => {
          if (res.data.status === 200) {
            this.tableData = res.data.content
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleCat (row) {
      this.dialogVisible = true
      this.$axios.get('api/yml/' + row.name)
        .then(res => {
          this.content = res.data
        })
        .catch(err => {
          console.error(err)
        })
      console.log(row.name)
    },
    handleDelete (row) {
      this.$axios.delete('api/yaml/', { data: { name: row.name } })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功',
              message: '删除成功'
            })
          }
          this.getyaml()
        })
        .catch(err => {
          console.error(err)
        })
    },
    UploadFile (response, file, fileList) {
      for (var i = 0; i < fileList.length; i++) {
        if (fileList[i].response.status === 200) {
          this.$notify({
            title: '成功',
            type: 'success',
            dangerouslyUseHTMLString: true,
            message: '文件：<br>' + fileList[i].name + '<br>上传成功！'
          })
        }
        if (fileList[i].response.status === 33336) {
          this.$notify.error({
            title: '错误',
            dangerouslyUseHTMLString: true,
            message: '文件： <br>' + fileList[i].name + '<br>格式错误！ </p>'
          })
        }
        if (fileList[i].response.status === 33338) {
          this.$notify.error({
            title: '错误',
            dangerouslyUseHTMLString: true,
            message: '文件： <br>' + fileList[i].name + '<br>文件名存在！</p>'
          })
        }
        this.fileList = []
        this.getyaml()
      }
    }
  },
  mounted () {
    this.getyaml()
  }
}
</script>
<style>
.upload-demo {
    margin-bottom: 10px;
}
</style>
