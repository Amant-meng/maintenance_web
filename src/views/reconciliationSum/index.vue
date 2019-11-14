<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="入住开始时间"
        end-placeholder="入住结束时间"
        class="filter-item"
        style="width: auto"
        value-format="yyyy-MM-dd"
        @change="formatTimeRange"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <div class="filter-container">
        <form id="myform" name="myform" method="post" action="" class="form-class">
          <input id="length" type="hidden" name="length">
          <input id="startPage" type="hidden" name="start">
          <input id="params" type="hidden" name="params">
          <el-dropdown type="primary" @command="exportData">
            <el-button type="primary">
              EXCEL导出<i class="el-icon-arrow-down el-icon--right"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">导出当前页</el-dropdown-item>
              <el-dropdown-item command="2">导出全部数据</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </form>
        <!--<form id="myform1" name="myform1" method="post" action="" class="form-class">-->
        <!--<input id="length1" type="hidden" name="length">-->
        <!--<input id="startPage1" type="hidden" name="start">-->
        <!--<input id="draw1" type="hidden" name="draw">-->
        <!--<input id="payWay1" type="hidden" name="payWay">-->
        <!--<input id="createtime1" type="hidden" name="createtime">-->
        <!--<el-dropdown type="primary" @command="exportPDFData">-->
        <!--<el-button type="primary">-->
        <!--PDF导出<i class="el-icon-arrow-down el-icon&#45;&#45;right"/>-->
        <!--</el-button>-->
        <!--<el-dropdown-menu slot="dropdown">-->
        <!--<el-dropdown-item command="1">导出当前页</el-dropdown-item>-->
        <!--<el-dropdown-item command="2">导出全部数据</el-dropdown-item>-->
        <!--</el-dropdown-menu>-->
        <!--</el-dropdown>-->
        <!--</form>-->
        <!--<el-button v-waves v-print="'#printTest'" class="filter-item" type="primary" icon="el-icon-download">打印</el-button>-->
        <br><br>
        <span style="margin-right: 30px;font-size: 21px">总计条数:</span><span style="margin-right: 80px;font-size: 21px">{{ total }}</span>
        <span style="margin-right: 30px;font-size: 21px">预支付金额:</span><span style="margin-right: 80px;font-size: 21px">{{ tatlebill_prepay }}</span>
        <span style="margin-right: 30px;font-size: 21px">消费金额:</span><span style="margin-right: 80px;font-size: 21px">{{ tatalall_price }}</span>
        <span style="margin-right: 30px;font-size: 21px">退款金额:</span><span style="margin-right: 80px;font-size: 21px">{{ totalrefundable_amount }}</span>
      </div>
    </div>
    <!--表格数据显示-->
    <div id="printTest" class="no-print">
      <el-table
        v-loading="listLoading"
        :data="list"
        stripe
        border
        fit
        highlight-current-row
        style="width: 100%;">
        <el-table-column label="序号" align="center" min-width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.xu_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预订单号" align="center" min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.or_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入住单号" min-width="210px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.or_checkin_id }}</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="渠道" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.or_source }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="类型" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.or_mode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.or_status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房间号" align="center" min-width="120" prop="ro_id" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.ro_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房型" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.ro_type_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" min-width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.or_ci_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入住时间" align="center" min-width="180" prop="or_act_arr_time" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.or_act_arr_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退房时间" align="center" min-width="180" prop="or_act_dep_time" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.or_act_dep_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="天数" class-name="status-col" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.or_act_day }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房间单价" class-name="status-col" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.ro_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预付金额" class-name="status-col" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_prepay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付金额" class-name="status-col" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_all_pay_money }}</span>
          </template>
        </el-table-column>
        <el-table-column label="押金" class-name="status-col" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_deposit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房费" class-name="status-col" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_all_ro_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="消费品" class-name="status-col" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_all_con_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="其它" class-name="status-col" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_all_other_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款金额" class-name="status-col" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_refundable_amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="消费金额" class-name="status-col" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_all_con_money }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" class-name="status-col" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.pay_paytype }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付类型" class-name="status-col" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.pay_trans_typebs }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易编号" class-name="status-col" align="center" min-width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.pay_bill_no }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易时间" class-name="status-col" align="center" min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.pay_trans_datetime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :limit.sync="listQuery.length" @pagination="getList" />
  </div>
</template>

<script>
import { getSummarybillDetails } from '@/api/report'
import { getDicMore } from '@/api/dic'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'RegistrationOrder',
  components: { Pagination },
  directives: { waves },
  filters: {

  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      tatlebill_prepay: 0,
      tatalall_price: 0,
      totalrefundable_amount: 0,
      totalall_pay_money: 0,
      datas: {
        hi_id: '',
        or_checkin_id: ''
      },
      listLoading: false,
      dateRange: undefined,
      checkoutdateRange: undefined,
      allcurrent: undefined,
      createtime: undefined,
      payWay: undefined,
      assureParamsData: [],
      enterParamsData: [],
      payParamsData: [],
      payTypeData: [],
      listQuery: {
        start: 0,
        length: 10,
        params: {
          payWay: undefined
        }
      },
      /* enableOptions: [
        { label: '现金支付', key: '1' },
        { label: '支付宝支付', key: '2' },
        { label: '微信支付', key: '3' },
        { label: '银行卡支付', key: '4' }
      ],*/
      allorcurrent: [{ label: '当前页', key: '1' }, { label: '全部', key: '0' }],
      displayData: true,
      refundShow: false,
      checkoutShow: false,
      activeName: 'stayin',
      billDialogFormVisible: false,
      dialogStatus: '',
      tabVariable: '',
      textMap: {
        update: '取消',
        create: '添加'
      },
      queryBillData: [],
      dicParams: 'code_assuretype,code_checkinstatus,code_payment,code_trantypebs'
    }
  },
  created() {
    this.getDic()
    // this.getList()
  },
  methods: {
    // 获取订单列表
    getList() {
      this.listLoading = true
      if (this.listQuery.params.or_act_arr_time) {
        getSummarybillDetails(this.listQuery).then(response => {
          this.list = response.data
          this.total = response.recordsTotal
          this.tatlebill_prepay = response.attachData.bill_prepay
          this.tatalall_price = response.attachData.bill_all_con_money
          this.totalrefundable_amount = response.attachData.bill_refundable_amount
          this.totalall_pay_money = response.attachData.totalall_pay_money
          this.listLoading = false
        })
      } else {
        this.$message.error('入住时间不能为空！')
      }
    },
    exportData(command) {
      if (this.listQuery.params.or_act_arr_time) {
        if (this.list.length === 0) {
          this.$message.error('导出数据为空')
        } else {
          if (command === '2') {
            this.listQuery.params.all = '1'
          }
          if (command === '1') {
            delete this.listQuery.params.all
          }
          const url = process.env.BASE_API + 'report/exportSummaryBillDetails'
          document.getElementById('myform').setAttribute('action', url)// url提交的路径
          document.getElementById('length').value = this.listQuery.length // url提交的路径
          document.getElementById('startPage').value = this.listQuery.start // url提交的路径
          document.getElementById('params').value = JSON.stringify(this.listQuery.params)
          document.getElementById('myform').submit()
        }
      } else {
        this.$message.error('入住时间不能为空！')
      }
    },
    // 获取字典表所有数据
    getDic() {
      getDicMore(this.dicParams).then(response => {
        this.dicParamsData = response.data
        this.assureParamsData = this.dicParamsData.code_assuretype
        this.enterParamsData = this.dicParamsData.code_checkinstatus
        this.payParamsData = this.dicParamsData.code_payment
        this.payTypeData = this.dicParamsData.code_trantypebs
      })
    },
    exportPDFData(command) {
      if (this.listQuery.params.or_act_arr_time) {
        if (command === '2') {
          const url = 'http://localhost:8081/export/excel2pdf'
          document.getElementById('myform1').setAttribute('action', url)// url提交的路径
          document.getElementById('length1').value = 10000
          document.getElementById('startPage1').value = 0
          document.getElementById('draw1').value = 1
          document.getElementById('payWay1').value = this.listQuery.params.payWay
          document.getElementById('createtime1').value = this.listQuery.params.createtime
          document.getElementById('myform1').submit()
        }
        if (command === '1') {
          const url = 'http://localhost:8081/export/excel2pdf'
          document.getElementById('myform1').setAttribute('action', url)// url提交的路径
          document.getElementById('length1').value = this.listQuery.length // url提交的路径
          document.getElementById('startPage1').value = this.listQuery.start // url提交的路径
          document.getElementById('draw1').value = 2 // url提交的路径
          document.getElementById('payWay1').value = this.listQuery.params.payWay
          document.getElementById('createtime1').value = this.listQuery.params.createtime
          document.getElementById('myform1').submit()
        }
      } else {
        alert('营业时间不能为空！')
      }
    },
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
<style scoped>
  .form-class {
    display: inline-block;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
