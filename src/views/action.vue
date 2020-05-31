<template>
<div>
    <el-steps :active="active" finish-status="success">
  <el-step title="步骤 1" description="选择ansible要执行的主机组"></el-step>
  <el-step title="步骤 2" description="填写ansible配置"></el-step>
  <el-step title="步骤 3" description="执行结果"></el-step>
</el-steps>

<selectgroup @getgroup="getgrouplist" v-show="active === 0"/>
<ansible @getyamlname="yamlname" @getfork="fork" @getbecome="become" @getbecome_user="become_user" @gettasks="tasks_name" v-show="active === 1" />
<logmessage :v.sync="vists" :message.sync="res" v-if="active > 1"/>

<div style="width: 100%" v-if="this.active === 0"><el-button type="primary" class="acnextbtn" style="margin-top: 12px;" @click="next" plain="" :disabled="disable">下一步</el-button></div>
<div style="width: 100%" v-if="this.active === 1"><el-button type="primary" class="acnprebtn" style="margin-top: 12px;" @click="pre" plain="">上一步</el-button></div>
<div style="width: 100%" v-if="this.active === 1"><el-button type="primary" class="acnextbtn" style="margin-top: 12px;" @click="commit"  plain="" :disabled="cdisable">提交</el-button></div>
<div style="width: 100%" v-if="this.active > 1 && this.$store.state.visit === false"><el-button type="primary" class="acnextbtn" style="margin-top: 12px;" @click="end"  plain="">完成</el-button></div>
</div>
</template>

<script>
import selectgroup from '@/components/select.vue'
import ansible from '@/components/ansible.vue'
import logmessage from '@/components/logmess.vue'
export default {
  components: {
    selectgroup,
    ansible,
    logmessage
  },
  data () {
    return {
      active: 0,
      grouplist: [],
      yname: '',
      forks: 5,
      becomes: false,
      busers: null,
      log: [],
      vists: true,
      res: null
    }
  },
  computed: {
    disable () {
      if (this.grouplist.length > 0) {
        return false
      } else {
        return true
      }
    },
    cdisable () {
      if (this.yname === '' || this.forks === 0) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    end () {
      this.$store.commit('hidev')
      this.active = 0
    },
    tasks_name (val) {
      this.tasksname = val
    },
    yamlname (val) {
      this.yname = val
    },
    fork (val) {
      this.forks = val
    },
    become (val) {
      this.becomes = val
    },
    become_user (val) {
      this.busers = val
    },
    commit () {
      this.log = []
      if (this.active <= 2) {
        this.$notify.warning({
          title: '警告',
          dangerouslyUseHTMLString: true,
          message: '<li class="el-icon-loading"></li><span>正在执行，请勿刷新页面</span>'
        })
        this.$axios.post('api/run/', { group: this.grouplist, yaml: this.yname, forks: this.forks, become: this.becomes, busers: this.busers })
          .then(res => {
            console.log(res)
            if (res.data.stauts === 200) {
              this.$store.commit('showv')
              this.res = res.data.content
              this.active++
            }
            // console.log(res)
          })
          .catch(err => {
            console.error(err)
          })
        this.active++
      }
    },
    next () {
      if (this.active <= 2) {
        this.active++
      }
    },
    pre () {
      if (this.active > 0) {
        this.active--
      }
    },
    getgrouplist (val) {
      this.grouplist = val
    }
  }
}
</script>
<style>
    .acnextbtn {
        position: absolute;
        right: 50px;
    }
    .acprebtn {
        position: absolute;
        left: 50px;
    }
</style>
