<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.params.uid" placeholder="用户ID" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.uname" placeholder="姓名" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.operation" placeholder="操作" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.method" placeholder="方法" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.params" placeholder="参数" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.ip" placeholder="IP" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.taketime" placeholder="耗时(s)" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="创建开始时间"
        end-placeholder="创建结束时间"
        class="filter-item"
        style="width: auto"
        value-format="yyyy-MM-dd"
        @keyup.enter.native="handleFilter"
        @change="formatTimeRange"/>
      <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
      </div>
    </div>

    <!--table数据展示-->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="用户ID" prop="id" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.uid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.uname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.operation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="方法" align="center" min-width="210px">
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参数" align="center" min-width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.params }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" align="center" min-width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="耗时" align="center" min-width="75">
        <template slot-scope="scope">
          <span>{{ scope.row.taketime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" class-name="status-col" align="center" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :limit.sync="listQuery.length" @pagination="getList" />
    <!--详情数据-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="syslogDialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户ID" prop="username">
          <el-input :disabled="dialogStatus==='update'" v-model="temp.uid" type="text" />
        </el-form-item>
        <el-form-item label="姓名" prop="truename">
          <el-input v-model="temp.uname" type="text" />
        </el-form-item>
        <el-form-item label="操作" prop="phone">
          <el-input v-model="temp.operation"/>
        </el-form-item>
        <el-form-item label="方法" prop="phone">
          <el-input v-model="temp.method"/>
        </el-form-item>
        <el-form-item label="参数" prop="phone">
          <el-input v-model="temp.params"/>
        </el-form-item>
        <el-form-item label="IP" prop="phone">
          <el-input v-model="temp.ip"/>
        </el-form-item>
        <el-form-item label="耗时" prop="phone">
          <el-input v-model="temp.taketime"/>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { getSysLogList, getSysLogInfo } from '@/api/log'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'SysLog',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        是: 'success',
        否: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      dateRange: undefined,
      listQuery: {
        start: 0,
        length: 10,
        params: {
          username: undefined,
          createuser_name: undefined,
          gender: undefined,
          createtime: undefined,
          phone: undefined,
          truename: undefined,
          enabled: undefined,
          modifytime: undefined,
          issystem: undefined
        }
      },
      temp: {
        uid: '',
        uname: '',
        operation: '',
        method: '',
        params: '',
        ip: '',
        taketime: '',
        issystem: ''

      },
      syslogDialogFormVisible: false,
      dialogStatus: '',
      textMap: {
      },
      premData: [],
      updatePremData: {
        roles: [],
        uid: ''
      },
      rules: {
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSysLogList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.recordsTotal
        this.listLoading = false
      })
    },
    handleRefresh() {
      this.listQuery.params = {}
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
      }
    },

    handleUpdate(row) {
      getSysLogInfo(row.id).then((res) => {
        this.temp = res.data
        this.dialogStatus = 'update'
        this.syslogDialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },

    formatTimeRange(filterVal) {
      if (filterVal) {
        this.listQuery.params.createtime = JSON.stringify(filterVal)
          .replace(/\[|\]|\"/g, '')
          .replace(',', ' - ')
      } else {
        this.listQuery.params.createtime = undefined
      }
    }
  }
}
</script>
