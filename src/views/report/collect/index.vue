<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.createtime"
        type="daterange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        class="filter-item"
        style="width: auto"
        value-format="yyyy-MM-dd"/>
      <el-input v-model="listQuery.hotel" placeholder="酒店" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="findStatisticsList()">统计</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="exportStatisticsList()">导出</el-button>
    </div>
    <div id="table">
      <el-table :data="list" max-height="420" stripe>
        <el-table-column v-for="item in tableConfig" :label="item.label" :prop="item.prop" :min-width="item.width" :key="item.id" align = "center">
          <el-table-column
            v-for="item1 in item.list"
            v-if="item.list||item.children.length>0"
            :label="item1.label"
            :prop="item1.prop"
            :min-width="item1.width"
            :key="item1.id"
            align = "center">
            <el-table-column
              v-for="item2 in item1.list"
              v-if="item1.list||item1.list.length>0"
              :label="item2.label"
              :prop="item2.prop"
              :min-width="item2.width"
              :key="item2.id"
              align = "center"/>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <!--添加操作弹出框-->
  </div>
</template>

<script>
import { getStatisticsList, getTopData } from '@/api/report'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'RegistrationOrder',
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
  data: function() {
    return {
      header: null,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      tableConfig: null,
      createtime: null,
      hotel: null,
      listQuery: {
        hotel: null,
        createtime: null,
        params: {
          top_id: 100
        }
      },

      temp: {

      },
      userDialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '取消',
        create: '添加'
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
      getTopData(this.listQuery).then(response => {
        this.tableConfig = response.tableConfig
        this.listLoading = false
      })
    },
    findStatisticsList() {
      getStatisticsList(this.listQuery).then(response => {
        this.list = response.stringList
        this.getException(this.tableConfig)
        this.listLoading = false
      })
    },
    getException(tableConfig) {
      for (let i = 0; i < tableConfig.length; i++) {
        if (tableConfig[i].statistics_column_sql) {
          this.getValue(tableConfig[i].prop, tableConfig[i].statistics_column_sql)
        } else if (tableConfig[i].list) {
          this.getException(tableConfig[i].list)
        }
      }
    },
    getValue(prop, exception) {
      console.log(exception)
      exception = exception.replace(/\$/g, 'item.')
      console.log(exception)
      this.list.forEach(function(item, index) {
        Object.keys(item).forEach(function(key) {
          if (key !== 'group') {
            if (item[key]) {
              item[key] = parseInt(item[key])
            } else {
              item[key] = 0
            }
          }
        })
        item[prop] = eval(exception)
      })
    },
    // exportStatisticsList(){
    //   exportExcel () {
    //     var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
    //     var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
    //     try {
    //       FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'sheetjs.xlsx')
    //     } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
    //     return wbout
    //   }
    // }
    exportStatisticsList() {
      require.ensure([], () => {
        const { export_table_to_excel } = require('../../../utils/Export2Excel')
        export_table_to_excel('table')
      })
    }
  }
}
</script>
