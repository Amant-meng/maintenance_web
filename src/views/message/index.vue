<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="isReadChange">
      <el-tab-pane label="未读" name="unread"/>
      <el-tab-pane label="已读" name="read"/>
    </el-tabs>
    <div class="filter-container">
      <el-button v-if="activeName==='unread'" class="filter-item" type="primary" @click="updateAllMessage()">全部已读</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="消息标题" prop="title" min-width="100px" align="center"/>
      <el-table-column label="消息内容" prop="content" min-width="200px" align="center"/>
      <el-table-column label="消息时间" prop="pushdate" align="center" min-width="180px" sortable/>
      <el-table-column v-if="activeName==='unread'" label="操作" align="center" width="100" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleRead(scope.row)">已读</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :limit.sync="listQuery.length" @pagination="getList" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getMessageList, updateMessage, updateMessagelist } from '@/api/message'

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        是: 'success',
        否: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      activeName: 'unread',
      listLoading: true,
      listQuery: {
        start: 0,
        length: 10,
        params: {
          state: '0'
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getMessageList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.recordsTotal
        this.$store.dispatch('ToggleUnReadNum', this.total)
        this.listLoading = false
      })
    },
    isReadChange(tab) {
      if (tab.name === 'unread') {
        this.listQuery.params.state = '0'
      } else {
        this.listQuery.params.state = '1'
      }
      this.getList()
    },
    handleRead(row) {
      row.state = '1'
      updateMessage(row).then(response => {
        this.getList()
      })
    },
    updateAllMessage() {
      updateMessagelist().then(response => {
        this.getList()
      })
    }
  }
}
</script>
