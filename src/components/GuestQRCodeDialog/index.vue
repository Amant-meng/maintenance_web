<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="handleClose"
    :visible.sync="visible"
    title="打印二维码"
    width="1200px">
    <el-table v-loading="listLoading" :data="guestList" @selection-change="handleGuestSelectionChange">
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column label="客单号" prop="or_guest_id" min-width="100" align="center"/>
      <el-table-column label="入住人姓名" prop="or_name" min-width="100" align="center"/>
      <el-table-column label="联系电话" prop="or_tel" min-width="100" align="center"/>
      <el-table-column label="是否使用" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.or_isuse === '0' ? '未使用' : '已使用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="二维码标识" prop="qr_code_id" min-width="200" align="center"/>
      <el-table-column label="支付规则" prop="pay_rule" min-width="100" align="center"/>
      <el-table-column label="支付金额" min-width="150" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.pay_amount" type="number" step="1"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="resetQRCode(scope.row)">重置二维码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="printQRCode">打印</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getGuestList, resetQRCode, printQRCode } from '@/api/QRCode'
export default {
  name: 'GuestQRCodeDialog',
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
      guestList: [],
      printQRCodeParams: {
        terminalId: '',
        hotelId: '',
        groupId: '',
        qrCode: []
      },
      resetQRCodeParams: {
        price: '',
        or_guest_id: '',
        qr_code_id: ''
      }
    }
  },
  computed: {},
  // 监听数据
  watch: {
    visible(val) {
      if (val === true) {
        this.init()
      }
    }
  },
  created() {
  },
  methods: {
    init() {
      this.listLoading = true
      getGuestList(this.data).then(response => {
        this.guestList = response.data
        this.listLoading = false
      })
    },
    handleGuestSelectionChange(val) {
      this.printQRCodeParams.qrCode = []
      val.forEach(item => {
        this.printQRCodeParams.qrCode.push(item.qr_code_id)
      })
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
    resetQRCode(row) {
      this.resetQRCodeParams.price = row.pay_amount
      this.resetQRCodeParams.qr_code_id = row.qr_code_id
      this.resetQRCodeParams.or_guest_id = row.or_guest_id
      resetQRCode(this.resetQRCodeParams).then(response => {
        this.$message({
          message: '重置二维码成功',
          type: 'success'
        })
        this.init()
      })
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
