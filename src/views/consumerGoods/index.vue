<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.params.pk_consumer_id" placeholder="消费品系列号" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.con_name" placeholder="消费品名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.con_price" placeholder="消费品价格" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="消费品系列号" prop="id" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.pk_consumer_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消费品名称" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.con_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消费品价格" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.con_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.c_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.m_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteConfirm(scope.row)">删除</el-button>
          <el-button type="danger" size="mini" @click="handleUpdate(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start+1" :limit.sync="listQuery.length" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="userDialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="消费品名称" prop="con_name">
          <el-input v-model="temp.con_name" type="text" placeholder="请输入消费品名称"/>
        </el-form-item>
        <el-form-item label="消费品价格" prop="con_price">
          <el-input v-model="temp.con_price" type="text" placeholder="请输入消费品价格"/>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getConsumergoodsList, getConsumergoodsInfo, addConsumergoods, updateConsumergoods, delConsumergoods } from '@/api/consumergoods'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ConsumerGoods',
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
          pk_consumer_id: undefined,
          con_name: undefined,
          con_price: undefined,
          c_time: undefined,
          m_time: undefined
        }
      },

      temp: {
        pk_consumer_id: '',
        con_name: '',
        con_price: ''
      },
      userDialogFormVisible: false,
      premDialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改消费品',
        create: '添加消费品'
      },
      premData: [],
      updatePremData: {
        roles: [],
        uid: ''
      },
      rules: {
        con_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 0, max: 50, message: '请输入请输入商品名称', trigger: 'blur' }
        ],
        con_price: [
          { required: true, message: '请输入商品的价格', trigger: 'blur' },
          { min: 1, max: 10, message: '请输入商品的价格', trigger: 'blur' },
          { pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/, message: '所输入的价格不正确', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getConsumergoodsList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.recordsTotal
        this.listLoading = false
        console.log(this.list)
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.userDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addConsumergoods(this.temp).then(() => {
            this.userDialogFormVisible = false
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
    handleUpdate(row) {
      getConsumergoodsInfo(row.pk_consumer_id).then((res) => {
        this.temp = res.data
        console.log(this.temp)
        this.dialogStatus = 'update'
        this.userDialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateConsumergoods(this.temp).then(() => {
            this.userDialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleDelete(row) {
      delConsumergoods(row.pk_consumer_id).then(() => {
        this.userDialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    deleteConfirm(row) {
      this.$confirm('确认删除' + row.con_name + '消费品吗？', '删除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(row)
      })
    },
    formatTimeRange(filterVal) {
    }
  }
}
</script>
