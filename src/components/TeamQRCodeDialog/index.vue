<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="handleClose"
      :visible.sync="visible"
      width="1400px">
      <el-row>
        <el-col :span="24">
          <div>团住预订信息</div>
          <div class="line"/>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="table-no-line">
        <el-col :span="8">
          <el-table :show-header="false" :data="tableData">
            <el-table-column prop="dataName" min-width="100"/>
            <el-table-column prop="dataValue" min-width="200"/>
          </el-table>
        </el-col>
        <el-col :span="8">
          <el-table :show-header="false" :data="tableData2">
            <el-table-column prop="dataName" min-width="100"/>
            <el-table-column prop="dataValue" min-width="150"/>
          </el-table>
        </el-col>
        <el-col :span="8">
          <el-table :show-header="false" :data="tableData3">
            <el-table-column prop="dataName" min-width="100"/>
            <el-table-column prop="dataValue" min-width="150"/>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="line"/>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-button type="primary" size="small" @click="createQRCode">批量创建二维码</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" size="small" @click="printQRCode">批量打印</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table v-loading="listLoading" :data="roomList" height="300px" @selection-change="handleCheckinSelectionChange">
            <el-table-column
              type="selection"
              width="55"/>
            <el-table-column label="入住单号" prop="or_checkin_id" min-width="100" align="center"/>
            <el-table-column label="房间号" prop="ro_id" min-width="100" align="center"/>
            <el-table-column label="房间单价" prop="ro_price" min-width="100" align="center"/>
            <el-table-column label="可住人数" prop="ro_maxps" min-width="100" align="center"/>
            <el-table-column label="已排客单" prop="or_guest_count" min-width="100" align="center"/>
            <el-table-column label="已制二维码" prop="or_qrcode_count" min-width="100" align="center"/>
            <el-table-column label="已入住" prop="ci_tel" min-width="100" align="center"/>
            <el-table-column label="支付规则" prop="pay_rule" min-width="100" align="center"/>
            <el-table-column label="支付金额" prop="pay_amount" min-width="100" align="center"/>
            <el-table-column label="备注" prop="or_comments" min-width="100" align="center"/>
            <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="createQRCode(scope.row)">创建二维码</el-button>
                <el-button type="primary" size="mini" @click="printQRCodeDialog(scope.row)">打印</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="spiltDialogFormVisible"
      :before-close="handleCloseSpilt"
      title="创建二维码"
      width="400px">
      <el-form label-position="left" label-width="80px">
        <el-form-item label="支付规则">
          <el-select v-model="splitParams.code">
            <el-option
              v-for="item in splitOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <!--<el-form-item v-if="splitValue === 0" label="支付金额">-->
        <!--<el-input type="text"/>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseSpilt">取消</el-button>
        <el-button type="primary" @click="split">创建</el-button>
      </div>
    </el-dialog>
    <guest-q-r-code-dialog :visible.sync="printDialogFormVisible" :data="guestListParams"/>
  </div>
</template>

<script>
import { getRoomList, split, printQRCode } from '@/api/QRCode'
import GuestQRCodeDialog from '@/components/GuestQRCodeDialog'
export default {
  name: 'TeamQRCodeDialog',
  components: {
    GuestQRCodeDialog
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      listLoading: true,
      spiltDialogFormVisible: false,
      printDialogFormVisible: false,
      roomList: [],
      tableData: [{
        dataName: '预订人姓名',
        dataValue: ''
      }, {
        dataName: '团队订单号',
        dataValue: ''
      }, {
        dataName: '房间数',
        dataValue: ''
      }, {
        dataName: '预抵时间',
        dataValue: ''
      }],
      tableData2: [{
        dataName: '手机号',
        dataValue: ''
      }, {
        dataName: '已排客单',
        dataValue: ''
      }, {
        dataName: '预离时间',
        dataValue: ''
      }],
      tableData3: [{
        dataName: 'PMS订单号',
        dataValue: ''
      }, {
        dataName: '预住上限',
        dataValue: ''
      }, {
        dataName: '已入住',
        dataValue: ''
      }],
      splitOptions: [{
        value: 1,
        label: '合并支付'
      }, {
        value: 0,
        label: '分摊支付'
      }],
      qrCode: {
        groupId: null,
        pmsTypeId: '009'
      },
      splitParams: {
        or_checkin_id: [],
        code: 1,
        or_group_id: '',
        endtime: ''
      },
      printQRCodeParams: {
        terminalId: '',
        hotelId: '',
        groupId: '',
        qrCode: []
      },
      guestListParams: {
        or_checkin_id: '',
        or_group_id: ''
      },
      timestamp: null
    }
  },
  computed: {
    // messageData() {
    //   return this.$store.state.message.data
    // }
  },
  // 监听数据
  watch: {
    visible(val) {
      if (val === true) {
        this.init()
      }
    }
    // messageData: {
    //   handler(newVal, oldVal) {
    //     console.log(newVal)
    //     if (JSON.parse(newVal.attacheData).timestamp === this.timestamp + '') {
    //       this.getRoomList()
    //     }
    //   },
    //   deep: true
    // }
  },
  created() {
  },
  methods: {
    getRoomList() {
      getRoomList(this.or_group_id).then(response => {
        this.roomList = response.data
        this.listLoading = false
      })
    },
    init() {
      this.tableData[0].dataValue = this.data.or_name
      this.tableData[1].dataValue = this.data.or_group_id
      this.tableData[2].dataValue = this.data.ro_room_count
      this.tableData[3].dataValue = this.data.or_est_arr_time
      this.tableData2[0].dataValue = this.data.or_tel
      this.tableData2[1].dataValue = this.data.or_guest_all_count
      this.tableData2[2].dataValue = this.data.or_est_dep_time
      this.tableData3[0].dataValue = this.data.or_id
      this.tableData3[1].dataValue = this.data.ro_est_all_maxps
      this.tableData3[2].dataValue = this.data.or_guest_all_count
      this.splitParams.endtime = this.data.or_est_dep_time
      this.or_group_id = this.data.or_group_id
      this.qrCode.groupId = this.data.or_group_id
      this.roomList = []
      this.listLoading = true
      this.getRoomList()
    },
    split() {
      this.splitParams.or_group_id = this.qrCode.groupId
      split(this.splitParams).then(response => {
        this.splitParams.or_checkin_id = []
        this.getRoomList()
        this.spiltDialogFormVisible = false
        this.$message({
          message: '创建二维码成功',
          type: 'success'
        })
      })
    },
    createQRCode(row) {
      if (row.or_checkin_id) {
        this.splitParams.or_checkin_id = []
        this.splitParams.or_checkin_id.push(row.or_checkin_id)
        this.spiltDialogFormVisible = true
      } else {
        if (this.splitParams.or_checkin_id.length === 0) {
          this.$message.error('请选择最少一条数据')
        } else {
          this.spiltDialogFormVisible = true
        }
      }
    },
    printQRCodeDialog(row) {
      if (row.or_qrcode_count < 1) {
        this.$message.error('请先创建二维码')
      } else {
        this.guestListParams.or_group_id = this.qrCode.groupId
        this.guestListParams.or_checkin_id = row.or_checkin_id
        this.printDialogFormVisible = true
      }
    },
    handleCheckinSelectionChange(val) {
      this.splitParams.or_checkin_id = []
      this.printQRCodeParams.qrCode = []
      val.forEach(item => {
        this.splitParams.or_checkin_id.push(item.or_checkin_id)
        this.printQRCodeParams.qrCode = this.printQRCodeParams.qrCode.concat(item.qrCode)
      })
      console.log(this.printQRCodeParams)
    },
    printQRCode() {
      console.log(this.printQRCodeParams.qrCode)
      if (this.printQRCodeParams.qrCode.length === 0) {
        this.$message.error('请选择最少一条数据')
      } else {
        printQRCode(this.printQRCodeParams).then(response => {
          this.$message({
            message: '打印成功',
            type: 'success'
          })
        })
      }
    },
    handleCloseSpilt() {
      if (this.splitParams.or_checkin_id.length === 1) {
        this.splitParams.or_checkin_id = []
      }
      this.spiltDialogFormVisible = false
    },
    // 关闭窗口
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .line{
    height: 1px;
    border-top: 2px solid #ebeef5;
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
