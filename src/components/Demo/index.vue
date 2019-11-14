<template>
  <el-dialog
    :visible.sync="visible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    title="提示"
    width="30%">
    <span>{{ value }}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'Demo',
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  },
  computed: {

  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>

</style>
