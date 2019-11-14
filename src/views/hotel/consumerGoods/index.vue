<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.params.con_seriesnum_id" placeholder="条形码" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.con_name" placeholder="消费品名称" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.con_price" placeholder="消费品价格(元)" clearable style="width: 150px;" class="filter-item" @keyup.native="provingPrice" />
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="创建开始时间"
        end-placeholder="创建结束时间"
        class="filter-item"
        style="width: auto"
        value-format="yyyy-MM-dd"
        @change="conGoodsTimeRange"/>
      <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="addConGoods">添加</el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
      </div>
    </div>

    <!--消费品表格数据显示-->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="条形码" prop="id" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.con_seriesnum_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消费品名称" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.con_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消费品价格(元)" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.con_price | rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.c_user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.c_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.m_user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.m_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteConfirm(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :limit.sync="listQuery.length" @pagination="getList" />

    <!--添加消费品弹出框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="conGoodsDialogFormVisible" width="30%" top="5vh">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" class="common-form">
        <el-form-item label="条形码" prop="con_seriesnum_id">
          <el-input :disabled="dialogStatus==='update'" v-model="temp.con_seriesnum_id" type="text" placeholder="请输入消费品条形码" />
        </el-form-item>
        <el-form-item label="消费品名称" prop="con_name">
          <el-input v-model="temp.con_name" type="text" placeholder="请输入消费品名称" />
        </el-form-item>
        <el-form-item label="消费品价格(元)" prop="con_price" label-width="120px">
          <el-input v-model="temp.con_price" type="text" placeholder="请输入消费品价格" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="conGoodsDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?saveData():updateData()">确认</el-button>
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
    rounding(value) {
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
      listQuery: {
        start: 0,
        length: 10,
        params: {
          con_seriesnum_id: undefined,
          con_name: undefined,
          con_price: undefined,
          c_time: undefined,
          m_time: undefined
        }
      },
      temp: {},
      conGoodsDialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改消费品',
        create: '添加消费品'
      },
      premData: [],
      replace: '',
      updatePremData: {
        roles: [],
        uid: ''
      },
      rules: {
        con_seriesnum_id: [
          { required: true, message: '请输入商品条形码', trigger: 'blur' },
          { min: 0, max: 50, message: '输入商品条形码的长度不能大于50', trigger: 'blur' }
        ],
        con_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 0, max: 20, message: '输入商品名称长度的不能大于20', trigger: 'blur' }
        ],
        con_price: [
          { required: true, message: '请输入商品的价格', trigger: 'blur' },
          { min: 0, max: 8, message: '输入价格限制在0-6位数以内', trigger: 'blur' },
          { pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/, message: '所输入的价格不正确', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    //  验证只能输入价格
    provingPrice() {
      // 如果输入非数字，则替换为''
      this.listQuery.params.con_price = this.listQuery.params.con_price.replace(/[^\d\.]/g, '')
      // 必须保证第一个为数字而不是.
      this.listQuery.params.con_price = this.listQuery.params.con_price.replace(/^\./g, '')
      // 保证只有出现一个.而没有多个.
      this.listQuery.params.con_price = this.listQuery.params.con_price.replace(/\.{2,}/g, '.')
      // 保证.只出现一次，而不能出现两次以上
      this.listQuery.params.con_price = this.listQuery.params.con_price.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      // 只能输入两位小数
      this.listQuery.params.con_price = this.listQuery.params.con_price.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    },
    // 获取消费品列表
    getList() {
      this.listLoading = true
      getConsumergoodsList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.recordsTotal
        this.listLoading = false
      })
    },
    handleRefresh() {
      this.listQuery.params = {}
      this.dateRange = ''
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
    addConGoods() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.conGoodsDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 添加消费品
    saveData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addConsumergoods(this.temp).then(() => {
            this.conGoodsDialogFormVisible = false
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
    // 通过消费品序列号获取消费品
    handleUpdate(row) {
      getConsumergoodsInfo(row.con_seriesnum_id).then((res) => {
        this.temp = res.data
        this.dialogStatus = 'update'
        this.conGoodsDialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    // 修改消费品
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateConsumergoods(this.temp).then(() => {
            this.conGoodsDialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    // 删除消费品
    handleDelete(row) {
      delConsumergoods(row.con_seriesnum_id).then(() => {
        this.conGoodsDialogFormVisible = false
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
    conGoodsTimeRange(filterVal) {
      if (filterVal) {
        this.listQuery.params.c_time = JSON.stringify(filterVal)
          .replace(/\[|\]|\"/g, '')
          .replace(',', ' - ')
      } else {
        this.listQuery.params.c_time = undefined
      }
    }
  }
}
</script>
