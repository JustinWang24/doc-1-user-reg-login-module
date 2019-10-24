# 接口设计


## 对内提供服务的接口

### 获取参会人员  /teacher/conference/getUsers

#### 1: 请求数据
| 参数名       | 是否必须     | 参数类型  | 说明       |
| --------    |:----------:| -----:   | -----:    |
| from        | Yes        | date     | 会议开始时间|
| to          | Yes        | date     | 会议结束时间|

#### 2:响应数据: json 格式
```$xslt
{
"error_no":1000,
"data":[
        {
            "id":1,  
            "teacher_id":3,               //老师ID
            "name":"Dr. Shyanne Jacobs",  //昵称
            "school_id":1,                //学校ID
            "status":0                    //状态 0:没有会议  1:有会议
        }
    ]
}
```


### 获取会议室 /teacher/conference/getRooms

#### 响应数据  json 格式
```$xslt
{
	"error_no": 1000,
	"data": [{
		"id": 1,
		"school_id": 50,
		"campus_id": 0,
		"building_id": 1,
		"name": "教学楼",
		"type": 3,
		"seats": 1,
		"description": null,
		"deleted_at": null
	}]
}
```


### 创建会议接口 /teacher/conference/create

#### 1: 请求数据
| 参数名       | 是否必须     | 参数类型  | 说明       |
| --------    |:----------:| -----:   | -----:    |
|  title      | Yes        | string   | 会议主题|
| room_id     | Yes        |  string  | 会议室id|
| from        | Yes        | date     | 会议开始时间|
|  to         | Yes        | date     | 会议结束时间|
| user_id     | Yes        | string   | 负责人ID   |
|participant  | Yes        | array    | 参会人ID   |
|sign_out     | No         | string   | 是否需要签退|
|video        | No         | string   | 是否需要视频会议|
|remark       | No         | string   | 特殊说明|


#### 2响应数据  json 格式
```$xslt
{
	"error_no": 1000,
	"msg": "创建成功"
}
```
