<template>
  <div>
    <el-upload
      :action="url"
      list-type="picture-card"
      accept="image/jpeg,image/png"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :on-success="handleSuccess"
      :limit="5"
      :file-list="fileList"
      :drag="true"
      :before-upload="beforeUpload"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__tip" slot="tip" style="padding-left: 0!important;"></div>
    </el-upload>

    <!--        预览弹出框-->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters, mapState,mapActions,mapMutations} from "vuex"
  import imgSize from "../../../utils/imgSize";
  import {host01Url} from "/src/config/iAxios"

  export default {
    data() {
      return {
        fileList: [],

        introImgs: [],

        dialogImageUrl: '',
        dialogVisible: false,

        url: host01Url+'upload'
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
          type:'category'
        })
        this.transmit(this.introImgs)
      },
      ...mapActions({
        transmit:'IntroImgs/setIntros'
      }),

      handleRemove(file, fileList) {
        this.transmit(null)
        this.introImgs = []
        fileList.forEach(file => {
          this.introImgs.push({
            name:file.name,
            src:file.response,
            type:'category'
          })
        })
        this.transmit(this.introImgs)
      },

      beforeUpload(file, fileList){
        const isJPG = file.type === 'image/jpg'
        const isJPEG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'

        const isLt2M = file.size / 1024 / 1024 < 5;

        if (!isJPG && !isPNG && !isJPEG) {
          this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
          return false
        }

        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 5MB!');
          return false
        }

        let legalSize
        imgSize(file)
          .then(
            (valid) => {},
            (valid) => legalSize=valid
          )
        if (legalSize===false){
          this.$message.error('上传尺寸错误!');
          return false
        }

        return true
      }
    }

  }
</script>

<style scoped>

</style>
