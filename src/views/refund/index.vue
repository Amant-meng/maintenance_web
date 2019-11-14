<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.params.hi_name" placeholder="酒店名称" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input
        v-model="listQuery.params.ro_id"
        placeholder="房间号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
      <el-input
        v-model="listQuery.params.or_ci_name"
        placeholder="入住人"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
      <el-input
        v-model="listQuery.params.c_user_name"
        placeholder="操作员"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
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
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-refresh"
        @click="handleRefresh">刷新
      </el-button>
    </div>
    <!--表格数据显示-->
    <el-tabs v-model="activeName" type="card" @tab-click="refundChange">
      <el-tab-pane label="未退款" name="norefund"/>
      <el-tab-pane label="退款中" name="refunding"/>
      <el-tab-pane label="已退款" name="refund"/>
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
      <el-table-column key="1" label="酒店名称" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.hi_name }}</span>
        </template>
      </el-table-column>
      <el-table-column key="2" label="房间号" align="center" min-width="150" prop="ro_id" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.ro_id }}</span>
        </template>
      </el-table-column>
      <el-table-column key="3" label="姓名" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.or_ci_name }}</span>
        </template>
      </el-table-column>
      <el-table-column key="4" label="电话" align="center" min-width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.or_ci_tel }}</span>
        </template>
      </el-table-column>
      <el-table-column key="5" label="预付金额(元)" align="center" min-width="200px" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.bill_prepay }}</span>
        </template>
      </el-table-column>
      <el-table-column key="6" label="押金(元)" align="center" min-width="120px" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.bill_deposit| roundingPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column key="7" label="房费总额(元)" align="center" min-width="150px" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.ro_price*scope.row.or_act_day }}</span>
        </template>
      </el-table-column>
      <el-table-column key="8" label="商户订单号" align="center" min-width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.pay_merchant_orderid }}</span>
        </template>
      </el-table-column>
      <el-table-column key="9" label="行内订单号" align="center" min-width="250px">
        <template slot-scope="scope">
          <span>{{ scope.row.pay_deal_orderid }}</span>
        </template>
      </el-table-column>
      <el-table-column key="10" label="授权号" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.pay_auth_code }}</span>
        </template>
      </el-table-column>
      <el-table-column key="11" label="支付方式" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.pay_paytype }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="ok" key="12" label="退款金额(元)" align="center" min-width="200px" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.bill_refundable_amount| roundingPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column
        key="13"
        label="入住时间"
        class-name="status-col"
        align="center"
        min-width="180"
        prop="or_act_arr_time"
        sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.or_act_arr_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="refundShow"
        key="14"
        label="退款时间"
        class-name="status-col"
        align="center"
        min-width="180"
        prop="bill_refund_time"
        sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.bill_refund_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="peopleShow"
        key="15"
        label="操作人"
        class-name="status-col"
        align="center"
        min-width="180"
        prop="bill_refund_time"
        sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.m_user_name }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column key="10" label="创建时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.c_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column-->>
      <el-table-column
        v-if="displayData"
        key="14"
        label="操作"
        align="center"
        width="260"
        class-name="small-padding fixed-width"
        fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="getRefundDetail(scope.row)">退款</el-button>
          <!--<el-button type="primary" size="mini" @click="fullRefunds(scope.row)">全额退款</el-button>-->
          <el-button type="primary" size="mini" @click="openChangeRoomDialog(scope.row)">换房</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="changeRoomDialog"
      :before-close="handleClose"
      title="换房"
      width="300px"
    >
      <el-input v-model="changeRoomParams.change_room_id" placeholder="请输入更换后的房间号" style="width: 200px;"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="changeRoom">确 定</el-button>
      </span>
    </el-dialog>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.start"
      :limit.sync="listQuery.length"
      @pagination="getList"/>
    <!--添加操作弹出框-->
    <RefundModify
      ref="RefundModify"
      :refund-dialog-form-visible.sync="refundDialogFormVisible"
      :datas="datas"
      :order="order"/>
  </div>
</template>

<script>
import { getRefundList, fullRefunds, changeRoom } from '@/api/refund'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import RefundModify from '@/components/RefundModify'

export default {
  name: 'RegistrationOrder',
  components: { Pagination, RefundModify },
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
  data: function() {
    return {
      ok: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      displayData: true,
      refundShow: false,
      peopleShow: false,
      dateRange: undefined,
      activeName: 'norefund',
      datas: {
        comments: ''
      },
      order: {},
      listQuery: {
        start: 0,
        length: 10,
        params: {
          hi_name: undefined,
          ro_id: undefined,
          or_ci_name: undefined,
          or_ci_tel: undefined,
          bill_all_con_money: undefined,
          bill_all_pay_money: undefined,
          bill_deposit: undefined,
          bill_refundable_amount: undefined,
          or_isrefund: '0',
          c_user_name: undefined,
          or_act_arr_time: undefined,
          bill_refund_time: undefined,
          bill_prepay: undefined,
          ro_price: undefined,
          or_act_day: undefined
        }
      },
      refundDialogFormVisible: false,
      temp: {},
      tabVariable: '',
      timestamp: '',
      loading: false,
      changeRoomParams: {
        change_room_id: '',
        ro_id: ''
      },
      changeRoomDialog: false
    }
  },
  computed: {
    messageData() {
      return this.$store.state.message.data
    }
  },
  watch: {
    messageData: {
      handler(newVal, oldVal) {
        console.log(newVal)
        if (JSON.parse(newVal.data.attacheData).timestamp === this.timestamp + '') {
          // 消息回复
          if (newVal.success === true) {
            this.$notify({
              title: '成功',
              message: '退款成功!',
              type: 'success',
              duration: 2000
            })
          }
          this.loading.close()
          // 刷新订单页面
          this.getList()
        }
      },
      deep: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    refundChange(tab) {
      this.tabVariable = tab
      if (tab.name === 'norefund') {
        this.ok = false
        this.displayData = true
        this.refundShow = false
        this.peopleShow = false
        this.listQuery.params = { or_isrefund: '0' }
      }
      if (tab.name === 'refund') {
        this.ok = true
        this.displayData = false
        this.refundShow = true
        this.peopleShow = true
        this.listQuery.params = { or_isrefund: '1' }
      }
      if (tab.name === 'refunding') {
        this.ok = true
        this.displayData = false
        this.refundShow = false
        this.peopleShow = true
        this.listQuery.params = { or_isrefund: '2' }
      }
      this.getList()
    },
    // 获取退款列表
    getList() {
      this.listLoading = true
      getRefundList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.recordsTotal
        this.listLoading = false
        // console.log(this.list)
      })
    },
    // 点击退款按钮
    getRefundDetail(row) {
      this.refundDialogFormVisible = true
      if (row) {
        this.order = row
        this.datas.ro_id = row.ro_id// 房间号
        this.datas.or_act_arr_time = row.or_act_arr_time// 入住时间
        this.datas.bill_all_con_money = row.bill_all_con_money// 消费金额
        this.datas.bill_deposit = row.bill_deposit// 押金
        this.datas.or_ci_name = row.or_ci_name// 入住人
        this.datas.bill_refundable_amount = row.bill_refundable_amount// 退款金额
        this.datas.bill_prepay = row.bill_prepay// 预付金额
        this.datas.totalPrice = row.ro_price * row.or_act_day // 房费总额
        this.datas.hi_id = row.hi_id
        this.datas.or_checkin_id = row.or_checkin_id
        this.datas.ti_id = row.ti_id
      }
    },
    fullRefunds(row) {
      const h = this.$createElement
      this.$msgbox({
        title: '退款提醒',
        message: h('p', null, [
          h('span', null, '将退款 '),
          h('span', {
            style: 'color: red'
          }, row.bill_prepay),
          h('span', null, '元，确认退款吗？')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            done()
          } else {
            done()
          }
        }
      }).then(action => {
        this.timestamp = new Date().getTime()
        const temp = {}
        temp.hi_id = row.hi_id
        temp.or_checkin_id = row.or_checkin_id
        temp.ti_id = row.ti_id
        temp.comment = '全额退款'
        temp.timestamp = this.timestamp
        fullRefunds(temp).then(() => {
          this.openFullScreen()
        })
      })
    },
    changeRoom() {
      changeRoom(this.changeRoomParams).then((res) => {
        this.changeRoomParams.change_room_id = ''
        this.changeRoomDialog = false
        this.$notify({
          title: '成功',
          message: '换房成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    openChangeRoomDialog(row) {
      this.changeRoomDialog = true
      this.changeRoomParams.ro_id = row.ro_id
    },
    handleClose() {
      this.changeRoomParams.change_room_id = ''
      this.changeRoomDialog = false
    },
    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: '正在退款中，请稍后，如等待时间过长请刷新页面后重试。',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    handleRefresh() {
      this.refundChange(this.tabVariable)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
