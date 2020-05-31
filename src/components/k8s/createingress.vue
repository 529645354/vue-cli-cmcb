<template>
    <div>
        <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
  title="Ingress创建"
  :show-close="false"
  :visible.sync="show"
  width="60%"
  >
  <!-- ingress名称 -->
  <el-row>
      <el-col :span="6">
      ingress名称:
      <el-input v-model="name" placeholder="ingress名称"></el-input>
      </el-col>
  </el-row>
  <!-- ingress名称 -->
  <!-- host -->
  <div v-for="(h, index) in host" :key="index">
      <el-divider content-position="left">Ingress Host</el-divider>
      <!-- dns -->
      <el-row>
          <el-col :span="6">
              Ingress Host:
              <el-input v-model="h.hostname" placeholder="输入dns"></el-input>
          </el-col>
      </el-row>
      <!-- dns -->

      <!-- backend -->
        <el-row style="padding-top: 10px" v-for="(b, bindex) in h.http" :key="bindex" :gutter="10">
            <el-col :span="4">
                Path:
                <el-input placeholder="path" v-model="b.path"></el-input>
            </el-col>
            <el-col :span="4">
                Service:
                <el-input placeholder="后端Service" v-model="b.backendService"></el-input>
            </el-col>
            <el-col :span="4">
                Service Port:
                <el-input placeholder="后端Service的对应端口" v-model.number="b.backendPort"></el-input>
            </el-col>
            <el-col :span="4">
                <el-tooltip class="item" effect="dark" content="删除Rule" placement="right">
                <el-button @click="deleteRole(bindex, index)" type="danger" icon="el-icon-delete" circle></el-button>
                </el-tooltip>
            </el-col>
        </el-row>
      <!-- backend -->
      <!-- ingress操作 -->
      <el-row style="padding-top: 10px" :gutter="10">
          <el-col :span="4">
                <el-tooltip class="item" effect="dark" content="删除Host" placement="right">
                <el-button @click="deleteHost(index)" type="danger" icon="el-icon-delete" circle></el-button>
                </el-tooltip>
          </el-col>
          <el-col :span="4">
                <el-tooltip class="item" effect="dark" content="增加Rule" placement="right">
                <el-button @click="addRule(index)"  icon="el-icon-plus" circle></el-button>
                </el-tooltip>
          </el-col>
      </el-row>
      <!-- ingress操作 -->
  </div>
  <!-- host -->
  <el-divider></el-divider>
  <el-row style="padding-top: 10px">
      <el-tooltip class="item" effect="dark" content="增加Host" placement="right">
      <el-button @click="addHost()" icon="el-icon-plus" circle></el-button>
      </el-tooltip>
  </el-row>

  <!-- 按钮 -->
  <el-row style="padding-top: 20px">
    <span >
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-row>
  <!-- 按钮 -->
   </el-dialog>
    </div>
</template>

<script>
export default {
  props: {
    namespace: String,
    show: Boolean
  },
  data () {
    return {
      name: null,
      host: [{
        hostname: null,
        http: [{
          path: null,
          backendService: null,
          backendPort: null
        }]
      }]
    }
  },
  methods: {
    submit () {
      this.$axios.post('k8s/createingress', {
        name: this.name,
        namespace: this.namespace,
        host: this.host
      })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '创建成功！'
            })
            this.$emit('close')
          } else {
            this.$notify.error({
              title: '错误！',
              message: '创建失败！内容格式错误或目标资源已存在'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    addRule (index) {
      this.host[index].http.push({
        path: null,
        backendService: null,
        backendPort: null
      })
    },
    deleteRole (bindex, index) {
      this.host[index].http.splice(bindex, 1)
    },
    addHost () {
      this.host.push({
        hostname: null,
        http: [{
          path: null,
          backendService: null,
          backendPort: null
        }]
      })
    },
    deleteHost (index) {
      this.host.splice(index, 1)
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
