<template>
<div class="mess" v-loading="this.$store.state.visit"  element-loading-text="ansible正在执行中">
    <el-collapse v-model="activeNames">
  <el-collapse-item title="完成日志" name="1">
    <pre v-if="this.$store.state.visit === false">{{ message.ok }}</pre>
  </el-collapse-item>
  <el-collapse-item title="未到达" name="2">
    <pre v-if="this.$store.state.visit === false">{{ message.unreachable }}</pre>
  </el-collapse-item>
  <el-collapse-item title="失败日志" name="3">
    <pre v-if="this.$store.state.visit === false">{{ message.failed }}</pre>
  </el-collapse-item>
  <el-collapse-item title="跳过项" name="4">
    <pre v-if="this.$store.state.visit === false">{{ message.skip }}</pre>
  </el-collapse-item>
</el-collapse>
</div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object
    }
  },
  data () {
    return {
      activeNames: []
    }
  }
}
</script>
<style>
    .mess {
        position: relative;
        width: 100%;
        /* padding: 10px,10px,10px,auto; */
        padding-left: 10px;
        /* height: 200px; */
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    }
</style>
