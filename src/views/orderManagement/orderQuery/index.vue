<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.params.hi_name" placeholder="酒店名称" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.or_source" placeholder="来源" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <!--<el-select v-model="listQuery.params.or_mode" placeholder="入住方式" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in checkinWayData" :key="item.code" :label="item.name" :value="item.code"/>
      </el-select>-->
      <el-input v-model="listQuery.params.or_checkin_id" placeholder="入住单号" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.ro_type_name" placeholder="房型" clearable style="width: 150px;" class="filter-item" @keyup.native="roomTypeberProving"/>
      <el-input v-model="listQuery.params.ro_id" placeholder="房号" clearable style="width: 150px;" class="filter-item" @keyup.native="roomNumberProving"/>
      <el-input v-model="listQuery.params.or_ci_name" placeholder="姓名" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.or_ci_tel" placeholder="电话" clearable style="width: 150px;" class="filter-item" @keyup.native="phoneNumProving"/>
      <el-input v-model="listQuery.params.ro_price" placeholder="房价(元)" clearable style="width: 150px;" class="filter-item" @keyup.native="roomPriceProving"/>
      <el-input v-model="listQuery.params.or_act_day" placeholder="入住天数" clearable style="width: 150px;" class="filter-item" @keyup.native="dayNumProving"/>
      <el-input v-model="listQuery.params.bill_prepay" placeholder="预付金额(元)" clearable style="width: 150px;" class="filter-item" @keyup.native="provingBillPrepay"/>
      <el-input v-model="listQuery.params.bill_deposit" placeholder="押金(元)" clearable style="width: 150px;" class="filter-item" @keyup.native="provingBillDeposit"/>
      <el-select v-model="listQuery.params.or_status" placeholder="订单状态" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in orstatusParamsData" :key="item.code" :label="item.name" :value="item.code"/>
      </el-select><!--
      <el-select v-model="listQuery.params.or_ispay" placeholder="是否支付" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in ispayData" :key="item.code" :label="item.name" :value="item.code"/>
      </el-select>
      <el-select v-model="listQuery.params.or_ispmsin" placeholder="PMS入住成功" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in ispayData" :key="item.code" :label="item.name" :value="item.code"/>
      </el-select>-->
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
      <el-table-column label="入住单号" align="center" min-width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.or_checkin_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="酒店名称" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.hi_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单来源" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.or_source }}</span>
        </template>
      </el-table-column>
      <el-table-column :formatter="checkinWay" label="入住方式" prop="or_mode" align="center" min-width="150"/>
      <el-table-column label="房型" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.ro_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房号" align="center" min-width="120" prop="ro_id" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.ro_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" min-width="150">
        <template slot-scope="scope">
          <span v-html="cutoutData(scope.row.or_ci_name)"/>
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center" min-width="150">
        <template slot-scope="scope">
          <span v-html="cutoutData(scope.row.or_ci_tel)"/>
        </template>
      </el-table-column>
      <el-table-column label="房价(元)" align="center" min-width="120" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.ro_price | paddingZero }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预付金额(元)" align="center" min-width="120px" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.bill_prepay | paddingZero }}</span>
        </template>
      </el-table-column>
      <el-table-column label="押金(元)" align="center" min-width="120px" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.bill_deposit | paddingZero }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入住天数" min-width="120px" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.or_act_day }}</span>
        </template>
      </el-table-column>
      <el-table-column :formatter="ispmsOptions" label="PMS入住成功" prop="or_ispmsin" align="center" min-width="120"/>
      <el-table-column :formatter="statusTypeOptions" label="订单状态" prop="or_status" align="center" min-width="120"/>
      <el-table-column :formatter="ispayOption" label="是否支付" align="center" min-width="180"/>
      <el-table-column label="入住时间" class-name="status-col" align="center" min-width="180" prop="or_act_arr_time" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.or_act_arr_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预离时间" class-name="status-col" align="center" min-width="180" prop="or_est_dep_time" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.or_est_dep_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退房时间" class-name="status-col" align="center" min-width="180" prop="or_act_dep_time" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.or_act_dep_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showOrderDetails(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :limit.sync="listQuery.length" @pagination="getList" />
    <!--订单详情组件-->
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
          hi_name: undefined,
          or_mode: undefined,
          or_ispay: undefined,
          or_source: undefined,
          or_checkin_id: undefined,
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
          or_act_dep_time: undefined,
          or_ispmsin: undefined
        }
      },
      dicParams: 'code_checkinmode,code_if,code_checkinstatus',
      dicParamsData: [],
      orstatusParamsData: [],
      checkinWayData: [],
      ispayData: []
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
        this.orstatusParamsData = this.dicParamsData.code_checkinstatus
        this.checkinWayData = this.dicParamsData.code_checkinmode
        this.ispayData = this.dicParamsData.code_if
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
    // 入住方式数据显示
    checkinWay(row, column) {
      for (let i = 0; i < this.checkinWayData.length; i++) {
        if (this.checkinWayData[i].code === row.or_mode) {
          return this.checkinWayData[i].name
        }
      }
    },
    // PMS入住是否成功标识
    ispmsOptions(row, column) {
      for (let i = 0; i < this.ispayData.length; i++) {
        if (this.ispayData[i].code === row.or_ispmsin) {
          return this.ispayData[i].name
        }
      }
    },
    // 是否支付数据显示
    ispayOption(row, column) {
      for (let i = 0; i < this.ispayData.length; i++) {
        if (this.ispayData[i].code === row.or_ispay) {
          return this.ispayData[i].name
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
    },
    // 截取数据换行显示
    cutoutData(cellValue) {
      return cellValue.replace(/\,/g, '</br>')
    }
  }
}
</script>
