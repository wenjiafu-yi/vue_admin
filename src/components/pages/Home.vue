<template>
  <div class="wrapper">
    <p class="text">
      欢迎您，
      <span>{{username}}</span>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "linxun"
    };
  },
  computed: {
    username() {
      let username = localStorage.getItem("ms_account");
      if (!username) {
        return this.name;
      }
      return username;
    }
  }
};
</script>

<style>
.wrapper {
  padding: 20px;
  overflow: auto;
  height: 100%;
}
.text {
  color: slateblue;
  font-size: 30px;
  margin-left: 20px;
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>