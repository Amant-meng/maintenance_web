<template>
  <div>
    <el-row :gutter="80">
      <el-col :span="16">
        <div>最近退房</div>
        <div class="line"/>
        <el-table :data="list">
          <el-table-column label="退房时间" class-name="status-col" align="center" min-width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.or_act_dep_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="房号" prop="ro_id" align="center" min-width="100"/>
          <el-table-column label="房型" prop="ro_type_name" align="center" min-width="150"/>
          <el-table-column label="姓名" prop="or_ci_name" align="center" in-width="100"/>
          <el-table-column label="入住时间" class-name="status-col" align="center" min-width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.or_act_arr_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
        <div>系统通告</div>
        <el-card style="margin-top: 10px">
          <div v-for="item in announcementList" :key="item.id" class="notice-item" @click="handleDetail(item.id)">
            <span>{{ item.title }}</span>
            <span>{{ item.createtime | parseTime('{y}-{m}-{d}') }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="80" style="margin-top: 20px">
      <el-col :span="24">
        <div>在住客人</div>
        <div class="line"/>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col v-for="item in checkinData" :span="4" :key="item.pk_ci_id" style="margin-top: 10px">
        <el-card>
          <div>
            <div class="checkin-item"><span style="font-size: 19px;font-weight: bold">{{ item.ro_id }}</span><span style="float: right">{{ item.ro_type_name }}</span></div>
            <div class="checkin-item">{{ item.or_ci_name }}</div>
            <div class="checkin-item">入住：{{ item.or_act_arr_time | parseTime('{y}-{m}-{d}') }}</div>
            <div class="checkin-item">预离：{{ item.or_est_dep_time | parseTime('{y}-{m}-{d}') }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-button v-if="checkinData.length !== 0" type="text" size="medium" style="margin-top: 60px;margin-left: 70px" @click="checkinMore">查看更多</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="80" style="margin-top: 20px">
      <el-col :span="24" style="height: 400px">
        <div>入住统计</div>
        <div class="line"/>
        <div id="chart" style="width: 100%;height: 100%"/>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="detailDialogFormVisible" top="5vh">
      <div v-html="content"/>
    </el-dialog>
  </div>
</template>

<script>
// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts')
// 引入折现图
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import { getCheckOutList, getRecentlyCheckOut } from '@/api/checkout'
import { getAnnouncementList, getAnnouncement } from '@/api/announcement'
import { countPeopleNum } from '@/api/chart'
export default {
  name: 'Reception',
  data() {
    return {
      chart: null,
      list: null,
      checkinData: [],
      announcementList: null,
      content: null,
      detailDialogFormVisible: false,
      listLoading: false,
      seriesData: [],
      listQuery: {
        start: 0,
        length: 11,
        params: {
          or_status: 'I'
        }
      },
      announcementListQuery: {
        start: 0,
        length: 10,
        params: {
          title: null,
          content: null
        }
      }
    }
  },
  watch: {
    seriesData(val) {
      console.log(val)
      this.setOptions(val)
    }
  },
  mounted() {
    this.initCharts()
  },
  created() {
    this.getCheckinList()
    this.getAnnouncementList()
    this.countPeopleNum()
  },
  methods: {
    // 获取在住客人列表
    getCheckinList() {
      getCheckOutList(this.listQuery).then(response => {
        this.checkinData = response.data
        this.getList()
      })
    },
    // 获取最近退房列表
    getList() {
      this.listQuery.params.or_status = 'S'
      this.listQuery.length = 5
      this.listLoading = true
      getRecentlyCheckOut(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    // 查看更多在住客人列表
    checkinMore() {
      this.$router.push({ path: '/checkout/checkout' })
    },
    // 获取系统通告列表
    countPeopleNum() {
      countPeopleNum().then(response => {
        this.seriesData = response.data
      })
    },
    // 查看通告详情
    handleDetail(id) {
      this.detailDialogFormVisible = true
      getAnnouncement(id).then((res) => {
        this.content = res.data.content
      })
    },
    getAnnouncementList() {
      getAnnouncementList(this.announcementListQuery).then(response => {
        this.announcementList = response.data
      })
    },
    // 初始化图表
    initCharts() {
      this.chart = echarts.init(document.getElementById('chart'), 'light')
      this.setOptions(this.seriesData)
    },
    // 图表参数
    setOptions(data) {
      console.log(data)
      this.chart.setOption({
        tooltip: {},
        xAxis: {
          data: ['0点', '1点', '2点', '3点', '4点', '5点', '6点', '7点', '8点', '9点', '10点', '11点', '12点', '13点', '14点', '15点', '16点', '17点', '18点', '19点', '20点', '21点', '22点', '23点']
        },
        yAxis: {},
        series: [{
          name: '入住人数',
          type: 'line',
          data
        }]
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .line{
    height: 1px;
    border-top: 2px solid #ebeef5;
    margin-top: 10px;
  }

  .checkin-item{
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .notice-item{
    height: 25px;
    cursor:pointer;
    margin-top: 8px;
    margin-bottom: 8px;
    &:hover{
      color: #409EFF;
    }
    span{
      &:nth-child(1){
        float: left;
        width: 70%;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      &:nth-child(2){
        float: right;
      }
    }
  }
</style>
