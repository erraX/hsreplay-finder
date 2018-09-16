<template>
<div class="page-replays">
    <el-form class="form-filter" :inline="true" label-width="100px">
        <el-form-item label="职业：">
            <el-select placeholder="请选择职业">
            </el-select>
        </el-form-item>
        <el-form-item label="套牌：">
            <el-select placeholder="请选择套牌">
            </el-select>
        </el-form-item>
        <el-form-item label="只显示获胜：">
            <el-switch
                active-color="#13ce66"
                inactive-color="#e0e0e0">
            </el-switch>
        </el-form-item>
        <el-form-item label="排名：">
            <span>传说</span>
            <el-switch
                active-color="#13ce66"
                inactive-color="#e0e0e0">
            </el-switch>
            <el-form-item>
                <el-button type="primary">查询</el-button>
            </el-form-item>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
export default {
}
</script>

<style lang="less">
</style>
