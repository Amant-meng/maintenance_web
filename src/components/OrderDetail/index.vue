<template>
  <el-dialog
    v-loading="listLoading"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :visible.sync="orderDialogFormVisible"
    title="详情信息"
    width="1100px">
    <el-row>
      <el-tabs>
        <el-tab-pane label="基本信息">
          <el-row :gutter="20" class="table-no-line">
            <el-col :span="8">
              <el-table :show-header="false" :data="tableData">
                <el-table-column prop="dataName" min-width="100"/>
                <el-table-column :formatter="priceShow" prop="dataValue" min-width="200"/>
              </el-table>
            </el-col>
            <el-col :span="8">
              <el-table :show-header="false" :data="tableData2">
                <el-table-column prop="dataName" min-width="100"/>
                <el-table-column :formatter="priceDataShow" prop="dataValue" min-width="150"/>
              </el-table>
            </el-col>
            <el-col :span="8">
              <el-table :show-header="false" :data="tableData3">
                <el-table-column prop="dataName" min-width="100"/>
                <el-table-column :formatter="getOrderStatus" prop="dataValue" min-width="150"/>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="同住人">
          <el-row class="table-no-line">
            <el-col :span="24">
              <el-table :data="housemateList">
                <el-table-column label="姓名" prop="ci_name" min-width="100"/>
                <el-table-column label="性别" prop="ci_sex" min-width="100"/>
                <el-table-column label="民族" prop="ci_race" min-width="100"/>
                <el-table-column label="身份证号" min-width="100">
                  <template slot-scope="scope">
                    <span>{{ "*************" }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="联系电话" prop="ci_tel" min-width="100"/>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <el-tabs>
      <el-tab-pane label="账务信息">
        <el-row class="table-no-line">
          <el-col :span="24">
            <el-table :data="billDetailList" height="200">
              <el-table-column label="账务条目" min-width="100" >
                <template slot-scope="scope">
                  <span>{{ scope.row.bill_pname }}</span>
                </template>
              </el-table-column>
              <el-table-column :formatter="accountType" label="账务类型" min-width="100" prop="bill_type"/>
              <el-table-column label="消费" min-width="100">
                <template slot-scope="scope">
                  <!--<span>{{ scope.row.billType == '0' ? scope.row.money : '' }}</span>-->
                  <span>{{ scope.row.bill_con_money }}</span>
                </template>
              </el-table-column>
              <el-table-column label="付款" min-width="100">
                <template slot-scope="scope">
                  <!--<span>{{ scope.row.billType == '1' ? scope.row.money : '' }}</span>-->
                  <span>{{ scope.row.bill_pay_money }}</span>
                </template>
              </el-table-column>
              <el-table-column label="营业日" min-width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.bill_ptime | parseTime('{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="备注" min-width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.bill_comments }}</span>
                </template>
              </el-table-column>
              <el-table-column label="记账时间" min-width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.bill_ptime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="操作人" min-width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.c_user_name }}</span>
                </template>
              </el-table-column>-->
            </el-table>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="消费品">
        <el-row class="table-no-line">
          <el-col :span="24">
            <el-table :data="consumerGoodsList">
              <el-table-column label="消费品名称" prop="con_name" min-width="100"/>
              <el-table-column label="价格(元)" min-width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.con_price | priceRound }}</span>
                </template>
              </el-table-column>
              <el-table-column label="数量" prop="con_count" min-width="100"/>
              <el-table-column label="总价(元)" min-width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.con_price * scope.row.con_count | priceRound }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="支付信息">
        <el-row class="table-no-line">
          <el-col :span="24">
            <el-table :data="tradingDetailList">
              <el-table-column label="交易流水号" prop="pay_mistrace_no" min-width="100"/>
              <el-table-column label="参考号" prop="pay_refer_no" min-width="100"/>
              <el-table-column label="交易卡号" prop="pay_trans_card_num" min-width="100"/>
              <el-table-column :formatter="payType" label="交易类别" prop="pay_trans_typebs" min-width="80"/>
              <el-table-column :formatter="paytypeOptions" label="支付方式" prop="pay_paytype" min-width="80"/>
              <el-table-column label="交易金额" min-width="80">
                <template slot-scope="scope">
                  <span>{{ scope.row.pay_trans_amount | priceRound }}</span>
                </template>
              </el-table-column>
              <el-table-column label="交易时间" prop="pay_trans_datetime" min-width="140"/>
            </el-table>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-tabs>
      <el-tab-pane label="订单操作记录"/>
    </el-tabs>
    <el-row class="table-no-line">
      <el-col :span="24">
        <el-table :data="operateLogList" height="200">
          <el-table-column label="时间" prop="log_op_date" min-width="100"/>
          <el-table-column label="操作员" prop="log_op_name" min-width="60"/>
          <el-table-column label="行为" prop="log_op_behavior" min-width="60"/>
          <el-table-column label="详细" min-width="200">
            <template slot-scope="scope">
              <span v-html="cutout(scope.row.log_op_detail)"/>
            </template>
          </el-table-column>
          <el-table-column label="IP" prop="log_op_ip" min-width="100"/>
          <el-table-column label="结果" prop="log_op_result" min-width="60"/>
        </el-table>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getOrderDetailsInfo } from '@/api/checkout'
import { getDicMore } from '@/api/dic'

export default {
  name: 'OrderDetail',
  // 过滤
  filters: {
    // 价格过滤方法
    priceRound(value) {
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
  props: {
    orderDialogFormVisible: {
      type: Boolean,
      required: true,
      default: false
    },
    pkwid: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      total: 0,
      listQuery: {
        start: 0,
        length: 5,
        params: {

        }
      },
      listLoading: true,
      tableData: [{
        dataName: '入住单号',
        dataValue: ''
      }, {
        dataName: '房号',
        dataValue: ''
      }, {
        dataName: '房型',
        dataValue: ''
      }, {
        dataName: '房价(元)',
        dataValue: ''
      }, {
        dataName: '预付金额(元)',
        dataValue: ''
      }],
      tableData2: [{
        dataName: '入住人',
        dataValue: ''
      }, {
        dataName: '人住天数',
        dataValue: ''
      }, {
        dataName: '联系电话',
        dataValue: ''
      }, {
        dataName: '订单来源',
        dataValue: ''
      }, {
        dataName: '押金(元)',
        dataValue: ''
      }],
      tableData3: [{
        dataName: '订单状态',
        dataValue: ''
      }, {
        dataName: 'PMS入住成功',
        dataValue: ''
      }, {
        dataName: '入住时间',
        dataValue: ''
      }, {
        dataName: '预离时间',
        dataValue: ''
      }, {
        dataName: '退房时间',
        dataValue: ''
      }],
      getbillDetails: {
        pk_ci_id: '',
        pms_type_id: '',
        hi_id: '',
        ro_id: '',
        or_checkin_id: ''
      },
      operateLogList: [],
      orderList: [],
      housemateList: [],
      consumerGoodsList: [],
      billDetailList: [],
      tradingDetailList: [],
      PMSbilldetail: [],
      totalPrice: '',
      balance: {},
      dictParam: 'code_checkinstatus,code_payment,code_trantypebs,code_accountstype,code_if',
      dictParamsData: [],
      statusData: [],
      tradingData: [],
      accountsData: [],
      paytypeData: [],
      ispmsData: []
    }
  },
  computed: {},
  // 监听数据
  watch: {
    // datas发生改变的时候去调用初始化方法
    orderDialogFormVisible(value) {
      if (value === true) {
        this.getList()
        this.getDic()
      }
    }
  },
  created() {
  },
  methods: {
    // 截取数据
    cutout(cellValue) {
      return cellValue.replace(/\,/g, '</br>')
    },
    // 获取字典表所有数据
    getDic() {
      getDicMore(this.dictParam).then(response => {
        this.dictParamsData = response.data
        // 订单状态字典数据
        this.statusData = this.dictParamsData.code_checkinstatus
        // 支付方式字典表数据
        this.paytypeData = this.dictParamsData.code_payment
        // 交易类别字典表数据
        this.tradingData = this.dictParamsData.code_trantypebs
        // 账务类型数据
        this.accountsData = this.dictParamsData.code_accountstype
        // PMS入住是否成功
        this.ispmsData = this.dictParamsData.code_if
      })
    },
    // 交易类别数据字典翻译数据显示
    payType(row, column) {
      for (let i = 0; i < this.tradingData.length; i++) {
        if (this.tradingData[i].code === row.pay_trans_typebs) {
          return this.tradingData[i].name
        }
      }
    },
    // 账务类型数据字典翻译数据显示
    accountType(row, column) {
      for (let i = 0; i < this.accountsData.length; i++) {
        if (this.accountsData[i].code === row.bill_type) {
          return this.accountsData[i].name
        }
      }
    },
    // 支付方式数据显示
    paytypeOptions(row, column) {
      for (let i = 0; i < this.paytypeData.length; i++) {
        if (this.paytypeData[i].code === row.pay_paytype) {
          return this.paytypeData[i].name
        }
      }
    },
    // 获取订单状态
    getOrderStatus(row, column, cellValue, index) {
      if (cellValue === '' || cellValue === undefined || cellValue === null) {
        return
      }
      // 订单状态显示
      if (index === 0) {
        for (let i = 0; i < this.statusData.length; i++) {
          if (this.statusData[i].code === cellValue) {
            cellValue = this.statusData[i].name
            return cellValue
          }
        }
      } else if (index === 1) {
        // PMS入住是否成功显示
        for (let i = 0; i < this.ispmsData.length; i++) {
          if (this.ispmsData[i].code === cellValue) {
            return this.ispmsData[i].name
          }
        }
      } else {
        return cellValue
      }
    },
    // 价格显示补零
    priceShow(row, column, cellValue, index) {
      if (cellValue === '' || cellValue === undefined || cellValue === null) {
        return
      }
      switch (index) {
        case 3:
          return cellValue.toFixed(2)
        case 4:
          return cellValue.toFixed(2)
        default:
          return cellValue
      }
    },
    // 价格显示补零
    priceDataShow(row, column, cellValue, index) {
      if (cellValue === '' || cellValue === undefined || cellValue === null) {
        return
      }
      switch (index) {
        case 4:
          return cellValue.toFixed(2)
        default:
          return cellValue
      }
    },
    getList() {
      // 订单详情

      getOrderDetailsInfo(this.pkwid).then(response => {
        this.consumerGoodsList = response.data.consumerGoods
        this.housemateList = response.data.housemateInfo
        this.tradingDetailList = response.data.paymentInfo
        this.billDetailList = response.data.billDetailInfo
        this.orderList = response.data.basicInfo
        this.operateLogList = response.data.operateLogInfo
        this.tableData[0].dataValue = this.orderList.or_checkin_id
        this.tableData[1].dataValue = this.orderList.ro_id
        this.tableData[2].dataValue = this.orderList.ro_type_name
        this.tableData[3].dataValue = this.orderList.ro_price
        this.tableData[4].dataValue = this.orderList.bill_prepay

        this.tableData2[0].dataValue = this.orderList.or_ci_name
        this.tableData2[1].dataValue = this.orderList.or_act_day
        this.tableData2[2].dataValue = this.orderList.or_ci_tel
        this.tableData2[3].dataValue = this.orderList.or_source
        this.tableData2[4].dataValue = this.orderList.bill_deposit

        this.tableData3[0].dataValue = this.orderList.or_status
        this.tableData3[1].dataValue = this.orderList.or_ispmsin
        this.tableData3[2].dataValue = this.orderList.or_act_arr_time
        this.tableData3[3].dataValue = this.orderList.or_est_dep_time
        this.tableData3[4].dataValue = this.orderList.or_act_dep_time
        this.getbillDetails.pk_ci_id = this.orderList.pk_ci_id
        this.getbillDetails.pms_type_id = this.orderList.pms_type_id
        this.getbillDetails.hi_id = this.orderList.hi_id
        this.getbillDetails.ro_id = this.orderList.ro_id
        this.getbillDetails.or_checkin_id = this.orderList.or_checkin_id
        this.listLoading = false
      })
      /* getRegistrationOrderById(this.pkwid).then(response => {
        this.orderList = response.data.basicInfo
        this.tableData[0].dataValue = this.orderList.or_checkin_id
        this.tableData[1].dataValue = this.orderList.ro_id
        this.tableData[2].dataValue = this.orderList.ro_type_name
        this.tableData[3].dataValue = this.orderList.ro_price
        this.tableData[4].dataValue = this.orderList.bill_prepay

        this.tableData2[0].dataValue = this.orderList.or_ci_name
        this.tableData2[1].dataValue = this.orderList.or_act_day
        this.tableData2[2].dataValue = this.orderList.or_ci_tel
        this.tableData2[3].dataValue = this.orderList.or_source
        this.tableData2[4].dataValue = this.orderList.bill_deposit

        this.tableData3[0].dataValue = this.orderList.or_status
        this.tableData3[1].dataValue = this.orderList.or_ispmsin
        this.tableData3[2].dataValue = this.orderList.or_act_arr_time
        this.tableData3[3].dataValue = this.orderList.or_est_dep_time
        this.tableData3[4].dataValue = this.orderList.or_act_dep_time
        this.getbillDetails.pk_ci_id = this.orderList.pk_ci_id
        this.getbillDetails.pms_type_id = this.orderList.pms_type_id
        this.getbillDetails.hi_id = this.orderList.hi_id
        this.getbillDetails.ro_id = this.orderList.ro_id
        this.getbillDetails.or_checkin_id = this.orderList.or_checkin_id
        this.listLoading = false

        /!* // 根据入住单主键查询订单操作日志
        getOperateLogById(this.pkwid).then(response => {
          this.operateLogList = response.data

        })
        // 根据入住单主键查询消费品明细
        getConsumerGoodsDetailById(this.pkwid).then(response => {
          this.consumerGoodsList = response.data
        })
        // 根据入住单主键查询同住人信息
        getHousemateList(this.pkwid).then(response => {
          this.housemateList = response.data
        })
        // 根据入住单主键查询交易明细信息
        getTradingDetail(this.pkwid).then(response => {
          this.tradingDetailList = response.data
        })*!/
        /!* if (this.orderList.or_status === 'I') {
        // 如果订单是入住状态从pms获取账务信息
          getBalance(this.getbillDetails).then(response => {
            this.balance = response.data
            this.PMSbilldetail = response.data.billInfo
            this.billDetailList = JSON.parse(this.PMSbilldetail)
          })
        } *!/
        // 根据入住单主键查询账单明细
        /!* getbillDetailById(this.pkwid).then(response => {
          this.billDetailList = response.data
        })*!/
      })*/
    },
    // 关闭窗口
    handleClose() {
      this.$emit('update:orderDialogFormVisible', false)
    }
  }
}
</script>

<style scoped>
  .detail-el-row{
    font-size: 18px;
    border-bottom: solid 1px
  }
</style>
