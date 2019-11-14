<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.params.roomTypeCode" placeholder="房型编码" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.params.roomTypeName" placeholder="房型名称" clearable style="width: 150px;" class="filter-item" />-->
      <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新
        </el-button>
      </div>
      <div>
        <el-button v-waves class="filter-item" type="primary" @click="depositOuterVisible = true">房间押金配置</el-button>
        <el-dialog :visible.sync="depositOuterVisible" title="押金配置选项" width="35%">
          <el-radio v-model="radio" label="1" border @change="inputShow=true">统一押金配置</el-radio>
          <el-radio v-model="radio" label="0" border style="margin-left:97px" @change="inputShow=false">单独押金配置</el-radio>
          <el-row v-if="inputShow" style="margin-top:20px">
            <el-col :span="3">
              <span style="line-height:40px">押金：</span>
            </el-col>
            <el-col :span="17">
              <el-input v-model="temp.deposit" type="number" placeholder="请输入押金额度"/>
            </el-col>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button @click="depositOuterVisible = false">取 消</el-button>
            <el-button type="primary" @click="SelectDepositData">确认</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <!--房型图片列表-->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="imagesTypeList"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="房型编码" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roomTypeCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房型名称" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.roomTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大可住人数" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.maxCheckInNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="押金" align="center" min-width="100px">
        <template slot-scope="scope">
          <span v-if="radio==='0'">{{ scope.row.roomtype_deposit }}</span>
          <span v-if="radio==='1'">{{ temp.deposit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房型图片" align="center" min-width="100px">
        <template slot-scope="scope">
          <viewer>
            <img
              :src="uploadUrl + `roomimg/findAllRoomTypeById?imgId=${scope.row.roomTypeCode }&imgNum=${imgNum}`"
              min-width="70"
              height="70">
          </viewer>
        </template>
      </el-table-column>
      <el-table-column :width="btnAreaWidth" label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            style="float:right;margin-left:10px"
            @click="handleUpdate(scope.row)">修改可住人数
          </el-button>
          <el-button
            type="primary"
            size="mini"
            style="float:right"
            @click="getAllRoomByRoomType(scope.row)">房间别名配置
          </el-button>
          <el-button
            v-if="depositBtnVisible"
            type="primary"
            size="mini"
            style="float:right"
            @click="handleDepositUpdate(scope.row)">修改押金
          </el-button>
          <el-upload
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :show-file-list="false"
            :data="imagesParams"
            :action="imagesURL"
            class="fileUpload"
            style="float:right"
            accept="image/jpg">
            <el-button size="mini" type="primary" @click="addPhoto(scope.row)">点击上传
            </el-button>
          </el-upload>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="maxCheckInNumDialogFormVisible" title="修改最大可住人数" width="35%" top="5vh">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="120px" class="common-form" >
        <el-form-item label="最大可住人数" prop="maxCheckInNum">
          <el-input v-model="temp.maxCheckInNum" type="number" placeholder="最大可住人数"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="maxCheckInNumDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="depositDialogFormVisible" title="修改押金配置" width="35%" top="5vh">
      <el-form ref="depositDataForm" :model="temp" label-position="left" label-width="120px" class="common-form">
        <el-form-item label="押金" prop="deposit">
          <el-input v-model="temp.deposit" type="number" placeholder="押金"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="depositDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateDepositData()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="roomAnotherNameDialogFormVisible" title="房间别名配置" width="35%" top="5vh">
      <el-table
        v-loading="listLoading"
        :key="1"
        :data="roomAnotherNameList"
        height="500"
        stripe
        border
        fit
        highlight-current-row
        style="width: 100%;">
        <el-table-column label="房间编号" min-width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.roomNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房间别名" min-width="150px" align="center">
          <template slot-scope="{row,$index}">
            <el-input v-show="showEdit[$index]" ref="roomAnotherName" v-model="row.roomAnotherName" size="small" placeholder="房间别名" @blur="showEdit[$index]=false"/>
            <span
              v-if="!showEdit[$index]"
              style="display: block; width: 100%;height: 100%;position: absolute;top: 0;left: 0;line-height:45px"
              @click="handleEdit($index)">{{ row.roomAnotherName }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="dialog-footer" style="overflow: hidden;margin-top:10px;line-height:40px">
        <el-button type="primary" style="float:right;margin-left:10px" @click="updateRoomAnotherNameData()">确认</el-button>
        <el-button style="float:right;margin-left:10px" @click="roomAnotherNameDialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoomTypeImagesList, updateRoomMaxCheckInNum, findAllRoomByRoomType, saveRoomAnotherName, updateRoomTypeDeposit, updateDepositOff } from '@/api/roomTypeImages'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'RoomTypeImages',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      radio: '1',
      json: {},
      showEdit: [], // 显示编辑框
      inputShow: true, // 统一押金配置输入框显示
      imgNum: 0,
      imagesURL: process.env.BASE_API + 'roomimg/upload',
      uploadUrl: process.env.BASE_API,
      imagesParams: {
        roomTypeCode: null,
        roomTypeName: null
      },
      roomTypeParams: {
        roomTypeCode: '',
        timestamp: ''
      },
      tableKey: 0,
      imagesTypeList: null,
      roomAnotherNameList: null,
      total: 0,
      listLoading: true,
      dateRange: undefined,
      listQuery: {
        start: 0,
        length: 10,
        params: {
          roomTypeName: undefined,
          roomTypeCode: undefined,
          imgPath: undefined,
          maxCheckInNum: undefined
        }
      },
      temp: {
        maxCheckInNum: '',
        roomTypeCode: '',
        deposit: '',
        roomAnotherName: '',
        roomNo: ''
      },
      maxCheckInNumDialogFormVisible: false,
      roomAnotherNameDialogFormVisible: false,
      depositDialogFormVisible: false,
      depositOuterVisible: false,
      depositInnerVisible: false,
      depositBtnVisible: false,
      btnAreaWidth: 360,
      uploadMessage: null,
      premData: [],
      replace: '',
      timestamp: ''
    }
  },
  computed: {
    messageData() {
      return this.$store.state.message.data
    }
  },
  watch: {
    messageData: {
      handler(newVal, oldVal) {
        console.log(newVal)
        if (newVal.tag === this.timestamp + '') {
          this.imagesTypeList = newVal.data.rooms
          this.temp.deposit = newVal.data.roomtype_deposit
          this.radio = newVal.data.deposit_off
          if (this.radio === '0') {
            this.depositBtnVisible = true
            this.inputShow = false
            this.btnAreaWidth = 470
          }
          this.listLoading = false
        }
        if (newVal.tag === this.roomTypeParams.timestamp + '') {
          this.roomAnotherNameList = newVal.data
          this.listLoading = false
        }
      },
      deep: true
    }
  },
  created() {
    // this.depositBtnVisible = false
    this.getList()
  },
  methods: {
    // 获取房型列表
    getList() {
      this.listLoading = true
      this.timestamp = new Date().getTime()
      getRoomTypeImagesList(this.timestamp).then(response => {

      }).catch(() => {
        this.listLoading = false
      })
    },
    // 修改最大可住人数
    handleUpdate(row) {
      this.temp.maxCheckInNum = row.maxCheckInNum
      this.temp.roomTypeCode = row.roomTypeCode
      this.maxCheckInNumDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    addPhoto(row) {
      this.imagesParams.roomTypeCode = row.roomTypeCode
      this.imagesParams.roomTypeName = row.roomTypeName
    },
    // 更新修改最大人数
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateRoomMaxCheckInNum(this.temp.roomTypeCode, this.temp.maxCheckInNum).then(() => {
            this.maxCheckInNumDialogFormVisible = false
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
    // 查询房型所有房间及别名
    getAllRoomByRoomType(row) {
      this.temp.roomNo = row.roomNo
      this.roomTypeParams.roomTypeCode = row.roomTypeCode
      this.roomTypeParams.timestamp = new Date().getTime()
      findAllRoomByRoomType(this.roomTypeParams.roomTypeCode, this.roomTypeParams.timestamp).then(response => {
        this.roomAnotherNameDialogFormVisible = true
      })
    },
    // 保存房间别名
    updateRoomAnotherNameData() {
      for (let i = 0; i < this.roomAnotherNameList.length; i++) {
        const roomNo = this.roomAnotherNameList[i].roomNo
        this.json[roomNo] = this.roomAnotherNameList[i].roomAnotherName
      }
      const params = {}
      params.params = this.json
      params.roomTypeCode = this.roomTypeParams.roomTypeCode
      saveRoomAnotherName(JSON.stringify(params)).then(() => {
        this.roomAnotherNameDialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    // 修改押金
    handleDepositUpdate(row) {
      this.temp.deposit = row.roomtype_deposit
      this.temp.roomTypeCode = row.roomTypeCode
      this.depositDialogFormVisible = true
    },
    // 更新押金配置
    updateDepositData() {
      this.$refs['depositDataForm'].validate(valid => {
        if (valid) {
          // this.temp.deposit = 100
          updateRoomTypeDeposit(this.temp.deposit, this.temp.roomTypeCode).then(() => {
            this.depositDialogFormVisible = false
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
    // 押金配置选项
    SelectDepositData() {
      if (this.radio === '1') {
        //  调用接口
        updateRoomTypeDeposit(this.temp.deposit, this.temp.roomTypeCode, this.radio).then(() => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
        this.btnAreaWidth = 360
        this.depositOuterVisible = false
        this.depositBtnVisible = false
      } else {
        //  关闭弹窗、显示按钮
        this.temp.deposit = 0
        updateDepositOff(this.temp.deposit, this.radio).then(() => {
          this.getList()
        })
        this.depositOuterVisible = false
        this.depositBtnVisible = false
        this.depositOuterVisible = false
        this.depositBtnVisible = true
        this.btnAreaWidth = 470
      }
    },

    // 限制上传文件类型
    beforeUpload(file) {
      console.log(file)
      const imagesSize = file.size / 1024 / 1024 < 0.1
      const imagesType = file.type === 'image/jpeg'
      if (!imagesSize) {
        this.$message.error('上传图片大小不能超过100k!')
      } else if (!imagesType) {
        this.$message.error('上传图片只能为 .jpg格式!')
      } else {
        this.uploadMessage = this.$message({
          message: '图片上传中...',
          type: 'warning',
          duration: 0
        })
      }
      return imagesSize && imagesType
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
        this.$message({
          message: '图片上传成功',
          type: 'success'
        })
        this.imgNum = new Date().getTime()
        this.getList()
      }
      this.uploadMessage.close()
    },
    uploadError(err) {
      this.uploadMessage.close()
      this.$message.error(err.message)
    },
    addConGoods() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.maxCheckInNumDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
      this.temp = {}
    },
    handleEdit(index) {
      this.showEdit[index] = true
      // this.$nextTick(() => {
      //   this.$refs.roomAnotherName.focus()
      // })
      // console.log(index, row)
    }
  }
}
</script>
<style>
  .tb-edit .el-input {
    display: none
  }
  .tb-edit .current-row .el-input {
    display: block
  }
  .tb-edit .current-row .el-input+span {
    display: none
  }
</style>
