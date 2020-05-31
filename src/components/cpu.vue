<template>
    <div id='cpu'></div>
</template>

<script>
export default {
  data () {
    return {
      cpu_use: [0],
      nowtime: [0]
    }
  },
  props: {
    cpu_state: Object
  },
  computed: {
    cuse () {
      if (this.cpu_use.length < 7) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.cpu_use.push(this.cpu_state.cpu_use)
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.cpu_use.push(this.cpu_state.cpu_use)
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.cpu_use.shift()
      }
      return this.cpu_use
    },
    // eslint-disable-next-line vue/return-in-computed-property
    ctime () {
      if (this.nowtime.length < 7) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.nowtime.push(this.cpu_state.time)
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.nowtime.push(this.cpu_state.time)
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.nowtime.shift()
      }
      return this.nowtime
    }
  },
  methods: {
    cpu () {
      var cpu = this.$echarts.init(document.getElementById('cpu'))
      cpu.showLoading()
      setInterval(() => {
        cpu.setOption({
          title: {
            text: 'cpu使用率:%'
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
            data: ['cpu使用率']
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
              // type: 'category',
              boundaryGap: false,
              data: this.ctime
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: 'cpu使用率',
              type: 'line',
              areaStyle: {},
              data: this.cuse
            }
          ]
        })
        cpu.hideLoading()
      }, 1000)
    }
  },
  mounted () {
    this.cpu()
  }
}
</script>
<style>
    #cpu {
        width: auto;
        height: 300px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    }
</style>
