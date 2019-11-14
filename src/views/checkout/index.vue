<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.params.or_source" placeholder="来源" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.params.or_mode" placeholder="入住方式" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in checkinWayData" :key="item.code" :label="item.name" :value="item.code"/>
      </el-select>
      <el-input v-model="listQuery.params.ro_type_name" placeholder="房型" clearable style="width: 150px;" class="filter-item" @keyup.native="provingRoomType"/>
      <el-input v-model="listQuery.params.ro_id" placeholder="房号" clearable style="width: 150px;" class="filter-item" @keyup.native="provingRoom"/>
      <el-input v-model="listQuery.params.or_ci_name" placeholder="姓名" clearable style="width: 150px;" class="filter-item" @keyup.native="provingName"/>
      <el-input v-model="listQuery.params.or_ci_tel" placeholder="电话" clearable style="width: 150px;" class="filter-item" @keyup.native="provingPhone"/>
      <el-input v-model="listQuery.params.ro_price" placeholder="房价(元)" clearable style="width: 150px;" class="filter-item" @keyup.native="provingRoomPrice"/>
      <el-input v-model="listQuery.params.bill_prepay" placeholder="预付金额(元)" clearable style="width: 150px;" class="filter-item" @keyup.native="provingPrepay"/>
      <el-input v-model="listQuery.params.bill_deposit" placeholder="押金(元)" clearable style="width: 150px;" class="filter-item" @keyup.native="provingDeposit"/>
      <el-input v-model="listQuery.params.or_act_day" placeholder="入住天数" clearable style="width: 150px;" class="filter-item" @keyup.native="changeCode"/>
      <el-select v-model="listQuery.params.or_ispay" placeholder="是否支付" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in ispayData" :key="item.code" :label="item.name" :value="item.code"/>
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
        v-if="checkoutShow"
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
    <el-tabs v-model="activeName" type="card" @tab-click="statusChange">
      <el-tab-pane label="在住状态" name="In"/>
      <el-tab-pane label="已退未结" name="refund"/>
      <el-tab-pane label="已退已结" name="Out"/>
    </el-tabs>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column key="1" label="订单来源" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.or_source }}</span>
        </template>
      </el-table-column>
      <el-table-column key="2" :formatter="checkinWay" label="入住方式" prop="or_mode" align="center" min-width="150"/>
      <el-table-column key="3" label="房型" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.ro_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column key="4" label="房号" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.ro_id }}</span>
        </template>
      </el-table-column>
      <el-table-column key="5" label="姓名" align="center" min-width="150">
        <template slot-scope="scope">
          <span v-html="cutoutData(scope.row.or_ci_name)"/>
        </template>
      </el-table-column>
      <el-table-column key="6" label="电话" min-width="150px" align="center">
        <template slot-scope="scope">
          <span v-html="cutoutData(scope.row.or_ci_tel)"/>
        </template>
      </el-table-column>
      <el-table-column key="7" label="房价(元)" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ro_price | roundingPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column key="8" label="预付金额(元)" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.bill_prepay | roundingPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column key="9" label="押金(元)" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.bill_deposit | roundingPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkoutShow" key="10" label="入住天数" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.or_act_day }}</span>
        </template>
      </el-table-column>
      <el-table-column key="11" :formatter="ispayOption" label="是否支付" align="center" min-width="180"/>
      <el-table-column key="12" label="入住时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.or_act_arr_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column key="13" label="预离时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.or_est_dep_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkoutShow" key="14" label="退房时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.or_act_dep_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column key="15" label="操作" align="center" width="180" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="checkShow" type="primary" size="mini" @click="getBillDetail(scope.row)">退房</el-button>
          <el-button v-if="retryShow" type="primary" size="mini" @click="retry(scope.row)">退款重试</el-button>
          <el-button type="primary" size="mini" @click="getOrderDetails(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页组件-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :limit.sync="listQuery.length" @pagination="getList" />
    <!--结账退房组件-->
    <CheckOut ref="CheckOut" :bill-dialog-form-visible.sync="billDialogFormVisible" :datas="datas" :order="order"/>
    <!--订单详情组件-->
    <OrderDetail ref="OrderDetail" :order-dialog-form-visible.sync="orderDialogFormVisible" :pkwid="pkwid"/>
  </div>
</template>

<script>
import { getCheckOutList, retryRefund } from '@/api/checkout'
import waves from '@/directive/waves' // Waves directive
import { getDicMore } from '@/api/dic'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import CheckOut from '@/components/CheckOut'
import OrderDetail from '@/components/OrderDetail'

export default {
  name: 'RegistrationOrder',
  components: { Pagination, CheckOut, OrderDetail },
  directives: { waves },
  filters: {
    roundingPrice(value) {
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
      order: {},
      listLoading: true,
      dateRange: undefined,
      checkoutdateRange: undefined,
      pkwid: '',
      listQuery: {
        start: 0,
        length: 10,
        params: {
          or_mode: undefined,
          or_ispay: undefined,
          or_source: undefined,
          ro_id: undefined,
          or_ci_tel: undefined,
          ro_price: undefined,
          or_ci_name: undefined,
          or_act_day: undefined,
          bill_deposit: undefined,
          bill_prepay: undefined,
          or_status: 'I',
          or_act_arr_time: undefined,
          or_act_dep_time: undefined
        }
      },
      orderDialogFormVisible: false,
      checkoutShow: false,
      retryShow: false,
      checkShow: true,
      activeName: 'In',
      billDialogFormVisible: false,
      dialogStatus: '',
      dictParams: 'code_checkinmode,code_if',
      dictParamData: [],
      checkinWayData: [],
      ispayData: [],
      tabVariable: {
        name: 'In'
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
    this.getDic()
  },
  methods: {
    // 选项卡切换调用方法
    statusChange(tab) {
      this.tabVariable = tab
      if (tab.name === 'In') {
        this.checkoutShow = false
        this.retryShow = false
        this.checkShow = true
        this.listQuery.params = { or_status: 'I' }
      }
      if (tab.name === 'Out') {
        this.checkoutShow = true
        this.retryShow = false
        this.checkShow = false
        this.listQuery.params = { or_status: 'O' }
      }
      if (tab.name === 'refund') {
        this.checkoutShow = true
        this.retryShow = true
        this.checkShow = false
        this.listQuery.params = { or_status: 'S' }
      }
      this.getList()
    },
    // 获取字典表所有数据
    getDic() {
      getDicMore(this.dictParams).then(response => {
        this.dictParamData = response.data
        this.checkinWayData = this.dictParamData.code_checkinmode
        this.ispayData = this.dictParamData.code_if
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
    // 是否支付数据显示
    ispayOption(row, column) {
      for (let i = 0; i < this.ispayData.length; i++) {
        if (this.ispayData[i].code === row.or_ispay) {
          return this.ispayData[i].name
        }
      }
    },
    // 获取订单列表
    getList() {
      this.listLoading = true
      getCheckOutList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.recordsTotal
        this.listLoading = false
      })
    },
    // 点击退房按钮
    getBillDetail(row) {
      this.billDialogFormVisible = true
      if (row) {
        this.order = row
        this.datas.hi_id = row.hi_id
        this.datas.or_checkin_id = row.or_checkin_id
        this.datas.or_act_arr_time = row.or_act_arr_time
        this.datas.or_est_dep_time = row.or_est_dep_time
        this.datas.ro_price = row.ro_price
        this.datas.bill_prepay = row.bill_prepay
      }
    },
    // 订单详情方法
    getOrderDetails(row) {
      this.pkwid = row.pk_ci_id
      this.orderDialogFormVisible = true
    },
    // 退款重试
    retry(row) {
      this.$confirm('是否重试退款操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        retryRefund(row).then(response => {
          this.listLoading = true
          this.$message({
            type: 'success',
            message: '退款成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
      this.handleRefresh()
    },
    // 刷新操作
    handleRefresh() {
      this.listQuery.params = {}
      this.statusChange(this.tabVariable)
      this.dateRange = ''
      this.checkoutdateRange = ''
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 输入天数验证
    changeCode() {
      this.listQuery.params.or_act_day = this.listQuery.params.or_act_day.replace(/[^\d]/g, '')
      this.listQuery.params.or_act_day = this.listQuery.params.or_act_day.replace('.', '')
    },
    // 验证房间号
    provingRoom() {
      this.listQuery.params.ro_id = this.listQuery.params.ro_id.replace(/[^\w\.\/]/ig, '')
      this.listQuery.params.ro_id = this.listQuery.params.ro_id.replace('.', '')
    },
    // 验证输入房型只能输入中文
    provingRoomType() {
      this.listQuery.params.ro_type_name = this.listQuery.params.ro_type_name.replace(/[^\u4e00-\u9fa5]/g, '')
      this.listQuery.params.ro_type_name = this.listQuery.params.ro_type_name.replace('.', '')
    },
    // 验证姓名
    provingName() {
      this.listQuery.params.or_ci_name = this.listQuery.params.or_ci_name.replace(/^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/, '')
      this.listQuery.params.or_ci_name = this.listQuery.params.or_ci_name.replace('.', '')
    },
    // 手机号验证
    provingPhone() {
      this.listQuery.params.or_ci_tel = this.listQuery.params.or_ci_tel.replace(/[^\.\d]/g, '')
      this.listQuery.params.or_ci_tel = this.listQuery.params.or_ci_tel.replace('.', '')
    },
    // 房价验证
    provingRoomPrice() {
      this.listQuery.params.ro_price = this.listQuery.params.ro_price.replace(/[^\.\d]/g, '')
      this.listQuery.params.ro_price = this.listQuery.params.ro_price.replace('.', '')
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
