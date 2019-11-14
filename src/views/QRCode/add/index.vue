<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="qrCode.or_name"
        placeholder="预订人姓名"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
      <el-input
        v-model="qrCode.or_tel"
        placeholder="预订人手机号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
      <el-input
        v-model="qrCode.groupId"
        placeholder="团队订单号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
    </div>
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getTeamList">查询</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="teamList"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="预订人姓名" prop="or_name" align="center" min-width="150"/>
      <el-table-column label="手机号" prop="or_tel" align="center" min-width="150px"/>
      <el-table-column label="团队订单号" prop="or_group_id" align="center" min-width="100px"/>
      <el-table-column label="PMS订单号" prop="or_id" align="center" min-width="95"/>
      <el-table-column label="房间数" prop="ro_room_count" align="center" min-width="180"/>
      <el-table-column label="已排客单" prop="or_guest_all_count" align="center" min-width="180"/>
      <el-table-column label="预住上限人数" prop="ro_est_all_maxps" align="center" min-width="180"/>
      <el-table-column label="预抵时间" prop="or_est_arr_time" align="center" min-width="180"/>
      <el-table-column label="预离时间" prop="or_est_dep_time" align="center" min-width="180"/>
      <el-table-column
        label="操作"
        prop="or_name"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
        fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="payDialog(scope.row)">创建二维码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="payDialogFormVisible" :close-on-click-modal="false" title="支付方式" width="550px" top="5vh">
      <el-select v-model="saveInfoParams.settle_type">
        <el-option
          v-for="item in payOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="payDialogFormVisible === false">取消</el-button>
        <el-button type="primary" @click="QRCodeDialog">确定</el-button>
      </div>
    </el-dialog>
    <team-q-r-code-dialog :visible.sync="teamQRCodeDialogVisible" :data="teamQRCodeData"/>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import { getTeamList, saveInfo } from '@/api/QRCode'
import TeamQRCodeDialog from '@/components/TeamQRCodeDialog'

export default {
  directives: { waves },
  components: {
    TeamQRCodeDialog
  },
  data() {
    return {
      num: 1,
      total: 0,
      teamQRCodeData: {},
      listLoading: false,
      listLoading2: false,
      listLoading3: false,
      or_group_id: null,
      timestamp: null,
      response: null,
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
      guestListParams: {
        or_checkin_id: '',
        or_group_id: ''
      },
      resetQRCodeParams: {
        or_guest_id: '',
        qr_code_id: ''
      },
      printQRCodeParams: {
        terminalId: '',
        hotelId: '',
        groupId: '',
        qrCode: []
      },
      saveInfoParams: {
        response: null,
        settle_type: '0'
      },
      teamList: [],
      roomList: [],
      guestList: [],
      teamQRCodeDialogVisible: false,
      spiltDialogFormVisible: false,
      printDialogFormVisible: false,
      payDialogFormVisible: false,
      payOptions: [{
        value: 0,
        label: '团队支付'
      }, {
        value: 1,
        label: '个人支付'
      }],
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
      }]
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
        if (JSON.parse(newVal.attacheData).timestamp === this.timestamp + '') {
          this.response = newVal.response
          this.teamList.push(Object.assign(JSON.parse(newVal.groupInfo), JSON.parse(newVal.maxLive)))
          this.listLoading = false
        }
      },
      deep: true
    }
  },
  created() {
    // this.getTeamList()
  },
  methods: {
    handleFilter() {
      this.getTeamList()
    },
    getTeamList() {
      this.listLoading = true
      this.teamList = []
      this.timestamp = new Date().getTime()
      if (this.$store.state.user.localVersion) {
        getTeamList(this.qrCode, this.timestamp).then(response => {
        })
      } else {
        getTeamList(this.qrCode, this.timestamp).then(response => {
          this.response = response.data.response
          const list = Object.assign(JSON.parse(response.data.groupInfo), JSON.parse(response.data.maxLive))
          this.teamList.push(list)
          console.log(this.teamList)
          this.listLoading = false
        }).catch(() => {
          this.teamList = []
          this.listLoading = false
        })
      }
    },
    payDialog(row) {
      this.payDialogFormVisible = true
      this.teamQRCodeData = row
    },
    QRCodeDialog() {
      this.saveInfoParams.response = this.response
      saveInfo(this.saveInfoParams).then(response => {
        this.teamQRCodeDialogVisible = true
      })
    }
  }
}
</script>
