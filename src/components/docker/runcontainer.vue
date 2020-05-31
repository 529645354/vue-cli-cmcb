<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-tooltip class="item" effect="dark" content="刷新容器列表" placement="right">
          <el-button icon="el-icon-refresh-right" @click="flush()" circle></el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="4"></el-col>
      <el-col :span="4" :offset="16">
        <h4>正在运行的容器</h4>
      </el-col>
        </el-row>
    <el-table :data="tableData" style="width: 100%" max-height="350" min-height="350" v-loading="loading">
      <el-table-column label="容器id" fixed width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="容器名称" width="200">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="left">
            <p>网络模式: {{ scope.row.networkmode[0] }}</p>
            <p>内端口: {{ scope.row.dport }}</p>
            <p>镜像: {{ scope.row.image }}</p>
            <p>容器名称: {{ scope.row.name }}</p>
            <p>容器内部地址: {{ scope.row.networkaddr }}</p>
            <p v-if="scope.row.status === 'running'">运行状态：运行中</p>
            <p v-if="scope.row.status === 'exited' ">运行状态：未运行</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" v-if="scope.row.status === 'running'">{{ scope.row.name }}</el-tag>
              <el-tag size="medium" v-if="scope.row.status === 'exited'" type="danger">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="容器端口" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.dport }}</span>
        </template>
      </el-table-column>

      <el-table-column label="容器对应主机端口" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.hport }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">

        <template slot-scope="scope">
          <el-button @click="startContainer(scope.row)"  type="text" v-if="scope.row.status === 'exited'" size="small">启动</el-button>
          <el-button @click="handleClick(scope.row)" v-if="scope.row.status === 'running'" type="text" size="small">杀死</el-button>
          <el-button @click="deleteContainer(scope.row)" v-if="scope.row.status === 'exited'" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: true,
      tableData: [],
      running: 0,
      stop: 0
    }
  },
  methods: {
    deleteContainer (row) {
      this.loading = true
      this.$axios.delete('api/docker-container/', { data: { id: row.id, addr: this.$store.state.remoteaddr } })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '删除了一个容器！id:' + row.id
            })
          }
          if (res.data.status === 33341) {
            this.$notify.error({
              title: '错误！',
              message: '内部错误，无法删除容器！'
            })
          }
          this.getContainer()
        })
        .catch(err => {
          console.error(err)
        })
    },
    startContainer (row) {
      this.loading = true
      this.$axios.post('api/docker-container/', { id: row.id, addr: this.$store.state.remoteaddr })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '启动了一个容器' + row.id
            })
            this.getContainer()
          } else {
            this.$notify.error({
              title: '失败！',
              message: '启动容器' + row.id + '失败！'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    flush () {
      this.getContainer()
    },
    handleClick (row) {
      this.loading = true
      this.$axios.put('api/docker-container/', { id: row.id, addr: this.$store.state.remoteaddr })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '杀死容器' + row.id
            })
            this.getContainer()
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    getContainer () {
      this.loading = true
      this.$axios
        .get('api/docker-container/', {
          params: { addr: this.$store.state.remoteaddr }
        })
        .then(res => {
          if (res.data.status === 200) {
            console.log(res.data.content)
            this.tableData = res.data.content
          }
          this.loading = false
          this.running = 0
          this.stop = 0
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].status === 'running') {
              this.running += 1
            }
            if (this.tableData[i].status === 'exited') {
              this.stop += 1
            }
          }
          this.$emit('RunAndStop', this.running, this.stop)
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  mounted () {
    this.getContainer()
  }
}
</script>
