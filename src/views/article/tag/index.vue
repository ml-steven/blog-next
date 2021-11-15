<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="标签名称" prop="tag_name">
                <el-input v-model="queryParams.tag_name" placeholder="请输入标签名称" clearable size="small" @keyup.enter.native="handleQuery" />
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

        <el-table v-loading="loading" :data="artlist" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="标签名称" align="center" prop="tag_name" :show-overflow-tooltip="true" />
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

        <!-- 添加或修改文章标签对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="780px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="标签名称" prop="tag_name">
                            <el-input v-model="form.tag_name" placeholder="请输入文章标签名称" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="padding-top:20px">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    getArtTag,
    getArtTagList,
    deleteArtTag,
    updateArtTag,
    createArtTag,
} from "@/api/article/tag";

export default {
    name: "articleTag",
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
            // 文章标签表格数据
            artlist: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 状态数据字典
            typeOptions: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                tag_name: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                tag_name: [
                    {
                        required: true,
                        message: "标签名称不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询文章标签列表 */
        getList() {
            this.loading = true;
            getArtTagList(this.queryParams).then((response) => {
                const { rows, count } = response.data;
                this.artlist = rows;
                this.total = count;
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: undefined,
                tag_name: undefined,
            };
            this.resetForm("form");
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
            this.ids = selection.map((item) => item.id);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加文章标签";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getArtTag(id).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = "修改文章标签";
            });
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.form.id != undefined) {
                        updateArtTag(this.form).then((response) => {
                            if (response.code === 200) {
                                this.msgSuccess("修改成功");
                                this.open = false;
                                this.getList();
                            } else {
                                this.msgError(response.msg);
                            }
                        });
                    } else {
                        createArtTag(this.form).then((response) => {
                            if (response.code === 200) {
                                this.msgSuccess("新增成功");
                                this.open = false;
                                this.getList();
                            } else {
                                this.msgError(response.msg);
                            }
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$confirm(
                '是否确认删除文章标签编号为"' + ids + '"的数据项?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(function () {
                    return deleteArtTag(ids);
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