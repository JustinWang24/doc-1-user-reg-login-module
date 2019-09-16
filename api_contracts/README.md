# 接口设计

::: tip

- 对外提供服务的接口表示由外界发起呼叫, 本模块进行被动响应
- 在任何情况下, 本模块需要对外主动发起通信请求时需要实现的接口

:::

*基础约定: 对于用户注册和登陆模块, 其所有的返回数据中的状态码, 均以数字 1 开头, 状态码范围为 1000 - 1999 之间的整数值.*

## 对外提供服务的接口

### 用户登录接口 /api/user/login

本接口响应来自网页端, 移动 APP 端的登陆响应.

#### 1: 请求数据

| 参数名       | 是否必须          | 参数类型  | 说明  |
| ------------- |:-------------:| -----:| -----:|
| version     | Yes | String | 表示当前呼叫方的版本号 |
| name      | Yes      |   String | 登陆的用户名, 可以为手机号码, 邮箱, 昵称等 |
| password | Yes     |    String | 登陆用户的密码 |
| type | Optional     |    Number | 类型(1:校园版,2:商企版,3:教师版) |
| device | Yes     |    String | 推送消息设备码 |
| remember | Optional     |    Number | 显式的指定以后该客户讲一直处于登录状态, 直到手动退出 |

- 请求参数说明
  - device 为原系统的 `deviceinfo`, 是否有必要继续使用?
  - type: 为院系的 `user_apptype`, 是否有必要继续使用?

#### 响应数据: json 格式

```javascript
{
    "code": 1000,   // 登陆操作结果的数字代码
    "message": "",  // 登陆操作结果的文字消息
    "data": {
        // 下一步操作的 token
        "token": "encrypted-token-string", 
        // 最新的版本号: 对应与移动端 APP, 升级时使用
        "version": "",
        // 下一步操作的描述符接口, 非空表示系统强制前端进行某些操作
        "redirect": {
            "action": "Action describer",
            "params": {},
        },
        // 登录的用户的详细数据         
        "user":{
            "id": "user-uuid-string", // 登陆用户的 UUID
            "name": "",               // 用户姓名
            "nickname": "",           // 用户昵称
            "roles":[
                // 登录用户可能的角色数组: 学生, 老师, 管理员, 第三方商户, 第三方合作应用等....
                {
                    "id": "role-id1",
                    "name": "role name1"
                },{
                    "id": "role-id2",
                    "name": "role name2"
                }
                // ... More roles
            ]
        },
        // 登陆用户所属的所有班级, 假设一个用户可能从属于多个班级, 例如老师管 2 个班的情况
        "grades":[
            {
                "id": "school-uuid-string",
                "name": "北京科技大学",
                // 用户所归属的校区
                "campus":{
                    "id":1,
                    "name":"xxx",
                    "description": "yyy yyy"
                },
                // 用户所归属的学院
                "institute":{
                    "id":1,
                    "name":"xxx",
                    "description": "yyy yyy"
                },
                // 用户所归属的系
                "department":{
                    "id":1,
                    "name":"xxx",
                    "description": "yyy yyy"
                },
                // 用户所归属的专业
                "major":{
                    "id":1,
                    "name":"xxx",
                    "description": "yyy yyy"
                },
                // 用户所归属的班级
                "grade":{
                    "id":1,
                    "year": 2017,
                    "name":"xxx",
                    "description": "yyy yyy"
                }
            }
        ]
    }
}
```

::: warning
本接口返回的数据, 只包含用户的数据, 如何进行以后的操作, 应该有前端根据用户的学校, 院系, 部门, 用户类型来实现业务逻辑. 唯一的例外是如果返回的 `redirect` 字段不为`null`或空, 说明系统要求强制客户端(包括 Web 和 APP)完成某些操作, 应答无条件进行解析 `redirect 描述符`, 继而跳转或执行某些操作
:::

---

### 用户注册接口 /api/user/reg

本接口响应来自网页端, 移动 APP 端的登陆响应.

#### 1: 用户注册请求数据

| 参数名       | 是否必须          | 参数类型  | 说明  |
| ------------- |:-------------:| -----:| -----:|
| version     | Yes | String | 表示当前呼叫方的版本号 |
| name      | Yes      |   String | 登陆的用户名, 可以为手机号码, 邮箱, 昵称等 |
| password | Yes     |    String | 登陆用户的密码 |
| type | Yes     |    Number | 类型(1:校园版,2:商企版,3:教师版) |
| role | Yes     |    Number | 是否注注册企业(0:校园版账号,4:商家 ,5:配送员 ,7:企业) |
| school | Yes     |    String | 学校的 ID (UUID) |
| campus | Yes     |    String | 校区的 ID |
| verification_code | Yes     |    String | 注册时的短信验证码 |
| device | Yes     |    String | 推送消息设备码 |
| identification | Optional     |    String | 用户的身份证 |

::: tip
`identification` 是用户的身份证号码, 如果该数据被提交, 并且在系统中存在, 则该学生的状态应该为`已认证`
:::

#### 2: 用户注册响应数据

- 同登陆接口数据

---

### 用户重置密码接口 /api/user/findUserPasswordInfo

- 用户在重置密码表单中先填入手机号, 然后点击获取验证码按钮来要求系统发送验证码

#### 用户重置密码请求接口 第一步

```json
{
    "user": "",  // 用户的手机号
    "type": "type_of_verification" // 1: 用户注册, 2: 找回密码, 3: 更新手机号码
}
```

#### 用户重置密码响应接口 第一步

```json
{
    "code": 1000,   // 结果的状态码
    "message": ""   // 结果的文字描述
}
```

- 用户收到短信验证码之后, 填入验证码和新的密码后提交即可

#### 用户重置密码请求接口 第二步

```json
{
    "user":"",  // 用户的手机号
    "verification_code": "123456", //  验证码
    "password": "", // 新的 password
    "device": ""    // 设备的 ID
}
```

#### 用户重置密码响应接口 第二步

```json
{
    "code": 1000,   // 结果的状态码
    "message": ""   // 结果的文字描述
}
```

---

### 用户退出接口 /api/user/logout

本接口响应来自网页端, 移动 APP 端的登陆响应.

#### 1: 用户退出接口请求数据

| 参数名       | 是否必须          | 参数类型  | 说明  |
| ------------- |:-------------:| -----:| -----:|
| version     | Yes | String | 表示当前呼叫方的版本号 |
| id      | Yes      |   String | 当前登陆的用户 uuid |

#### 2: 用户退出接口响应数据

```json
{
    "code": 1000,   // 用户退出操作结果的数字代码
    "message": "",  // 用户退出操作结果的文字消息
}
```

---

### 修改手机号接口 /api/user/updateUserMobileInfo

本接口响应来自网页端, 移动 APP 端的登陆响应.

#### 1: 修改手机号接口请求数据

| 参数名       | 是否必须          | 参数类型  | 说明  |
| ------------- |:-------------:| -----:| -----:|
| version     | Yes | String | 表示当前呼叫方的版本号 |
| id      | Yes      |   String | 当前登陆的用户 uuid |
| mobile      | Yes      |   String | 新的手机号码 |
| verification_code      | Yes      |   String | 验证码 |
| password      | Yes      |   String | 当前登陆的用户的密码 |

#### 2: 修改手机号接口响应数据

```json
{
    "code": 1000,   // 修改手机号操作结果的数字代码
    "message": "",  // 修改手机号操作结果的文字消息
}
```

## 主动向外界发起的呼叫的接口

### 系统日志服务器写

#### 下列操作应该被记入系统日志中

- 用户登录操作
- 用户注册操作
- 用户登出操作
- 用户修改手机号操作
- 用户找回密码请求操作
- 用户找回密码提交新密码操作

#### 日志请求数据接口

- 参照 RFC 5424 规范和 PHP 的 PRS-3 规范作为设计依据
- [规范文档](https://psr.yue.dev/psr-3/标准建议书.html#概述)

```json
{
    "level": 1, // 1 到 8 分别代表 调试，信息，通知，警告，错误，严重，警报，紧急情况
    "message": {
        "ip": "",   // 提交日志的服务器 ip 地址
        "uri": "",  // 请求的 URI
        "method": "",// 请求的方法
        "client":{
            "ip":"",
            "name": "" // 浏览器名/类型; ios设备类型; android 设备类型
        },
        "memory": { // 服务器性能信息
            "usage": 10, // 内存使用量, 单位为兆
            "peak": 200  // 峰值内存使用量, 单位为兆
        }
    }
}
```

#### 日志请求响应接口

空, 无需响应

---

### 短信发送后的回调接口

在短信发送服务器发送成功之后, 会执行该回调已做后续处理. 后续处理的业务具体逻辑待定

#### 请求数据接口

```json
{
    "code": 1000,   // 回调发起方的执行结果状态码
    "job": "",      // 执行的 job 编号
    "message": ""   // 执行结果文字描述, 成功为空
}
```

#### 响应数据接口

```json
{
    "code": 1000 // 返回结果, 1000 为成功, 999 为重发
}
```

---

### 系统消息队列服务器入列操作

对于任何的耗时操作, 将需要操作的信息写入队列以便之后处理

#### 短信/app内消息推送 发送服务入列请求接口

```json
{
    "job":"job-unique-id",
    "type":"SMS/PUSH",
    "payload": { // Payload 接口
        // 需要入列的任务所需的数据
        "module": "auth",
        // 具体执行该任务的应用服务器程序所需的数据
        "url":"",
        "method":"",
        "data":{ // PayloadData 接口
            // 数据体
            "device": "",   // 消息推送用的目标 ID
            "user": "",     // 关联的用户 ID
            "mobile": "",   // 收信号码
            "message":""    // 短信的内容
        }
    },
    "cb": "" // 入列任务执行完成后的回调 url (回调不会包含数据业务数据, 只通过 job 来执行数据操作)
}
```

#### 短信发送服务入列请求的响应接口

```json
{
    "code": 1000,
    "id": "queue-item-id" // 入列后得到的 ID
}
```

### 云班牌 学校

展示云班牌上的学校信息 学校名称,学校LOGO,校训,轮播视频

#### 云班牌 学校

```json
{
    "code":1000,
    "msg" :"",
    "data": {
        "school_name"  : "学校名称", // 学校名称
        "school_img"   : "学校LOGO", // 学校LOGO
        "school_name"  : "学校名称",// 学校名称
        "school_motto" : "校训",  // 校训
        "school_video" : "轮播视频" // 轮播视频
    }
}
```

### 云班牌 班级

展示云班牌上的班级信息 班级名称,班主任,班长,学生人数,班级照片

#### 云班牌 班级

```json
{
    "code":1000,
    "msg" :"",
    "data": {
        "class_name"    : "班级名称", // 班级名称
        "class_teacher" : "班主任", // 班主任
        "class_number"  : {
            "total" : "20", // 总人数
            "man"   : "10", // 男生
            "woman" : "10", // 女生
        },
        "class_img" : [  //班级风采 返回几个展示几个
            "class_img" : "xxx/xxx.jpg",
            "class_img" : "xxx/xxx.jpg",
            "class_img" : "xxx/xxx.jpg",
        ]
    }
}
```

### 云班牌 课表信息

展示云班牌上的课表信息 课程名称,班主任,班长,学生人数,班级照片

#### 云班牌 课表信息

```json
{
    "code":1000,
    "msg" :"",
    "data":[
        { 
            "number"         : "第5节", // 课节
            "course_time"    : "12:35 - 14:05", // 课程时间
            "course_place"   : "教学楼A栋101室", // 课程地点
            "course_teacher" : "王老师", // 课程老师
            "course_name"    : "计算机科学" //课程名称
        },
        { 
            "number"         : "第5节", // 课节
            "course_time"    : "12:35 - 14:05", // 课程时间
            "course_place"   : "教学楼A栋101室", // 课程地点
            "course_teacher" : "王老师", // 课程老师
            "course_name"    : "计算机科学" //课程名称
        }

    ]
}
```

### 云班牌 考勤统计

展示云班牌上的考勤统计 已签,未签,请假

#### 云班牌 考勤统计

```json
{
    "code":1000,
    "msg" :"",
    "data":
        { 
            "sign"    : "10", // 已签到
            "no_sign" : "10", // 未签到
            "leave"   : "0" // 请假
        }
}
```

### 云班牌 补签二维码

展示云班牌上的二维码 (需要base64 解码来展示二维码图片)

#### 云班牌 补签二维码

```json
{
    "code" : 1000,
    "msg"  : "",
    "data" : "iVBORw0KGgoAAAANSUhEUgAAAbIAAAGyAQM......" // 二维码 base64转成字符串
}
```

### 云班牌 天气信息

展示云班牌上的由华三提供


