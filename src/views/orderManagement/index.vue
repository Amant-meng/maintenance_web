<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.params.or_id" placeholder="订单号" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.ro_type_name" placeholder="房型" clearable style="width: 150px;" class="filter-item" @keyup.native="roomTypeberProving"/>
      <el-input v-model="listQuery.params.ro_id" placeholder="房号" clearable style="width: 150px;" class="filter-item" @keyup.native="roomNumberProving"/>
      <el-input v-model="listQuery.params.or_ci_name" placeholder="姓名" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.or_ci_tel" placeholder="电话" clearable style="width: 150px;" class="filter-item" @keyup.native="phoneNumProving"/>
      <el-input v-model="listQuery.params.ro_price" placeholder="房价(元)" clearable style="width: 150px;" class="filter-item" @keyup.native="roomPriceProving"/>
      <el-input v-model="listQuery.params.or_act_day" placeholder="实住天数" clearable style="width: 150px;" class="filter-item" @keyup.native="dayNumProving"/>
      <el-input v-model="listQuery.params.bill_prepay" placeholder="预付金额(元)" clearable style="width: 150px;" class="filter-item" @keyup.native="provingBillPrepay"/>
      <el-input v-model="listQuery.params.bill_deposit" placeholder="押金(元)" clearable style="width: 150px;" class="filter-item" @keyup.native="provingBillDeposit"/>
      <el-select v-model="listQuery.params.or_status" placeholder="订单状态" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in orstatusParamsData" :key="item.code" :label="item.name" :value="item.code"/>
      </el-select>
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
      <el-date-picker
        v-model="checkoutdateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="退房时间"
        end-placeholder="结束时间"
        class="filter-item"
        style="width: auto"
        value-format="yyyy-MM-dd"
        @change="checkoutformatDateRange"/>
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
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column key="1" label="订单号" prop="id" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.or_id }}</span>
        </template>
      </el-table-column>
      <el-table-column key="2" label="房型" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.ro_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column key="3" label="房号" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.ro_id }}</span>
        </template>
      </el-table-column>
      <el-table-column key="4" label="姓名" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.or_ci_name }}</span>
        </template>
      </el-table-column>
      <el-table-column key="5" label="电话" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.or_ci_tel }}</span>
        </template>
      </el-table-column>
      <el-table-column key="6" label="房价" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.ro_price | paddingZero }}</span>
        </template>
      </el-table-column>
      <el-table-column key="7" label="实住天数" min-width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.or_act_day }}</span>
        </template>
      </el-table-column>
      <el-table-column key="8" label="预付金额" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.bill_prepay | paddingZero }}</span>
        </template>
      </el-table-column>
      <el-table-column key="9" label="押金" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.bill_deposit | paddingZero }}</span>
        </template>
      </el-table-column>
      <el-table-column key="10" :formatter="statusTypeOptions" label="订单状态" prop="or_status" align="center" min-width="120"/>
      <el-table-column key="11" label="入住时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.or_act_arr_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column key="12" label="退房时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.or_act_dep_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column key="13" label="创建人" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.c_user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column key="14" label="创建时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.c_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column key="15" label="操作" align="center" width="180" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showOrderDetails(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :limit.sync="listQuery.length" @pagination="getList" />
    <OrderDetail ref="OrderDetail" :order-dialog-form-visible.sync="showOrderDialogFormVisible" :pkwid="pkwid"/>
  </div>
</template>

<script>
import { getAllOrderList } from '@/api/ordermanagement'
import { getDicMore } from '@/api/dic'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import OrderDetail from '@/components/OrderDetail'

export default {
  name: 'OrderManagement',
  components: { Pagination, OrderDetail },
  directives: { waves },
  filters: {
    paddingZero(value) {
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
      listLoading: true,
      dateRange: undefined,
      checkoutdateRange: undefined,
      pkwid: '',
      showOrderDialogFormVisible: false,
      listQuery: {
        start: 0,
        length: 10,
        params: {
          or_id: undefined,
          or_ci_name: undefined,
          or_ci_tel: undefined,
          ro_id: undefined,
          ro_type_name: undefined,
          ro_price: undefined,
          or_act_day: undefined,
          or_status: undefined,
          bill_deposit: undefined,
          bill_prepay: undefined,
          or_act_arr_time: undefined,
          or_act_dep_time: undefined
        }
      },
      dicParams: 'code_roomtype,code_checkinstatus',
      dicParamsData: [],
      roomTypeParamsData: [],
      orstatusParamsData: []
    }
  },
  created() {
    this.getDic()
    this.getList()
  },
  methods: {
    // 订单详情方法
    showOrderDetails(row) {
      this.pkwid = row.pk_ci_id
      this.showOrderDialogFormVisible = true
    },
    // 验证房间号
    roomNumberProving() {
      this.listQuery.params.ro_id = this.listQuery.params.ro_id.replace(/[^\w\.\/]/ig, '')
      this.listQuery.params.ro_id = this.listQuery.params.ro_id.replace('.', '')
    },
    // 验证输入房型只能输入中文
    roomTypeberProving() {
      this.listQuery.params.ro_type_name = this.listQuery.params.ro_type_name.replace(/[^\u4e00-\u9fa5]/g, '')
      this.listQuery.params.ro_type_name = this.listQuery.params.ro_type_name.replace('.', '')
    },
    // 手机号验证
    phoneNumProving() {
      this.listQuery.params.or_ci_tel = this.listQuery.params.or_ci_tel.replace(/[^\.\d]/g, '')
      this.listQuery.params.or_ci_tel = this.listQuery.params.or_ci_tel.replace('.', '')
    },
    // 房价验证
    roomPriceProving() {
      // 如果输入非数字，则替换为''
      this.listQuery.params.ro_price = this.listQuery.params.ro_price.replace(/[^\d\.]/g, '')
      // 必须保证第一个为数字而不是.
      this.listQuery.params.ro_price = this.listQuery.params.ro_price.replace(/^\./g, '')
      // 保证只有出现一个.而没有多个.
      this.listQuery.params.ro_price = this.listQuery.params.ro_price.replace(/\.{2,}/g, '.')
      // 保证.只出现一次，而不能出现两次以上
      this.listQuery.params.ro_price = this.listQuery.params.ro_price.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      // 只能输入两位小数
      this.listQuery.params.ro_price = this.listQuery.params.ro_price.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    },
    // 入住天数验证
    dayNumProving() {
      this.listQuery.params.or_act_day = this.listQuery.params.or_act_day.replace(/[^\.\d]/g, '')
      this.listQuery.params.or_act_day = this.listQuery.params.or_act_day.replace('.', '')
    },
    // 押金验证
    provingBillDeposit() {
      this.listQuery.params.bill_deposit = this.listQuery.params.bill_deposit.replace(/[^\.\d]/g, '')
      this.listQuery.params.bill_deposit = this.listQuery.params.bill_deposit.replace('.', '')
    },
    // 预付金额验证
    provingBillPrepay() {
      this.listQuery.params.bill_prepay = this.listQuery.params.bill_prepay.replace(/[^\.\d]/g, '')
      this.listQuery.params.bill_prepay = this.listQuery.params.bill_prepay.replace('.', '')
    },
    // 获取字典表所有数据
    getDic() {
      getDicMore(this.dicParams).then(response => {
        this.dicParamsData = response.data
        this.roomTypeParamsData = this.dicParamsData.code_roomtype
        this.orstatusParamsData = this.dicParamsData.code_checkinstatus
      })
    },
    // 获取订单列表
    getList() {
      this.listLoading = true
      getAllOrderList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.recordsTotal
        this.listLoading = false
      })
    },
    // 房间类型表格数据显示
    roomTypeOptions(row, column) {
      for (let i = 0; i < this.roomTypeParamsData.length; i++) {
        if (this.roomTypeParamsData[i].code === row.ro_type_id) {
          return this.roomTypeParamsData[i].name
        }
      }
    },
    // 在住状态表格数据显示
    statusTypeOptions(row, column) {
      for (let i = 0; i < this.orstatusParamsData.length; i++) {
        if (this.orstatusParamsData[i].code === row.or_status) {
          return this.orstatusParamsData[i].name
        }
      }
    },
    // 刷新操作
    handleRefresh() {
      this.listQuery.params = {}
      this.dateRange = ''
      this.checkoutdateRange = ''
      this.getList()
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
    },
    // 格式化时间
    checkoutformatDateRange(filterVal) {
      if (filterVal) {
        this.listQuery.params.or_act_dep_time = JSON.stringify(filterVal)
          .replace(/\[|\]|\"/g, '')
          .replace(',', ' - ')
      } else {
        this.listQuery.params.or_act_dep_time = undefined
      }
    }
  }
}
</script>
