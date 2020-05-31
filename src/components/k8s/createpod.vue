<template>
    <div>
        <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
  :title="title"
  :show-close="false"
  :visible.sync="show"
  width="60%"
  >

  <el-row v-if=" createtype === 'pod' "><el-col :span="4">Pod名称：<el-input v-model="Name" placeholder="请输入Pod名称"></el-input></el-col></el-row>
  <el-row v-if=" createtype === 'deploy' "><el-col :span="4">deployment名称：<el-input v-model="Name" placeholder="请输入Deployment名称"></el-input></el-col></el-row>
  <el-row v-if=" createtype === 'deploy' " style="padding-top: 10px">副本数：<el-input-number v-model="Replicas" :min="1" label="副本数"></el-input-number></el-row>
<!--DeployMent Label -->
   <el-divider v-if=" createtype === 'deploy' " content-position="left">Deployment Label</el-divider>
    <el-row :gutter="20" v-for="(label, index) in DeployLabel" :key="'13'+index">
        <el-col :span="4">key: <el-input v-model="label.key"></el-input></el-col>
        <el-col :span="4">value: <el-input v-model="label.value"></el-input></el-col>
        <el-tooltip class="item" effect="dark" content="删除" placement="right">
        <el-button @click="deletedeploylabel(index)" type="danger" icon="el-icon-delete" circle></el-button>
        </el-tooltip>
    </el-row>
    <el-button style="margin-top: 5px" @click="adddeploylabel()" type="primary" plain>增加标签</el-button>
<!--DeployMent Label -->

<!--Pod Label -->
   <el-divider content-position="left">Pod Label</el-divider>
    <el-row :gutter="20" v-for="(label, index) in Label" :key="'21'+index">
        <el-col :span="4">key: <el-input v-model="label.key"></el-input></el-col>
        <el-col :span="4">value: <el-input v-model="label.value"></el-input></el-col>
        <el-tooltip class="item" effect="dark" content="删除" placement="right">
        <el-button @click="deletelabel(index)" type="danger" icon="el-icon-delete" circle></el-button>
        </el-tooltip>
    </el-row>
    <el-button style="margin-top: 5px" @click="addlabel()" type="primary" plain>增加标签</el-button>
<!--Pod Label -->

<!-- container -->
<div v-for="(c, index) in Container" :key="'11'+index">
   <el-divider content-position="left">Container</el-divider>

   <!-- 容器名称和镜像 -->
    <el-row :gutter="20">
        <el-col :span="4">Name: <el-input v-model="c.Name"></el-input></el-col>
        <el-col :span="4">Image: <el-input v-model="c.Image"></el-input></el-col>
    </el-row>
    <!-- 容器名称和镜像 -->

    <!-- env -->
     <el-row v-for="(e, eindex) in c.Env" :key="'10'+eindex" :gutter="20" style="margin-top: 5px">
            <el-col :span="4">环境变量名称：<el-input v-model="e.name"></el-input></el-col>
            <el-col :span="4">环境变量值：<el-input v-model="e.value"></el-input></el-col>
            <el-tooltip class="item" effect="dark" content="删除环境变量" placement="right">
            <el-button @click="deleteenv(eindex, index)" type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
    </el-row>
    <!-- env -->

    <!-- 挂载卷 -->
    <el-row v-for="(v, vindex) in c.VolumeMount" :key="'9'+vindex" :gutter="20" style="margin-top: 5px">
            <el-col :span="4">卷名称：<el-input v-model="v.name"></el-input></el-col>
            <el-col :span="4">挂载路径：<el-input v-model="v.path"></el-input></el-col>
            <el-tooltip class="item" effect="dark" content="删除挂载" placement="right">
            <el-button @click="deletemountvolume(vindex, index)" type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
    </el-row>
    <!-- 挂载卷 -->

    <!-- 环境变量形式configmap -->
    <el-row v-for="(cm, cindex) in c.ConfigMap" :key="'8'+cindex" :gutter="20" style="margin-top: 5px">
            <el-col :span="4">变量名称：<el-input v-model="cm.name"></el-input></el-col>
            <el-col :span="4">configmap 名称：<el-input v-model="cm.configname"></el-input></el-col>
            <el-col :span="4">configmap key：<el-input v-model="cm.key"></el-input></el-col>
            <el-tooltip class="item" effect="dark" content="删除挂载" placement="right">
            <el-button @click="deleteEnvConfigmap(cindex, index)" type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
    </el-row>
    <!-- 环境变量形式configmap -->

    <!-- 容器执行命令 -->
    <el-row style="margin-top: 10px">
        <el-col :span="20">容器执行命令Command：<el-input v-model="c.Command" placeholder="默认为空,命令分割以逗号表示"></el-input></el-col>
    </el-row>
    <!-- 容器执行命令 -->

    <!-- container操作 -->
    <el-tooltip class="item" effect="dark" content="删除container" placement="bottom">
            <el-button style="margin-top: 5px" @click="deletecontainer(index)" type="danger" icon="el-icon-delete" circle></el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="添加环境变量" placement="bottom">
            <el-button style="margin-top: 5px" @click="addenv(index)" type="primary"  icon="el-icon-takeaway-box" circle></el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="添加挂载卷" placement="bottom">
            <el-button style="margin-top: 5px" @click="addvolumemount(index)" type="success"  icon="el-icon-folder-opened" circle></el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="挂载ConfigMap环境变量" placement="bottom">
            <el-button style="margin-top: 5px" @click="addEnvConfigMap(index)" type="success"  icon="el-icon-edit-outline" circle></el-button>
    </el-tooltip>
    <!-- container操作 -->
    </div>
<!-- container -->

<!-- initcontainer -->
<div v-for="(c, index) in initContainer" :key="'7'+index">
   <el-divider content-position="left">initContainer</el-divider>

   <!-- 容器名称和镜像 -->
    <el-row :gutter="20">
        <el-col :span="4">Name: <el-input v-model="c.Name"></el-input></el-col>
        <el-col :span="4">Image: <el-input v-model="c.Image"></el-input></el-col>
    </el-row>
    <!-- 容器名称和镜像 -->

    <!-- env -->
     <el-row v-for="(e, eindex) in c.Env" :key="'6'+eindex" :gutter="20" style="margin-top: 5px">
            <el-col :span="4">环境变量名称：<el-input v-model="e.name"></el-input></el-col>
            <el-col :span="4">环境变量值：<el-input v-model="e.value"></el-input></el-col>
            <el-tooltip class="item" effect="dark" content="删除环境变量" placement="right">
            <el-button @click="deleteinitenv(eindex, index)" type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
    </el-row>
    <!-- env -->

    <!-- 挂载卷 -->
    <el-row v-for="(v, vindex) in c.VolumeMount" :key="'5'+vindex" :gutter="20" style="margin-top: 5px">
            <el-col :span="4">卷名称：<el-input v-model="v.name"></el-input></el-col>
            <el-col :span="4">挂载路径：<el-input v-model="v.path"></el-input></el-col>
            <el-tooltip class="item" effect="dark" content="删除挂载" placement="right">
            <el-button @click="deleteinitmountvolume(vindex, index)" type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
    </el-row>
    <!-- 挂载卷 -->

    <!-- 容器执行命令 -->
    <el-row style="margin-top: 10px">
        <el-col :span="20">容器执行命令Command：<el-input v-model="c.Command" placeholder="默认为空,命令分割以逗号表示"></el-input></el-col>
    </el-row>
    <!-- 容器执行命令 -->

    <!-- initcontainer操作 -->
    <el-tooltip class="item" effect="dark" content="删除initcontainer" placement="bottom">
            <el-button style="margin-top: 5px" @click="deleteinitcontainer(index)" type="danger" icon="el-icon-delete" circle></el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="添加环境变量" placement="bottom">
            <el-button style="margin-top: 5px" @click="addinitenv(index)" type="primary"  icon="el-icon-takeaway-box" circle></el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="添加挂载卷" placement="bottom">
            <el-button style="margin-top: 5px" @click="addinitvolumemount(index)" type="success"  icon="el-icon-folder-opened" circle></el-button>
    </el-tooltip>
    <!-- initcontainer操作 -->
    </div>
<!-- initcontainer -->

<!-- 增加卷 -->
    <div v-for="(volume, vindex) in Volume" :key="'4'+vindex">
    <el-divider content-position="left">Volume</el-divider>
    <el-row :gutter="10">
        <!-- 卷类型为pvc -->
        <el-col :span="5">
                    卷名称：
                    <el-input placeholder="卷名称" v-model="volume.name"></el-input>
                    pvc卷名：
                    <el-input placeholder="pvc" v-model="volume.pvc"></el-input>
        </el-col>
        <!-- 卷类型为pvc -->
         <!-- 删除卷按钮 -->
         <el-col :span="4">
             <el-tooltip class="item" effect="dark" content="删除volume" placement="right">
            <el-button style="margin-top: 5px" @click="deletevolume(vindex)" type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
         </el-col>
         <!-- 删除卷按钮 -->
    </el-row>
    </div>
<!-- 增加卷 -->

<!-- 增加secret卷 -->
    <div v-for="(sv, sindex) in SecretVolume" :key="'3'+sindex">
    <el-divider content-position="left">Secret Volume</el-divider>
    <el-row :gutter="10">
        <el-col :span="5">
                    卷名称：
                    <el-input placeholder="卷名称" v-model="sv.name"></el-input>
                    Secret名：
                    <el-input placeholder="Secret" v-model="sv.secret"></el-input>
        </el-col>
         <!-- 删除卷按钮 -->
         <el-col :span="4">
             <el-tooltip class="item" effect="dark" content="删除secret卷" placement="right">
            <el-button style="margin-top: 5px" @click="deletesecretvolume(sindex)" type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
         </el-col>
         <!-- 删除卷按钮 -->
    </el-row>
    </div>
<!-- 增加secret卷 -->

<!-- 增加configmap卷 -->
    <div v-for="(cmv, cindex) in ConfigMapVolume" :key="'2'+cindex">
    <el-divider content-position="left">ConfigMap Volume</el-divider>
    <el-row :gutter="10">
        <el-col :span="5">
                    卷名称：
                    <el-input placeholder="卷名称" v-model="cmv.name"></el-input>
                    ConfigMap名：
                    <el-input placeholder="Configmap" v-model="cmv.configmap"></el-input>
        </el-col>
         <!-- 删除卷按钮 -->
         <el-col :span="4">
             <el-tooltip class="item" effect="dark" content="删除secret卷" placement="right">
            <el-button style="margin-top: 5px" @click="deleteconfigmapvolume(cindex)" type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
         </el-col>
         <!-- 删除卷按钮 -->
    </el-row>
    </div>
<!-- 增加config卷 -->

<!-- 增加nfs卷 -->
    <div v-for="(n, nindex) in NfsVolume" :key="'1'+nindex">
    <el-divider content-position="left">Nfs Volume</el-divider>
    <el-row :gutter="10">
        <el-col :span="5">
                    卷名称：
                    <el-input placeholder="卷名称" v-model="n.name"></el-input>
                    nfs服务器ip：
                    <el-input placeholder="IP" v-model="n.nfsserver"></el-input>
                    nfs path：
                    <el-input placeholder="path" v-model="n.path"></el-input>
        </el-col>
         <!-- 删除卷按钮 -->
         <el-col :span="4">
             <el-tooltip class="item" effect="dark" content="删除nfs卷" placement="right">
            <el-button style="margin-top: 5px" @click="deletenfsvolume(nindex)" type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
         </el-col>
         <!-- 删除卷按钮 -->
    </el-row>
    </div>
<!-- 增加nfs卷 -->

<!-- 按钮 -->
    <el-card style="margin-top: 50px" class="box-card">
    <el-row :gutter="5">
        <el-col :span="4">
            <el-tooltip class="item" effect="dark" content="增加container" placement="bottom">
            <el-button  @click="addcontainer()" icon="el-icon-plus" plain></el-button>
            </el-tooltip>
        </el-col>
        <el-col :span="4">
            <el-tooltip class="item" effect="dark" content="增加初始化容器" placement="bottom">
            <el-button  @click="addinitcontainer()" icon="el-icon-s-help" plain></el-button>
            </el-tooltip>
        </el-col>
        <el-col :span="4">
            <el-tooltip class="item" effect="dark" content="增加卷" placement="bottom">
            <el-button  @click="addVolume()" icon="el-icon-wallet" plain></el-button>
            </el-tooltip>
        </el-col>
        <el-col :span="4">
            <el-tooltip class="item" effect="dark" content="挂载ConfigMap卷" placement="bottom">
            <el-button  @click="addVolumeConfigMap()" icon="el-icon-s-order" plain></el-button>
        </el-tooltip>
        </el-col>
        <el-col :span="4">
            <el-tooltip class="item" effect="dark" content="挂载Secret卷" placement="bottom">
            <el-button @click="addVolumeSecret()"  icon="el-icon-s-finance" plain></el-button>
            </el-tooltip>
        </el-col>
        <el-col :span="4">
            <el-tooltip class="item" effect="dark" content="挂载nfs卷" placement="bottom">
            <el-button @click="addVolumeNfs()"  icon="el-icon-document-copy" plain></el-button>
            </el-tooltip>
        </el-col>
    </el-row>
    </el-card>
<!-- 按钮 -->

<!-- container -->

  <span slot="footer" class="dialog-footer">
    <el-button @click="close()">取 消</el-button>
    <el-button type="primary" @click="submit()">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
  props: {
    namespace: String,
    show: Boolean,
    title: String,
    createtype: String
  },
  data () {
    return {
      Name: null,
      Replicas: 1,
      ConfigMapVolume: [],
      SecretVolume: [],
      NfsVolume: [],
      Volume: [],
      Label: [{
        key: null,
        value: null
      }],
      Container: [{
        Name: null,
        Image: null,
        Env: [],
        Command: null,
        VolumeMount: [],
        ConfigMap: []
      }],
      initContainer: [{
        Name: null,
        Image: null,
        Env: [],
        Command: null,
        VolumeMount: []
      }],
      DeployLabel: [{
        key: null,
        value: null
      }]
    }
  },
  methods: {
    submit () {
      if (this.createtype === 'pod') {
        this.$axios.post('k8s/createpod', {
          name: this.Name,
          volume: this.Volume,
          label: this.Label,
          container: this.Container,
          initContainer: this.initContainer,
          namespace: this.namespace,
          nfsvolume: this.NfsVolume,
          configmapvolume: this.ConfigMapVolume,
          secretvolume: this.SecretVolume
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
                message: '创建失败！内容格式错误或目标资源已存在'
              })
            }
          })
          .catch(err => {
            console.error(err)
          })
      } else if (this.createtype === 'deploy') {
        this.$axios.post('k8s/createdeploy', {
          name: this.Name,
          volume: this.Volume,
          label: this.Label,
          container: this.Container,
          initContainer: this.initContainer,
          namespace: this.namespace,
          nfsvolume: this.NfsVolume,
          configmapvolume: this.ConfigMapVolume,
          secretvolume: this.SecretVolume,
          replicas: this.Replicas,
          deploylabel: this.DeployLabel
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
                message: '创建失败！内容格式错误或目标资源已存在'
              })
            }
          })
          .catch(err => {
            console.error(err)
          })
      }
    },
    addVolumeNfs () {
      this.NfsVolume.push({
        name: null,
        nfsserver: null,
        path: null
      })
    },
    deletenfsvolume (nindex) {
      this.NfsVolume.splice(nindex, 1)
    },
    addVolumeConfigMap () {
      this.ConfigMapVolume.push({
        name: null,
        configmap: null
      })
    },
    deleteconfigmapvolume (cindex) {
      this.ConfigMapVolume.splice(cindex, 1)
    },
    addVolumeSecret () {
      this.SecretVolume.push({
        name: null,
        secret: null
      })
    },
    deletesecretvolume (sindex) {
      this.SecretVolume.splice(sindex, 1)
    },
    addEnvConfigMap (index) {
      this.Container[index].ConfigMap.push({
        name: null,
        key: null,
        configname: null
      })
    },
    deleteEnvConfigmap (cindex, index) {
      this.Container[index].ConfigMap.splice(cindex, 1)
    },
    addinitvolumemount (index) {
      this.initContainer[index].VolumeMount.push({
        name: null,
        path: null
      })
    },
    deleteinitmountvolume (vindex, index) {
      this.initContainer[index].Env.splice(vindex, 1)
    },
    addinitcontainer () {
      this.initContainer.push({
        Name: null,
        Image: null,
        Env: [],
        Command: null,
        VolumeMount: []
      })
    },
    deleteinitcontainer (index) {
      this.initContainer.splice(index, 1)
    },
    addinitenv (index) {
      this.initContainer[index].Env.push({
        name: null,
        value: null
      })
    },
    deleteinitenv (eindex, index) {
      this.initContainer[index].Env.splice(eindex, 1)
    },
    addVolume () {
      this.Volume.push({
        name: null,
        pvc: null
      })
    },
    deletevolume (vindex) {
      this.Volume.splice(vindex, 1)
    },
    addvolumemount (index) {
      this.Container[index].VolumeMount.push({
        name: null,
        path: null
      })
    },
    deletemountvolume (vindex, index) {
      this.Container[index].VolumeMount.splice(index, 1)
    },
    addenv (index) {
      this.Container[index].Env.push({
        name: null,
        value: null
      })
    },
    deleteenv (eindex, index) {
      this.Container[index].Env.splice(eindex, 1)
    },
    addcontainer () {
      this.Container.push({
        Name: null,
        Image: null,
        Env: [],
        Command: null,
        VolumeMount: [],
        ConfigMap: []
      })
    },
    deletecontainer (index) {
      this.Container.splice(index, 1)
    },
    deletelabel (index) {
      this.Label.splice(index, 1)
    },
    deletedeploylabel (index) {
      this.DeployLabel.splice(index, 1)
    },
    adddeploylabel () {
      this.DeployLabel.push({
        key: null,
        value: null
      })
    },
    addlabel () {
      this.Label.push({
        key: null,
        value: null
      })
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
