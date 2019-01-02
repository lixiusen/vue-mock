import Mock from 'mockjs';
const LoginUser = [
  {
    id:1,
    username:'admin',
    password:'123456',
    avatar:'https://avatars0.githubusercontent.com/u/25765359?s=400&v=4',
    name:'张某某'
  }
];
const Users=[];
for (let i=0; i<86;i++){
  Users.push(Mock.mock({
    id:Mock.Random.guid(),
    name:Mock.Random.cname(),
    addr:Mock.mock('@county(true)'),
    'age|18-60':1,
    birth:Mock.Random.date(),
    sex:Mock.Random.integer(0,1)
  }))
}

export {LoginUser, Users}
