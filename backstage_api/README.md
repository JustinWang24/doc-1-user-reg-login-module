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
"code":1000,
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
	"code": 1000,
	"data": [{
		"id": 1,
		"school_id": 50,
		"campus_id": 0,
		"building_id": 1,
		"name": "教学楼",
		"type": 3,
		"seats": 1,
		"description": null,
		"deleted_at": null,
		"time":[
		    {   
		     "from":"13:38:52",    //开始时间
		     "to":"13:43:52",      //结束时间
		     "room_id":1
		    },
		    {
		    "from":"14:40:00",  
             "to":"15:00:00",
             "room_id":1
		    }
        ]
      
	}]
}
```


### 创建会议接口 /teacher/conference/create

#### 1: 请求数据
| 参数名       | 是否必须     | 参数类型  | 说明       |
| --------    |:----------:| -----:   | -----:    |
|  title      | Yes        | string   | 会议主题   |
| room_id     | Yes        |  string  | 会议室id   |
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
	"code": 1000,
	"msg": "创建成功",
}
```


### 获取会议列表
#### 响应数据
```$xslt
{
	"code": 1000,
	"data": [{
		"id": 4,
		"title": "TO7GvEgXH7",       //会议主题       
		"school_id": 50,             //学校ID
		"user_id": 1,                //用户ID
		"room_id": 1,                //会议室ID
		"sign_out": 0,               //是否签退 0不需要 1需要
		"date": "2019-10-25",        //当天日期
		"from": "13:38:52",          //会议开始时间
		"to": "13:43:52",            //会议结束时间
		"video": 0,                  //是否视频会议 0不需要 1需要
		"remark": null,              //特殊说明
		"status": 0,                 //审核状态 0未审核 1已审核  2已拒绝
		"created_at": "2019-10-25 13:38:52", 
		"updated_at": "2019-10-25 13:38:52",
		"users": {
			"id": 1,
			"uuid": "6fec3fe9-da7a-44a2-9ce1-1a541e931bec",
			"name": "小马",
			"mobile": "18601216091",
			"email": null,
			"type": 1,
			"status": 3,
			"mobile_verified_at": "2019-10-23 10:50:47",
			"created_at": "2019-10-23 10:50:47",
			"updated_at": "2019-10-23 10:50:47"
		},
		"rooms": {
                "id" : 1
                "school_id" : 50
                "campus_id" : 0
                "building_id" : 1
                "name"  : "教学楼"
                "type"  :3
                "seats" : 1
                "description" => null
                "deleted_at" => null
        }

	}]
}
```
