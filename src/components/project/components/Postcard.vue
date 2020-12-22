<template>
  <div>
    <el-upload
      action="https://www.freetour.top:721/upload"
      list-type="picture-card"
      accept="image/jpeg,image/png"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :on-success="handleSuccess"
      :on-error="handleError"
      :limit="1"
      :file-list="fileList"
      :drag="true"
      :before-upload="beforeUpload">
      <i class="el-icon-upload"></i>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过512KB</div>
    </el-upload>
    <!--        预览弹出框-->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters, mapState, mapActions, mapMutations} from "vuex"
  import imgSize from "../../../utils/imgSize";
  import {iAxios as axios} from "../../../config/iAxios";

  export default {
    destroyed() {
      this.fileList=[]
    },
    data() {
      return {
        fileList: [],

        postcard: {
          name: '',
          src: '',
          type: 'postcard',
          top: false,
        },

        dialogImageUrl: '',
        dialogVisible: false,

        //加载遮罩层（锁屏）
        loading: null
      }
    },
    methods: {
      ...mapActions({
        transmit: 'Postcard/setPostcard'
      }),

      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleChange(file, fileList) {
      },
      handleSuccess(response, file) {
        this.postcard.name = file.name
        this.postcard.src = file.response
        this.transmit(this.postcard)
        if (this.loading!=null) {
          this.loading.close()
        }
      },
      /*
      file有三种状态(status)：ready(待传输，预览的是url)，success(传输成功)，uploading(正在传输)
      file的属性：url，表示的是本地的blob对象，不论是否成功都有；src，才是服务器端路径，传输成功才有
       */
      handleRemove(file, fileList) {
        if (file.status=='ready')
          return
        let strings = file.response.split('//');
        let url = strings[2].substring(10);

        console.log(url)

        axios.delete('delFile',{
          params:{url:url}
        })
        this.postcard.src = ''
        this.postcard.name = ''
        //引用对象的改变，是指向对象改变，指向不变，只改那个对象的属性值，是监听不到的
        this.transmit(null)
      },
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpg'
        const isPNG = file.type === 'image/png'
        const isJPEG = file.type === 'image/jpeg'
        if (!isJPG && !isPNG && !isJPEG) {
          this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
          return false
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
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
        //必须返一个true，不懂，也不敢问
        return true
      },

      handleError(err, file, fileList){
        this.loading.close()
        this.$message.error('图片'+file.name+'上传失败！')
      }
    }
  }
</script>

<style scoped>

</style>
