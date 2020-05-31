<template>
    <div>
        <el-dialog
        :destroy-on-close="true"
        :show-close="false"
        :close-on-click-modal="false"
  :close-on-press-escape="false"
  :title="pod"
  :visible.sync="this.$store.state.kubeyaml"
  width="40%">
  <div class="precontent" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
  <pre>{{ content }}</pre>
  </div>
    <el-button type="primary" @click="close()">确 定</el-button>
</el-dialog>
    </div>
</template>

<script>
export default {
  props: {
    content: Object,
    pod: String
  },
  methods: {
    close () {
      this.content = null
      this.deploy = null
      this.$store.commit('hidekubeyaml')
    }
  },
  mounted () {
    console.log(this.content)
  }
}
</script>
<style>
.precontent {
  padding-top: 5px;
  padding-left: 5px;
  overflow-x: scroll;
}
</style>
