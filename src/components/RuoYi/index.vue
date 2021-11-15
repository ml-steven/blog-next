<template>
  <div>
    <svg-icon icon-class="download" @click="handleDownload"/>
  </div>
</template>

<script>
export default {
  name: 'RuoYi',
  data() {
    return {
      url: 'https://gitee.com/ml_steven/blognext'
    }
  },
  methods: {
    handleDownload() {
      window.open(this.url)
    }
  }
}
</script>