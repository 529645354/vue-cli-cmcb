<template>
    <div>
        <el-dialog :close-on-press-escape="false"
        :close-on-click-modal="false"
  title="创建名称空间"
  :show-close="false"
  :visible.sync="show"
  width="60%">
        <el-form :model="form">
            <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close()">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  props: {
    show: Boolean
  },
  data () {
    return {
      form: {
        name: null
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    submit () {
      this.$axios.post('k8s/createnamespace', {
        name: this.form.name
      })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '创建成功！'
            })
            this.$emit('close')
          } else {
            this.$notify.error({
              title: '失败！',
              message: '创建失败！内容格式错误或目标资源存在！'
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
