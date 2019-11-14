<template>
  <div class="dashboard-container">
    <!--<component :is="role"/>-->
  </div>
</template>

<script>
import { Reception } from './components'
export default {
  name: 'Dashboard',
  components: {
    Reception
  },
  data() {
    return {
    }
  },
  computed: {
    role() {
      if (this.$store.state.user.role.indexOf('超级管理员') !== -1) {
        return 'Reception'
      }
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
  .line{
    height: 1px;
    border-top: 2px solid #ebeef5;
    margin-top: 10px;
  }

  .checkin-item{
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .notice-item{
    height: 25px;
    cursor:pointer;
    margin-top: 8px;
    margin-bottom: 8px;
    &:hover{
      color: #409EFF;
    }
    span{
      &:nth-child(1){
        float: left;
        width: 70%;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      &:nth-child(2){
        float: right;
      }
    }
  }
</style>
