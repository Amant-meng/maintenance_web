<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.params.ro_type_name" placeholder="房型" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.ro_id" placeholder="房号" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.or_ci_name" placeholder="姓名" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.or_ci_tel" placeholder="电话" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.bill_deposit" placeholder="押金(元)" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.c_user_name" placeholder="操作员" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="入住时间"
        end-placeholder="结束时间"
        class="filter-item"
        style="width: auto"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="formatTimeRange"/>
      <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
      </div>
    </div>
    <!--表格数据显示-->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="房型" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.ro_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房号" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.ro_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.or_ci_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.or_ci_tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实住天数" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.or_act_day }}</span>
        </template>
      </el-table-column>
      <el-table-column label="押金(元)" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.bill_deposit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入住时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.or_act_arr_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作员" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.c_user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.c_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="refundConfirm(scope.row)">退款</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :limit.sync="listQuery.length" @pagination="getList" />

    <!--添加操作弹出框-->

  </div>
</template>

<script>
import { getRefundOverdueOrder } from '@/api/checkout'
import { Refund } from '@/api/refund'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'RegistrationOrder',
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
  data: function() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      dateRange: undefined,
      listQuery: {
        start: 0,
        length: 10,
        params: {
          ro_id: undefined,
          or_ci_name: undefined,
          or_ci_tel: undefined,
          bill_deposit: undefined,
          or_isrefund: undefined,
          c_user_name: undefined,
          or_act_arr_time: undefined
        }
      },
      temp: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRefundOverdueOrder(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.recordsTotal
        this.listLoading = false
        console.log(this.list)
      })
    },
    handleRefresh() {
      this.listQuery.params = {}
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
      }
    },
    refundUpdate(row) {
      Refund(row.or_id).then(() => {
        this.$notify({
          title: '成功',
          message: '退款成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    refundConfirm(row) {
      this.$confirm('确认退款吗？', '退款提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.refundUpdate(row)
      })
    },
    // 格式化时间
    formatTimeRange(filterVal) {
      if (filterVal) {
        this.listQuery.params.or_act_arr_time = JSON.stringify(filterVal)
          .replace(/\[|\]|\"/g, '')
          .replace(',', ' - ')
      } else {
        this.listQuery.params.or_act_arr_time = undefined
      }
    }
  }
}
</script>
