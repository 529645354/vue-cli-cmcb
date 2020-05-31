<template>
    <div :id="this.cid" class="t"></div>
</template>

<script>
export default {
  data () {
    return {
      dev: [],
      ser: [],
      oldrate: [],
      xtime: []
    }
  },
  props: {
    network: Object,
    title: String,
    cid: String
  },
  computed: {
    udev () {
      return this.network
    },
    getxtime () {
      if (this.xtime.length < 7) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.xtime.push(this.udev.time)
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.xtime.shift()
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.xtime.push(this.udev.time)
      }
      return this.xtime
    }
  },
  methods: {
    setrate () {
      setInterval(() => {
        for (var i = 0; i < this.ser.length; i++) {
          if (this.ser[i].data.length < 7 && this.ser[i].data.length > 0) {
            this.ser[i].data.push(this.udev.net[i].rate)
          } else {
            this.ser[i].data.shift()
            this.ser[i].data.push(this.udev.net[i].rate)
          }
        }
      }, 1000)
    },
    getdev () {
      for (var i = 0; i < this.udev.net.length; i++) {
        this.dev.push(this.udev.net[i].name)
      }
    },
    setser () {
      for (var i = 0; i < this.udev.net.length; i++) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.ser.push({
          name: this.udev.net[i].name,
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: []
        })
      }
    },
    output () {
      var output = this.$echarts.init(document.getElementById(this.cid))
      output.showLoading()
      setInterval(() => {
        output.setOption({
          title: {
            text: this.title
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: this.dev
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: this.getxtime
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: this.ser
        })
        output.hideLoading()
      }, 2000)
    }
  },
  mounted () {
    this.getdev()
    this.setser()
    this.setrate()
    this.output()
  }
}
</script>
<style>
    .t{
        width: auto;
        height: 300px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    }
</style>
