<template>
<div class="search" v-loading="loading"  element-loading-text="正在搜索镜像。。。">
  <el-row :gutter="20">
    <el-col :span="8"><el-input v-model="input" placeholder="输入要搜索的镜像名"></el-input></el-col>
     <el-tooltip class="item" effect="dark" content="搜索镜像" placement="right">
    <el-col :span="4"><el-button @click="search()" icon="el-icon-search" circle></el-button></el-col>
  </el-tooltip>
  </el-row>
  <el-divider></el-divider>
    <div :v-if="res" v-for="(image, index) in imageList" :key="index">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item :title="image.name">
          <div>镜像名称：{{ image.name }}</div>
          <div>镜像描述：{{ image.description }}</div>
          <div>镜像描述：{{ image.description }}</div>
          <div>是否为自动化构建: {{ image.is_automated }}</div>
          <div>官方镜像: {{ image.is_official }}</div>
          <div>star: {{ image.star_count }}</div>
           <el-tooltip class="item" effect="dark" content="pull" placement="right">
          <el-button type="primary" class="pullbutton" icon="el-icon-download" @click="pullimage(image.name)" circle></el-button>
         </el-tooltip>
        </el-collapse-item>
  </el-collapse>
  </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      input: '',
      loading: false,
      imageList: [],
      res: false,
      activeNames: []
    }
  },
  methods: {
    pullimage (image) {
      this.$axios.post('api/docker-images/', { image: image, addr: this.$store.state.remoteaddr })
        .then(res => {
          if (res.data.status === 200) {
            this.$message({
              message: '加入任务清单',
              type: 'success'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '添加到任务清单失败'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    handleChange (val) {
      console.log(val)
    },
    search () {
      this.imageList = []
      if (this.input === '') {
        this.$message({
          message: '请输入镜像名称',
          type: 'warning'
        })
      } else {
        this.loading = true
        this.$axios.post('api/search_image/', { image: this.input })
          .then(res => {
            this.loading = false
            if (res.data.status === 200) {
              this.imageList = res.data.content
              this.res = true
              console.log(this.imageList)
            }
            if (res.data.status === 33342) {
              this.$notify.error({
                title: '错误！',
                message: '搜索镜像时超时'
              })
            }
          })
          .catch(err => {
            this.loading = false
            console.error(err)
          })
      }
    }
  }
}
</script>
<style>
  .search {
    max-height: 400px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>
