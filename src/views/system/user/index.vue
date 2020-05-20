<template>
  <div>系统设置<br>{{ JSON.stringify(obj) }}</div>
</template>

<script>
import { getUserList } from '@/api/system'
export default {
  data() {
    return {
      obj: null
    }
  },
  mounted() {
    getUserList().then(res => {
      this.obj = res
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
