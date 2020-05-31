<template>
    <div>
        <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
  title="创建ConfigMap"
  :show-close="false"
  :visible.sync="show"
  width="30%"
  >

  <el-row>
      <el-col :span="10">
          ConfigMap名称：
          <el-input v-model="name" placeholder="ConfigMap名称"></el-input>
      </el-col>
  </el-row>
  <el-divider  content-position="left">ConfigMap</el-divider>

  <el-row v-for="(v, index) in configmapdata" :key="'1'+index" :gutter="10" style="padding-top: 10px">
      <el-col :span="10">
          Key:
          <el-input v-model="v.key" placeholder="key"></el-input>
      </el-col>
      <el-col :span="10">
          Value:
          <el-input v-model="v.value" placeholder="value"></el-input>
      </el-col>
      <el-col :span="4">
                <el-tooltip class="item" effect="dark" content="删除data" placement="right">
                <el-button @click="deleteData(index)"  type="danger" icon="el-icon-delete" circle></el-button>
                </el-tooltip>
      </el-col>
  </el-row>
  <el-divider></el-divider>
  <el-row>
      <el-col :span="4">
                <el-tooltip class="item" effect="dark" content="增加data" placement="right">
                <el-button @click="addData()"  icon="el-icon-plus" circle></el-button>
                </el-tooltip>
      </el-col>
  </el-row>
  <el-row style="padding-top: 20px">
    <span >
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-row>
  </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    show: Boolean,
    namespace: String
  },
  data () {
    return {
      name: null,
      configmapdata: [{
        key: null,
        value: null
      }]
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    deleteData (index) {
      this.configmapdata.splice(index, 1)
    },
    addData () {
      this.configmapdata.push({
        key: null,
        value: null
      })
    },
    submit () {
      this.$axios.post('k8s/createconfigmap', { name: this.name, namespace: this.namespace, data: this.configmapdata })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '成功创建！'
            })
            this.$emit('close')
          } else {
            this.$notify.error({
              title: '失败！',
              message: '创建失败！内容格式错误或目标资源存在'
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
