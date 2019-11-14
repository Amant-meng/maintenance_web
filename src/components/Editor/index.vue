<template>
  <div id="wangeditor">
    <div ref="editorElem" style="text-align:left"/>
  </div>
</template>
<script>
import E from 'wangeditor'
export default {
  name: 'EditorElem',
  props: {
    catchData: {
      type: Function,
      default: () => {

      }
    },
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null,
      editorContent: ''
    }
  }, // 接收父组件的方法
  watch: {
    content() {
      this.editor.txt.html(this.content)
    }
  },
  mounted() {
    this.editor = new E(this.$refs.editorElem)
    this.editor.customConfig.onchange = (html) => {
      this.editorContent = html
      this.catchData(this.editorContent) // 把这个html通过catchData的方法传入父组件
    }
    this.editor.customConfig.uploadImgServer = '你的上传图片的接口'
    this.editor.customConfig.uploadFileName = '你自定义的文件名'
    this.editor.customConfig.menus = [ // 菜单配置
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'emoticon', // 表情
      'undo', // 撤销
      'redo' // 重复
    ]
    this.editor.create() // 创建富文本实例
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  #wangeditor {
    width: 50rem;
  }
</style>
