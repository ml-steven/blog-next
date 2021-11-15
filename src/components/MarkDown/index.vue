<template>
    <div class="app-container">
        <mavon-editor class="editor" :ishljs="true" @change="changeContent" ref="md" @imgAdd="$imgAdd" @imgDel="$imgDel" v-model="value" />
    </div>
</template>

<script>
import request from "@/utils/request";
export default {
    name: "markdown",
    props: {
        uploadUrl: {
            type: String,
            default: "/api/upload/single",
        },
        htmlstr:String,
        value:String
    },
    methods: {
        uploadImg(data) {
            const self = this
            return request({
                url: self.uploadUrl,
                method: "post",
                data: data,
            });
        },
        // 绑定@imgAdd event
        $imgAdd(pos, $file) {
            // 第一步.将图片上传到服务器.
            var formdata = new FormData();
            formdata.append("image", $file);
            this.uploadImg(formdata).then((res) => {
                // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                /**
                 * $vm 指为mavonEditor实例，可以通过如下两种方式获取
                 * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
                 * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
                 */
                if (res.code == 200) {
                    this.$refs.md.$img2Url(pos, res.data);
                }
            });
        },
        $imgDel(pos) {
            console.log("del:", pos);
        },
        changeContent(value, render) {
            this.$emit("update:htmlstr", render);
            this.$emit("input", value);
        },
        clearVal(){
            this.$emit("clear");
        }
    },
};
</script>

<style lang="scss" scoped>
.editor {
    height: 600px;
}
</style>