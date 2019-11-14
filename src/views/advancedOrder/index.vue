<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.params.or_id" placeholder="预订单号" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.or_name" placeholder="预订人" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.or_tel" placeholder="预订人手机号" clearable style="width: 150px;" class="filter-item" @keyup.native="phoneProving"/>
      <el-select v-model="listQuery.params.ro_type_id" placeholder="房间类型" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in roomTypeParamsData" :key="item.code" :label="item.name" :value="item.code"/>
      </el-select>
      <el-input v-model="listQuery.params.or_est_roomnum" placeholder="房间数" clearable style="width: 150px;" class="filter-item" @keyup.native="roomNumProving"/>
      <el-input v-model="listQuery.params.or_all_room_amount" placeholder="房间总价(元)" clearable style="width: 150px;" class="filter-item" @keyup.native="provingPrice"/>
      <el-select v-model="listQuery.params.or_assure_id" placeholder="担保类型" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in assureTypeParamsData" :key="item.code" :label="item.name" :value="item.code"/>
      </el-select>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="预计抵店时间"
        end-placeholder="结束时间"
        class="filter-item"
        style="width: auto"
        value-format="yyyy-MM-dd"
        @change="timeFormatting"/>
      <el-date-picker
        v-model="checkoutdateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="预计退房时间"
        end-placeholder="结束时间"
        class="filter-item"
        style="width: auto"
        value-format="yyyy-MM-dd"
        @change="formatDepTimeRange"/>
      <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
      </div>
    </div>
    <!--数据显示-->
    <el-tabs v-model="activeName" type="card" @tab-click="ispayChange">
      <el-tab-pane label="未支付" name="nopay"/>
      <el-tab-pane label="已支付" name="pay"/>
      <el-tab-pane label="已取消" name="cancel"/>
    </el-tabs>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column key="1" label="预订单号" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.or_id }}</span>
        </template>
      </el-table-column>
      <el-table-column key="2" label="预订人" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.or_name }}</span>
        </template>
      </el-table-column>
      <el-table-column key="3" label="预订人手机号" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.or_tel }}</span>
        </template>
      </el-table-column>
      <el-table-column key="4" :formatter="roomTypeOptions" label="房间类型" align="center" min-width="150" prop="ro_type_id"/>
      <el-table-column key="5" label="房间数" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.or_est_roomnum }}</span>
        </template>
      </el-table-column>
      <el-table-column key="6" label="房间总价(元)" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.or_all_room_amount | priceRounding }}</span>
        </template>
      </el-table-column>
      <el-table-column key="7" :formatter="assureTypeOptions" label="担保类型" align="center" min-width="120" prop="or_assure_id"/>
      <el-table-column v-if="ispayStatusShow" key="8" :formatter="ispayTypeOptions" label="是否付款" align="center" min-width="120" prop="or_ispay"/>
      <el-table-column v-if="displayData" key="9" label="预计抵店时间" align="center" min-width="180" prop="or_est_arr_time">
        <template slot-scope="scope">
          <span>{{ scope.row.or_est_arr_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="displayData" key="10" label="预计退房时间" align="center" min-width="180" prop="or_est_dep_time">
        <template slot-scope="scope">
          <span>{{ scope.row.or_est_dep_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="cancelShow" key="11" label="取消时间" align="center" min-width="180" prop="or_cancel_time">
        <template slot-scope="scope">
          <span>{{ scope.row.or_cancel_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column key="12" label="创建人" align="center" min-width="180" prop="c_time">
        <template slot-scope="scope">
          <span>{{ scope.row.c_user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column key="13" label="创建时间" align="center" min-width="180" prop="c_time">
        <template slot-scope="scope">
          <span>{{ scope.row.c_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="displayData" key="14" label="操作" align="center" width="200" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="payButtonShow" type="primary" size="mini" @click="payConfirm(scope.row)">支付</el-button>
          <el-button type="danger" size="mini" @click="handleCancel(scope.row)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :limit.sync="listQuery.length" @pagination="getList" />

    <!--取消操作弹出框-->
    <el-dialog :visible.sync="cancelDialogFormVisible" width="30%" top="5vh">
      <el-input v-model="temp.or_cancel_cause" :rows="3" placeholder="请输入取消预订单的原因" prop="or_cancel_cause" type="textarea"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="cancelOrder()">确认</el-button>
      </div>
    </el-dialog>

    <!--添加操作弹出框-->
    <el-dialog :visible.sync="orderDialogFormVisible" title="添加预订单" width="30%" top="5vh">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" class="common-form">
        <el-form-item label="预订单号" prop="or_id">
          <el-input v-model="temp.or_id" type="text" style="width: 280px" placeholder="请输入预订单号" />
        </el-form-item>
        <el-form-item label="预订人姓名" prop="or_name">
          <el-input v-model="temp.or_name" type="text" style="width: 280px" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="预订人手机号" prop="or_tel" label-width="120px">
          <el-input v-model="temp.or_tel" type="text" style="width: 280px" placeholder="请输入预订人手机号" />
        </el-form-item>
        <el-form-item label="房间类型" prop="ro_type_id">
          <el-select v-model="temp.ro_type_id" class="filter-item" style="width: 280px" placeholder="请选择" >
            <el-option v-for="item in roomTypeParamsData" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="房间数" prop="or_est_roomnum">
          <el-input v-model="temp.or_est_roomnum" type="text" style="width: 280px" placeholder="请输入预定房间数"/>
        </el-form-item>
        <el-form-item label="抵店时间" prop="or_est_arr_time">
          <el-date-picker
            v-model="temp.or_est_arr_time"
            :picker-options="timePickerOptions"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 280px"
            value-format="yyyy-MM-dd HH:mm:ss"/>
        </el-form-item>
        <el-form-item label="预计退房时间" prop="or_est_dep_time">
          <el-date-picker
            v-model="temp.or_est_dep_time"
            :picker-options="timePickerOptions"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 280px"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="14:00:00"/>
        </el-form-item>
        <el-form-item label="担保类型" prop="or_assure_id">
          <el-select v-model="temp.or_assure_id" class="filter-item" style="width: 280px" placeholder="请选择" >
            <el-option v-for="item in assureTypeParamsData" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="房间总价(元)" prop="or_all_room_amount" label-width="120px">
          <el-input v-model="temp.or_all_room_amount" style="width: 280px"/>
        </el-form-item>
        <el-form-item label="备注" prop="or_comments" >
          <el-input v-model="temp.or_comments" :rows="3" type="textarea" style="width: 280px"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getAdvancedOrderList, addAdvancedOrder, payAdvancedOrder, cancleAdvancedOrder } from '@/api/advancedorder'
import { getDicMore } from '@/api/dic'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'AdvancedOrder',
  components: { Pagination },
  directives: { waves },
  filters: {
    priceRounding(value) {
      return value.toFixed(2)
    }
  },
  data: function() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      activeName: 'nopay',
      dateRange: undefined,
      checkoutdateRange: undefined,
      listQuery: {
        start: 0,
        length: 10,
        params: {
          ro_type_id: null,
          or_est_roomnum: null,
          or_est_arr_time: null,
          or_est_dep_time: null,
          or_id: null,
          or_name: null,
          or_tel: null,
          or_ispay: '0',
          or_status: 'R',
          or_assure_id: null,
          or_all_room_amount: null,
          or_comments: null,
          or_cancel_cause: null
        }
      },
      temp: {
        or_id: '',
        or_name: '',
        or_tel: '',
        ro_type_id: '',
        or_est_roomnum: '',
        or_est_arr_time: '',
        or_est_dep_time: '',
        or_assure_id: '',
        or_all_room_amount: '',
        or_comments: '',
        or_cancel_cause: ''
      },
      orderRowData: {
        or_id: '',
        or_name: '',
        or_tel: '',
        ro_type_id: '',
        or_est_roomnum: '',
        or_est_arr_time: '',
        or_est_dep_time: '',
        or_assure_id: '',
        or_comments: '',
        or_all_room_amount: '',
        or_cancel_cause: '',
        c_time: ''
      },
      cancelShow: false,
      orderDialogFormVisible: false,
      cancelDialogFormVisible: false,
      displayData: true,
      payButtonShow: true,
      ispayStatusShow: false,
      dicParams: 'code_roomtype,code_if,code_ordstatus,code_assuretype',
      tabVariable: '',
      dicParamsData: [],
      assureTypeParamsData: [],
      roomTypeParamsData: [],
      timePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      rules: {
        or_est_roomnum: [
          { required: true, message: '请输入1-11的预定房间数', trigger: 'blur' },
          { min: 1, max: 11, message: '请输入1-11的预定房间数', trigger: 'blur' },
          { pattern: /[\d]/, message: '只能输入数字', trigger: 'blur' }
        ],
        or_id: [
          { required: true, message: '请输入订单号', trigger: 'blur' },
          { min: 1, max: 50, message: '请输入请输入订单号', trigger: 'blur' }
        ],
        or_name: [
          { required: true, message: '请输入姓名', trigger: 'change' },
          { min: 2, max: 20, message: '请输入姓名', trigger: 'blur' },
          { pattern: /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/, message: '姓名输入不正确', trigger: 'blur' }
        ], // /^[\u4E00-\u9FA5]+(·[\u4E00-\u9FA5]+)*$/   纯中文姓名验证
        or_tel: [
          { required: true, message: '请输入11位手机号码', trigger: 'change' },
          { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' }
        ],
        or_all_room_amount: [
          { required: true, message: '请输入房间价格', trigger: 'change' },
          { pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请输入正确的房间价格', trigger: 'blur' },
          { min: 0, max: 4, message: '请输入房间价格', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDic()
    this.getList()
  },
  methods: {
    // 选项卡切换调用方法
    ispayChange(tab) {
      this.tabVariable = tab
      if (tab.name === 'nopay') {
        this.displayData = true
        this.payButtonShow = true
        this.ispayStatusShow = false
        this.cancelShow = false
        this.listQuery.params = { or_ispay: '0', or_status: 'R' }
      }
      if (tab.name === 'pay') {
        this.displayData = true
        this.payButtonShow = false
        this.ispayStatusShow = false
        this.cancelShow = false
        this.listQuery.params = { or_ispay: '1', or_status: 'R' }
      }
      if (tab.name === 'cancel') {
        this.displayData = false
        this.ispayStatusShow = true
        this.cancelShow = true
        this.listQuery.params = { or_status: 'X' }
      }
      this.getList()
    },
    //  验证只能输入价格
    provingPrice() {
      // 如果输入非数字，则替换为''
      this.listQuery.params.or_all_room_amount = this.listQuery.params.or_all_room_amount.replace(/[^\d\.]/g, '')
      // 必须保证第一个为数字而不是.
      this.listQuery.params.or_all_room_amount = this.listQuery.params.or_all_room_amount.replace(/^\./g, '')
      // 保证只有出现一个.而没有多个.
      this.listQuery.params.or_all_room_amount = this.listQuery.params.or_all_room_amount.replace(/\.{2,}/g, '.')
      // 保证.只出现一次，而不能出现两次以上
      this.listQuery.params.or_all_room_amount = this.listQuery.params.or_all_room_amount.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      // 只能输入两位小数
      this.listQuery.params.or_all_room_amount = this.listQuery.params.or_all_room_amount.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    },
    // 房间数验证
    roomNumProving() {
      this.listQuery.params.or_est_roomnum = this.listQuery.params.or_est_roomnum.replace(/[^\.\d]/g, '')
      this.listQuery.params.or_est_roomnum = this.listQuery.params.or_est_roomnum.replace('.', '')
    },
    // 手机号验证
    phoneProving() {
      this.listQuery.params.or_tel = this.listQuery.params.or_tel.replace(/[^\.\d]/g, '')
      this.listQuery.params.or_tel = this.listQuery.params.or_tel.replace('.', '')
    },
    // 担保类型表格数据显示
    assureTypeOptions(row, column) {
      for (let i = 0; i < this.assureTypeParamsData.length; i++) {
        if (this.assureTypeParamsData[i].code === row.or_assure_id) {
          return this.assureTypeParamsData[i].name
        }
      }
    },
    // 房间类型表格数据显示
    roomTypeOptions(row, column) {
      for (let i = 0; i < this.roomTypeParamsData.length; i++) {
        if (this.roomTypeParamsData[i].code === row.ro_type_id) {
          return this.roomTypeParamsData[i].name
        }
      }
    },
    // 是否支付表格数据显示
    ispayTypeOptions(row, column) {
      for (let i = 0; i < this.dicParamsData.code_if.length; i++) {
        if (this.dicParamsData.code_if[i].code === row.or_ispay) {
          return this.dicParamsData.code_if[i].name
        }
      }
    },
    // 获取字典表所有数据
    getDic() {
      getDicMore(this.dicParams).then(response => {
        this.dicParamsData = response.data
        this.roomTypeParamsData = this.dicParamsData.code_roomtype
        this.assureTypeParamsData = this.dicParamsData.code_assuretype
      })
    },
    // 获取预订单列表
    getList() {
      this.listLoading = true
      getAdvancedOrderList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.recordsTotal
        this.listLoading = false
      })
    },
    handleRefresh() {
      this.ispayChange(this.tabVariable)
      this.dateRange = ''
      this.checkoutdateRange = ''
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
      }
    },
    handleCreate() {
      this.resetTemp()
      this.orderDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 点击取消支付按钮出弹框，写入取消原因
    handleCancel(row) {
      this.orderRowData.or_id = row.or_id
      this.orderRowData.or_name = row.or_name
      this.orderRowData.or_tel = row.or_tel
      this.orderRowData.ro_type_id = row.ro_type_id
      this.orderRowData.or_est_roomnum = row.or_est_roomnum
      this.orderRowData.or_est_arr_time = this.getTime(row.or_est_arr_time)
      this.orderRowData.or_est_dep_time = this.getTime(row.or_est_dep_time)
      this.orderRowData.or_assure_id = row.or_assure_id
      this.orderRowData.or_all_room_amount = row.or_all_room_amount
      this.orderRowData.or_comments = row.or_comments
      this.orderRowData.c_time = this.getTime(row.c_time)
      this.resetTemp()
      this.cancelDialogFormVisible = true
    },
    // 把获取时间格式化
    getTime(data) {
      const date = new Date(data)
      const seperator1 = '-'
      const seperator2 = ':'
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      const currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        ' ' + date.getHours() + seperator2 + date.getMinutes() +
        seperator2 + date.getSeconds()
      return currentdate
    },
    // 添加预订单
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addAdvancedOrder(this.temp).then(() => {
            this.orderDialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    // 支付预订单
    handlePay(row) {
      payAdvancedOrder(row.or_id).then(() => {
        this.orderDialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '支付成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    payConfirm(row) {
      this.$confirm('确认支付预订单吗？', '支付提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handlePay(row)
      })
    },
    // 取消预订单
    cancelOrder() {
      this.orderRowData.or_cancel_cause = this.temp.or_cancel_cause
      console.log(this.orderRowData)
      cancleAdvancedOrder(this.orderRowData).then(() => {
        this.cancelDialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '取消成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    // 时间格式化
    timeFormatting(filterVal) {
      if (filterVal) {
        this.listQuery.params.or_est_arr_time = JSON.stringify(filterVal)
          .replace(/\[|\]|\"/g, '')
          .replace(',', ' - ')
      } else {
        this.listQuery.params.or_est_arr_time = undefined
      }
    },
    // 时间格式化
    formatDepTimeRange(filterVal) {
      if (filterVal) {
        this.listQuery.params.or_est_dep_time = JSON.stringify(filterVal)
          .replace(/\[|\]|\"/g, '')
          .replace(',', ' - ')
      } else {
        this.listQuery.params.or_est_dep_time = undefined
      }
    }
  }
}
</script>
