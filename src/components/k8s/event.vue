<template>
    <div>
        <el-dialog
  :title="namespace"
  :visible.sync="this.$store.state.eventdialog"
  width="30%">

  <el-collapse>
  <el-collapse-item v-for="(event, index) in content" :key="index" :title="event.name">
    <div>event类型：{{ event.type }}</div>
    <div>reason: {{ event.reason }}</div>
    <div>event资源对象：{{ event.event_type }}</div>
    <div>event资源对象名称：{{ event.event_regarding_name }}</div>
    <div>详细信息：{{ event.message }}</div>
  </el-collapse-item>
</el-collapse>

  <span slot="footer" class="dialog-footer">
    <el-button @click="flush()">刷新</el-button>
    <el-button type="primary" @click="close()">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default {
  props: {
    namespace: String,
    content: Array
  },
  data () {
    return {
      activeNames: [],
      dialogVisible: false
    }
  },
  methods: {
    flush () {
      this.content = null
      this.$emit('flush')
    },
    close () {
      this.$store.commit('hideeventdialog')
    }
  }
}
</script>
