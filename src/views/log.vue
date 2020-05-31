<template>
    <div class="log">
        <div class="block">
  <el-timeline>
      <!-- <div > -->
          <el-timeline-item v-for='(i,index) in log' :key='index' :timestamp="i.date_time" placement="top">
      <el-card>
        <h4>提交了一个任务，任务id：{{ i.task_id }}</h4>
        <p>{{ i.task }}</p>
        <span>任务状态：</span>
        <span>
          <el-tag type='success' v-if="i.ready === 1">已就绪</el-tag>
          <el-tag type='success' v-if="i.ready === 0">就绪中</el-tag>
        </span>
        <p>
        <span>任务结果：</span>
        <span>
          <el-tag type='success' v-if="i.success===1"><span class="el-icon-circle-check"></span> 成功</el-tag>
          <el-tag type="info" v-if="i.success === 0 & i.ready === 0"><span class="el-icon-loading"></span> 执行中</el-tag>
          <el-tag type="danger" v-if="i.success === 0 & i.ready === 1"><span class="el-icon-circle-close"></span> 未完成</el-tag>
        </span>
        </p>
        <p>
          <span class="el-icon-tickets">报告：</span>
          <span>{{ i.res }}</span>
        </p>
         <el-tooltip class="item" effect="dark" content="删除任务" placement="bottom">
        <el-button type="danger" icon="el-icon-delete" @click="deleletasks(i.task_id,index)" circle></el-button>
        </el-tooltip>
      </el-card>
    </el-timeline-item>
      <!-- </div> -->
  </el-timeline>
</div>
    </div>
</template>

<script>
export default {
  name: 'tasks',
  data () {
    return {
      log: null
    }
  },
  methods: {
    gettask () {
      this.$axios.get('api/tasks/')
        .then(res => {
          console.log(res)
          if (res.data.status === 200) {
            this.log = res.data.content
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    deleletasks (id, index) {
      console.log(id)
      this.log.splice(index, 1)
      this.$axios.delete('api/tasks/', { data: { tasks_id: id } })
        .then(res => {
          console.log(res)
          if (res.data.status === 200) {
            this.$notify.success({
              title: '通知',
              message: '任务删除成功！'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  mounted () {
    this.gettask()
    setInterval(() => {
      this.gettask()
    }, 3000)
  }
}
</script>

<style>
    .log{
        position: absolute;
        height: 95%;
        width: 85%;
        overflow-y: scroll;
    }
    .log::-webkit-scrollbar{
        width: 0px;
    }
</style>
