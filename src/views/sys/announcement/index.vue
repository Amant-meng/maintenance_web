<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.params.title" placeholder="标题" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.createuser_name" placeholder="创建人" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.modifyuser_name" placeholder="修改人" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
    </div>
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
    </div>
    <!--表格数据展示-->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="标题" prop="id" align="center" min-width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
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
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">查看</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.start" :limit.sync="listQuery.length" @pagination="getList" />

    <!--公告添加-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="editDialogFormVisible" :close-on-click-modal="false" width="850px" top="5vh">
      <editor :catch-data="catchData" :content="temp.content"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

    <!--公告查看-->
    <el-dialog :visible.sync="detailDialogFormVisible" top="5vh">
      <div v-html="temp.content"/>
    </el-dialog>
  </div>
</template>

<script>
import { getAnnouncementList, addAnnouncement, getAnnouncement, deleteAnnouncement, updateAnnouncement } from '@/api/announcement'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import editor from '@/components/Editor'

export default {
  components: { Pagination, editor },
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
      list: null,
      total: 0,
      listLoading: true,
      dateRange: null,
      listQuery: {
        start: 0,
        length: 10,
        params: {
          title: null,
          content: null
        }
      },
      temp: {
        title: null,
        content: null
      },
      editDialogFormVisible: false,
      detailDialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      }

    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAnnouncementList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.recordsTotal
        this.listLoading = false
      })
    },
    catchData(val) {
      this.temp.content = val
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
        title: '',
        content: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.editDialogFormVisible = true
    },
    createData() {
      for (const i in document.getElementsByTagName('h1')) {
        this.temp.title += document.getElementsByTagName('h1')[i].innerHTML
      }
      addAnnouncement(this.temp).then((res) => {
        this.editDialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handleDetail(row) {
      this.detailDialogFormVisible = true
      this.resetTemp()
      getAnnouncement(row.id).then((res) => {
        this.temp.content = res.data.content
      })
    },
    handleUpdate(row) {
      this.editDialogFormVisible = true
      this.resetTemp()
      getAnnouncement(row.id).then((res) => {
        this.temp = res.data
        this.dialogStatus = 'update'
      })
    },
    updateData() {
      console.log(document.getElementsByTagName('h1'))
      this.temp.title = document.getElementsByTagName('h1')[1].innerHTML
      updateAnnouncement(this.temp).then(() => {
        this.editDialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除该通告吗？', '删除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(row)
      }).catch(() => {

      })
    },
    deleteData(row) {
      deleteAnnouncement(row.id).then(() => {
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
