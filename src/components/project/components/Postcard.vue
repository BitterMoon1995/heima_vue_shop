<template>
  <div>
    <el-upload
      action="http://localhost:2020/upload"
      list-type="picture-card"
      accept="image/jpeg,image/png"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :on-success="handleSuccess"
      :limit="1"
      :file-list="fileList"
      :drag="true"
      :before-upload="beforeUpload"
      multiple>
      <i class="el-icon-plus"></i>
    </el-upload>
    <!--        预览弹出框-->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters, mapState, mapActions, mapMutations} from "vuex"

  export default {
    data() {
      return {
        fileList: [],

        postcard: null,

        dialogImageUrl: '',
        dialogVisible: false,

      }
    },
    methods:{
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleChange(file, fileList){
      },
      handleSuccess(response,file){
        this.introImgs.push({
          name:file.name,
          src:file.response,
          type:'swiper',
          top:false
        })
        this.postcard=this.introImgs[0]
        this.transmit(this.postcard)
      },
      ...mapActions({
        transmit:'Postcard/setPostcard'
      }),

      handleRemove(file, fileList) {
        this.introImgs = []
        fileList.forEach(file => {
          this.introImgs.push({
            name:file.name,
            src:file.response,
            type:'swiper',
            top:false
          })
        })
        this.postcard=null
      },
      beforeUpload(file, fileList){
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/jpng'

        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG&&!isPNG) {
          this.$message.error('上传图片只能是 JPG或PNG 格式!');
        }

        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>

<style scoped>

</style>
