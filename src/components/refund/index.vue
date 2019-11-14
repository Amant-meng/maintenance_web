<template>
  <div>
    <!--添加操作弹出框-->
    <el-dialog
      :before-close="handleClose"
      :close-on-click-modal="false"
      :visible.sync="billDialogFormVisible"
      title="账务信息"
      width="1000px">
      <el-card shadow="never">
        <el-row :gutter="12">
          <el-col :span="6">
            <div class="bill-item"><span>入离时间</span></div>
            <div class="bill-item"><span>{{ datas.or_act_arr_time | parseTime('{m}/{d} {h}:{i}') }} - {{ datas.or_est_dep_time | parseTime('{m}/{d} {h}:{i}') }}</span></div>
          </el-col>
          <el-col :span="4">
            <div class="bill-item"><span>房价</span></div>
            <div class="bill-item"><span>{{ datas.ro_price | roundingPrice }}元</span></div>
          </el-col>
          <el-col :span="4">
            <div class="bill-item"><span>付款</span></div>
            <div class="bill-item"><span>{{ datas.bill_prepay | roundingPrice }}元</span></div>
          </el-col>
          <el-col :span="4">
            <div class="bill-item"><span>消费</span></div>
            <div class="bill-item"><span>{{ balance.consumerTotal != null ? parseFloat(balance.consumerTotal)+getOrderInfo.ro_price : getOrderInfo.ro_price | roundingPrice }}元</span></div>
          </el-col>
          <el-col :span="4">
            <el-card :body-style="{padding: '0px'}">
              <div class="bill-item bill-balance"><span>余额</span></div>
              <div class="bill-item bill-balance"><span>{{ balance.balance }}元</span></div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
      <div class="filter-container" style="margin-top: 20px">
        <el-button class="filter-item" type="primary" @click="addBill">添加账务</el-button>
        <el-button class="filter-item" type="primary" @click="addBillConsumer">添加消费品</el-button>
        <el-popover
          v-model="popoverVisible"
          :disabled="offlineMode"
          width="250"
          trigger="click"
          placement="bottom-start"
          @hide="cancelSwitchover"
        >
          <el-alert
            :closable="false"
            show-icon
            title="切换到离线模式将无法切换回在线模式，确定吗？"
            type="warning"/>
          <div style="text-align: right; margin-top: 10px">
            <el-button size="mini" type="text" @click="cancelSwitchover">取消</el-button>
            <el-button type="primary" size="mini" @click="switchover">确定</el-button>
          </div>
          <el-switch
            slot="reference"
            v-model="order.or_pattern_out"
            :disabled="offlineMode"
            active-text="在线模式"
            inactive-text="离线模式"
            active-value="1"
            inactive-value="0"
            style="float: right"/>
        </el-popover>
      </div>
      <el-table
        v-loading="listLoading"
        :data="PMScoutArr"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        height="300">
        <el-table-column label="项目" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_pname }}</span>
          </template>
        </el-table-column>
        <el-table-column :formatter="accountType" label="类型" min-width="100" prop="bill_type" align="center"/>
        <el-table-column label="消费" align="center" min-width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_con_money }}</span>
          </template>
        </el-table-column>
        <el-table-column label="付款" align="center" min-width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_pay_money }}</span>
          </template>
        </el-table-column>
        <el-table-column label="营业日" align="center" min-width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_ptime | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入账时间" class-name="status-col" align="center" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_ptime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" class-name="status-col" align="center" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_comments }}</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="操作人" class-name="status-col" align="center" min-width="120">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{ scope.row.time }}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="checkOutShow()">结账退房</el-button>
      </div>
    </el-dialog>
    <!-- 添加财务弹窗 -->
    <el-dialog
      :before-close="cancel"
      :close-on-click-modal="false"
      :visible.sync="billAddDialogFormVisible"
      title="账务信息"
      width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 500px;">
        <el-form-item label="财务类型" prop="bill_type">
          <el-select v-model="temp.bill_type" class="filter-item" placeholder="请选择财务类型" @change="billTypePcode">
            <el-option v-for="item in queryBillDatas" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="财务条目" prop="bill_pid">
          <el-select v-model="temp.bill_pid" class="filter-item" placeholder="请选择财务条目" @change="billTypename">
            <el-option v-for="item in queryPcodeData" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.bill_type === '1'" label="支付方式" prop="pname">
          <el-select v-model="temp.pname" class="filter-item" placeholder="请选择支付方式">
            <el-option v-for="item in queryPcodeData" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="temp.money" type="text"/>
        </el-form-item>
        <el-form-item label="原始凭证编号">
          <el-input v-model="temp.serailnumber" type="text"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.comments" type="text"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="addBillDetail()">确认</el-button>
      </div>
    </el-dialog>
    <!--添加消费品弹窗-->
    <el-dialog
      :before-close="cancel"
      :close-on-click-modal="false"
      :visible.sync="consumerAddDialogFormVisible"
      title="账务信息"
      width="800px">
      <el-table
        v-loading="listLoadings"
        :key="tableKeys"
        :data="goodslists"
        border
        fit
        highlight-current-row
        style="width: 95%;"
        height="300">
        <el-table-column label="消费品系列号" prop="id" align="center" min-width="20px">
          <template slot-scope="scope">
            <span>{{ scope.row.con_seriesnum_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="消费品名称" min-width="20px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.con_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="消费品价格" align="center" min-width="20px">
          <template slot-scope="scope">
            <span>{{ scope.row.con_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80px" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="addconsumer(scope.row)">选中</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="goodslist.start" :limit.sync="goodslist.length" @pagination="addBillConsumer" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel()">取消</el-button>
      </div>
    </el-dialog>

    <!--退房弹窗-->
    <el-dialog
      :before-close="cancel"
      :close-on-click-modal="false"
      :visible.sync="checkoutkeyDialogFormVisible"
      title="退房提醒"
      width="700px">
      <el-card shadow="never">
        <el-row :gutter="12">
          <el-col :span="4">
            <div class="bill-item"><span>入住单号</span></div>
            <div class="bill-item"><span>{{ getOrderInfo.or_checkin_id }}</span></div>
          </el-col>
          <el-col :span="4">
            <div class="bill-item"><span>姓名</span></div>
            <div class="bill-item"><span>{{ getOrderInfo.or_ci_name }}</span></div>
          </el-col>
          <el-col :span="6">
            <div class="bill-item"><span>房间号</span></div>
            <div class="bill-item"><span>{{ getOrderInfo.ro_id }}({{ getOrderInfo.ro_type_name }})</span></div>
          </el-col>
          <el-col :span="5">
            <div class="bill-item bill-balance"><span>共计消费</span></div>
            <div class="bill-item bill-balance"><span>{{ (balance.consumerTotal != null ? parseFloat(balance.consumerTotal)+getOrderInfo.ro_price : getOrderInfo.ro_price) }}元</span></div>
          </el-col>
          <el-col :span="5">
            <div class="bill-item bill-balance"><span>应退款</span></div>
            <div class="bill-item bill-balance"><span>{{ balance.balance > 0 ? balance.balance : 0 }}元</span></div>
          </el-col>
        </el-row>
      </el-card>
      <el-alert
        :closable="false"
        title="确定退房将进行退款操作"
        type="warning"
        center=""
        show-icon/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button class="filter-item" type="primary" @click="checkOut">确定退房</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { checkoutonekey, updateOrderInfo, getOrderInfo, addConsumerDetail, addBillDetail, getBillPcode, checkOut, getBalance, getConsumerGood, getbillDetailById, switchover, offLineAddBillDetail, offLineCheckOut, offLineGetBillDetail } from '@/api/checkout'
import { getDic } from '@/api/dic'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'CheckOut',
  components: { Pagination },
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
  props: {
    billDialogFormVisible: {
      type: Boolean,
      required: true,
      default: false
    },
    datas: {
      type: Object,
      required: true
    },
    order: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      getOrderInfo: {
        bill_deposit: ''
      },
      tableKey: 0,
      listLoading: true,
      total: 0,
      billlist: null,
      checkin_id: null,
      tableKeys: 0,
      goodslists: null,
      listLoadings: true,
      offlineMode: false,
      goodslist: {
        start: 0,
        length: 10,
        params: {}
      },
      pcode: '',
      consumer: {
        pay: null,
        name: null
      },
      consumerPay: [],
      billDetail: {
        pk_ci_id: '',
        hi_id: '',
        pms_type_id: '',
        or_checkin_id: '',
        bill_pid: '',
        bill_pname: '',
        bill_type: '',
        bill_con_money: '',
        bill_pay_money: '',
        bill_con_count: '',
        pay_paytype: '',
        bill_ptime: '',
        bill_comments: '',
        pay_isone: '',
        pay_shift_no: '',
        c_user_id: '',
        c_user_name: '',
        m_user_id: '',
        m_user_name: '',
        c_time: '',
        m_time: ''
      },
      consumerGoodsDetail: {
        pk_consumer_id: '',
        pk_ci_id: '',
        con_name: '',
        con_price: '',
        con_count: ''
      },
      temp: {
        bill_type: null,
        bill_pid: null,
        money: null,
        serailnumber: null,
        pname: null,
        comments: null
      },
      rules: {
        bill_type: [{ required: true, message: '请选择财务类型', trigger: 'blur' }],
        bill_pid: [{ required: true, message: '请选择财务条目', trigger: 'blur' }],
        pname: [{ required: true, message: '请选择支付方式', trigger: 'blur' }],
        money: [{ required: true, message: '请填入金额', trigger: 'blur' }]
      },
      rule: {
        pay: [{ required: true, message: '请选择支付方式', trigger: 'blur' }]
      },
      billAddDialogFormVisible: false,
      consumerAddDialogFormVisible: false,
      checkoutkeyDialogFormVisible: false,
      popoverVisible: false,
      ConsumerTotal: 0,
      PMScout: null,
      PMScoutArr: [],
      balance: {},
      getBalanceTotal: {
        pk_ci_id: '',
        pms_type_id: '',
        hi_id: '',
        ro_id: '',
        or_checkin_id: ''
      },
      checkoutvisible: false,
      hiId: null,
      billType: '',
      dialogStatus: '',
      textMap: {
        update: '取消',
        create: '添加'
      },
      queryBillDatas: [],
      queryPcodeData: [],
      timestamp: null,
      timestamp2: null,
      timestamp3: null
    }
  },
  computed: {
    messageData() {
      return this.$store.state.message.data
    }
  },
  // 监听数据
  watch: {
    billDialogFormVisible(val) {
      if (val === true) {
        this.getBillDetail()
      }
    },
    messageData: {
      handler(newVal, oldVal) {
        console.log(newVal)
        if (JSON.parse(newVal.attacheData).timestamp === this.timestamp) {
          // 后台获取PMS账务
          this.balance = newVal.data
          if (this.balance.consumerTotal) {
            this.balance.consumerTotal = parseFloat(this.balance.consumerTotal)
          } else {
            this.balance.consumerTotal = 0
          }
        }
        if (JSON.parse(newVal.attacheData).timestamp === this.timestamp2) {
          this.billAddDialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '添加账务成功',
            type: 'success',
            duration: 2000
          })
          this.getBillDetail()
          this.resetTemp()
          this.resetBill()
        }
        if (JSON.parse(newVal.attacheData).timestamp === this.timestamp3) {
          // 将弹窗关闭
          this.handleClose()
          this.$notify({
            title: '成功',
            message: '退房成功',
            type: 'success',
            duration: 2000
          })
          this.checkoutkeyDialogFormVisible = false
          // 刷新订单页面
          this.$parent.getList()
        }
      },
      deep: true
    }
  },
  created() {
    this.queryBillList()
  },
  methods: {
    handleClose() {
      this.$emit('update:billDialogFormVisible', false)
    },
    // 点击添加消费品按钮
    addBillConsumer() {
      this.consumerAddDialogFormVisible = true
      this.billDetail.pms_type_id = this.getOrderInfo.pms_type_id
      this.billDetail.hi_id = this.getOrderInfo.hi_id
      this.billDetail.or_checkin_id = this.getOrderInfo.or_checkin_id
      this.billDetail.pk_ci_id = this.getOrderInfo.pk_ci_id
      this.billDetail.ro_id = this.getOrderInfo.ro_id
      this.billDetail.bill_type = '0'
      this.billDetail.pay_isone = '0'
      this.listLoadings = true
      getConsumerGood(this.goodslist).then(response => {
        this.goodslists = response.data
        this.total = response.recordsTotal
        this.listLoadings = false
      })
      // 消费品根据pcode值获取字典表数据
      this.pcode = '0'
      getBillPcode(this.pcode).then(response => {
        this.consumerPay = response.data
      })
    },
    // 点击选中按钮后
    addconsumer(row) {
      this.consumerAddDialogFormVisible = false
      this.billDetail.bill_con_money = row.con_price
      this.billDetail.bill_pid = this.consumer.pay
      this.billDetail.bill_type = '0'
      this.billDetail.bill_pname = row.con_name
      this.billDetail.bill_con_count = 1
      this.billDetail.pay_paytype = this.consumer.name
      addBillDetail(this.billDetail).then(response => {
        this.billAddDialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '添加消费品成功',
          type: 'success',
          duration: 2000
        })
        // 将消费品明细信息添加到消费品明细表
        this.consumerGoodsDetail.con_count = '1'
        this.consumerGoodsDetail.con_name = row.con_name
        this.consumerGoodsDetail.con_price = row.con_price
        this.consumerGoodsDetail.pk_ci_id = this.getOrderInfo.pk_ci_id
        this.consumerGoodsDetail.pk_consumer_id = row.pk_consumer_id
        addConsumerDetail(this.consumerGoodsDetail).then(response => {
          this.billAddDialogFormVisible = false
        })
      })
      this.getBillDetail()
      this.resetTemp()
      this.resetBill()
      this.restconsumer()

      this.getBillDetail()
      this.resetTemp()
      this.resetBill()
      this.restconsumer()
    },
    checkOutShow() {
      this.checkoutkeyDialogFormVisible = true
    },
    // 退房操作
    checkOut() {
      if (parseFloat(this.balance.balance) >= 0) {
        if (this.offlineMode) {
          offLineCheckOut(this.getOrderInfo).then(response => {
            // 将弹窗关闭
            this.handleClose()
            this.$notify({
              title: '成功',
              message: '退房成功',
              type: 'success',
              duration: 2000
            })
            this.checkoutkeyDialogFormVisible = false
            // 刷新订单页面
            this.$parent.getList()
          })
        } else {
          this.timestamp3 = new Date().getTime()
          if (this.$store.state.user.localVersion) {
            checkOut(this.getOrderInfo, this.timestamp3, this.balance.balance).then(response => {
            })
          } else {
            checkOut(this.getOrderInfo, this.timestamp3, this.balance.balance).then(response => {
              // 将弹窗关闭
              this.handleClose()
              this.$notify({
                title: '成功',
                message: '退房成功',
                type: 'success',
                duration: 2000
              })
              this.checkoutkeyDialogFormVisible = false
              // 刷新订单页面
              this.$parent.getList()
            })
          }
        }
      } else {
        this.$alert('该订单存在应收账务！请手动平账！', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      }
    },
    // 根据code值获取字典表数据
    queryBillList() {
      this.billType = 'code_accountstype'
      getDic(this.billType).then(response => {
        this.queryBillDatas = response.data
      })
    },
    // 账务根据pcode值获取字典表数据
    billTypePcode(value) {
      getBillPcode(value).then(response => {
        this.queryPcodeData = response.data
        this.temp.bill_pid = ''
      })
    },
    // 添加账务页面遍历出字典表数据对应得数据获取name值，赋值到queryPcodeData的name属性上
    billTypename(code) {
      for (let i = 0; i < this.queryPcodeData.length; i++) {
        if (this.queryPcodeData[i].code === code) {
          this.queryPcodeData.name = this.queryPcodeData[i].name
        }
      }
    },
    // 添加消费品页面遍历出字典表数据对应得数据获取name值，赋值到consumerPay的name属性上
    conTypename(code) {
      for (let i = 0; i < this.consumerPay.length; i++) {
        if (this.consumerPay[i].code === code) {
          this.consumer.name = this.consumerPay[i].name
        }
      }
    },
    // 取消按钮设置
    cancel() {
      this.consumerAddDialogFormVisible = false
      this.billAddDialogFormVisible = false
      this.checkoutkeyDialogFormVisible = false
      this.restconsumer()
      this.resetBill()
      this.resetTemp()
    },
    // 重置temp变量的数据
    resetTemp() {
      this.temp = {
      }
    },
    // 重置billDetail变量的数据，以防添加账务的时候将消费和结算一起录入数据库
    resetBill() {
      this.billDetail = {
      }
    },
    // 重置consumer变量的数据，以防添加账务的时候重复录入数据库
    restconsumer() {
      this.consumer = {
      }
    },
    // 初始化数据
    getBillDetail() {
      this.listLoading = true
      this.offlineMode = false
      this.PMScoutArr = []
      this.getOrderInfo = {}
      this.balance = {}
      if (this.order.or_pattern_out === '0') {
        this.offlineMode = true
      }
      getOrderInfo(this.datas).then(response => {
        this.getOrderInfo = response.data
        if (this.getOrderInfo.or_status === 'I') {
          this.hiId = this.getOrderInfo.hi_id
          this.checkin_id = this.getOrderInfo.or_checkin_id
          this.getBalanceTotal.hi_id = this.getOrderInfo.hi_id
          this.getBalanceTotal.pms_type_id = this.getOrderInfo.pms_type_id
          this.getBalanceTotal.or_checkin_id = this.getOrderInfo.or_checkin_id
          this.getBalanceTotal.ro_id = this.getOrderInfo.ro_id
          this.getBalanceTotal.pk_ci_id = this.getOrderInfo.pk_ci_id
          // 后台获取PMS账务
          if (this.offlineMode) {
            offLineGetBillDetail(this.order).then(res => {
              this.balance = res.data
              this.PMScoutArr = JSON.parse(res.data.billInfo)
              this.listLoading = false
            })
          } else {
            this.timestamp = new Date().getTime()
            if (this.$store.state.user.localVersion) {
              getBalance(this.getBalanceTotal, this.timestamp).then(response => {
              })
            } else {
              getBalance(this.getBalanceTotal, this.timestamp).then(response => {
                this.balance = response.data
                if (this.balance.consumerTotal) {
                  this.balance.consumerTotal = parseFloat(this.balance.consumerTotal)
                } else {
                  this.balance.consumerTotal = 0
                }
              })
              getbillDetailById(this.getBalanceTotal.pk_ci_id).then(response => {
                this.PMScoutArr = response.data
                this.listLoading = false
              })
            }
          }
        } else {
          this.open()
        }
      })
    },
    open() {
      this.$alert('该订单已退房，不是在住订单！', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.handleClose()
          this.updateOrder()
          this.$parent.getList()
          this.$message({
            type: 'info',
            message: `提示: 页面已刷新`
          })
        }
      })
    },
    updateOrder() {
      updateOrderInfo(this.datas).then(response => {
        this.billlist = response.data
      })
    },
    // 一键退房
    checkoutkey() {
      checkoutonekey(this.getOrderInfo).then(response => {
        // 将弹窗关闭
        this.handleClose()
        this.$notify({
          title: '成功',
          message: '退房成功',
          type: 'success',
          duration: 2000
        })
        // 刷新订单页面
        this.$parent.getList()
      })
    },
    // 点击添加账务按钮的同时给billDetail变量赋值部分属性
    addBill() {
      this.billAddDialogFormVisible = true
      this.billDetail.pms_type_id = this.getOrderInfo.pms_type_id
      this.billDetail.hi_id = this.getOrderInfo.hi_id
      this.billDetail.or_checkin_id = this.getOrderInfo.or_checkin_id
      this.billDetail.pk_ci_id = this.getOrderInfo.pk_ci_id
      this.billDetail.ro_id = this.getOrderInfo.ro_id
      this.billDetail.pay_isone = '0'
      this.billDetail.bill_con_count = 1
    },
    // 添加账务界面确定之后，给billDetail变量赋值部分属性，且调用添加账务接口，回调获取账务列表方法和重置重置temp与billDetail方法
    addBillDetail() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.billDetail.bill_type = this.temp.bill_type
          if (this.billDetail.bill_type === '0') {
            this.billDetail.bill_pname = '消费帐'
          } else {
            this.billDetail.bill_pname = '结算帐'
          }
          this.billDetail.bill_pid = this.temp.bill_pid
          if (this.billDetail.bill_type === '0') {
            this.billDetail.bill_con_money = this.temp.money
          } else {
            this.billDetail.bill_pay_money = this.temp.money
          }
          this.billDetail.bill_comments = this.temp.comments
          this.billDetail.pay_shift_no = this.temp.serailnumber
          this.billDetail.pay_paytype = this.queryPcodeData.name
          if (this.offlineMode) {
            offLineAddBillDetail(this.billDetail).then(response => {
              this.billAddDialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '添加账务成功',
                type: 'success',
                duration: 2000
              })
              this.getBillDetail()
              this.resetTemp()
              this.resetBill()
            })
          } else {
            this.timestamp2 = new Date().getTime()
            if (this.$store.state.user.localVersion) {
              addBillDetail(this.billDetail, this.timestamp2).then(response => {
              })
            } else {
              addBillDetail(this.billDetail, this.timestamp2).then(response => {
                this.billAddDialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '添加账务成功',
                  type: 'success',
                  duration: 2000
                })
                this.getBillDetail()
                this.resetTemp()
                this.resetBill()
              })
            }
          }
        }
      })
    },
    accountType(row, column) {
      for (let i = 0; i < this.queryBillDatas.length; i++) {
        if (this.queryBillDatas[i].code === row.bill_type) {
          return this.queryBillDatas[i].name
        }
      }
    },
    switchover() {
      switchover(this.order).then(res => {
        this.order.or_pattern_out = '0'
        this.offlineMode = true
        this.popoverVisible = false
        this.getBillDetail()
        this.$parent.getList()
      }).catch(() => {
        this.order.or_pattern_out = '1'
      })
    },
    cancelSwitchover() {
      this.popoverVisible = false
      this.order.or_pattern_out = '1'
    }
  }
}
</script>

<style scoped>
  .bill-item{
    text-align: center;
    margin-top: 12px;
    margin-bottom: 12px;
  }
  .bill-balance{
    font-weight: bolder;
    color: red;
  }
</style>
