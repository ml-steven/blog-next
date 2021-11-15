<template>
    <div class="app-container">
        <!-- 添加或修改文章标签对话框 -->
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="文章标题" prop="title">
                        <el-input v-model="form.title" placeholder="请输入文章标题" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="文章描述" prop="title">
                        <el-input v-model="form.des" placeholder="请输入描述" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="文章分类" prop="sort_id">
                        <el-select v-model="form.sort_id" placeholder="文章分类" clearable size="small" style="width:100%">
                            <el-option v-for="item in artSorts" :key="item.id" :label="item.sort_name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="文章标签" prop="tag_ids">
                        <el-select v-model="form.tag_ids" multiple placeholder="文章标签" clearable size="small" style="width:100%">
                            <el-option v-for="item in artTags" :key="item.id" :label="item.tag_name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="文章内容" prop="html">
                        <mark-down :htmlstr.sync="form.html" v-model="form.content" ref="mkd"></mark-down>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
</template>

<script>
import {
    getArticle,
    updateArticle,
    createArticle,
} from "@/api/article/article";
import { getArtTagList } from "@/api/article/tag";
import { getArtSortList } from "@/api/article/sort";
import MarkDown from "@/components/MarkDown";

export default {
    name: "articleDetail",
    components: {
        MarkDown,
    },
    data() {
        return {
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                title: [
                    {
                        required: true,
                        message: "文章标题不能为空",
                        trigger: "blur",
                    },
                ],
                des: [
                    {
                        required: true,
                        message: "文章描述不能为空",
                        trigger: "blur",
                    },
                ],
                sort_id: [
                    {
                        required: true,
                        message: "文章分类不能为空",
                        trigger: "change",
                    },
                ],
                content: [
                    {
                        required: true,
                        message: "文章内容不能为空",
                        trigger: "blur",
                    },
                ],
            },
            //分类列表
            artSorts: [],
            //标签列表
            artTags: [],
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            const proa = Promise.all([getArtTagList(), getArtSortList()]);
            proa.then((arrRes) => {
                const [tagRes, sortRes] = arrRes;
                this.artTags = tagRes.data;
                this.artSorts = sortRes.data;
            });
            this.getDetail()
        },
        getDetail() {
            const { id } = this.$route.params;
            if (!id) {
                return;
            }
            getArticle(id).then((res) => {
                this.form = res.data;
            });
        },
        reset() {
            this.form = {};
            this.$refs.mkd.clearVal();
            this.resetForm("form");
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.form.id != undefined) {
                        updateArticle(this.form).then((response) => {
                            if (response.code === 200) {
                                this.msgSuccess("修改成功");
                                this.getDetail();
                            } else {
                                this.msgError(response.msg);
                            }
                        });
                    } else {
                        createArticle(this.form).then((response) => {
                            if (response.code === 200) {
                                this.msgSuccess("新增成功");
                                this.reset();
                            } else {
                                this.msgError(response.msg);
                            }
                        });
                    }
                }
            });
        },
    },
};
</script>