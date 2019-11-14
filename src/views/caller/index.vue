<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.params.visitor_name" placeholder="被访人姓名" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.visitor_ro_id" placeholder="被访房间号" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.ci_name" placeholder="访客姓名" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.params.ci_sex" placeholder="访客性别" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in genderTypeParamsData" :key="item.code" :label="item.name" :value="item.code"/>
      </el-select>
      <el-input v-model="listQuery.params.ci_tel" placeholder="访客电话" clearable style="width: 150px;" class="filter-item" @keyup.native="phoneNumRules"/>
      <el-input v-model="listQuery.params.ci_race" placeholder="访客民族" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        v-model="birthRange"
        type="date"
        class="filter-item"
        style="width: auto"
        placeholder="访客出生日期"
        value-format="yyyy-MM-dd"
        @change="formatBirthRange"/>
      <el-input v-model="listQuery.params.ci_idcard" placeholder="访客证件号码" clearable style="width: 180px;" class="filter-item" @keyup.native="icardRules"/>
      <el-input v-model="listQuery.params.ci_address" placeholder="访客详细地址" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="创建时间"
        end-placeholder="结束时间"
        class="filter-item"
        style="width: auto"
        value-format="yyyy-MM-dd"
        @change="formatTimeRange"/>
      <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
      </div>
    </div>

    <!--页面表格数据展示-->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="被访人姓名" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.visitor_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被访房间号" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.visitor_ro_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访客姓名" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.ci_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访客性别" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.ci_sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访客电话" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ci_tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访客民族" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.ci_race }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访客证件号码" align="center" min-width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.ci_idcard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访客出生年月" align="center" min-width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.ci_birthday }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访客详细地址" align="center" min-width="500px">
        <template slot-scope="scope">
          <span>{{ scope.row.ci_address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.c_user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" class-name="status-col" align="center" min-width="180px" prop="c_time" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.c_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.m_user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" class-name="status-col" align="center" min-width="180px" prop="m_time" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.m_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteConfirm(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :limit.sync="listQuery.length" @pagination="getList" />

    <!--添加访客弹出框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="callerDialogFormVisible" width="30%" top="5vh">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" class="common-form">
        <el-form-item label="被访人姓名" prop="visitor_name">
          <el-input v-model="temp.visitor_name" type="text" placeholder="请输入被访人姓名" style="width: 280px;"/>
        </el-form-item>
        <el-form-item label="被访房间号" prop="visitor_ro_id">
          <el-input v-model="temp.visitor_ro_id" type="text" placeholder="请输入被访房间号" style="width: 280px;"/>
        </el-form-item>
        <el-form-item label="访客姓名" prop="ci_name">
          <el-input v-model="temp.ci_name" type="text" placeholder="请输入访客姓名" style="width: 280px;"/>
        </el-form-item>
        <el-form-item label="访客性别" prop="ci_sex">
          <el-select v-model="temp.ci_sex" class="filter-item" placeholder="请选择" style="width: 280px;">
            <el-option v-for="item in genderTypeParamsData" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="访客电话" prop="ci_tel">
          <el-input v-model="temp.ci_tel" type="text" placeholder="请输入访客电话" style="width: 280px;"/>
        </el-form-item>
        <el-form-item label="访客民族" prop="ci_race">
          <el-input v-model="temp.ci_race" type="text" placeholder="请输入访客民族" style="width: 280px;"/>
        </el-form-item>
        <el-form-item label="访客证件号码" label-width="120px" prop="ci_idcard">
          <el-input v-model="temp.ci_idcard" type="text" placeholder="请输入访客证件号码" style="width: 280px;margin-left: -18px"/>
        </el-form-item>
        <el-form-item label="访客出生日期" prop="or_est_arr_time">
          <el-date-picker
            v-model="temp.ci_birthday"
            type="date"
            placeholder="选择日期时间"
            style="width: 280px;"
            value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item label="访客详细地址" prop="ci_address">
          <el-input v-model="temp.ci_address" :rows="5" type="textarea" placeholder="请输入访客详细地址" style="width: 280px;"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="callerDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createCaller():updateData()">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getCallerInfoList, getCallerInfoById, addCaller, updateCaller, delCaller } from '@/api/caller'
import { getDicMore } from '@/api/dic'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Caller',
  components: { Pagination },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      birthRange: undefined,
      dateRange: undefined,
      listQuery: {
        start: 0,
        length: 10,
        params: {
          visitor_name: undefined,
          visitor_ro_id: undefined,
          ci_name: undefined,
          ci_sex: undefined,
          ci_race: undefined,
          ci_birthday: undefined,
          ci_tel: undefined,
          ci_address: undefined,
          ci_idcard: undefined
        }
      },
      temp: {
        visitor_name: '',
        visitor_ro_id: '',
        ci_name: '',
        ci_sex: '',
        ci_race: '',
        ci_birthday: '',
        ci_tel: '',
        ci_address: '',
        ci_idcard: ''
      },
      callerDialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改访客',
        create: '添加访客'
      },
      genderTypeParamsData: [],
      dicParamsData: [],
      dicParams: 'code_gender',
      rules: {
        ci_name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '请输入请输入商品名称', trigger: 'blur' },
          { pattern: /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/, message: '所输入的姓名不正确', trigger: 'blur' }
        ],
        ci_tel: [
          { required: true, message: '请输入11位手机号码', trigger: 'change' },
          { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' }
        ],
        ci_idcard: [
          { required: true, message: '请输入18位身份证号码', trigger: 'change' },
          { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号', trigger: 'blur' },
          { min: 18, max: 18, message: '请输入18位身份证号码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDic()
  },
  methods: {
    // 访客手机号验证
    phoneNumRules() {
      this.listQuery.params.ci_tel = this.listQuery.params.ci_tel.replace(/[^\.\d]/g, '')
      this.listQuery.params.ci_tel = this.listQuery.params.ci_tel.replace('.', '')
    },
    // 访客身份证验证
    icardRules() {
      this.listQuery.params.ci_idcard = this.listQuery.params.ci_idcard.replace(/[^\.\d]/g, '')
      this.listQuery.params.ci_idcard = this.listQuery.params.ci_idcard.replace('.', '')
    },
    // 获取字典表所有数据
    getDic() {
      getDicMore(this.dicParams).then(response => {
        this.dicParamsData = response.data
        this.genderTypeParamsData = this.dicParamsData.code_gender
      })
    },
    // 从字典表获取性别展示在表格
    sexTypeOptions(row, column) {
      for (let i = 0; i < this.genderTypeParamsData.length; i++) {
        if (this.genderTypeParamsData[i].code === row.ci_sex) {
          return this.genderTypeParamsData[i].name
        }
      }
    },
    // 获取访客列表
    getList() {
      this.listLoading = true
      getCallerInfoList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.recordsTotal
        this.listLoading = false
        console.log(this.list)
      })
    },
    handleRefresh() {
      this.dateRange = ''
      this.birthRange = ''
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
      this.callerDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 添加访客
    createCaller() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addCaller(this.temp).then(() => {
            this.callerDialogFormVisible = false
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
    // 根据姓名获取访客信息
    handleUpdate(row) {
      getCallerInfoById(row.pk_id).then((res) => {
        this.temp = res.data
        this.dialogStatus = 'update'
        this.callerDialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    // 修改访客
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateCaller(this.temp).then(() => {
            this.callerDialogFormVisible = false
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
    // 删除访客
    handleDelete(row) {
      delCaller(row.pk_id).then(() => {
        this.callerDialogFormVisible = false
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
      this.$confirm('确认删除访客' + row.ci_name + '吗？', '删除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(row)
      })
    },
    // 时间格式化
    formatTimeRange(filterVal) {
      if (filterVal) {
        this.listQuery.params.c_time = JSON.stringify(filterVal)
          .replace(/\[|\]|\"/g, '')
          .replace(',', ' - ')
      } else {
        this.listQuery.params.c_time = undefined
      }
    },
    formatBirthRange(filterVal) {
      if (filterVal) {
        this.listQuery.params.ci_birthday = JSON.stringify(filterVal)
          .replace(/\[|\]|\"/g, '')
          .replace(',', ' - ')
      } else {
        this.listQuery.params.ci_birthday = undefined
      }
    }
  }
}
</script>
