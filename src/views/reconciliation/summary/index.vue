<template>
  <div class="app-container">
    <el-row>
      <el-col :span="16" :offset="4">
        <el-steps :active="step" simple finish-status="success">
          <el-step title="上传文件" />
          <el-step title="比对选项" />
          <el-step title="比对结果" />
        </el-steps>
      </el-col>
    </el-row>
    <el-button v-show="step>0" style="margin-top: 12px;margin-left: 20%" type="primary" icon="el-icon-arrow-left" @click="pre">上一步</el-button>
    <el-button v-show="step<2" style="margin-top: 12px;margin-right:20%;float: right" type="primary" @click="next">下一步<i class="el-icon-arrow-right el-icon--right"/></el-button>
    <div v-if="step===0">
      <el-upload
        ref="upload"
        :before-upload="beforeUpload"
        :on-exceed="numLimit"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :on-remove="removeUploadFile"
        :limit="2"
        :action="uploadUrl"
        :with-credentials="true"
        :data="uploadParams"
        name="fileUpload"
        class="upload"
        drag>
        <i class="el-icon-upload"/>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
      </el-upload>
      <div v-if="isFileUpload" style="margin-top: 50px">
        <span style="margin-left: 48%;font-size: 22px">上传预览</span>
        <el-table
          :data="previewData.preview"
          empty-text=" "
          stripe
          border
          fit
          style="margin-top: 50px">
          <el-table-column
            v-for="item in previewData.cols"
            :prop="item.colname"
            :label="item.colcomments"
            :key="item.id"
          />
        </el-table>
      </div>
    </div>
    <div v-if="step===1" class="options">
      <el-form ref="dataForm" :rules="rules" :model="compareParams.params" label-position="left" label-width="150px">
        <el-form-item label="对账营业日期范围" prop="dateRange" style="margin-top: 20px">
          <el-date-picker
            v-model="compareParams.params.dateRange"
            style="width: auto"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </el-form-item>
        <!--<el-form-item label="支付方式">-->
        <!--<el-select v-model="compareParams.params.paytype" placeholder="请选择">-->
        <!--<el-option v-for="item in paymentOptions" :key="item.code" :label="item.name" :value="item.code"/>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <div v-if="step===2" style="margin-top: 30px">
      <form id="myform" name="myform" method="post" action="" class="form-class">
        <input id="length" type="hidden" name="length">
        <input id="startPage" type="hidden" name="start">
        <input id="params" type="hidden" name="params">
        <el-dropdown type="primary" @command="exportData">
          <el-button type="primary">
            EXCEL导出<i class="el-icon-arrow-down el-icon--right"/>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">导出当前页</el-dropdown-item>
            <el-dropdown-item command="2">导出全部数据</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </form>
      <el-tabs style="margin-top: 20px" type="card" value="e" @tab-click="getCompareList">
        <el-tab-pane label="对账正常" name="e"/>
        <el-tab-pane label="金额异常" name="ne"/>
        <el-tab-pane label="无银行交易明细" name="n"/>
      </el-tabs>
      <el-table
        :data="compareData.preview"
        max-height="520"
        border
        fit>
        <el-table-column
          v-for="item in compareData.cols"
          :prop="item.colname"
          :label="item.colcomments"
          :key="item.id"
          :fixed="item.colcomments === '消费金额' || item.colcomments === '银行实收金额' ? 'left' : null"
        />
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="compareParams.start" :limit.sync="compareParams.length" @pagination="getCompareList" />
    </div>
  </div>
</template>

<script>

import { getDic } from '@/api/dic'
import { getCompareList } from '@/api/reconciliation'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      step: 0,
      uploadUrl: process.env.BASE_API + 'file/upload',
      dicParam: 'code_payment',
      uploadParams: {
        taskid: new Date().getTime()
      },
      total: 0,
      compareParams: {
        start: 0,
        length: 10,
        params: {
          taskid: new Date().getTime(),
          businesstime: null,
          previewtype: 'e',
          dateRange: null
        }
      },
      previewData: {
        cols: null,
        preview: null
      },
      compareData: {
        cols: null,
        preview: null
      },
      isFileUpload: false,
      uploadMessage: null,
      paymentOptions: [],
      rules: {
        dateRange: [
          { required: true, message: '请选择日期区间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDic()
  },
  methods: {
    // 获取字典表
    getDic() {
      getDic(this.dicParam).then(response => {
        this.paymentOptions = response.data
      })
    },
    getCompareList(tab) {
      if (tab) {
        this.compareParams.params.previewtype = tab.name ? tab.name : this.compareParams.params.previewtype
      }
      getCompareList(this.compareParams).then(response => {
        this.compareData = response.data
        this.total = response.recordsTotal
      })
    },
    exportData(command) {
      if (this.compareData.preview.length === 0) {
        this.$message.error('导出数据为空')
      } else {
        if (command === '2') {
          this.compareParams.params.all = '1'
        }
        if (command === '1') {
          delete this.compareParams.params.all
        }
        const url = process.env.BASE_API + 'file/export'
        document.getElementById('myform').setAttribute('action', url)// url提交的路径
        document.getElementById('length').value = this.compareParams.length // url提交的路径
        document.getElementById('startPage').value = this.compareParams.start // url提交的路径
        document.getElementById('params').value = JSON.stringify(this.compareParams.params)
        document.getElementById('myform').submit()
      }
    },
    // 下一步
    next() {
      if (this.step === 1) {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.step++
            this.compareParams.params.businesstime = this.formatTimeRange(this.compareParams.params.dateRange)
            delete this.compareParams.params.dateRange
            this.getCompareList()
          }
        })
      } else if (this.isFileUpload) {
        this.step++
      } else {
        this.$message.error('请先上传一个文件!')
      }
    },
    // 上一步
    pre() {
      this.step--
      if (this.step === 0) {
        this.uploadParams.taskid = new Date().getTime()
        this.compareParams.params.taskid = new Date().getTime()
        this.isFileUpload = false
      }
    },
    // 限制上传文件类型
    beforeUpload(file) {
      console.log(file)
      const isLt10M = file.size / 1024 / 1024 < 10
      const isXLS = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === ''
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      } else if (!isXLS) {
        this.$message.error('上传文件只能是 xls/xlsx 格式!')
      } else {
        this.uploadMessage = this.$message({
          message: '文件上传中',
          type: 'warning',
          duration: 0
        })
      }
      return isLt10M && isXLS
    },
    // 限制上传文件数量
    numLimit() {
      this.$message.error('最多只能上传两个文件!')
    },
    uploadSuccess(response) {
      // 超时
      if (response === '{status:403}' || response.status === 403) {
        this.$confirm(
          '你已超时被登出，可以取消继续留在该页面，或者重新登录',
          '超时登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.$store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
        return
      }
      if (!response.success) {
        this.$refs.upload.clearFiles()
        this.$message.error(response.message)
      } else {
        this.previewData = response.data
        this.isFileUpload = true
        this.$message({
          message: '文件上传成功',
          type: 'success'
        })
      }
      this.uploadMessage.close()
    },
    uploadError(err) {
      this.uploadMessage.close()
      this.$message.error(err.message)
    },
    removeUploadFile() {
      this.isFileUpload = false
    },
    formatTimeRange(filterVal) {
      if (filterVal) {
        return JSON.stringify(filterVal)
          .replace(/\[|\]|\"/g, '')
          .replace(',', ' - ')
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .upload {
    width: 360px;
    margin-left: 40%;
    margin-top: 100px;
  }
  .options {
    margin-left: 35%;
    margin-top: 50px;
  }
  .demonstration{
    margin-right: 10px;
  }
</style>
