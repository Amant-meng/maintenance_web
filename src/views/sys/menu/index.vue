<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
    </div>

    <el-table :data="data" row-key="id" border stripe>
      <el-table-column label="菜单" prop="name" min-width="200"/>
      <el-table-column label="图标" prop="icon" align="center" min-width="200"/>
      <el-table-column label="排序ID" prop="orderid" align="center" min-width="80"/>
      <el-table-column label="描述" prop="remark" align="center" min-width="100"/>
      <el-table-column label="权限标识" prop="premission" align="center" min-width="200"/>
      <el-table-column label="创建时间" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人" prop="modifyuser" align="center" min-width="70"/>
      <el-table-column label="修改时间" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.modifytime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路径" min-width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组件" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="menuDialogFormVisible" width="30%" top="5vh">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" class="common-form">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="temp.name" type="text" placeholder="请输入2-100字的菜单名" />
        </el-form-item>
        <el-form-item label="所属分类">
          <popup-tree-input
            :data="popupTreeData"
            :props="popupTreeProps"
            :prop="temp.pidname==null||temp.pidname===''?'顶级菜单':temp.pidname"
            :node-key="''+temp.pid"
            :current-change-handle="handleTreeSelectChange"/>
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="temp.premission" type="text" placeholder="请输入3-200内的权限标识"/>
        </el-form-item>
        <el-form-item label="图标名称">
          <el-input v-model="temp.icon" type="text" placeholder="请输入3-100内的图标名称"/>
        </el-form-item>
        <el-form-item label="排序ID">
          <el-input v-model="temp.orderid" type="text" placeholder="请输入排序ID"/>
        </el-form-item>
        <el-form-item label="是否为功能" prop="isfunc">
          <el-select v-model="temp.isfunc" class="filter-item" placeholder="请选择">
            <el-option v-for="item in yesORNoOptions" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="temp.url" type="text" placeholder="请输入路径"/>
        </el-form-item>
        <el-form-item label="组件">
          <el-input v-model="temp.component" type="text" placeholder="请输入组件"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuList, getMenuInfo, createMenu, updateMenu, deleteMenu } from '@/api/menu'
import treeTable from '@/components/TreeTable'
import treeToArray from './customEval'
import { toTree } from '@/utils/toTree'
import PopupTreeInput from '@/components/PopupTreeInput'
export default {
  name: 'Menu',
  components: { treeTable, PopupTreeInput },
  data() {
    return {
      func: treeToArray,
      expandAll: false,
      data: [],
      temp: {},
      dialogStatus: '',
      menuDialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '添加'
      },
      popupTreeData: [],
      popupTreeProps: {
        label: 'name',
        children: 'children'
      },
      yesORNoOptions: [{ label: '是', key: '1' }, { label: '否', key: '0' }],
      rules: {
        name: [
          { required: true, message: '请输入2-100字的菜单名', trigger: 'blur' },
          { min: 2, max: 100, message: '请输入2-100字的菜单名', trigger: 'blur' }
        ],
        pidname: [
          { required: true, message: '请选择所属分类', trigger: 'blur' }
        ],
        isfunc: [
          { required: true, message: '请选择是否为功能', trigger: 'blur' }
        ]
      },
      columns: [
        {
          text: '菜单',
          value: 'name',
          minWidth: 200
        },
        {
          text: '图标',
          value: 'icon',
          minWidth: 100
        },
        {
          text: '排序ID',
          value: 'orderid',
          minWidth: 80
        },
        {
          text: '描述',
          value: 'remark',
          minWidth: 100
        },
        {
          text: '权限标识',
          value: 'premission',
          minWidth: 200
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getMenuList().then(response => {
        this.data = toTree(response)
        this.popupTreeData = this.getParentMenuTree(this.data)
      })
    },
    handleRefresh() {
      this.getList()
    },
    getParentMenuTree: function(tableTreeData) {
      const parent = {
        parentId: 0,
        name: '顶级菜单',
        children: tableTreeData
      }
      return [parent]
    },
    // 菜单树选中
    handleTreeSelectChange(data, node) {
      this.temp.pid = data.id
      this.temp.pidname = data.name
    },
    resetTemp() {
      this.temp = {
        pid: null,
        pidname: null
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.menuDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createMenu(this.temp).then(() => {
            this.menuDialogFormVisible = false
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
      getMenuInfo(row.id).then((res) => {
        this.temp = res.data
        console.log(this.temp)
        this.dialogStatus = 'update'
        this.menuDialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateMenu(this.temp).then(() => {
            this.menuDialogFormVisible = false
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
      this.$confirm('确认删除' + row.name + '菜单吗？', '删除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(row)
      }).catch(() => {

      })
    },
    deleteData(row) {
      deleteMenu(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    }
  }
}
</script>
