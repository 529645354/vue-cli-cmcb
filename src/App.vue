
<template>
  <div id="app">
  <el-container>
  <el-aside width="205px">
<el-menu default-active="1-4-1" style="hight: 100%" class="el-menu-vertical-demo" :collapse="isCollapse">
    <el-menu-item index="1"  @click="gotoindex">
    <i class="el-icon-menu"></i>
    <span slot="title">首页</span>
  </el-menu-item>

  <el-submenu index="2">
    <template slot="title">
      <i class="el-icon-s-platform"></i>
      <span slot="title">主机</span>
    </template>
      <router-link tag="span" to="/server"><el-menu-item index="2-1">主机列表</el-menu-item></router-link>
      <router-link tag="span" to="/group"><el-menu-item index="2-2">主机组</el-menu-item></router-link>
  </el-submenu>

    <el-submenu index="3">
    <template slot="title">
      <i class="el-icon-s-help"></i>
      <span slot="title">Ansible</span>
    </template>
      <router-link tag="span" to="/yaml"><el-menu-item index="3-1">yaml文件</el-menu-item></router-link>
      <router-link tag="span" to="/action"><el-menu-item index="3-2">Ansible执行</el-menu-item></router-link>
    </el-submenu>
  <el-submenu index="4">
    <template slot="title">
      <i class="el-icon-news"></i>
      <span slot="title">容器</span>
    </template>
<el-menu-item index="4-1" @click="docker">docker主机</el-menu-item>
<el-menu-item index="4-2" @click="kube">k8s</el-menu-item>
  </el-submenu>

   <el-submenu index="5">
    <template slot="title">
      <i class="el-icon-notebook-1"></i>
      <span slot="title">任务</span>
    </template>
      <router-link tag="span" to="/tasks"><el-menu-item index="5-1">任务清单</el-menu-item></router-link>
  </el-submenu>
</el-menu>
</el-aside>
  <el-container>
  <el-main>
    <keep-alive><router-view/></keep-alive>
  </el-main>
  </el-container>
  </el-container>
  </div>
</template>

<script>

export default {
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    kube () {
      this.$router.replace('kube')
    },
    docker () {
      if (this.$store.state.dView) {
        this.$router.replace('docker-server')
      } else {
        this.$router.replace('docker')
      }
    },
    gotoindex () {
      this.$router.replace('/')
    },
    gototasklog () {
      this.$router.replace('log')
    }
  }
}
</script>

<style>
  body {
    min-width: 1900px;
    min-height: 1080px;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
