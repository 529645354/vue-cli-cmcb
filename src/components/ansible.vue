<template>
<div class="an">
<el-row>
  <el-col :span="4" :offset="10">
      <label form="select">*选择要执行的yaml文件：</label>
    <div id="select">
  <el-select  v-model="yamlname" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  </div>
  </el-col>
</el-row>

  <el-row>
    <el-col :span="4" :offset="10">
        <label form="block">*选择执行线程数：</label>
        <div id="block" class="block">
    <el-slider
      :max=20
      v-model="fork"
      show-input>
    </el-slider>
  </div>
  </el-col>
  </el-row>
  <el-row>
    <el-col :span="4" :offset="10">
        <el-switch
  v-model="become"
  inactive-text="提权">
</el-switch>
    </el-col>
  </el-row>
  <el-row  v-if="become === true">
      <el-col id="become" :offset="10" :span="4"><label form="become">输入提权后的用户名：</label><el-input v-model="become_user" placeholder="请输入内容"></el-input></el-col>
  </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      become_user: '',
      options: [],
      yamlname: '',
      fork: 5,
      become: false,
      tasks: ''
    }
  },
  watch: {
    yamlname (val) {
      this.$emit('getyamlname', this.yamlname)
    },
    fork (val) {
      this.$emit('getfork', this.fork)
    },
    become (val) {
      this.$emit('getbecome', this.become)
    },
    become_user (val) {
      this.$emit('getbecome_user', this.become_user)
    },
    tasks (val) {
      this.$emit('gettasks', this.tasks)
    }
  },
  methods: {
    getyaml () {
      this.$axios.get('api/yaml/')
        .then(res => {
          if (res.data.status === 200) {
            console.log(res)
            for (var i = 0; i < res.data.content.length; i++) {
              this.options.push({
                value: res.data.content[i].name,
                lable: res.data.content[i].name
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
    this.getyaml()
  }
}
</script>
<style>
    .an {
        margin-top: 100px;
    }
</style>
