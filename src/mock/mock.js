import  axios from 'axios';
import MockAdapter from 'axios-mock-adapter';//生成代理api地址
import {LoginUser,Users} from "./data/user";

let _Users = Users;

export default {
  init(){
    let  mock = new MockAdapter(axios);
    mock.onGet('/success').reply(200,{
      msg:'success'
    });

    mock.onGet('/error').reply(500,{
      msg:'failure'
    });

    //登录
    mock.onPost('/login').reply(config => {
      let {username,password} =JSON.parse(config.data);
      return new Promise((resolve,reject) => {
        let user = null;
        setTimeout(() => {
          let hasUser = LoginUser.some(u => {
            if(u.username === username && u.password === password){
              user = JSON.parse(JSON.stringify(u));
              user.password = undefined;
              return true;
            }
          });
          if(hasUser){
            resolve([200,{code:200,msg:'请求成功',user}])
          }else{
            resolve([200,{code:500,msg:'账号或者密码错误'}])
          }
        },1000)
      })
    })
    //获取用户列表
    mock.onGet('/user/list').reply(config => {
      let {name}=config.params;
      let mockUsers = _Users.filter(user => {
        if(name && user.name.indexOf(name) == -1) return false;
        return  true;
      })
      return new Promise((resolve,reject) => {
        setTimeout(() => {
          resolve([200,{
            users:mockUsers//返回所有数据
          }]);
        },1000)
      })
    })
    //获取用户列表（分页）
    mock.onGet('/user/listPage').reply(config => {
      let {page,pageSize,name} = config.params;
      let mockUsers = _Users.filter(user =>{
        if(name && user.name.indexOf(name) == -1 ) return false;
        return true
      });
      let total = mockUsers.length;
      mockUsers = mockUsers.filter(
        (u,index) => index< pageSize * page && index>= pageSize * (page-1)
      );
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200,{
            total:total,
            pageSize:pageSize,
            users:mockUsers//根据分页返回数据
          }])
        },500)
      })
    })
    //新增用户
    mock.onGet('/user/add').reply(config => {
      let {name, addr, age, birth, sex } = config.params;
      _Users.unshift({
        name:name,
        addr:addr,
        age:age,
        birth:birth,
        sex:sex
      });
      return new Promise((resolve,reject) => {
        setTimeout(() => {
          resolve([200,{
            code:200,
            msg:'新增成功'
          }])
        },500)
      })
    });
    //编辑用户
    mock.onGet('/user/edit').reply(config => {
      let {id, name, addr, age, birth, sex} = config.params;
      _Users.some(u => {
        if(u.id === id){
          u.name = name;
          u.addr = addr;
          u.age = age;
          u.birth = birth;
          u.sex = sex;
        }
      });
      var data = config.params;
      return new Promise((resolve, reject) =>{
        setTimeout(() => {
          resolve([200,{
            code:200,
            data: data,
            msg:'修改成功'
          }])
        },500)
      })
    });
    //删除用户
    mock.onGet('/user/delete').reply(config => {
      let id = config.params;
      _Users = _Users.filter(u => u.id !== id);
      return new Promise((resolve,reject) => {
        setTimeout(() => {
          resolve([200,{
            code:200,
            msg:'删除成功'
          }])
        },500)
      })
    });
    //批量删除用户
    mock.onGet('/user/deleteGroup').reply(config => {
      let ids = config.params;
      ids = ids.split(',');
      _Users = _Users.filter(u => !ids.includes(u.id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200,{
            code:200,
            msg:'删除成功'
          }])
        },500)
      })
    })
  }
}
