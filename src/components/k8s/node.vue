<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
            <span>节点信息</span>
             <el-tooltip class="item" effect="dark" content="刷新" placement="bottom">
            <el-button class="flush" icon="el-icon-refresh" @click="flush()" circle></el-button>
             </el-tooltip>
            </div>
        <el-row :gutter="20" v-loading="loading">
            <el-col :span="6" v-for="(c, index) in content" :key="index">
                <el-card  class="box-card">
                    <div slot="header" class="clearfix">
                        <span>{{ c.name }}</span>
                    </div>
                    <div  class="text item">
                        cpu数量：{{ c.cpu }} <li class="el-icon-cpu"></li>
                    </div>
                    <div  class="text item">
                        内存：{{ c.total_memory }}Mb <li class="el-icon-coin"></li>
                    </div>
                    <div  class="text item">
                        是否可调度：<span><li v-if="c.sched" class="el-icon-error"></li><li v-else class="el-icon-success"></li></span>
                    </div>
                    <div  class="text item">
                        Pod Cidr：{{ c.pod_cidr }}
                    </div>
                    <el-divider content-position="left">网络</el-divider>
                    <div v-for="(n,index) in c.net" :key="index">
                        <el-popover trigger="hover" placement="top">
                        <p>host: {{ n.ip }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">类型：{{ n.type }}</el-tag>
                        </div>
                    </el-popover>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loading: true,
      content: null
    }
  },
  methods: {
    flush () {
      this.content = null
      this.getnode()
    },
    getnode () {
      this.loading = true
      this.$axios.get('k8s/nodelist')
        .then(res => {
          if (res.data.status === 200) {
            this.content = res.data.content
          }
        })
        .catch(err => {
          console.error(err)
        })
      this.loading = false
    }
  },
  mounted () {
    this.getnode()
  }
}
</script>
<style>
.flush {
    margin-left: 5px;
}
</style>
