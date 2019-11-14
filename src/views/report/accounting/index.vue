<template>
  <div class="app-container">
    <div class="filter-container">
      <!--
      <el-input v-model="listQuery.params.or_source" placeholder="渠道" style="width: 150px;" class="filter-item"/>
      <el-input v-model="listQuery.params.ro_type_name" placeholder="房型" style="width: 150px;" class="filter-item"/>
      <el-select v-model="listQuery.params.bill_type" placeholder="账务类型" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in accountsTypeData" :key="item.code" :label="item.name" :value="item.code"/>
      </el-select>
      <el-select v-model="listQuery.params.bill_pid" placeholder="入账条目" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in billNameParamsData" :key="item.code" :label="item.name" :value="item.code"/>
      </el-select>
      <el-input v-model="listQuery.params.pay_shift_no" placeholder="原始凭证编号" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      --><el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="入账开始时间"
        end-placeholder="入账结束时间"
        class="filter-item"
        style="width: auto"
        value-format="yyyy-MM-dd"
        @change="formatTimeRange"/>
      <el-input v-model="listQuery.params.or_id" placeholder="预订单" style="width: 150px;" class="filter-item"/>
      <el-input v-model="listQuery.params.or_checkin_id" placeholder="入住单号" style="width: 150px;" class="filter-item"/>
      <el-input v-model="listQuery.params.ro_id" placeholder="房间号" style="width: 150px;" class="filter-item"/>
      <el-input v-model="listQuery.params.or_ci_name" placeholder="姓名" style="width: 150px;" class="filter-item"/>
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
        <!--<input id="bill_type1" type="hidden" name="bill_type">-->
        <!--<input id="bill_name1" type="hidden" name="bill_name">-->
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
        <br><br>
        <span style="margin-right: 30px;font-size: 21px">总计条数:</span><span style="margin-right: 80px;font-size: 21px">{{ total }}</span>
        <span style="margin-right: 30px;font-size: 21px">消费金额:</span><span style="margin-right: 80px;font-size: 21px">{{ tatalall_price }}</span>
        <span style="margin-right: 30px;font-size: 21px">结算金额:</span><span style="margin-right: 80px;font-size: 21px">{{ totalall_pay_money }}</span>
      </div>
    </div>
    <!--表格数据显示-->
    <div id="printTest">
      <el-table
        v-loading="listLoading"
        :data="list"
        stripe
        border
        fit
        highlight-current-row
        style="width: 100%;">
        <el-table-column label="预定单号" prop="or_id" align="center" min-width="150" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.or_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入住单号" prop="or_checkin_id" align="center" min-width="210" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.or_checkin_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.or_mode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="渠道" align="center" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.or_source }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房间号" prop="ro_id" align="center" min-width="100" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.ro_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房型" prop="id" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.ro_type_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="id" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.or_ci_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账务类型" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入账条目" prop="id" align="center" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_pname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="消费金额" align="center" prop="bill_all_con_money" min-width="110" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.bill_all_con_money }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算金额" align="center" prop="bill_pay_money" min-width="110" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.bill_pay_money }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易编号" class-name="status-col" align="center" min-width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.pay_bill_no }}</span>
          </template>
        </el-table-column>
        <el-table-column label="原始凭证编号" align="center" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.pay_shift_no }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" min-width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_comments }}</span>
          </template>
        </el-table-column>
        <el-table-column label="营业日期" class-name="status-col" align="center" prop="bill_pdate" min-width="160" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.bill_pdate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入账时间" class-name="status-col" align="center" prop="bill_ptime" min-width="160" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.bill_ptime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :limit.sync="listQuery.length" @pagination="getList" />
  </div>
</template>

<script>
import { getBillDetails } from '@/api/report'
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
      bill_name: undefined,
      bill_type: undefined,
      bill_name1: undefined,
      bill_type1: undefined,
      billNameParamsData: [],
      payParamsData: [],
      accountsTypeData: [],
      dicParams: 'code_accountscategory,code_payment,code_accountstype',
      listQuery: {
        start: 0,
        length: 10,
        params: {
          or_id: undefined,
          or_ci_name: undefined,
          ro_id: undefined,
          or_checkin_id: undefined
        }
      },
      enableOptions: [
        { label: '现金支付', key: 'CHH_CASH' },
        { label: '支付宝支付', key: 'CHH_ALIPAY' },
        { label: '微信支付', key: 'CHH_WECHATPAY' },
        { label: '银行卡支付', key: 'CHH_YHK' }
      ],
      billTypeOpting: [
        { label: '消费账', key: '0' },
        { label: '结算账', key: '1' }
      ],
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
      queryBillData: []
    }
  },
  created() {
    this.getDic()
    // this.getList()
  },
  methods: {
    // 获取订单列表
    getList() {
      if (this.listQuery.params.bill_ptime) {
        getBillDetails(this.listQuery).then(response => {
          this.list = response.data
          this.total = response.recordsTotal
          this.tatlebill_prepay = response.tatlebill_prepay
          this.tatalall_price = response.attachData.bill_con_money
          this.totalrefundable_amount = response.totalrefundable_amount
          this.totalall_pay_money = response.attachData.bill_pay_money
          this.listLoading = false
        })
      } else {
        this.$message.error('入账时间不能为空！')
      }
    },
    exportData(command) {
      if (this.listQuery.params.bill_ptime) {
        if (this.list.length === 0) {
          this.$message.error('导出数据为空')
        } else {
          if (command === '2') {
            this.listQuery.params.all = '1'
          }
          if (command === '1') {
            delete this.listQuery.params.all
          }
          const url = process.env.BASE_API + 'report/exportBillDetails'
          document.getElementById('myform').setAttribute('action', url)// url提交的路径
          document.getElementById('length').value = this.listQuery.length // url提交的路径
          document.getElementById('startPage').value = this.listQuery.start // url提交的路径
          document.getElementById('params').value = JSON.stringify(this.listQuery.params)
          document.getElementById('myform').submit()
        }
      } else {
        this.$message.error('入账时间不能为空！')
      }
    },
    exportPDFData(command) {
      if (command === '2') {
        const url = 'http://localhost:8081/export/excelAccounting2pdf'
        document.getElementById('myform1').setAttribute('action', url)// url提交的路径
        document.getElementById('length1').value = 10000
        document.getElementById('startPage1').value = 0
        document.getElementById('draw1').value = 1
        document.getElementById('payWay1').value = this.listQuery.params.payWay
        document.getElementById('bill_name1').value = this.listQuery.params.bill_name1
        document.getElementById('bill_type1').value = this.listQuery.params.bill_type1
        document.getElementById('createtime1').value = this.listQuery.params.createtime
        document.getElementById('myform1').submit()
      }
      if (command === '1') {
        const url = 'http://localhost:8081/export/excelAccounting2pdf'
        document.getElementById('myform1').setAttribute('action', url)// url提交的路径
        document.getElementById('length1').value = this.listQuery.length // url提交的路径
        document.getElementById('startPage1').value = this.listQuery.start // url提交的路径
        document.getElementById('draw1').value = 2 // url提交的路径
        document.getElementById('payWay1').value = this.listQuery.params.payWay
        document.getElementById('bill_name1').value = this.listQuery.params.bill_name1
        document.getElementById('bill_type1').value = this.listQuery.params.bill_type1
        document.getElementById('createtime1').value = this.listQuery.params.createtime
        document.getElementById('myform1').submit()
      }
    },
    // 获取字典表所有数据
    getDic() {
      getDicMore(this.dicParams).then(response => {
        this.dicParamsData = response.data
        this.billNameParamsData = this.dicParamsData.code_accountscategory
        this.payParamsData = this.dicParamsData.code_payment
        this.accountsTypeData = this.dicParamsData.code_accountstype
      })
    },
    formatTimeRange(filterVal) {
      if (filterVal) {
        this.listQuery.params.bill_ptime = JSON.stringify(filterVal)
          .replace(/\[|\]|\"/g, '')
          .replace(',', ' - ')
      } else {
        this.listQuery.params.bill_ptime = undefined
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
