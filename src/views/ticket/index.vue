<!-- 入住日期 --><!-- 房间号 --><!-- 入住人 --><!-- 查询 -->
<template>
  <div class="app-container">
    <!-- 条件筛选 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.params.ro_id"
        placeholder="房间号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.params.or_ci_name"
        placeholder="入住人"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="入住时间"
        end-placeholder="结束时间"
        class="filter-item"
        style="width: auto"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="formatTimeRange"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button
      >
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-refresh"
        @click="handleRefresh"
      >刷新</el-button
      >
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
      style="width: 100%;"
    >
      <el-table-column label="订单来源" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.or_source }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :formatter="checkinWay"
        label="入住方式"
        prop="or_mode"
        align="center"
        min-width="150"
      />
      <el-table-column label="房型" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.ro_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房号" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.ro_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" min-width="150">
        <template slot-scope="scope">
          <span v-html="cutoutData(scope.row.or_ci_name)" />
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center" min-width="150">
        <template slot-scope="scope">
          <span v-html="cutoutData(scope.row.or_ci_tel)" />
        </template>
      </el-table-column>
      <el-table-column label="房价(元)" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.ro_price | paddingZero }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预付金额(元)" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.bill_prepay | paddingZero }}</span>
        </template>
      </el-table-column>
      <el-table-column label="押金(元)" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.bill_deposit | paddingZero }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入住天数" min-width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.or_act_day }}</span>
        </template>
      </el-table-column>
      <el-table-column
        key="13"
        label="预离时间"
        class-name="status-col"
        align="center"
        min-width="180"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.or_est_dep_time | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkoutShow"
        key="14"
        label="退房时间"
        class-name="status-col"
        align="center"
        min-width="180"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.or_act_dep_time | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        key="15"
        label="操作"
        align="center"
        width="180"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="printTicket(scope.row)"
          >打印小票</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.start"
      :limit.sync="listQuery.length"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getCheckOutList, getPrintTicket } from '@/api/ticketPrint'
import { getDicMore } from '@/api/dic'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'TicketPrint',
  components: { Pagination },
  directives: { waves },
  filters: {
    /* 过滤器 */
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
      printListParams: {
        pk_ci_id: '',
        code: undefined
      },
      code: undefined,
      showOrderDialogFormVisible: false,
      listQuery: {
        start: 0,
        length: 10,
        params: {
          or_mode: undefined,
          or_ispay: undefined,
          or_source: undefined,
          ro_id: undefined /* 房间号  */,
          or_ci_tel: undefined,
          ro_price: undefined,
          or_ci_name: undefined /* 入住人姓名 */,
          or_act_day: undefined,
          bill_deposit: undefined,
          bill_prepay: undefined,
          or_status: 'I',
          or_act_arr_time: undefined,
          or_act_dep_time: undefined
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
    // 验证房间号
    roomNumberProving() {
      this.listQuery.params.ro_id = this.listQuery.params.ro_id.replace(
        /[^\w\.\/]/gi,
        ''
      )
      this.listQuery.params.ro_id = this.listQuery.params.ro_id.replace(
        '.',
        ''
      )
    },
    // 验证输入房型只能输入中文
    roomTypeberProving() {
      this.listQuery.params.ro_type_name = this.listQuery.params.ro_type_name.replace(
        /[^\u4e00-\u9fa5]/g,
        ''
      )
      this.listQuery.params.ro_type_name = this.listQuery.params.ro_type_name.replace(
        '.',
        ''
      )
    },
    // 房价验证
    roomPriceProving() {
      // 如果输入非数字，则替换为''
      this.listQuery.params.ro_price = this.listQuery.params.ro_price.replace(
        /[^\d\.]/g,
        ''
      )
      // 必须保证第一个为数字而不是.
      this.listQuery.params.ro_price = this.listQuery.params.ro_price.replace(
        /^\./g,
        ''
      )
      // 保证只有出现一个.而没有多个.
      this.listQuery.params.ro_price = this.listQuery.params.ro_price.replace(
        /\.{2,}/g,
        '.'
      )
      // 保证.只出现一次，而不能出现两次以上
      this.listQuery.params.ro_price = this.listQuery.params.ro_price
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
      // 只能输入两位小数
      this.listQuery.params.ro_price = this.listQuery.params.ro_price.replace(
        /^(\-)*(\d+)\.(\d\d).*$/,
        '$1$2.$3'
      )
    },
    // 入住天数验证
    dayNumProving() {
      this.listQuery.params.or_act_day = this.listQuery.params.or_act_day.replace(
        /[^\.\d]/g,
        ''
      )
      this.listQuery.params.or_act_day = this.listQuery.params.or_act_day.replace(
        '.',
        ''
      )
    },
    // 押金验证
    provingBillDeposit() {
      this.listQuery.params.bill_deposit = this.listQuery.params.bill_deposit.replace(
        /[^\.\d]/g,
        ''
      )
      this.listQuery.params.bill_deposit = this.listQuery.params.bill_deposit.replace(
        '.',
        ''
      )
    },
    // 预付金额验证
    provingBillPrepay() {
      this.listQuery.params.bill_prepay = this.listQuery.params.bill_prepay.replace(
        /[^\.\d]/g,
        ''
      )
      this.listQuery.params.bill_prepay = this.listQuery.params.bill_prepay.replace(
        '.',
        ''
      )
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
      getCheckOutList(this.listQuery).then(response => {
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
    },
    //  点击打印小票按钮
    printTicket(row) {
      this.printListParams.pk_ci_id = row.pk_ci_id
      this.$prompt('请输入要打印的小票数量', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(10|[1-9])$/,
        inputErrorMessage: '小票数量至少1张最多10张'
      }).then(({ value }) => {
        this.printListParams.code = parseInt(value)
        getPrintTicket(this.printListParams).then(response => {
          this.$alert('打印成功', '提示', {
            confirmButtonText: '确定'
          })
        })
      })
    }
  }
}
</script>

<style></style>
