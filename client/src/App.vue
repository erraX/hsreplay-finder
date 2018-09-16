<template>
  <div id="app">
    <router-view class="main" />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
}

ul {
    list-style: none;
}

ul, li {
    margin: 0;
    padding: 0;
}

a {
    text-decoration: none;
    &:focus {
        outline: none;
    }
}

.navigation {
    width: 250px;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;

    .el-menu {
        height: 100%;

        h1 {
            text-align: center;
        }
    }
}

#app {
    width: 637px;
    margin: auto;
}

.main {
}
</style>
