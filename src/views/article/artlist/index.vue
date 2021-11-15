<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="queryParams.title" placeholder="请输入文章标题" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="文章分类" prop="sort_id">
                <el-select v-model="queryParams.sort_id" placeholder="文章分类" clearable size="small" style="width: 240px">
                    <el-option v-for="sort in artSorts" :key="sort.id" :label="sort.sort_name" :value="sort.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="文章标签" prop="tag_id">
                <el-select v-model="queryParams.tag_id" placeholder="文章标签" clearable size="small" style="width: 240px">
                    <el-option v-for="tag in artTags" :key="tag.id" :label="tag.tag_name" :value="tag.id" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
            </el-col>
        </el-row>

        <el-table v-loading="loading" :data="artList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="文章标题" align="center" prop="title" :show-overflow-tooltip="true" />
            <el-table-column label="文章描述" align="center" prop="des" :show-overflow-tooltip="true" />
            <el-table-column label="文章分类" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-tag effect="dark">{{getSort(scope.row.sort_id)}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="文章标签" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <div class="tag-container">
                        <el-tag v-for="tag in scope.row.tags" :key="tag.id" type="success" class="tag-info">
                            {{tag.tag_name}}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="文章内容" align="center" prop="content" :show-overflow-tooltip="true" />
            <el-table-column label="创建者" align="center" prop="create_by" width="100" />
            <el-table-column label="创建时间" align="center" prop="created_at" width="100">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.created_at, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="更新者" align="center" prop="update_by" width="100" />
            <el-table-column label="更新时间" align="center" prop="updated_at" width="100">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.updated_at, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </div>
</template>

<script>
import { getArticleList, deleteArticle } from "@/api/article/article";
import { getArtTagList } from "@/api/article/tag";
import { getArtSortList } from "@/api/article/sort";

export default {
    name: "artlist",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // 文章表格数据
            artList: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                tag_id: undefined,
                sort_id: undefined,
                title: undefined,
            },
            //文章分类列表
            artSorts: [],
            //文章分类列表
            artTags: [],
        };
    },
    created() {
        this.init();
    },
    methods: {
        getSort(id) {
            if (this.artSorts.length == 0) return "";
            const { sort_name } = this.artSorts.find((sort) => sort.id === id);
            return sort_name ? sort_name : "";
        },
        getTags(ids) {
            return this.artTags.map((tag) => {
                if (ids.includes(tag.id)) {
                    return tag.tag_name;
                }
            });
        },
        init() {
            const proa = Promise.all([
                getArtTagList(),
                getArtSortList(),
                getArticleList(this.queryParams),
            ]);
            proa.then((arrRes) => {
                const [tagRes, sortRes, listRes] = arrRes;
                this.artTags = tagRes.data;
                this.artSorts = sortRes.data;

                const { rows, count } = listRes.data;
                this.artList = rows;
                this.total = count;
                this.loading = false;
            });
        },
        /** 查询文章标签列表 */
        getList() {
            this.loading = true;
            getArticleList(this.queryParams).then((response) => {
                const { rows, count } = response.data;
                this.artList = rows;
                this.total = count;
                this.loading = false;
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.noticeId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.$router.push({
                path: "/artlist/detail",
            });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            const id = row.id || this.ids;
            this.$router.push({
                path: `/artlist/detail/${id}`,
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$confirm(
                '是否确认删除文章编号为"' + ids + '"的数据项?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(function () {
                    return deleteArticle(ids);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                })
                .catch(function () {});
        },
    },
};
</script>

<style scoped lang='scss'> 
.tag-container{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .tag-info{
        margin-right: 5px;
        margin-bottom: 5px;
    }
}
</style>