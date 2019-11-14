<template>
  <div>
    <!-- 添加退款信息弹窗 -->
    <el-dialog
      :before-close="handleClose"
      :close-on-click-modal="false"
      :visible.sync="refundDialogFormVisible"
      title="退款信息"
      width="600px">
      <el-form ref="temp" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 500px;">
        <el-form-item label="入住时间">
          <el-input :disabled="true" v-model="temp.or_act_arr_time" type="text" />
        </el-form-item>
        <el-form-item label="房间号">
          <el-input :disabled="true" v-model="temp.ro_id" type="text" />
        </el-form-item>
        <el-form-item label="预付金额">
          <el-input :disabled="true" v-model="temp.bill_prepay" type="text" />
        </el-form-item>
        <el-form-item label="押金">
          <el-input :disabled="true" v-model="temp.bill_deposit" type="text" />
        </el-form-item>
        <el-form-item label="房费总额">
          <el-input :disabled="true" v-model="temp.totalPrice" type="text" />
        </el-form-item>
        <el-form-item label="入住人">
          <el-input :disabled="true" v-model="temp.or_ci_name" type="text" />
        </el-form-item>
        <el-form-item label="退款金额" prop="bill_refundable_amount">
          <el-input v-model="temp.bill_refundable_amount" placeholder="请输入退款金额" type="text" />
        </el-form-item>
        <!--<el-form-item label="消费金额" prop="bill_all_con_money">-->
        <!--<el-input v-model="temp.bill_all_con_money" placeholder="请输入消费金额" type="text" />-->
        <!--</el-form-item>-->
        <el-form-item label="备注">
          <el-input v-model="temp.comments" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取消</el-button>
        <el-button type="primary" @click="refundConfirm('temp')">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  refund
} from '@/api/refund'
export default {
  name: 'RefundModify',
  props: {
    refundDialogFormVisible: {
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
    var checkBacMoney = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写消费金额'))
      }

      if (!/^[0-9]+.?[0-9]*$/.test(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (this.temp.bill_deposit < Number(value)) {
          callback(new Error('消费金额不能大于押金'))
        } else {
          callback()
        }
      }
    }
    var refundMoney = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写退款金额'))
      }

      if (!/^[0-9]+.?[0-9]*$/.test(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (this.temp.bill_prepay < Number(value)) {
          callback(new Error('退款金额不能大于预付金额'))
        } else {
          callback()
        }
      }
    }
    return {
      loading: '',
      timestamp: '',
      temp: {
        bill_all_con_money: NaN,
        bill_refundable_amount: NaN,
        bill_deposit: '',
        comments: ''
      },
      modifyParams: {},
      rules: {
        bill_all_con_money: [{
          required: true,
          validator: checkBacMoney,
          trigger: 'change'
        }],
        bill_refundable_amount: [{
          required: true,
          validator: refundMoney,
          trigger: 'change'
        }]
      }
    }
  },
  computed: {
    messageData() {
      return this.$store.state.message.data
    }
  },
  // 监听数据
  watch: {
    // datas发生改变的时候去调用初始化方法
    refundDialogFormVisible(value) {
      if (value === true) {
        this.temp.or_act_arr_time = this.datas.or_act_arr_time
        this.temp.ro_id = this.datas.ro_id
        this.temp.bill_deposit = this.datas.bill_deposit
        this.temp.or_ci_name = this.datas.or_ci_name
        this.temp.bill_prepay = this.datas.bill_prepay
        this.temp.comments = ''
        this.temp.totalPrice = this.datas.totalPrice
        this.temp.bill_all_con_money = ''
        this.temp.bill_refundable_amount = ''
      }
    },
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
          console.log('1')
          this.handleClose()
          // 刷新订单页面
          this.$parent.getList()
          this.loading.close()
        }
      },
      deep: true
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:refundDialogFormVisible', false)
    },
    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: '正在退款中，请稍后，如等待时间过长请刷新页面后重试。',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    refundUpdate() {
      this.timestamp = new Date().getTime()
      this.modifyParams.hi_id = this.datas.hi_id
      this.modifyParams.or_checkin_id = this.datas.or_checkin_id
      this.modifyParams.ti_id = this.datas.ti_id
      this.modifyParams.price = this.temp.bill_refundable_amount
      this.modifyParams.comment = this.temp.comments
      this.modifyParams.timestamp = this.timestamp
      refund(this.modifyParams).then(() => {
        this.handleClose()
      })
    },
    open() {
      const h = this.$createElement
      this.$msgbox({
        title: '退款提醒',
        message: h('p', null, [
          h('span', null, '将退款 '),
          h('span', {
            style: 'color: red'
          }, this.temp.bill_refundable_amount),
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
        this.openFullScreen()
        this.refundUpdate()
      })
    },
    refundConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.open()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
