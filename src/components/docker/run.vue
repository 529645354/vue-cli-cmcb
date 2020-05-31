<template>
    <div>
        <el-dialog :title="this.title"
        :visible.sync="this.$store.state.runcontainer"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :show-close="false">
  <el-form :model="form" v-loading="loading">
    <el-form-item label="* 容器名称:">
        <el-row>
          <el-col :span="8"><el-input v-model="form.name" autocomplete="off"></el-input></el-col>
        </el-row>
    </el-form-item>
    <el-form-item label="容器挂载卷">
      <el-tooltip class="item" effect="dark" content="增加容器挂载卷" placement="rigth">
       <el-button @click="AddVolume()" icon="el-icon-plus" circle></el-button>
      </el-tooltip>
      <el-row :gutter="20" v-for="(item, index) in form.volumes" :key="index">
          <el-col :span="8">容器目录：<el-input v-model="item.dvolume" autocomplete="off"></el-input></el-col>
          <el-col :span="8">挂载到主机对应目录：<el-input v-model="item.hvolume" autocomplete="off"></el-input></el-col>
          <el-col :span="4">
            <el-tooltip content="删除该配置项" placement="right">
              <el-button @click="deleteVolume(index)" type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
          </el-col>
        </el-row>
    </el-form-item>
    <el-form-item label="容器暴露端口">
      <el-tooltip class="item" effect="dark" content="增加容器暴露端口" placement="rigth">
       <el-button @click="AddPort()" icon="el-icon-plus" circle></el-button>
      </el-tooltip>
      <el-row :gutter="20" v-for="(item, index) in form.ports" :key="index">
          <el-col :span="8">容器端口：<el-input v-model="item.dport" autocomplete="off"></el-input></el-col>
          <el-col :span="8">暴露到主机对应端口：<el-input v-model="item.hport" autocomplete="off"></el-input></el-col>
          <el-col :span="4">
            <el-tooltip content="删除该配置项" placement="right">
              <el-button @click="deletePort(index)" type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
          </el-col>
        </el-row>
    </el-form-item>

    <el-form-item label="容器环境变量">
      <el-tooltip class="item" effect="dark" content="增加容器环境变量" placement="rigth">
       <el-button @click="AddEnv()" icon="el-icon-plus" circle></el-button>
      </el-tooltip>
      <el-row :gutter="20" v-for="(item, index) in form.env" :key="index">
          <el-col :span="8">key：<el-input v-model="item.key" autocomplete="off"></el-input></el-col>
          <el-col :span="8">value：<el-input v-model="item.value" autocomplete="off"></el-input></el-col>
          <el-col :span="4">
            <el-tooltip content="删除该配置项" placement="right">
              <el-button @click="deleteEnv(index)" type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
          </el-col>
        </el-row>
    </el-form-item>

    <el-form-item label="* 容器网络类型:">
      <el-row :gutter="10">
        <el-col :span="6"><el-select v-model="network" placeholder="请选择网络类型">
        <el-option v-for="item in form.network"
        :key="item.value"
        :label="item.label"
        :value="item.value">
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </el-option>
      </el-select></el-col>
      <el-col :span="2"> <el-tooltip class="item" effect="dark" content="刷新" placement="right"><el-button @click="flush()" icon="el-icon-refresh-right" circle></el-button></el-tooltip></el-col>
      </el-row>
    </el-form-item>

    <el-form-item label="容器执行命令">
        <el-row>
          <el-col :span="12"><el-input v-model="form.command" autocomplete="off"></el-input></el-col>
        </el-row>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="close()">取 消</el-button>
    <el-button type="primary" @click="commit()">确 定</el-button>
  </div>
</el-dialog>
    </div>
</template>

<script>
export default {
  props: {
    title: String
  },
  data () {
    return {
      loading: false,
      form: {
        name: null,
        volumes: [],
        ports: [],
        network: [],
        env: [],
        command: null
      },
      network: ''
    }
  },
  methods: {
    commit () {
      this.loading = true
      this.$axios.post('api/run-container/', { name: this.form.name, volume: this.form.volumes, port: this.form.ports, network: this.network, image: this.title, env: this.form.env, command: this.form.command, addr: this.$store.state.remoteaddr })
        .then(res => {
          if (res.data.status === 200) {
            this.$notify.success({
              title: '成功！',
              message: '启动成功！'
            })
            this.$store.commit('hideRunContainer')
            this.clear()
          } else if (res.data.status === 33334) {
            this.$notify.error({
              title: '错误！',
              message: '有未填项！'
            })
          } else {
            this.$notify.error({
              title: '错误！',
              message: '创建容器错误！'
            })
          }
          this.loading = false
        })
        .catch(err => {
          this.loading = false
          console.error(err)
        })
    },
    clear () {
      this.form.name = null
      this.form.volumes = []
      this.form.ports = []
      this.form.network = []
      this.form.env = []
      this.form.command = null
    },
    AddEnv () {
      this.form.env.push({
        key: '',
        value: ''
      })
    },
    deleteEnv (index) {
      this.form.env.splice(index, 1)
    },
    deletePort (index) {
      this.form.ports.splice(index, 1)
    },
    deleteVolume (index) {
      this.form.volumes.splice(index, 1)
    },
    AddVolume () {
      this.form.volumes.push({
        dvolume: '',
        hvolume: ''
      })
    },
    AddPort () {
      this.form.ports.push({
        dport: '',
        hport: ''
      })
    },
    flush () {
      this.form.network = []
      this.getnetwork()
    },
    close () {
      this.clear()
      this.$store.commit('hideRunContainer')
    },
    getnetwork () {
      this.$axios.get('api/container-network/', { params: { addr: this.$store.state.remoteaddr } })
        .then(res => {
          if (res.data.status === 200) {
            for (var i = 0; i < res.data.content.length; i++) {
              this.form.network.push({
                value: res.data.content[i].id,
                label: res.data.content[i].name
              })
            }
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  mounted () {
    this.getnetwork()
  }
}
</script>
