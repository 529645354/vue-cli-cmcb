<template>
    <div>
        <el-dialog  title="创建网络" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :visible.sync="this.$store.state.createnetwork">
  <el-form v-loading="loading" :model="form">
    <el-form-item label="网络名称" :label-width="formLabelWidth">
                <el-row>
          <el-col :span="8"><el-input v-model="form.name" autocomplete="off"></el-input></el-col>
        </el-row>
    </el-form-item>
    <el-form-item  label="设置子网信息" :label-width="formLabelWidth">
        <el-row>
          <el-col :span="8"><el-input v-model="form.subnet" autocomplete="off"></el-input></el-col>
        </el-row>
    </el-form-item>
    <el-form-item label="设置网关信息" :label-width="formLabelWidth">
        <el-row>
          <el-col :span="8"><el-input v-model="form.gateway" autocomplete="off"></el-input></el-col>
        </el-row>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="close()">取 消</el-button>
    <el-button type="primary" @click="Submit()">确 定</el-button>
  </div>
</el-dialog>
    </div>
</template>

<script>
export default {
  methods: {
    Submit () {
      this.loading = true
      this.$axios.post('api/container-network/', { subnet: this.form.subnet, gateway: this.form.gateway, addr: this.$store.state.remoteaddr, name: this.form.name })
        .then(res => {
          if (res.data.status === 200) {
            this.$store.commit('hideCreateNetWork')
            this.$notify.success({
              title: '成功！',
              message: '添加网络成功！'
            })
            this.form.name = null
            this.form.subnet = null
            this.form.gateway = null
          } else if (res.data.status === 33334) {
            this.$notify.error({
              title: '错误！',
              message: '有未填项！'
            })
          } else {
            this.$notify.error({
              title: '错误！',
              message: '创建网络错误！'
            })
          }
          this.$emit('commitNet')
          this.loading = false
        })
        .catch(err => {
          console.error(err)
        })
    },
    close () {
      this.$store.commit('hideCreateNetWork')
    }
  },
  data () {
    return {
      loading: false,
      value: 'bridge',
      form: {
        name: null,
        subnet: null,
        gateway: null
      },
      formLabelWidth: '120px'
    }
  }
}
</script>
