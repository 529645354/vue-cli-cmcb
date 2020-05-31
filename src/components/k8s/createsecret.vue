<template>
    <div>
        <el-dialog
        :close-on-press-escape="false"
        :show-close="false"
        :close-on-click-modal="false"
        :destroy-on-close="true"
  title="创建secret"
  :visible.sync="show"
  width="70%">
  <el-row>
      <el-col :span="4">
          secret名称：
          <el-input v-model="name" placeholder="secret名称"></el-input>
      </el-col>
  </el-row>
    <!-- 类型 -->
    <el-divider content-position="left">Secret 类型</el-divider>
    <el-row style="padding-top: 10px">
    <el-radio v-model="stype" label="tls">tls</el-radio>
    <el-radio v-model="stype" label="generic">generic</el-radio>
    <el-radio v-model="stype" label="docker-registry">docker-registry</el-radio>
    </el-row>
    <!-- 类型 -->

        <!-- tls -->
        <el-divider v-if="stype === 'tls'" content-position="left">tls</el-divider>
        <el-row v-if="stype === 'tls'" style="padding-top: 10px" :gutter="10">
            <el-col :span="4">
                cert:
                <el-input v-model="tls.certpath" placeholder="证书路径"></el-input>
            </el-col>
            <el-col :span="4">
                key:
                <el-input v-model="tls.keypath" placeholder="私钥路径"></el-input>
            </el-col>
        </el-row>
        <!-- tls -->

        <!-- generic -->
        <div style="padding-top: 10px" v-if="stype === 'generic'">
            <el-divider content-position="left">generic</el-divider>
        <el-row v-for="(g, index) in generic" :key="index" :gutter="10" style="padding-top: 10px">
            <el-col :span="4">
                key:
                <el-input v-model="g.key" placeholder="key值"></el-input>
            </el-col>
            <el-col :span="4">
                value:
                <el-input v-model="g.value" placeholder="value值"></el-input>
            </el-col>
            <el-col :span="4">
                <el-tooltip class="item" effect="dark" content="删除" placement="right">
                <el-button @click="deletedata(index)" type="danger" icon="el-icon-delete" circle></el-button>
                </el-tooltip>
            </el-col>
        </el-row>
        </div>
        <!-- generic -->

         <!-- docker-registry -->
         <div v-if="stype === 'docker-registry'"  style="padding-top: 10px">
             <el-divider content-position="left">docker-registry</el-divider>
            <el-row :gutter="10"  style="padding-top: 10px">
                <el-col :span="4">
                    docker-server:
                    <el-input v-model="dockerregistry.dockerserver" placeholder="docker-server"></el-input>
                </el-col>
            </el-row>
            <el-row  style="padding-top: 10px">
                <el-col :span="4">
                    docker-username:
                    <el-input v-model="dockerregistry.dockerusername" placeholder="docker-username"></el-input>
                </el-col>
            </el-row>
            <el-row  style="padding-top: 10px">
                <el-col :span="4">
                   dockerpassword:
                    <el-input v-model="dockerregistry.dockerpassword" placeholder="docker-password"></el-input>
                </el-col>
            </el-row>
            <el-row  style="padding-top: 10px">
                <el-col :span="4">
                    dockeremail:
                    <el-input v-model="dockerregistry.dockeremail" placeholder="docker-email"></el-input>
                </el-col>
            </el-row>
         </div>
        <!-- docker-registry -->
        <el-divider></el-divider>
        <el-row v-if="stype === 'generic'">
            <el-col :span="4">
            <el-tooltip class="item" effect="dark" content="增加Data" placement="right">
            <el-button @click="addData()" icon="el-icon-plus" circle></el-button>
            </el-tooltip>
            </el-col>
        </el-row>

        <el-row style="padding-top: 20px">
        <span >
            <el-button @click="close()">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
        </span>
        </el-row>
  </el-dialog>
    </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    namespace: String
  },
  data () {
    return {
      name: null,
      stype: 'generic',
      tls: {
        certpath: null,
        keypath: null
      },
      generic: [{
        key: null,
        value: null
      }],
      dockerregistry: {
        dockerserver: null,
        dockerusername: null,
        dockerpassword: null,
        dockeremail: null
      }
    }
  },
  methods: {
    submit () {
      if (this.stype === 'tls') {
        this.$axios.post('k8s/createsecret', {
          name: this.name,
          stype: this.stype,
          tls: this.tls,
          namespace: this.namespace
        })
          .then(res => {
            if (res.data.status === 200) {
              this.$notify.success({
                title: '成功！',
                message: '成功创建！'
              })
              this.$emit('close')
            } else {
              this.$notify.error({
                title: '失败！',
                message: '创建失败！内容格式错误或目标资源存在'
              })
            }
          })
          .catch(err => {
            console.error(err)
          })
      } else if (this.stype === 'generic') {
        this.$axios.post('k8s/createsecret', {
          name: this.name,
          stype: this.stype,
          generic: this.generic,
          namespace: this.namespace
        })
          .then(res => {
            if (res.data.status === 200) {
              this.$notify.success({
                title: '成功！',
                message: '成功创建！'
              })
              this.$emit('close')
            } else {
              this.$notify.error({
                title: '失败！',
                message: '创建失败！内容格式错误或目标资源存在'
              })
            }
          })
          .catch(err => {
            console.error(err)
          })
      } else {
        this.$axios.post('k8s/createsecret', {
          stype: this.stype,
          dockerregistry: this.dockerregistry,
          namespace: this.namespace,
          name: this.name
        })
          .then(res => {
            if (res.data.status === 200) {
              this.$notify.success({
                title: '成功！',
                message: '成功创建！'
              })
              this.$emit('close')
            } else {
              this.$notify.error({
                title: '失败！',
                message: '创建失败！内容格式错误或目标资源存在'
              })
            }
          })
          .catch(err => {
            console.error(err)
          })
      }
    },
    close () {
      this.$emit('close')
    },
    addData () {
      this.generic.push({
        key: null,
        value: null
      })
    },
    deletedata (index) {
      this.generic.splice(index, 1)
    }
  }
}
</script>
