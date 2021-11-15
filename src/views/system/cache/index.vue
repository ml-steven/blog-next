<template>
    <div class="app-container">
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" size="mini" @click="clearCache"><svg-icon icon-class="refresh"></svg-icon>清理缓存</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { clearCache } from "@/api/system/common";
export default {
    name: "cache",
    methods: {
        clearCache() {
            clearCache().then((res) => {
                location.reload()
            });
        },
    },
};
</script>

<style lang="scss" scoped>
</style>