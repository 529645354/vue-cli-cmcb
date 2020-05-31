<template>
    <div :id='this.did' class="d"></div>
</template>

<script>
export default {
  data () {
    return {
      serdata: []
    }
  },
  props: {
    did: String,
    title: String,
    diskname: Array,
    cap: Array
  },
  methods: {
    getcap () {
      this.serdata = []
      for (var i = 0; i < this.cap.length; i++) {
        this.serdata.push({
          value: this.cap[i], name: this.diskname[i]
        }
        )
      }
    },
    disk () {
      var disk = this.$echarts.init(document.getElementById(this.did))
      disk.showLoading()
      setInterval(() => {
        disk.setOption({
          title: {
            text: this.title,
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            top: 'bottom',
            data: this.diskname
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: {
                show: true,
                type: ['pie', 'funnel']
              },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          series: [
            {
              name: '面积模式',
              type: 'pie',
              radius: [30, 110],
              center: ['50%', '50%'],
              roseType: 'area',
              data: this.serdata
            }
          ]
        })
        disk.hideLoading()
      }, 1000)
    }
  },
  mounted () {
    this.getcap()
    this.disk()
  }
}
</script>
<style>
    .d{
        width: auto;
        height: 400px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    }
</style>
