<template>
    <div>
        <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
  :title="title"
  :show-close="false"
  :visible.sync="show"
  width="30%"
  >
  <el-row>
      <el-col v-if="ctype === 'pv'" :span="10">
          Pv名称：
          <el-input v-model="name" placeholder="pv名称"></el-input>
      </el-col>
      <el-col v-if="ctype === 'pvc'" :span="10">
          PVC名称：
          <el-input v-model="name" placeholder="pvc名称"></el-input>
      </el-col>
  </el-row>

 <el-divider v-if="ctype === 'pv'" content-position="left">PV</el-divider>
 <el-divider v-if="ctype === 'pvc'" content-position="left">PVC</el-divider>
  <el-row style="padding-top: 10px">
      <el-col :span="10">
          选择Access Modes：
           <el-select v-model="accessmode" multiple placeholder="Access Modes">
            <el-option
            v-for="item in access"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
  </el-select>
      </el-col>
  </el-row>

  <el-row el-row style="padding-top: 10px">
      <el-col :span="10">
          storageClassName:
          <el-input v-model="storageClassName" placeholder="storageClassName,默认为空"></el-input>
      </el-col>
  </el-row>

  <el-row v-if="ctype === 'pv'"  style="padding-top: 10px">
      <el-col :span="10">
          回收策略：
          <el-select v-model="policy" placeholder="请选择回收策略">
                <el-option
                v-for="item in ReclaimPolicy"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
          </el-select>
      </el-col>
  </el-row>

  <el-row style="padding-top: 10px">
      <el-col :span="10">
          容量：
          <el-input v-model.number="storage" placeholder="输入容量"></el-input>
      </el-col>
  </el-row>

  <el-row v-if="ctype === 'pv'" :gutter="10" style="padding-top: 10px">
      <el-col :span="10">
          nfs服务器:
          <el-input v-model="nfs.nfsserver" placeholder="输入nfs服务器地址"></el-input>
      </el-col >
      <el-col :span="10">
          nfs服务器共享目录:
          <el-input v-model="nfs.path" placeholder="输入nfs服务器共享目录"></el-input>
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
    ctype: String,
    title: String,
    namespace: String
  },
  methods: {
    close () {
      this.$emit('close')
    },
    submit () {
      if (this.ctype === 'pv') {
        this.$axios.post('k8s/createpv', {
          name: this.name,
          accessmode: this.accessmode,
          storage: this.storage,
          storageClassName: this.storageClassName,
          nfs: this.nfs,
          policy: this.policy
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
                title: '失败！',
                message: '创建失败！内容格式错误或目标资源已存在！'
              })
            }
          })
          .catch(err => {
            console.error(err)
          })
      } else {
        this.$axios.post('k8s/createpvc', {
          name: this.name,
          accessmode: this.accessmode,
          storage: this.storage,
          storageClassName: this.storageClassName,
          namespace: this.namespace
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
                title: '失败！',
                message: '创建失败！内容格式错误或目标资源已存在！'
              })
            }
          })
          .catch(err => {
            console.error(err)
          })
      }
    }
  },
  data () {
    return {
      name: name,
      accessmode: [],
      policy: null,
      storage: null,
      storageClassName: null,
      nfs: {
        nfsserver: null,
        path: null
      },
      ReclaimPolicy: [{
        value: 'Delete',
        label: 'Delete'
      },
      {
        value: 'Retain',
        label: 'Retain'
      },
      {
        value: 'Recycle',
        label: 'Recycle'
      }],
      access: [{
        value: 'ReadWriteOnce',
        label: 'ReadWriteOnce'
      }, {
        value: 'ReadOnlyMany',
        label: 'ReadOnlyMany'
      }, {
        value: 'ReadWriteMany',
        label: 'ReadWriteMany'
      }]
    }
  }
}
</script>
