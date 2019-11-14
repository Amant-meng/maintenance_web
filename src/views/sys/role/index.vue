<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.params.name" placeholder="角色名" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.remark" placeholder="描述" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.params.issystem" placeholder="系统角色" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in yesORNoOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-input v-model="listQuery.params.createuser_name" placeholder="创建人" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.modifyuser_name" placeholder="修改人" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="创建开始时间"
        end-placeholder="创建结束时间"
        class="filter-item"
        style="width: auto"
        value-format="yyyy-MM-dd"
        @change="formatTimeRange"/>
    </div>
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
    </div>
    <!--表格数据展示-->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="角色名" prop="id" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统角色" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.issystem_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.createuser_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人" align="center" min-width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.modifyuser_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" class-name="status-col" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.modifytime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="success" size="mini" @click="handlePrem(scope.row)">授权</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :limit.sync="listQuery.length" @pagination="getList" />

    <!--角色添加-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="userDialogFormVisible" width="30%" top="5vh">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" class="common-form">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="temp.name" type="text" placeholder="请输入3-100字的角色名" />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="temp.remark" type="text" placeholder="请输入3-200字的描述"/>
        </el-form-item>
        <el-form-item label="系统角色" prop="issystem">
          <el-select v-model="temp.issystem" class="filter-item" placeholder="请选择" @change="formatIssystem">
            <el-option v-for="item in yesORNoOptions" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

    <!--角色授权-->
    <el-dialog :visible.sync="premDialogFormVisible" title="角色授权" width="400px" top="5vh">
      <el-tree
        v-loading="listLoading"
        ref="menuTree"
        :data="premData"
        :props="defaultProps"
        :default-checked-keys="menus"
        :default-expanded-keys="menus"
        :check-strictly="true"
        show-checkbox
        node-key="id"
        @check-change="handleMenuCheckChange"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="premDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updatePrem()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getRoleInfo, createRole, updateRole, deleteRole, getRolePrem, updateRolePrem } from '@/api/role'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { toTree } from '@/utils/toTree'

export default {
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
      yesORNoOptions: [{ label: '是', key: '1' }, { label: '否', key: '0' }],
      enableOptions: [
        { label: '启用', key: '1' },
        { label: '未启用', key: '0' }
      ],
      genderOptions: [{ label: '男', key: '1' }, { label: '女', key: '2' }],
      temp: {
        username: '',
        gender: '',
        gender_name: '',
        phone: '',
        truename: '',
        enabled: '',
        enabled_name: '',
        issystem: '',
        issystem_name: '',
        password: '',
        repassword: ''
      },
      userDialogFormVisible: false,
      premDialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      premData: [],
      updatePremData: {
        menus: [],
        rid: ''
      },
      menus: [],
      rules: {
        name: [
          { required: true, message: '请输入3-100字的角色名', trigger: 'blur' },
          { min: 3, max: 100, message: '请输入3-100字的角色名', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入3-200字的描述', trigger: 'blur' },
          { min: 3, max: 100, message: '请输入3-200字的描述', trigger: 'blur' }
        ],
        issystem: [{ required: true, message: '请选择是否是系统用户', trigger: 'change' }]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRoleList(this.listQuery).then(response => {
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
          createRole(this.temp).then(() => {
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
      getRoleInfo(row.id).then((res) => {
        this.temp = res.data
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
          updateRole(this.temp).then(() => {
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
      this.$confirm('确认删除' + row.name + '角色吗？', '删除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(row)
      }).catch(() => {

      })
    },
    deleteData(row) {
      deleteRole(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handlePrem: function(row) {
      this.menus = []
      this.updatePremData.rid = row.id
      getRolePrem(row.id).then((res) => {
        this.premData = toTree(res.data)
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].selected === 1) {
            this.menus.push(res.data[i].id)
          }
        }
        this.premDialogFormVisible = true
      })
    },
    updatePrem() {
      this.updatePremData.menus = this.$refs.menuTree.getHalfCheckedKeys().concat(this.$refs.menuTree.getCheckedKeys())
      console.log(this.updatePremData.menus)
      updateRolePrem(this.updatePremData).then(() => {
        this.premDialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '授权成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleMenuCheckChange(data, check, subCheck) {
      if (check) {
        // 节点选中时同步选中父节点
        if (data.pid) {
          const parentId = data.pid
          this.$refs.menuTree.setChecked(parentId, true, false)
        }
      } else {
        // 节点取消选中时同步取消选中子节点
        if (data.children != null) {
          data.children.forEach(element => {
            this.$refs.menuTree.setChecked(element.id, false, false)
          })
        }
      }
    },
    formatTimeRange(filterVal) {
      if (filterVal) {
        this.listQuery.params.createtime = JSON.stringify(filterVal)
          .replace(/\[|\]|\"/g, '')
          .replace(',', ' - ')
      } else {
        this.listQuery.params.createtime = undefined
      }
    },
    formatGender(filterVal) {
      if (filterVal === '1') {
        this.temp.gender_name = '男'
      } else {
        this.temp.gender_name = '女'
      }
    },
    formatEnable(filterVal) {
      if (filterVal === '1') {
        this.temp.enabled_name = '是'
      } else {
        this.temp.enabled_name = '否'
      }
    },
    formatIssystem(filterVal) {
      if (filterVal === '1') {
        this.temp.issystem_name = '是'
      } else {
        this.temp.issystem_name = '否'
      }
    }
  }
}
</script>
