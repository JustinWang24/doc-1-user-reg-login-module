# 数据库设计

本模块的数据将主要围绕系统的用户, 学校及其相关子系统之间的关系展开.

## 数据库管理

处于安全考虑, 除超级管理员外, 类似 Laravel 框架, 我司不允许直接链接数据库进行编辑任何表结构与数据, 也不会提供外部访问的机制来访问数据库服务器. 任何针对数据的修改, 只能通过本模块提供的脚本程序来执行.

### 准备工作

由于基于命令行的方式, 加载 Yaf 框架不太方便, 因此对于在开发期间, 使用 migration 工具, 需要找到 `migrations/get_db_connection.example.php` 文件, 拷贝其中内容, 然后在本地生成每个人自己的 `migrations/get_db_connection.php`文件. 该文件被用来在命令行方式下, 正常的获取数据库链接供之后操作数据库时使用.

### 在本地开发环境创建所有数据库表

```bash
php73 migrations/create_tables.php dev
```

### 在本地开发环境生成测试数据

开发人员可根据需求, 按以下的命令, 来生成不同规模的数据

```bash
php73 migrations/database_seeder.php dev ## 创建 15 万条学生数据, 阶段 1
```

或

```bash
php73 migrations/database_seeder_huge.php dev ## 创建 120 万条学生数据, 阶段 2
```

## 用户模块

### 用户表 users: models\User.php

这是一个高频读表

- id: primary, auto increament, unique
- uuid: index, unique
- mobile: index, unique
- password
- status: 当前用户的状态, 例如`等待手机验证`, `等待身份证验证`等
- type: 用户的类型
- remember_token: 用户当前登陆的 token
- created_at
- updated_at
- deleted_at
- last_updated_by
- mobile_verified_at: 表示手机号被验证的时间

### 用户验证码表 user_verifications

进行用户的短信验证码的数据表. 在用户注册的时候, 用户还没有产生 id 的情况下, 就会下发验证码以保证手机号填写正确, 因此这一步的时候, 要依据 mobile 来获取, 而且 purpose 用途为 `注册验证`, user_id 字段为 0. 以后的验证码, 将会出现 user 的 id. 

- id:
- user_id:
- code:
- purpose: 该验证码的用途
- mobile: 该验证码关联的手机号码
- created_at:

### 学生详细信息表  student_profiles

::: warning
TBD 需要最终完成设计
:::

- id:
- uuid:
- user_id:
- name:
- gender:
- country:
- state:
- city:
- postcode:
- address: 家庭住址栏
- address_in_school: 学校的住宿地址
- device: 如果是移动设备, 则此为设备串号
- birthday: 学生的生日
- avatar:
- created_at:
- updated_at:
- ... 更多 待补充

### 用户角色关系表 user_roles

- id
- user_id
- role_id

### 学校用户关系表 grade_users

本表将学校的的各级组织单元和用户(学生和老师)的关系维护在一起. 一个用户可以同时附属于多个组织, 类似一个老师可以管多个班级, 一个学生可以同时读两个学位....

- id
- user_id
- school_id
- campus_id
- institute_id
- department_id
- grade_id
- last_updated_by:
- created_at:
- updated_at:
- deleted_at:

## 角色模块

是否通过角色来进行职位的判定

- id
- name

## 学校模块

### 学校表 schools

- id
- uuid
- name
- max_students_number
- max_employees_number
- created_at
- updated_at
- deleted_at
- last_updated_by

### 校区表 campus

- id
- school_id
- deleted_at
- name
- description

### 学院表 institues

- id
- school_id
- campus_id
- name
- description

### 系表 departments

- id
- school_id
- institue_id
- name
- description

### 专业表 majors

- id
- school_id
- department_id
- name
- description

### 班级表 grades

- id
- school_id
- major_id
- year
- name
- description

## 系统任务模块

该模块是指在学生登陆, 密码找回等过程中, 发生的耗时任务的处理模块. 其基本方式为, 收集好必要的信息, 然后推入到队列服务器中去

### 系统任务表 jobs

- id:
- uuid: 对外可公开的 job 的唯一标识
- type:
- payload_data: 对应需要放入到队列中的相关原数据, json 格式的字符串
- complete: boolean, true 表示完成, false 表示等待中
- result: job 的执行结果描述
- created_at:
- updated_at:
