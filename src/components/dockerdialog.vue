<template>
    <div>
        <el-dialog title="docker服务器" :visible.sync="this.$store.state.dockerdialogfrom" :show-close="false" :destroy-on-close="true" :close-on-press-escape="false" :close-on-click-modal="false"  >
  <el-form :model="form" v-loading="loading">
    <el-form-item label="docker服务器名称:" :label-width="formLabelWidth">
      <el-input v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="docker服务器地址：" :label-width="formLabelWidth">
      <el-input v-model="form.ipaddr" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="docker链接端口：" :label-width="formLabelWidth">
      <el-input v-model="form.port" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="close()">取 消</el-button>
    <el-button type="primary" @click="PstData()">确 定</el-button>
  </div>
</el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        name: '',
        ipaddr: '',
        port: ''
      },
      loading: false,
      formLabelWidth: '120px'
    }
  },
  methods: {
    close () {
      this.$store.commit('hideDockerDialog')
    },
    PstData () {
      this.loading = true
      this.$axios.post('api/docker/', { name: this.form.name, ipaddr: this.form.ipaddr, port: this.form.port })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              dangerouslyUseHTMLString: true,
              message: '<li class="el-icon-loading"></li>docker服务器添加成功！'
            })
            this.$emit('MyRefreshData')
            this.close()
          } else if (res.data.status === 33336) {
            this.$notify.error({
              title: '错误！',
              message: 'docker服务器添加失败，请检查链接地址或端口是否正确！'
            })
          } else if (res.data.status === 33344) {
            this.$notify.error({
              title: '错误！',
              message: 'docker服务器名称或者链接以存在！'
            })
          } else if (res.data.status === 33334) {
            this.$notify.error({
              title: '错误！',
              message: '数据不能未空！'
            })
          } else if (res.data.status === 33342) {
            this.$notify.error({
              title: '错误！',
              message: '连接超时！'
            })
          }
          this.loading = false
        })
        .catch(err => {
          console.error(err)
        })
    },
    loadData () {
      this.$emit('load')
    }
  }
}

</script>
