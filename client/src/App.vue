<template>
  <div id="app">
    <nav class="navigation">
        <el-menu default-active="1">
            <h1>HsReplays</h1>
            <el-menu-item index="1">
                <i class="el-icon-menu"></i>
                <span slot="title">HsReplays</span>
            </el-menu-item>
        </el-menu>
    </nav>
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

.main {
    margin-left: 270px;
}
</style>
