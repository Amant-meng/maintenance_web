<template>
  <el-badge :value="unReadNum" :max="99" class="item">
    <el-popover
      width="400"
      trigger="click">
      <el-tabs :stretch="true" style="height: 300px;" class="table-no-line">
        <el-tab-pane label="未读">
          <template>
            <el-table
              :data="unReadMessageData"
              :show-header="false"
              max-height="220"
              style="width: 100%">
              <el-table-column
                prop="content"
                min-width="180"/>
              <el-table-column
                prop="pushdate"
                min-width="180"/>
            </el-table>
            <el-button type="primary" size="mini" class="readBt" @click="messageMore">查看更多</el-button>
            <el-button v-show="unReadMessageData.length>0" type="primary" size="mini" class="readBt" @click="updateAllMessage">全部已读</el-button>
          </template>
        </el-tab-pane>
        <el-tab-pane label="已读">
          <el-table
            :data="readMessageData"
            :show-header="false"
            max-height="220"
            style="width: 100%">
            <el-table-column
              prop="content"
              min-width="180"/>
            <el-table-column
              prop="pushdate"
              min-width="180  "/>
          </el-table>
          <el-button type="primary" size="mini" class="readBt" @click="messageMore">查看更多</el-button>
        </el-tab-pane>
      </el-tabs>
      <div slot="reference" style="height: 30px">
        <svg-icon class-name="message-icon" icon-class="messageBox"/>
      </div>
    </el-popover>
  </el-badge>
</template>

<script>
import { getMessageList, updateMessagelist } from '@/api/message'
export default {
  name: 'MessageBox',
  props: {},
  data() {
    return {
      queryList: {
        start: 0,
        length: 10,
        params: {
          state: ''
        }
      },
      readMessageData: [],
      unReadMessageData: []
    }
  },
  computed: {
    unReadNum() {
      this.getMessageList()
      return this.$store.state.app.unReadNum
    }
  },
  created() {
    this.getMessageList()
  },
  methods: {
    getMessageList() {
      this.queryList.params.state = '0'
      getMessageList(this.queryList).then(response => {
        this.unReadMessageData = response.data
        this.$store.dispatch('ToggleUnReadNum', response.recordsTotal)
        this.queryList.params.state = '1'
        getMessageList(this.queryList).then(response => {
          this.readMessageData = response.data
        })
      })
    },
    updateAllMessage() {
      updateMessagelist().then(response => {
        this.getMessageList()
      })
    },
    messageMore() {
      this.$router.push({ path: '/message/message' })
    }
  }
}
</script>

<style scoped>
.message-icon {
  margin-bottom: 5px;
  font-size: 25px;
  cursor: pointer;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}
.readBt{
  float: right;
  margin-top: 5px;
  margin-right: 20px;
}

</style>

<style>
  .table-no-line ::before{
    height: 0;
  }
  .table-no-line .el-table th{
    border-bottom: 0;
  }
  .table-no-line .el-table td{
    border-bottom: 0;
  }
</style>
