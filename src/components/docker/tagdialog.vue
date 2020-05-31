<template>
    <div>
        <el-dialog
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  :destroy-on-close="true"
  :show-close="false"
  :title="this.image"
  :visible.sync="this.$store.state.tagdialog"
  width="30%"
  >
  <el-form :model="form">
    <el-form-item label="镜像名称:">
      <el-input v-model="form.reponame" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="tag:">
      <el-input v-model="form.tag" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="close()">取 消</el-button>
    <el-button type="primary" @click="commit()">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default {
  props: {
    image: String
  },
  data () {
    return {
      form: {
        reponame: '',
        tag: ''
      }
    }
  },
  methods: {
    close () {
      this.form.reponame = ''
      this.form.tag = ''
      this.$store.commit('hideTagdialog')
    },
    commit () {
      this.form.reponame = ''
      this.form.tag = ''
      this.$axios.put('api/docker-images/', { name: this.image, repo: this.form.reponame, tag: this.form.tag, addr: this.$store.state.remoteaddr })
        .then(res => {
          console.log(res)
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '成功打上标签'
            })
            this.$emit('DoSuccess')
          } else {
            this.$notify.error({
              title: '错误！',
              message: '无法修改tag!'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>
