<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input-->
      <!--v-model="listQuery.params.leader"-->
      <!--placeholder="领队姓名"-->
      <!--style="width: 150px;"-->
      <!--class="filter-item"-->
      <!--@keyup.enter.native="handleFilter"/>-->
      <el-input
        v-model="listQuery.params.or_name"
        placeholder="预订人姓名"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
      <el-input
        v-model="listQuery.params.or_tel"
        placeholder="预订人手机号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
      <el-input
        v-model="listQuery.params.groupId"
        placeholder="团队订单号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
    </div>
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="teamOrderDialogVisible = true">获取PMS团单</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getHotelGroupOrderList">搜索</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="groupOrderList"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="领队姓名" prop="leader" align="center" min-width="150"/>
      <el-table-column label="预订人姓名" prop="or_name" align="center" min-width="150"/>
      <el-table-column label="预订人手机号" prop="or_tel" align="center" min-width="150px"/>
      <el-table-column label="团队订单号" prop="or_group_id" align="center" min-width="120px"/>
      <el-table-column label="支付方式" prop="pay_rule" align="center" min-width="100px"/>
      <el-table-column label="PMS订单号" prop="ro_or_id" align="center" min-width="180"/>
      <el-table-column label="房间数" prop="ro_room_count" align="center" min-width="90"/>
      <el-table-column label="已排客单" prop="or_guest_count" align="center" min-width="100"/>
      <el-table-column label="预住上限人数" prop="ro_maxps" align="center" min-width="100"/>
      <el-table-column label="预抵时间" prop="or_est_arr_time" align="center" min-width="180"/>
      <el-table-column label="预离时间" prop="or_est_dep_time" align="center" min-width="180"/>
      <el-table-column
        label="操作"
        prop="or_name"
        align="center"
        width="350"
        class-name="small-padding fixed-width"
        fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="payDialog(scope.row)">选择支付方式</el-button>
          <el-button type="primary" size="mini" @click="chooseDialog(scope.row)">选择领队</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除团单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :limit.sync="listQuery.length" @pagination="getHotelGroupOrderList" />
    <el-dialog :visible.sync="payDialogFormVisible" :close-on-click-modal="false" :before-close="beforeClose" title="支付方式" width="450px" top="5vh">
      <el-select v-model="updatePayRuleParams.pay_rule" placeholder="请选择">
        <el-option v-for="item in payRuleOptions" :key="item.code" :label="item.name" :value="item.code"/>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">取消</el-button>
        <el-button type="primary" @click="updatePayRule">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="beforeClose" title="选择领队" width="450px" top="5vh">
      <el-input
        v-model="getLeaderInfoParams.phoneNo"
        placeholder="领队手机号码"
        style="width: 250px;margin-top: 20px"/>
      <el-button v-waves type="primary" icon="el-icon-search" style="margin-left: 30px" @click="getLeaderInfo">查询</el-button>
      <el-checkbox v-if="leader" v-model="checked" border style="margin-top: 30px">{{ leader.name }}</el-checkbox>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">取消</el-button>
        <el-button type="primary" @click="groupOrderToLeader">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="teamOrderDialogVisible" :close-on-click-modal="false" :before-close="teamOrderBeforeClose" title="任意填写一项条件获取PMS团单" width="500px" top="5vh">
      <el-form label-width="150px" class="common-form">
        <el-form-item label="预订人姓名">
          <el-input
            v-model="getTeamOrderInfoParams.name"
            style="width: 150px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item label="预订人手机号">
          <el-input
            v-model="getTeamOrderInfoParams.mobile"
            style="width: 150px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item label="团队订单号">
          <el-input
            v-model="getTeamOrderInfoParams.orderCode"
            style="width: 150px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="teamOrderBeforeClose">取消</el-button>
        <el-button type="primary" @click="getTeamOrderInfo">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import { getHotelGroupOrderList, getTeamOrderInfo, getLeaderInfo, groupOrderToLeader, deleteTeamInfo, updatePayRule } from '@/api/groupOrder'
import { getDic } from '@/api/dic'
import Pagination from '@/components/Pagination'
export default {
  directives: { waves },
  components: {
    Pagination
  },
  data() {
    return {
      num: 1,
      total: 0,
      listLoading: false,
      dialogFormVisible: false,
      deleteDialogVisible: false,
      teamOrderDialogVisible: false,
      payDialogFormVisible: false,
      dicParams: 'code_groupsettletype',
      payRuleOptions: [],
      listQuery: {
        start: 0,
        length: 10,
        params: {
          leader: null,
          groupId: null,
          or_name: null,
          or_tel: null,
          or_id: null
        }
      },
      groupOrderList: [],
      getTeamOrderInfoParams: {
        name: '',
        mobile: '',
        orderCode: '',
        timestamp: ''
      },
      getLeaderInfoParams: {
        phoneNo: ''
      },
      groupOrderToLeaderParams: {
        groupId: null,
        id: null,
        name: null
      },
      deleteParams: {
        groupId: null
      },
      updatePayRuleParams: {
        pk_group_id: null,
        pay_rule: null
      },
      leader: null,
      groupOrder: null,
      checked: false,
      timestamp: null
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
        if (newVal.tag === this.timestamp + '') {
          this.teamOrderDialogVisible = false
          this.getHotelGroupOrderList()
        }
      },
      deep: true
    }
  },
  created() {
    this.getHotelGroupOrderList()
    this.getDic()
  },
  methods: {
    handleFilter() {
      this.getHotelGroupOrderList()
    },
    getDic() {
      getDic(this.dicParams).then(res => {
        this.payRuleOptions = res.data
      })
    },
    getHotelGroupOrderList() {
      this.listLoading = true
      this.groupOrderList = []
      getHotelGroupOrderList(this.listQuery).then(res => {
        this.total = res.recordsTotal
        this.groupOrderList = res.data
        this.listLoading = false
      }).catch(() => {
        this.groupOrderList = []
        this.listLoading = false
      })
    },
    getTeamOrderInfo() {
      this.timestamp = new Date().getTime()
      this.getTeamOrderInfoParams.timestamp = this.timestamp
      getTeamOrderInfo(this.getTeamOrderInfoParams).then(res => {
      })
    },
    chooseDialog(row) {
      this.dialogFormVisible = true
      this.groupOrder = row
    },
    getLeaderInfo() {
      getLeaderInfo(this.getLeaderInfoParams).then(res => {
        this.leader = res.data
      })
    },
    groupOrderToLeader() {
      if (this.checked) {
        this.groupOrderToLeaderParams.groupId = this.groupOrder.or_group_id
        this.groupOrderToLeaderParams.id = this.leader.id
        this.groupOrderToLeaderParams.name = this.leader.name
        groupOrderToLeader(this.groupOrderToLeaderParams).then(res => {
          this.$message({
            message: '选择领队成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.checked = false
          this.leader = null
          this.getHotelGroupOrderList()
        })
      } else {
        this.$message.error('请选择领队')
      }
    },
    beforeClose() {
      this.leader = null
      this.getLeaderInfoParams.phoneNo = ''
      this.dialogFormVisible = false
      this.payDialogFormVisible = false
    },
    handleDelete(row) {
      this.deleteParams.groupId = row.or_group_id
      this.$confirm('确认删除该团单吗？', '删除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTeamInfo(this.deleteParams).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getHotelGroupOrderList()
        })
      }).catch(() => {

      })
    },
    teamOrderBeforeClose() {
      this.getTeamOrderInfoParams = {
        name: '',
        mobile: '',
        orderCode: ''
      }
      this.teamOrderDialogVisible = false
    },
    payDialog(row) {
      this.payDialogFormVisible = true
      this.updatePayRuleParams.pk_group_id = row.pk_group_id
      this.payRuleOptions.filter(item => {
        if (item.name === row.pay_rule) {
          this.updatePayRuleParams.pay_rule = item.code
        }
      })
    },
    updatePayRule() {
      updatePayRule(this.updatePayRuleParams).then(res => {
        this.$message({
          message: '选择支付方式成功',
          type: 'success'
        })
        this.payDialogFormVisible = false
        this.getHotelGroupOrderList()
      })
    }
  }
}
</script>
