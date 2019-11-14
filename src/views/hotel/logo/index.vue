<template>
  <div class="app-container">
    <div>
      <el-upload
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :show-file-list="false"
        :action="imagesURL"
        class="fileUpload">
        <el-button v-waves type="primary" size="large" icon="el-icon-upload">点击上传</el-button>
      </el-upload>
      <p style="color:#aaa;">只能上传jpg文件，且不超过100kb</p>
    </div>
    <div v-show="imgSrc" style="margin-top: 20px;display:inline-block;padding: 20px;border: 1px solid #ccc;border-radius: 10px;">
      <viewer >
        <img :src="imgSrc" width="300" >
      </viewer >
    </div>
  </div>
</template>

<script>
import { getHotelLogo } from '@/api/hotelLogo'
import waves from '@/directive/waves' // Waves directive

export default {
  name: 'Logo',
  directives: { waves },
  filters: {

  },
  data() {
    return {
      imgNum: 0,
      imagesURL: process.env.BASE_API + 'hotelLogo/uploadLogo',
      imgSrc: '',
      uploadUrl: process.env.BASE_API
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取酒店logo
    getList() {
      getHotelLogo().then(response => {
        if (response.data[0].hotelLogoImg.indexOf('http') !== -1) {
          this.imgSrc = response.data[0].hotelLogoImg
        } else {
          this.imgSrc = 'data:image/png;base64,' + response.data[0].hotelLogoImg
        }
      })
    },
    // 限制上传文件类型
    beforeUpload(file) {
      console.log(file)
      const imagesSize = file.size / 1024 < 100
      const imagesType = file.type === 'image/jpeg'
      if (!imagesSize) {
        this.$message.error('上传图片大小不能超过100k!')
      } else if (!imagesType) {
        this.$message.error('上传图片只能为 jpg格式!')
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
    }
  }
}
</script>
