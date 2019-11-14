<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-if="isHotel==='1'"
        v-model="listQuery.params.blocId"
        :remote-method="queryBlockList"
        class="filter-item"
        placeholder="酒店集团名称"
        clearable
        filterable
        remote
        @focus="resetBlockData"
        @change="changeQueryBlocData">
        <el-option v-for="item in queryBlockData" :key="item.blocId" :label="item.blocName" :value="item.blocId"/>
      </el-select>
      <el-select
        v-if="isHotel==='1'"
        v-model="listQuery.params.hiId"
        :remote-method="queryHotelList"
        class="filter-item"
        placeholder="酒店名称"
        clearable
        filterable
        remote
        @focus="resetHotelData">
        <el-option v-for="item in queryHotelData" :key="item.hiId" :label="item.hiName" :value="item.hiId"/>
      </el-select>
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
import { getCollectRefoundList, getTopData, getBlockList, getHotelList } from '@/api/report'
import { getDicMore } from '@/api/dic'
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
      isHotel: 0,
      listLoading: true,
      tableConfig: null,
      createtime: null,
      hotel: null,
      hi_ids: '',
      listQuery: {
        params: {
          top_id: 200,
          hotel: undefined,
          hiId: null,
          hi_ids: ''
        }
      },
      hotelOptions: [
        { label: '当前酒店', key: '1' },
        { label: '所有酒店', key: '2' }
      ],
      blockData: [],
      queryBlockData: [],
      hotelData: [],
      queryHotelData: [],
      temp: {
        blocId: ''
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
    this.getBlockList()
    this.getDic()
    this.isHotel = this.$store.state.user.isSystem
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
    // 获取字典表
    getDic() {
      getDicMore(this.dicParams).then(response => {
        this.dicData = response.data
        this.genderOptions = this.dicData.code_gender
        this.yesORNoOptions = this.dicData.code_if
      })
    },
    // 酒店集团模糊查询
    queryBlockList(query) {
      if (query !== '') {
        this.queryBlockData = this.blockData.filter(item => {
          return item.blocName.indexOf(query) > -1
        })
      } else {
        this.queryBlockData = []
      }
    },
    resetHotelData() {
      this.queryHotelData = this.hotelData
    },
    resetBlockData() {
      this.queryBlockData = this.blockData
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
        this.hotelData.forEach(item => {
          console.log(item)
          this.listQuery.params.hi_ids += item.hiId + ','
        })
        this.listQuery.params.hi_ids = this.listQuery.params.hi_ids.substring(0, this.listQuery.params.hi_ids.length - 1)
      })
    },
    // 酒店模糊查询
    queryHotelList(query) {
      if (query !== '') {
        this.queryHotelData = this.hotelData.filter(item => {
          return item.hiName.indexOf(query) > -1
        })
      } else {
        this.queryHotelData = []
      }
    },
    findStatisticsList() {
      getCollectRefoundList(this.listQuery).then(response => {
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
    exportStatisticsList() {
      require.ensure([], () => {
        const { export_table_to_excel } = require('../../../utils/Export2Excel')
        export_table_to_excel('table')
      })
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
