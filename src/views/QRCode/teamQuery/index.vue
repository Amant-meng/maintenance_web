<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.params.or_name" placeholder="预订人姓名" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.or_tel" placeholder="预订人手机号" clearable style="width: 150px;" class="filter-item" @keyup.native="phoneNumProving"/>
      <el-input v-model="listQuery.params.or_group_id" placeholder="团队订单号" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.or_id" placeholder="PMS订单号" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="预抵时间"
        end-placeholder="结束时间"
        class="filter-item"
        style="width: auto"
        value-format="yyyy-MM-dd"
        @change="formatTimeRange"/>
      <el-date-picker
        v-model="checkoutdateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="预离时间"
        end-placeholder="结束时间"
        class="filter-item"
        style="width: auto"
        value-format="yyyy-MM-dd"
        @change="checkoutformatDateRange"/>
      <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
      </div>
    </div>
    <!--表格数据显示-->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="预订人姓名" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.or_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.or_tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="团队订单号" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.or_group_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="PMS订单号" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.or_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房间数" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.ro_room_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已排客单" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.or_guest_all_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预住上限人数" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.ro_est_all_maxps }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已住人数" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.or_checkin_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预抵时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.or_act_arr_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预离时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.or_est_dep_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="teamGroupOrderDetails(scope.row)">详情</el-button>
          <el-button type="danger" size="mini" @click="deleteConfirm(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页组件-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :limit.sync="listQuery.length" @pagination="getList" />
    <!--团住二维码详情组件-->
    <team-q-r-code-dialog :visible.sync="teamQRCodeDialogVisible" :data="teamQueryData"/>

  </div>
</template>

<script>
import { getOrderGroupList, delOrderGroup } from '@/api/ordergroup'
import { getDicMore } from '@/api/dic'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import TeamQRCodeDialog from '@/components/TeamQRCodeDialog'
export default {
  name: 'TeamQuery',
  components: { Pagination, TeamQRCodeDialog },
  directives: { waves },
  filters: {
    // 价格补零显示方法
    paddingZero(value) {
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
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      dateRange: undefined,
      checkoutdateRange: undefined,
      pkwid: '',
      showOrderDialogFormVisible: false,
      teamQRCodeDialogVisible: false,
      teamQueryData: {},
      listQuery: {
        start: 0,
        length: 10,
        params: {
          or_name: undefined,
          or_tel: undefined,
          or_group_id: undefined,
          or_id: undefined,
          or_act_arr_time: undefined,
          or_act_dep_time: undefined
        }
      },
      dicParams: 'code_checkinmode,code_if,code_checkinstatus',
      dicParamsData: [],
      orstatusParamsData: [],
      checkinWayData: [],
      ispayData: []
    }
  },
  created() {
    this.getDic()
    this.getList()
  },
  methods: {

    // 查看团住二维码详情
    teamGroupOrderDetails(row) {
      this.teamQueryData = row
      this.teamQRCodeDialogVisible = true
    },
    // 删除团单
    handleDelete(row) {
      delOrderGroup(row.or_group_id).then(() => {
        this.teamQRCodeDialogVisible = false
        this.getList()
      })
    },
    deleteConfirm(row) {
      this.$confirm('确认删除团单吗？', '删除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(row)
      })
    },
    // 手机号验证
    phoneNumProving() {
      this.listQuery.params.or_tel = this.listQuery.params.or_tel.replace(/[^\.\d]/g, '')
      this.listQuery.params.or_tel = this.listQuery.params.or_tel.replace('.', '')
    },
    // 获取字典表所有数据
    getDic() {
      getDicMore(this.dicParams).then(response => {
        this.dicParamsData = response.data
        this.orstatusParamsData = this.dicParamsData.code_checkinstatus
        this.checkinWayData = this.dicParamsData.code_checkinmode
        this.ispayData = this.dicParamsData.code_if
      })
    },
    // 获取团住二维码列表
    getList() {
      this.listLoading = true
      getOrderGroupList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.recordsTotal
        this.listLoading = false
      })
    },
    // 入住方式数据显示
    checkinWay(row, column) {
      for (let i = 0; i < this.checkinWayData.length; i++) {
        if (this.checkinWayData[i].code === row.or_mode) {
          return this.checkinWayData[i].name
        }
      }
    },
    // 刷新操作
    handleRefresh() {
      this.listQuery.params = {}
      this.dateRange = ''
      this.checkoutdateRange = ''
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 格式化时间
    formatTimeRange(filterVal) {
      if (filterVal) {
        this.listQuery.params.or_act_arr_time = JSON.stringify(filterVal)
          .replace(/\[|\]|\"/g, '')
          .replace(',', ' - ')
      } else {
        this.listQuery.params.or_act_arr_time = undefined
      }
    },
    // 格式化时间
    checkoutformatDateRange(filterVal) {
      if (filterVal) {
        this.listQuery.params.or_act_dep_time = JSON.stringify(filterVal)
          .replace(/\[|\]|\"/g, '')
          .replace(',', ' - ')
      } else {
        this.listQuery.params.or_act_dep_time = undefined
      }
    }
  }
}
</script>
