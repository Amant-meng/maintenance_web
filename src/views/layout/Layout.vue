<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <navbar />
      <app-main />
      <!--      <CheckOut ref="CheckOut" :bill-dialog-form-visible.sync="dialogVisible" :datas="datas" :order="order" />-->
      <!--      <OrderDetail ref="OrderDetail" :order-dialog-form-visible.sync="showOrderDialogFormVisible" :pkwid="pkwid" />-->
      <iframe allow="autoplay" style="display:none" src="static/nosound.mp3" />
    </div>
  </div>
</template>

<script>
import {
  Navbar,
  Sidebar,
  AppMain
} from './components'
import ResizeMixin from './mixin/ResizeHandler'
// import CheckOut from '@/components/CheckOut'
// import OrderDetail from '@/components/OrderDetail'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
    // CheckOut,
    // OrderDetail
  },
  mixins: [ResizeMixin],
  data() {
    return {
      webSock: null,
      dialogVisible: false,
      showOrderDialogFormVisible: false,
      queryList: {
        state: ''
      },
      readMessageData: null,
      unReadMessageData: null,
      datas: {
        hi_id: '',
        or_checkin_id: ''
      },
      order: {},
      pkwid: ''
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  created() {
    this.initWebSocket()
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', {
        withoutAnimation: false
      })
    },
    showDialog(messageData, notify) {
      notify.close()
      this.datas.hi_id = messageData.hotelId
      this.datas.or_checkin_id = messageData.data.or_checkin_id
      this.dialogVisible = true
    },
    showDetailDialog(messageData, notify) {
      notify.close()
      this.pkwid = messageData.data.pk_ci_id
      this.showOrderDialogFormVisible = true
    },
    // 初始化WebSocket
    initWebSocket() {
      const wsUrl = process.env.BASE_API.replace('http', 'ws') + 'websocket'
      this.webSock = new WebSocket(wsUrl)
      this.webSock.onmessage = this.webSocketOnmessage
      this.webSock.onclose = function(e) {
        console.log(e)
      }
      this.webSock.onopen = function() {
        console.log('连接成功')
      }
      // 连接发生错误的回调方法
      this.webSock.onerror = function() {
        console.log('WebSocket连接发生错误')
      }
    },
    // 接收消息
    webSocketOnmessage(e) {
      console.log(e)
      const h = this.$createElement
      const messageData = JSON.parse(e.data)
      const messageTime = this.timestampToTime(messageData.date)
      let notify = null
      let message
      if (!messageData.type) {
        this.$store.commit('setMessageData', messageData)
        if (!messageData.success) {
          this.$message.error(messageData.message)
        }
      } else {
        if (messageData.type === 'TASK') {
          message = h('p', null, [
            h('span', null, messageData.content),
            // h('br', null),
            h('span', null, messageTime),
            h('el-button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              class: 'message-bt',
              on: {
                click: () => {
                  this.showDialog(messageData, notify)
                }
              }
            }, messageData.typeName)
          ])
        } else {
          message = h('p', null, [
            h('span', null, messageData.content),
            // h('br', null),
            h('span', null, messageTime)
          ])
          const url = `http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=${messageData.content}`
          new Audio(
            url
          ).play()
        }
        notify = this.$notify({
          title: messageData.title,
          message: message,
          duration: 1000 * 60,
          position: 'bottom-right',
          type: 'warning'
        })
      }
    },
    timestampToTime(timestamp) {
      const date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      const Y = date.getFullYear() + '-'
      const M = date.getMonth() + 1 + '-'
      const D = date.getDate() + ' '
      const h = date.getHours() + ':'
      const m = date.getMinutes() + ':'
      const s = date.getSeconds()
      return Y + M + D + h + m + s
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .message-bt {
    float: right;
  }
</style>
