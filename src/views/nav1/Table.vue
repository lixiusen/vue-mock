<template>
    <section>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getUserList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--列表-->
      <el-table
        :data="users"
        highlight-current-row
        v-loading="listLoading"
        @selection-change="selsChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120" sortable></el-table-column>
        <el-table-column prop="sex" label="性别" width="100" :formatter="formatSex"></el-table-column>
        <el-table-column prop="age" label="年龄" width="100" sortable></el-table-column>
        <el-table-column prop="birth" label="生日" width="120" sortable></el-table-column>
        <el-table-column prop="addr" label="地址" min-width="180"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--批量删除和分页-->
      <el-col :span="24" class="toolbar">
        <el-button type="danger" @click="deleteGroupUser" :disabled="this.sels.length === 0" :loading="listLoading">批量删除</el-button>
        <el-pagination
          layout="prev,pager,next"
          @current-change="handleCurrentChange"
          :page-size="this.pageSize"
          :total="total"
          style="float: right"
        >

        </el-pagination>
      </el-col>
      <!--新增/编辑界面-->
      <el-dialog :title="this.dialogTitle" ref="addForm" :visible.sync="dialogFormVisible" :close-on-click-modal="true">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="addForm.sex">
              <el-radio class="radio" :label="1">男</el-radio>
              <el-radio class="radio" :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker type="date" placelholder="选择日期" v-model="addForm.birth"></el-date-picker>
          </el-form-item>
          <el-form-item label="地址">
            <el-input type="textarea" v-model="addForm.addr"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" v-if="dialogTitle=='新增'" @click.native="addSubmit" :loading="addLoading">提交</el-button>
          <el-button type="primary" v-else @click.native="editSubmit" :loading="editLoading">修改</el-button>
        </div>
      </el-dialog>
    </section>
</template>

<script>
  import {getUserListPage,addUser,editUser,deleteUser,deleteGroup} from "../../api/api";
  import util from '../../common/js/util'
  export default {
      name: "Table",
      data(){
        return{
          listLoading:false,
          editLoading:false,
          addLoading:false,
          dialogFormVisible:false,
          dialogTitle:'新增',
          users:[],
          sels:[],//列表选中项
          filters:{
            name:''
          },
          total:0,
          page:1,
          pageSize:10,
          //新增界面
          addForm:{
            name:'',
            sex:-1,
            age:0,
            birth:'',
            addr:''
          },
          addFormRules:{
            name:[
              {required: true, message:'请输入姓名', trigger:'blur'}
            ]
          },
          //编辑页面
          editForm:{
            id:0,
            name:'',
            sex:-1,
            age:0,
            birth:'',
            addr:''
          },
        }
      },
      mounted:function(){
        this.getUserList();
      },
      methods:{
        getUserList: function () {
          let self = this;
          let para = {
            page: this.page,
            pageSize:this.pageSize,
            name: this.filters.name
          };
          this.listLoading = true;
          getUserListPage(para).then((res) => {
            self.users = res.data.users;
            self.total = res.data.total;
            this.listLoading = false;
          })
        },
        formatSex: function(row,column){
          return row.sex ===1? '男': row.sex === 0? '女':'未知'
        },
        handleCurrentChange: function(val){
          this.page = val;
          this.getUserList();
        },
        getUsers: function () {
          console.log("getUsers")
        },
        handleAdd: function () {
          this.dialogFormVisible = true;
          this.dialogTitle='新增';
          this.addForm = {
            name:'',
            sex:-1,
            age:0,
            birth:'',
            addr:''
          }
        },
        handleEdit: function (row) {
          this.dialogFormVisible = true;
          this.dialogTitle='编辑';
          this.addForm= Object.assign({}, row);
        },
        //新增
        addSubmit: function () {
          this.$refs.addForm.validate((valid) => {
            if(valid){
              this.$confirm('确认提交吗？','提示',{}).then(() =>{
                this.addLoading = true;
                let para = Object.assign({}, this.addForm);
                para.birth = (!para.birth || para.birth == '')?'': util.formatDate.format(new Date(para.birth),'yyyy-MM-dd');
                addUser(para).then((res) => {
                  this.addLoading = false;
                  this.$message({
                    message:res.data.msg,
                    type:'success'
                  });
                  this.dialogFormVisible = false;
                  this.getUserList();
                }).catch(err => {
                  console.log(err);
                })
              })
            }
          })
        },
        //编辑
        editSubmit: function () {
          let self = this;
          this.$refs.addForm.validate((valid) => {
            if(valid){
              this.$confirm('确定修改吗？','提示',{}).then(() => {
                this.addLoading = true;
                let para = Object.assign({}, this.addForm);
                para.birth = (!para.birth || para.birth == '')?'':util.formatDate.format(new Date(para.birth),'yyyy-MM-dd');
                editUser(para).then((res) => {
                  this.addLoading = false;
                  this.$message({
                    message: res.data.msg,
                    type:'success'
                  });
                  this.dialogFormVisible = false;
                  self.getUserList();
                })
              })
            }
          })
        },
        //删除
        deleteUser: function (row) {
          let self = this;
          this.$confirm('确定删除吗？','提示',{}).then(() => {
            let para = row.id;
            deleteUser(para).then((res) => {
              this.$message({
                message:res.data.msg,
                type:'success'
              });
              self.getUserList()
            })
          })
        },
        //全选
        selsChange:function (sels) {
          this.sels = sels;
        },
        deleteGroupUser:function () {
          let self= this;
          let _ids = self.sels.map(item => item.id).toString();
          this.$confirm('确认删除选中数据吗？','提示',{
            type:"warning"
          }).then(() =>{
            this.listLoading= true;
            deleteGroup(_ids).then((res) => {
              this.$message({
                message:res.data.msg,
                type:'success'
              });
              self.getUserList();
            })
          })
        }
      }
    }
</script>

<style scoped lang="scss">
  .toolbar{
    margin: 10px 0px;
    padding: 10px;
    background-color: #f2f2f2;
    .el-form-item{
      margin-bottom: 0;
    }
  }

</style>
