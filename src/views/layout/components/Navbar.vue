<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
      <breadcrumb />
      <div class="right-menu">
        <message-box class="international right-menu-item"/>
        <div class="right-menu-item" style="margin-right: 20px">{{ hiId_name }}</div>
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <span>{{ name }}</span>
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link class="inlineBlock" to="/">
              <el-dropdown-item>
                首页
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span style="display:block;" @click="handleUpdatePassword">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" title="修改密码" width="500px" top="5vh">
      <el-form ref="dataForm" :rules="rules" :model="param" label-position="left" label-width="100px" class="common-form">
        <el-form-item label="旧密码">
          <el-input v-model="param.password" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="param.newPassword" type="password" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="确认新密码" prop="repassword">
          <el-input v-model="param.repassword" type="password" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updatePassword()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import MessageBox from '@/components/MessageBox'
import { updatePassword } from '@/api/user'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    MessageBox
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value !== this.param.newPassword && this.param.newPassword !== '') {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      param: {
        password: '',
        newPassword: '',
        repassword: ''
      },
      rules: {
        newPassword: [
          { required: false, message: '请输入密码', trigger: 'blur' }
        ],
        repassword: [
          { required: false, trigger: 'blur', validator: validatePass }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'hiId_name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        this.$router.push({ path: '/login' })
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    handleUpdatePassword() {
      this.param = {
        password: '',
        newPassword: '',
        repassword: ''
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.dialogFormVisible = true
    },
    updatePassword() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updatePassword(this.param).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改密码成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

