<template>
  <div class="app-container">
    <!--查询、添加、刷新区域-->
    <div class="filter-container">
      <el-select
        v-model="listQuery.params.blocId"
        class="filter-item"
        placeholder="酒店集团名称"
        clearable
        filterable
        @focus="resetBlockData"
        @change="changeQueryBlocData">
        <el-option v-for="item in queryBlockData" :key="item.blocId" :label="item.blocName" :value="item.blocId"/>
      </el-select>
      <el-select
        v-model="listQuery.params.hiId"
        class="filter-item"
        placeholder="酒店名称"
        clearable
        filterable
        @focus="resetHotelData">
        <el-option v-for="item in queryHotelData" :key="item.hiId" :label="item.hiName" :value="item.hiId"/>
      </el-select>
      <el-input v-model="listQuery.params.username" placeholder="用户名" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.truename" placeholder="真实姓名" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.phone" placeholder="联系电话" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.params.gender" placeholder="性别" clearable style="width: 80px" class="filter-item">
        <el-option v-for="item in genderOptions" :key="item.code" :label="item.name" :value="item.code"/>
      </el-select>
      <el-select v-model="listQuery.params.issystem" placeholder="系统用户" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in yesORNoOptions" :key="item.code" :label="item.name" :value="item.code"/>
      </el-select>
      <el-select v-model="listQuery.params.enabled" placeholder="启用状态" clearable style="width: 110px" class="filter-item">
        <el-option v-for="item in enableOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-input v-model="listQuery.params.createuser_name" placeholder="创建人" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.modifyuser_name" placeholder="修改人" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        v-model="dateRange2"
        type="daterange"
        range-separator="至"
        start-placeholder="最后登录开始时间"
        end-placeholder="最后登录结束时间"
        class="filter-item"
        style="width: auto"
        value-format="yyyy-MM-dd"
        @change="formatTimeRange2"/>
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
      <el-date-picker
        v-model="dateRange1"
        type="daterange"
        range-separator="至"
        start-placeholder="修改开始时间"
        end-placeholder="修改结束时间"
        class="filter-item"
        style="width: auto"
        value-format="yyyy-MM-dd"
        @change="formatTimeRange1"/>
    </div>
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
    </div>
    <!--表格-->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      stripe="true"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="最后登录时间">
              <span>{{ props.row.last_login_time }}</span>
            </el-form-item>
            <el-form-item label="创建人">
              <span>{{ props.row.createuser_name }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.modifytime }}</span>
            </el-form-item>
            <el-form-item label="修改人">
              <span>{{ props.row.modifyuser_name }}</span>
            </el-form-item>
            <el-form-item label="修改时间">
              <span>{{ props.row.modifytime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="id" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.truename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" min-width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.gender_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center" min-width="500px">
        <template slot-scope="scope">
          <span>{{ scope.row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统用户" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.issystem_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启用状态" class-name="status-col" align="center" min-width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enabled | statusFilter">{{ scope.row.enabled ==='1'?'启用':'未启用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="酒店名称" align="center" min-width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.hiId_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="酒店集团名称" align="center" min-width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.blocId_name }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="最后登录时间" class-name="status-col" align="center" min-width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.last_login_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="创建人" align="center" min-width="200px">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.createuser_name }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="创建时间" class-name="status-col" align="center" min-width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.createtime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="修改人" align="center" min-width="200px">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.modifyuser_name }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="修改时间" class-name="status-col" align="center" min-width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.modifytime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="success" size="mini" @click="handlePrem(scope.row)">授权</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :limit.sync="listQuery.length" @pagination="getList" />
    <!--添加、编辑弹窗-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="userDialogFormVisible" width="500px" top="5vh">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" class="common-form">
        <el-form-item label="用户名" prop="username">
          <el-input :disabled="dialogStatus==='update'" v-model="temp.username" type="text" placeholder="请输入3-11内的用户名" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="truename">
          <el-input v-model="temp.truename" type="text" placeholder="请输入2-10内的真实姓名"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="temp.phone"/>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="temp.gender" placeholder="请选择" style="width: 268px" @change="formatGender">
            <el-option v-for="item in genderOptions" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态" prop="enabled">
          <el-select v-model="temp.enabled" placeholder="请选择" style="width: 268px" @change="formatEnable">
            <el-option v-for="item in enableOptions" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="系统用户" prop="issystem">
          <el-select v-model="temp.issystem" placeholder="请选择" style="width: 268px" @change="formatIssystem">
            <el-option v-for="item in yesORNoOptions" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="酒店集团" prop="blocId_name">
          <el-select
            v-model="temp.blocId"
            placeholder="请选择酒店集团"
            filterable
            style="width: 268px"
            @focus="resetBlockData"
            @change="changeBlocData">
            <el-option v-for="item in queryBlockData" :key="item.blocId" :label="item.blocName" :value="item.blocId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="酒店" prop="hiId_name">
          <el-select
            v-model="temp.hiId"
            placeholder="请选择酒店"
            filterable
            style="width: 268px"
            @focus="resetHotelData"
            @change="changeHotelData">
            <el-option v-for="item in queryHotelData" :key="item.hiId" :label="item.hiName" :value="item.hiId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" type="password" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input v-model="temp.repassword" type="password" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>
    <!--授权弹窗-->
    <el-dialog :visible.sync="premDialogFormVisible" title="用户授权" width="500px" top="5vh">
      <el-form :rules="rules" label-position="top" label-width="100px" class="common-form">
        <el-form-item v-if="isSystem" label="系统角色">
          <el-checkbox-group v-model="updatePremData.roles">
            <el-checkbox v-for="item in premData" v-if="item.issystem==='1'" :label="item.id" :key="item.id">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="酒店角色">
          <el-checkbox-group v-model="updatePremData.roles">
            <el-checkbox v-for="item in premData" v-if="item.issystem==='0'" :label="item.id" :key="item.id">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="premDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updatePrem()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, getUserInfo, createUser, updateUser, deleteUser, getUserPrem, updateUserPrem, getBlockList, getHotelList, checkUser } from '@/api/user'
import { getDicMore } from '@/api/dic'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'SysUser',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    const validateUserName = (rule, value, callback) => {
      if (this.dialogStatus === 'update') {
        callback()
        return
      }
      const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      if (value === undefined || value.length < 3 || value.length > 11) {
        callback(new Error('请输入长度为3~11位的用户名'))
      } else if (reg.test(value)) {
        callback(new Error('所输入的字符不能包含有中文'))
      } else {
        checkUser({ username: value }).then(response => {
          if (!response.valid) {
            callback(new Error('用户名已存在'))
          } else {
            callback()
          }
        })
      }
    }
    const validatePass = (rule, value, callback) => {
      if (this.dialogStatus === 'update' && !this.temp.password) {
        callback()
        return
      }
      if (value === '' || value === undefined) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.temp.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      dateRange: undefined,
      dateRange1: undefined,
      dateRange2: undefined,
      dicParams: 'code_gender,code_if',
      dicData: null,
      isSystem: false,
      listQuery: {
        start: 0,
        length: 10,
        params: {
          username: null,
          createuser_name: null,
          gender: null,
          createtime: null,
          phone: null,
          truename: null,
          enabled: null,
          modifytime: null,
          issystem: null,
          hiId: null,
          modifyuser_name: null,
          last_login_time: null
        }
      },
      yesORNoOptions: null,
      enableOptions: [
        { label: '启用', key: '1' },
        { label: '未启用', key: '0' }
      ],
      genderOptions: null,
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
        hiId: '',
        hiId_name: '',
        blocId: '',
        blocId_name: '',
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
        roles: [],
        uid: '',
        role: ''
      },
      blockData: [],
      queryBlockData: [],
      hotelData: [],
      queryHotelData: [],
      rules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUserName }
        ],
        truename: [
          { required: true, message: '请输入长度为2~10位的真实姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '请输入长度为2~10位的真实姓名', trigger: 'blur' }
        ],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        enabled: [{ required: true, message: '请选择是否启用', trigger: 'change' }],
        issystem: [{ required: true, message: '请选择是否是系统用户', trigger: 'change' }],
        phone: [
          { required: true, message: '请输入11位手机号码', trigger: 'change' },
          { pattern: /^[0-9]*$/, message: '请输入11位数字', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: false, message: '请输入密码', trigger: 'blur' }
        ],
        repassword: [
          { required: false, trigger: 'blur', validator: validatePass }
        ]
      }
    }
  },
  created() {
    this.getDic()
    this.getList()
    this.getBlockList()
  },
  methods: {
    // 获取表格内容
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.recordsTotal
        this.listLoading = false
      })
    },
    // 获取字典表
    getDic() {
      getDicMore(this.dicParams).then(response => {
        this.dicData = response.data
        this.genderOptions = this.dicData.code_gender
        this.yesORNoOptions = this.dicData.code_if
      })
    },
    // 获取酒店集团列表
    getBlockList() {
      getBlockList().then(response => {
        this.blockData = response.data
        this.queryBlockData = this.blockData
      })
    },
    // 获取酒店列表
    getHotelList(blocId) {
      getHotelList(blocId).then(response => {
        this.hotelData = response.data
        this.queryHotelData = this.hotelData
      })
    },
    resetBlockData() {
      this.queryBlockData = this.blockData
    },
    resetHotelData() {
      this.queryHotelData = this.hotelData
    },
    handleRefresh() {
      this.listQuery.start = 1
      this.listQuery.params = {}
      this.dateRange = null
      this.dateRange1 = null
      this.dateRange2 = null
      this.getList()
    },
    handleFilter() {
      this.listQuery.start = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        hiId: '',
        hiId_name: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.rules.password[0].required = true
      this.rules.repassword[0].required = true
      this.dialogStatus = 'create'
      this.userDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 添加
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createUser(this.temp).then((res) => {
            this.userDialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
            this.handlePrem(res.data)
          })
        }
      })
    },
    handleUpdate(row) {
      getUserInfo(row.username).then((res) => {
        this.temp = res.data
        if (this.temp.blocId) {
          this.getHotelList(this.temp.blocId)
        }
        this.rules.password[0].required = false
        this.rules.repassword[0].required = false
        this.dialogStatus = 'update'
        this.userDialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    // 更新
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateUser(this.temp).then(() => {
            this.getList()
            this.userDialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除' + row.username + '用户吗？', '删除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(row)
      }).catch(() => {

      })
    },
    // 删除
    deleteData(row) {
      deleteUser(row.username).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handlePrem(row) {
      this.isSystem = row.issystem === '1'
      getUserPrem(row.id).then((res) => {
        this.premData = res.data
        this.updatePremData.roles = []
        for (let i = 0; i < this.premData.length; i++) {
          if (this.premData[i].selected === 1) {
            this.updatePremData.roles.push(this.premData[i].id)
          }
        }
        this.updatePremData.uid = row.id
        this.premDialogFormVisible = true
        this.getList()
      })
    },
    // 授权
    updatePrem() {
      this.updatePremData.role = ''
      for (let i = 0; i < this.premData.length; i++) {
        for (let j = 0; j < this.updatePremData.roles.length; j++) {
          if (this.premData[i].id === this.updatePremData.roles[j]) {
            this.updatePremData.role += ',' + this.premData[i].name
          }
        }
      }
      this.updatePremData.role = this.updatePremData.role.substring(1)
      updateUserPrem(this.updatePremData).then(() => {
        this.premDialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '授权成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    // 格式化时间范围
    formatTimeRange(filterVal) {
      if (filterVal) {
        this.listQuery.params.createtime = JSON.stringify(filterVal)
          .replace(/\[|\]|\"/g, '')
          .replace(',', ' - ')
      } else {
        this.listQuery.params.createtime = undefined
      }
    },
    // 格式化时间范围
    formatTimeRange1(filterVal) {
      if (filterVal) {
        this.listQuery.params.modifytime = JSON.stringify(filterVal)
          .replace(/\[|\]|\"/g, '')
          .replace(',', ' - ')
      } else {
        this.listQuery.params.modifytime = undefined
      }
    },
    // 格式化时间范围
    formatTimeRange2(filterVal) {
      if (filterVal) {
        this.listQuery.params.last_login_time = JSON.stringify(filterVal)
          .replace(/\[|\]|\"/g, '')
          .replace(',', ' - ')
      } else {
        this.listQuery.params.last_login_time = undefined
      }
    },
    formatGender(filterVal) {
      for (let i = 0; i < this.genderOptions.length; i++) {
        if (this.genderOptions[i].code === filterVal) {
          this.temp.gender_name = this.genderOptions[i].name
        }
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
      for (let i = 0; i < this.yesORNoOptions.length; i++) {
        if (this.yesORNoOptions[i].code === filterVal) {
          this.temp.issystem_name = this.yesORNoOptions[i].name
        }
      }
    },
    changeBlocData(blocId) {
      if (blocId) {
        this.temp.hiId = null
        this.getHotelList(blocId)
        for (let i = 0; i < this.blockData.length; i++) {
          if (this.blockData[i].blocId === blocId) {
            this.temp.blocId_name = this.blockData[i].blocName
          }
        }
      }
    },
    changeHotelData(hiId) {
      for (let i = 0; i < this.hotelData.length; i++) {
        if (this.hotelData[i].hiId === hiId) {
          this.temp.hiId_name = this.hotelData[i].hiName
        }
      }
    },
    changeQueryBlocData(blocId) {
      if (blocId) {
        this.listQuery.params.hiId = null
        this.getHotelList(blocId)
      }
    }
  }
}
</script>
