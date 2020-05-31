<template>
    <div>
      <createconfigmap :namespace="namespace" @close="closeconfigmap" :show="show"/>
        <el-dialog
  :destroy-on-close="true"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  :show-close="false"
  :title="namespace"
  :visible.sync="this.$store.state.configmapdata"
  width="70%">
    <el-collapse v-model="activeNames">
  <el-collapse-item v-for="(configmap, index) in content" :key="index" :title="configmap.name" :name="index">
    <div><pre>{{ configmap.data }}</pre></div>
    <el-tooltip class="item" effect="dark" content="删除该secret资源" placement="right">
     <el-button type="danger" @click="deleteconfigmap(configmap.name)" icon="el-icon-delete" circle></el-button>
     </el-tooltip>
  </el-collapse-item>
</el-collapse>
<span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="close()">确 定</el-button>
    <el-button @click="addConfigMap()">添加Data</el-button>
    <el-button @click="flush()">刷新</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
import createconfigmap from '@/components/k8s/createconfigmap.vue'
export default {
  props: {
    namespace: String,
    content: Array
  },
  components: {
    createconfigmap
  },
  data () {
    return {
      show: false,
      activeNames: []
    }
  },
  methods: {
    addConfigMap () {
      this.show = true
    },
    closeconfigmap () {
      this.show = false
    },
    deleteconfigmap (name) {
      this.$axios.delete('k8s/deleteconfigmap', { params: { namespace: this.namespace, configmap: name } })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '删除ConfigMap' + name + '成功！'
            })
          } else {
            this.$notify.error({
              title: '失败！',
              message: '删除ConfigMap' + name + '失败！'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
      this.flush()
    },
    flush () {
      this.content = null
      this.$emit('flush')
    },
    close () {
      this.$store.commit('hideconfigmapdata')
    }
  }
}
</script>
<style>
.el-collapse-item__content {
    overflow-x: scroll;
}
</style>
