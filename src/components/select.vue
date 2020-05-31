<template>
    <div>
         <p style="text-align: center; margin: 50px 0 20px">选择主机组</p>
  <div style="text-align: center">
    <el-transfer
      style="text-align: left; display: inline-block;"
      v-model="value4"
      filterable
      :titles="['备选项', '选中项']"
      :button-texts="['移除', '添加']"
      :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
      @change="handleChange"
      :data="data">
      <el-button @click="flush()" class="transfer-footer" slot="left-footer" size="small">刷新</el-button>
      <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
    </el-transfer>
  </div>
    </div>
</template>

<style>
  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }
</style>

<script>
export default {
  data () {
    return {
      data: [],
      value4: []
    }
  },
  watch: {
    value4 (val) {
      this.$emit('getgroup', this.value4)
    }
  },
  methods: {
    handleChange (value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
    },
    flush () {
      this.handleAllgroup()
    },
    handleAllgroup () {
      this.data = []
      this.$axios.get('api/allgroup/')
        .then(res => {
          console.log(res.data)
          for (var i = 0; i < res.data.content.length; i++) {
            this.data.push({
              key: res.data.content[i].id,
              label: res.data.content[i].name
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  mounted () {
    this.handleAllgroup()
  }
}
</script>
