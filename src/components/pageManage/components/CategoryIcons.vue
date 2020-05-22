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
      :limit="5"
      :file-list="fileList"
      :drag="true"
      :before-upload="beforeUpload"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__tip" slot="tip" style="padding-left: 0!important;">只能上传jpg/png文件，且不超过512KB</div>
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

  export default {
    data() {
      return {
        calendar:{
          date:'四月廿八',
          year:'庚子',
          solarTerm:'小满'
        },


        fileList: [],

        introImgs: [],

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

        const isLt2M = file.size / 1024 / 1024 < 0.5;

        if (!isJPG && !isPNG && !isJPEG) {
          this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
          return false
        }

        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 512KB!');
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
