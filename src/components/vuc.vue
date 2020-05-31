<template>
    <div id="screen">
    </div>
</template>

<script>
import RFB from '@novnc/novnc/core/rfb'
export default {
  name: 'novnc',
  data () {
    return {
      rfb: null,
      IsClean: false, // 是否已断开并不可重新连接
      connectNum: 0 // 重连次数
    }
  },
  props: {
    addr: String
  },
  methods: {
    // vnc连接断开的回调函数
    disconnectedFromServer (msg) {
      if (msg.detail.clean) {
        // 根据 断开信息的msg.detail.clean 来判断是否可以重新连接
        this.contentVnc()
      } else {
        // 这里做不可重新连接的一些操作
        this.$notify.error({
          title: '错误',
          message: '与远程vnc连接断开，请尝试点击安装vnc，再打开'
        })
      }
    },
    // 连接成功的回调函数
    connectedToServer () {
      console.log('success')
    },

    // 连接vnc的函数
    connectVnc () {
      const PASSWORD = 'redhat'
      const rfb = new RFB(document.getElementById('screen'), this.addr, {
        // 向vnc 传递的一些参数，比如说虚拟机的开机密码等
        credentials: { password: PASSWORD }
      })
      rfb.addEventListener('connect', this.connectedToServer)
      rfb.addEventListener('disconnect', this.disconnectedFromServer)
      rfb.scaleViewport = true // scaleViewport指示是否应在本地扩展远程会话以使其适合其容器。禁用时，如果远程会话小于其容器，则它将居中，或者根据clipViewport它是否更大来处理。默认情况下禁用。
      rfb.resizeSession = true // 是一个boolean指示是否每当容器改变尺寸应被发送到调整远程会话的请求。默认情况下禁用
      this.rfb = rfb
    }
  },
  mounted () {
    this.connectVnc()
  }
}
</script>

<style>
    #screen {
        width: 2000;
        height: 700px;
    }
</style>
