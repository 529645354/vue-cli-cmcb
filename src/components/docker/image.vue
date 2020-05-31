<template>
<div>
  <tagDialog :image="this.image" @DoSuccess="dosuccess()"/>
  <runC :title="this.image"/>
  <el-row>
    <el-col :span="4"> <el-tooltip class="item" effect="dark" content="刷新镜像列表" placement="right">
   <el-button icon="el-icon-refresh-right" @click="flush()" circle></el-button>
  </el-tooltip> </el-col>
  <el-col :span="4" :offset="16"><h3>镜像详情</h3></el-col>
  </el-row>
  <el-table
    :data="tableData"
    style="width: 100%"
    max-height="350" v-loading="loading">
    <el-table-column
      fixed
      prop="id"
      label="镜像id"
      width="150">
    </el-table-column>
    <el-table-column
      prop="name"
      label="镜像名称"
      width="150">
    </el-table-column>
        <el-table-column
      prop="tag"
      label="镜像标签"
      width="150">
    </el-table-column>
    <el-table-column
      prop="size"
      label="镜像大小：ＭB"
      width="150">
    </el-table-column>
    <el-table-column
      prop="port"
      label="容器内部暴露端口"
      width="150">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="200">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="deleteRow(scope.$index,tableData)"
          type="text"
          size="small">
          删除
        </el-button>
        <el-button
          @click.native.prevent="RunContainer(scope.$index,tableData)"
          type="text"
          size="small">
          启动容器
        </el-button>
        <el-button
          @click.native.prevent="Dotag(scope.$index,tableData)"
          type="text"
          size="small">
          打标签
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
import tagDialog from '@/components/docker/tagdialog.vue'
import runC from '@/components/docker/run.vue'
export default {
  mounted () {
    this.images()
  },
  components: {
    tagDialog,
    runC
  },
  methods: {
    RunContainer (index, tableData) {
      this.image = tableData[index].name + ':' + tableData[index].tag
      this.$store.commit('showRunContainer')
    },
    dosuccess () {
      this.$store.commit('hideTagdialog')
      this.images()
    },
    Dotag (index, tableData) {
      this.image = tableData[index].name + ':' + tableData[index].tag
      this.$store.commit('showTagdialog')
    },
    flush () {
      this.loading = true
      this.images()
    },
    deleteRow (index, rows) {
      this.loading = true
      this.$axios.delete('api/docker-images/', { data: { name: rows[index].name, tag: rows[index].tag, addr: this.$store.state.remoteaddr } })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '删除了镜像' + rows[index].name + ':' + rows[index].tag
            })
          }
          if (res.data.status === 33341) {
            this.$notify.error({
              title: '错误！',
              message: '无法删除镜像：' + rows[index].name + '该镜像正在被使用'
            })
          }
          this.images()
        })
        .catch(err => {
          console.error(err)
        })
    },
    images () {
      this.$axios.get('api/docker-images/', {
        params: {
          addr: this.$store.state.remoteaddr
        }
      })
        .then(res => {
          console.log(res.data.content)
          this.tableData = res.data.content
          this.loading = false
          for (var i = 0; i < this.tableData.length; i++) {
            this.imageLen.push(this.tableData[i].id)
          }
          this.imageLen = [...new Set(this.imageLen)]
          console.log(this.imageLen.length)
          this.$emit('imagenum', this.imageLen.length)
        })
    }
  },
  data () {
    return {
      image: '',
      tableData: [],
      loading: true,
      imageLen: []
    }
  }
}
</script>
