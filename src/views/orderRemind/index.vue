<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.params.ro_type_name" placeholder="房型" clearable style="width: 150px;" class="filter-item" @keyup.native="provingRoomType"/>
      <el-input v-model="listQuery.params.ro_id" placeholder="房号" clearable style="width: 150px;" class="filter-item" @keyup.native="provingRoom"/>
      <el-input v-model="listQuery.params.or_ci_name" placeholder="姓名" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.or_ci_tel" placeholder="电话" clearable style="width: 150px;" class="filter-item" @keyup.native="provingPhone"/>
      <el-input v-model="listQuery.params.or_act_day" placeholder="实住天数" clearable style="width: 150px;" class="filter-item" @keyup.native="changeCode"/>
      <el-input v-model="listQuery.params.bill_prepay" placeholder="预付金额(元)" clearable style="width: 150px;" class="filter-item" @keyup.native="provingPrepay"/>
      <el-input v-model="listQuery.params.bill_deposit" placeholder="押金(元)" clearable style="width: 150px;" class="filter-item" @keyup.native="provingDeposit"/>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="入住时间"
        end-placeholder="结束时间"
        class="filter-item"
        style="width: auto"
        value-format="yyyy-MM-dd"
        @change="formatTimeRange"/>
      <div class="filter-container">
        <div class="filter-container">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
        </div>
      </div>
    </div>
    <!--表格数据显示-->
    <el-tabs v-model="activeName" type="card" @tab-click="tabSwitch">
      <el-tab-pane label="入住到期" name="checkinExpire"/>
      <el-tab-pane label="退款超期" name="refundExpire"/>
    </el-tabs>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column key="1" label="房型" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.ro_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column key="2" label="房号" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.ro_id }}</span>
        </template>
      </el-table-column>
      <el-table-column key="3" label="姓名" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.or_ci_name }}</span>
        </template>
      </el-table-column>
      <el-table-column key="4" label="电话" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.or_ci_tel }}</span>
        </template>
      </el-table-column>
      <el-table-column key="5" label="实住天数" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.or_act_day }}</span>
        </template>
      </el-table-column>
      <el-table-column key="6" label="预付金额(元)" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.bill_prepay | priceFilters }}</span>
        </template>
      </el-table-column>
      <el-table-column key="7" label="押金(元)" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.bill_deposit | priceFilters }}</span>
        </template>
      </el-table-column>
      <el-table-column key="8" label="入住时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.or_act_arr_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column key="9" label="预计退房时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.or_est_dep_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column key="10" label="创建人" class-name="status-col" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.c_user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column key="11" label="创建时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.c_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column key="12" label="操作" align="center" width="180" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="getBillDetail(scope.row)">退房</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :limit.sync="listQuery.length" @pagination="getList" />

    <CheckOut ref="CheckOut" :bill-dialog-form-visible.sync="billDialogFormVisible" :datas="datas"/>
  </div>
</template>

<script>
import { getmaturityOrderList, getRefundOverdueOrder } from '@/api/checkout'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import CheckOut from '@/components/CheckOut'

export default {
  name: 'RegistrationOrder',
  components: { Pagination, CheckOut },
  directives: { waves },
  filters: {
    priceFilters(value) {
      if (value === '' || value === undefined || value === null) {
        return
      }
      if (value === 0) {
        return value
      } else {
        return value.toFixed(2)
      }
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      datas: {
        hi_id: '',
        or_checkin_id: ''
      },
      listLoading: true,
      dateRange: undefined,
      listQuery: {
        start: 0,
        length: 10,
        params: {
          ro_id: undefined,
          or_ci_tel: undefined,
          or_ci_name: undefined,
          or_act_day: undefined,
          bill_all_con_money: undefined,
          bill_all_pay_money: undefined,
          bill_deposit: undefined,
          bill_refundable_amount: undefined,
          or_status: undefined,
          or_act_arr_time: undefined,
          bill_refund_time: undefined
        }
      },
      billDialogFormVisible: false,
      dialogStatus: '',
      activeName: 'checkinExpire',
      variable: {
        name: 'checkinExpire'
      },
      textMap: {
        update: '取消',
        create: '添加'
      },
      queryBillData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 选项卡切换调用方法
    tabSwitch(tab) {
      this.variable = tab
      this.getList()
    },
    // 获取订单列表
    getList() {
      this.listLoading = true
      if (this.variable.name === 'checkinExpire') {
        getmaturityOrderList(this.listQuery).then(response => {
          this.list = response.data
          this.total = response.recordsTotal
          this.listLoading = false
        })
      } else {
        getRefundOverdueOrder(this.listQuery).then(response => {
          this.list = response.data
          this.total = response.recordsTotal
          this.listLoading = false
          console.log(this.list)
        })
      }
    },
    // 验证输入房型只能输入中文
    provingRoomType() {
      this.listQuery.params.ro_type_name = this.listQuery.params.ro_type_name.replace(/[^\u4e00-\u9fa5]/g, '')
      this.listQuery.params.ro_type_name = this.listQuery.params.ro_type_name.replace('.', '')
    },
    // 验证房间号
    provingRoom() {
      this.listQuery.params.ro_id = this.listQuery.params.ro_id.replace(/[^\w\.\/]/ig, '')
      this.listQuery.params.ro_id = this.listQuery.params.ro_id.replace('.', '')
    },
    // 手机号验证
    provingPhone() {
      this.listQuery.params.or_ci_tel = this.listQuery.params.or_ci_tel.replace(/[^\.\d]/g, '')
      this.listQuery.params.or_ci_tel = this.listQuery.params.or_ci_tel.replace('.', '')
    },
    // 输入天数验证
    changeCode() {
      this.listQuery.params.or_act_day = this.listQuery.params.or_act_day.replace(/[^\d]/g, '')
      this.listQuery.params.or_act_day = this.listQuery.params.or_act_day.replace('.', '')
    },
    // 预付金额验证
    provingPrepay() {
      this.listQuery.params.bill_prepay = this.listQuery.params.bill_prepay.replace(/[^\.\d]/g, '')
      this.listQuery.params.bill_prepay = this.listQuery.params.bill_prepay.replace('.', '')
    },
    // 押金验证
    provingDeposit() {
      this.listQuery.params.bill_deposit = this.listQuery.params.bill_deposit.replace(/[^\.\d]/g, '')
      this.listQuery.params.bill_deposit = this.listQuery.params.bill_deposit.replace('.', '')
    },
    // 点击退房按钮
    getBillDetail(row) {
      this.billDialogFormVisible = true
      if (row) {
        this.datas.hi_id = row.hi_id
        this.datas.or_checkin_id = row.or_checkin_id
      }
    },
    // 刷新操作
    handleRefresh() {
      this.statusChange(this.variable)
      this.dateRange = ''
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
