<template>
    <div>
      <createsecret :show.sync="show" :namespace="namespace" @close="closecreate"/>
        <el-dialog
        :close-on-press-escape="false"
        :show-close="false"
        :close-on-click-modal="false"
        :destroy-on-close="true"
  :title="namespace"
  :visible.sync="this.$store.state.secretdata"
  width="70%">
        <el-collapse v-model="activeNames">
  <el-collapse-item v-for="(secret, index) in content" :key="index" :title="secret.name">
    <div><pre>{{ secret.data }}</pre></div>
     <el-tooltip class="item" effect="dark" content="删除该secret资源" placement="right">
     <el-button type="danger" @click="deletesecret(secret.name)" icon="el-icon-delete" circle></el-button>
     </el-tooltip>
  </el-collapse-item>
</el-collapse>
 <span slot="footer" class="dialog-footer">
    <el-button @click="flush()">刷新</el-button>
    <el-button @click="addData()">增加Data</el-button>
    <el-button type="primary" @click="close()">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
import createsecret from '@/components/k8s/createsecret.vue'
export default {
  props: {
    content: Array,
    namespace: String
  },
  components: {
    createsecret
  },
  data () {
    return {
      activeNames: [],
      show: false
    }
  },
  methods: {
    closecreate () {
      this.show = false
    },
    addData () {
      this.show = true
    },
    deletesecret (name) {
      this.$axios.delete('k8s/deletesecret', { params: { namespace: this.namespace, secret: name } })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '删除secret' + name + '成功！'
            })
          } else {
            this.$notify.error({
              title: '失败！',
              message: '删除secret' + name + '失败！'
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
      this.$store.commit('hidesecretdata')
    }
  }
}
</script>
