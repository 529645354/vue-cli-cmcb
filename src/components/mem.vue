<template>
    <div id='mem'></div>
</template>

<script>

export default {
  props: {
    memvalue: Object
  },
  computed: {
    use () {
      return this.memvalue.use_mem
    },
    free () {
      return this.memvalue.free_mem
    }
  },
  methods: {
    mem: function () {
      var mem = this.$echarts.init(document.getElementById('mem'))
      mem.showLoading()
      setInterval(() => {
        mem.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: ['已用内存', '空闲内存']
          },
          series: [
            {
              name: '内存:G',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: this.use, name: '已用内存' },
                { value: this.free, name: '空闲内存' }
              ]
            }
          ]
        })
        mem.hideLoading()
      }, 1000)

      console.log(this.memvalue.use_mem)
    }
  },
  mounted () {
    this.mem()
    console.log(this.memvalue.use_mem)
  }
}
</script>
<style>
  #mem {
    width: auto;
    height: 300px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }
</style>
