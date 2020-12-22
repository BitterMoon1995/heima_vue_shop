<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>置顶管理</el-breadcrumb-item>
      <el-breadcrumb-item>热搜管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-button type="primary" @click="addDialog=true">新增热搜</el-button>
      </el-row>
      <el-table :data="hotList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="内容">
          <template v-slot="data">
            <el-input style="width: 140px" v-model="data.row.content"
                      @blur="handleChange(data.row)" class="theshy">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="顺序">
          <template v-slot="data">
            <el-input style="width: 140px" v-model="data.row.orderNum"
                      oninput = "value=value.replace(/[^\d]/g,'')" maxlength="3"
                      @blur="handleChange(data.row)" class="theshy">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="data">
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle @click="del(data.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="新增热搜" :visible.sync="addDialog">
      <el-form :model="addForm" label-width="100px" :rules="rules" ref="addRef">
        <el-form-item label="内容" prop="content">
          <el-input v-model="addForm.content"></el-input>
        </el-form-item>
        <el-form-item label="顺序" prop="orderNum">
          <el-input v-model="addForm.orderNum"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addScene">确 定</el-button>
    </span>
    </el-dialog>
  </div>

</template>

<script>
  import {iAxios as axios} from "axios";

  export default {
    created() {
      axios.defaults.baseURL = "https://www.freetour.top:721/mini/search"
      this.getHotList()
    },
    data() {
      return {
        hotList:[],
        addDialog: false,
        addForm: {
          content: '',
          orderNum: '',
          hot: 1
        },

        rules: {
          name: [
            {required: true, message: '请输入内容', trigger: 'blur'},
          ],
          orderNum: [
            {required: true, message: '请输入排名顺序', trigger: 'blur'},
          ]
        }
      }
    },
    methods: {
      async getHotList() {
        await axios.get('/getHot')
        .then(res=>{
          console.log(res.data)
          this.hotList = res.data
        })
      },
      async handleChange(changeItem) {
        console.log(changeItem)
        let {data}=await axios.post('/change',changeItem)
        if (data.info.code===400){
          this.$message.error(data.info.msg)
        }
      },
      addScene() {
        this.$refs.addRef.validate(async valid=>{
          if (!valid) return
          await axios.post('/addHot', this.addForm)
          .then(res=>{
            this.addDialog = false
            location.reload()
          })
        })
      },
      del(id) {
        axios.delete('/delHot',{
          params:{id:id}
        }).then(function () {
          location.reload()
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .theshy{
    width: 250px !important;
  }
</style>
