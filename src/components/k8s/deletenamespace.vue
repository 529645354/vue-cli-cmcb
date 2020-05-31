<template>
    <div>
        <el-dialog :close-on-press-escape="false"
        :close-on-click-modal="false"
  title="删除名称空间"
  :show-close="false"
  :visible.sync="show"
  width="30%">
  <el-form :model="form">
     <el-form-item label="选择名称空间">
      <el-select v-model="form.space" placeholder="请选名称空间">
        <el-option v-for="(n, index) in namespace" :key="index" :label="n" :value="n"></el-option>
      </el-select>
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
    namespace: Array,
    show: Boolean
  },
  data () {
    return {
      form: {
        space: null
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    submit () {
      this.$axios.delete('k8s/deletenamespace', { params: { name: this.form.space } })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '删除名称空间成功！'
            })
            this.$emit('close')
          } else {
            this.$notify.error({
              title: '失败！',
              message: '删除失败！'
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
