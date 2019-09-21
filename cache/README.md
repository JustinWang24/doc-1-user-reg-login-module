# 缓存机制的开发

通常的 API 功能, 如果每个接口, 都通过查询数据库, 然后对数据进行装配之后再返回, 那么很容易对数据库造成过大的压力, 特别是应对大容量高并发场景时, 很容易形成瓶颈. 因此, 如果可以对常用的某些接口, 通过缓存的机制, 减少对数据库服务器进行直接的操作, 那么将会显著的提升系统的容量.

至于对哪些接口, 要执行缓存的操作, 完全取决于实际的需求, 不能千篇一律, 通常情况下, 频繁调用的, 或者数据查询量比较大的, 都可以被考虑进来.

## 搭建思路

我们使用 Redis 作为接口的缓存介质, 同时利用 `phpredis` 扩展, 作为 PHP 与 Redis 服务器的通信接口服务程序. 将这两部分有机的结合起来, 形成一个高效的缓存系统.

### 1: 创建一个中间件类, 作为缓存的起始点

这个中间件类的作用, 是在 Yaf 分发 Request 请求到控制器之前, 进行拦截, 判断是否当前请求的路由, 需要执行缓存的相关操作.

```php
# /application/plugins/CheckAnyActionsNeedToBeCachedPlugin.php

class CheckAnyActionsNeedToBeCachedPlugin extends Yaf_Plugin_Abstract{

    // 需要被缓存的接口路由集合
    private $routesShallBeCached = [
        '/api/cached-action' => 60,    // target_uri 需要被缓存, 过期时间是 60 秒
    ];

    // 通过 dispatchLoopStartup 钩子函数中, 检查当前路由是否在 $routesShallBeCached 中, 进行判定

    public function dispatchLoopStartup(Yaf_Request_Abstract $request, Yaf_Response_Abstract $response){

        // Todo: 我们首先通过 session 的 ID 来获取需要查询的范围

        // Todo: 获取当前路由

        // Todo: 如果需要缓存, 则打上一些标志位, 然后在通过 Yaf 分发到控制器

        // Todo: 没有获取到缓存的数据, 或者不需要缓存, 那么就正常去执行 controller -> action
    }
}
```

### 2: 在需要缓存的接口中, 完成缓存的主要操作

```php
    /**
     * 模拟一个需要缓存的 API 接口的 Action
     */
    public function cachedAction(){
        // Todo: 检查约定的标志位是否存在, 来判断缓存的进一步操作

        // Todo: 检查是否已经取得缓存的数据, 如果已经取得, 就直接返回数据了

        // Todo: 调用执行业务逻辑的方法, 获取数据

        // Todo: 新建/更新缓存数据

        // Todo: 返回响应
    }

    /**
     * 执行业务逻辑的方法样例, 获取数据
     */
    private function cachedActionLogic(Yaf_Request_Abstract $request){
        return [
            'data'=>[]
        ];
    }
```

## 和 Redis 进行交互的驱动, 管理器和工具类的设计

### 1: Redis 的驱动的接口设计

#### 1.1 Redis 驱动接口

该接口定义了通过 phpredis 扩展或者其他第三方 Redis 链接库, 与 Redis 服务器进行链接的标准方法

```php
interface IRedisConnector
{
    const DRIVER_PHP_REDIS  = 'PhpRedis';
    const DRIVER_PREDIS     = 'Predis';

    const SERVER_DEFAULT    = 'default';
    const SERVER_REMOTE     = 'remote';

    /**
     * Create a new PhpRedis connection.
     * 创建一个新的单点的 PhpRedis 连接
     *
     * @param array $config
     * @param array $options
     * @return IRedisConnection
     */
    public function connect($config, $options);

    /**
     * Create the Redis client instance.
     * 创建 PhpRedis 的 Redis 类实例
     *
     * @param  array  $config
     * @return mixed
     */
    public function createClient(array $config);

    /**
     * Establish a connection with the Redis host.
     * 和 redis 服务器建立连接
     *
     * @param  mixed  $client
     * @param  array  $config
     * @return void
     */
    public function establishConnection($client, array $config);
}
```

#### 1.2 Redis 连接接口

该接口定义了与 Redis 服务器进行底层交互的所有方法, 它将保证对 Redis 驱动的解耦

- 包括了例如 `get`, `mget`, `exists` 等等 Redis 服务器所提供的可执行命令的封装
- 由于本接口比较复杂, 详情参照具体代码即可

### 2: Redis 管理器的设计

管理器接口主要负责对外提供其本身维护的 Redis 连接或者连接池, 实现了进一步的解耦

```php
/**
 * Redis 链接管理器的接口定义
 */
interface IRedisManager
{
    /**
     * Get a Redis connection by name.
     * 根据名字获取 Redis 的连接对象
     *
     * @param  string|null  $name
     * @return IRedisConnection
     */
    public function connection($name = null);

    /**
     * Return all of the created connections.
     *
     * @return IRedisConnection[]
     */
    public function connections();
}
```

### 3: Redis 工具类的设计

可以把本接口理解为针对 Redis 的 DAO 层, 本接口主要提供了增删改查的基本方法. 随着业务逐渐复杂, 可以随时扩充本接口的功能.

```php
/**
 * 获取和保存缓存中数据的工具接口 DAO
 */
interface ICacheUtility
{
    /**
     * 根据 Session 的 id 和 Uri 的名字, 获取缓存中的 json 数据
     *
     * @param $sessionId
     * @param $uri
     * @param boolean $dataStringOnly : 如果为真, 表示只返回 data 部分的 json 格式的字符串. 否则返回全部
     * @return mixed
     */
    public function get($sessionId, $uri, $dataStringOnly = true);

    /**
     * 以 session id 和 uri 作为 key, 将 $json 数据保存到缓存中.
     * 如果存在, 就更新 redis 中的值. 如果不存在, 就创建它.
     * 这个方法可以替代 create 方法, 但是会多执行 2 个 redis 查询
     *
     * @param $sessionId
     * @param $uri
     * @param $jsonString
     * @param int $expiredIn: 在多少秒之后过期
     * @return int
     */
    public function update($sessionId, $uri, $jsonString, $expiredIn=0);

    /**
     * 以 session id 和 uri 作为 key, 创建一条新的记录
     *
     * @param $sessionId
     * @param $uri
     * @param $jsonString
     * @param int $expiredIn
     * @return int
     */
    public function create($sessionId, $uri, $jsonString, $expiredIn = 0);

    /**
     * 删除 session id 和 uri 指定的值
     *
     * @param $sessionId
     * @param $uri
     * @return void
     */
    public function delete($sessionId, $uri);

    /**
     * 重置 session id 和 uri 指定的过期时间在 $expiredIn 秒之后
     *
     * @param $sessionId
     * @param $uri
     * @param int $expiredIn
     * @return void
     */
    public function expire($sessionId, $uri, $expiredIn);
}
```

### 4: 具体的实现

实现思路为:

- 以 Session ID, 结合路由名称, 作为缓存的 Key
- 全部采用 Hash 结构保存数据
- 数据保存的格式为

```php
'session-id_route-name' => [            // 以 Session ID, 结合路由名称, 作为缓存的 Key
    'md'    => 'md5-string',            // 数据的校验位, 可以用来判断是否需要更新等
    'data'  => 'json-format-string',    // 实际被缓存的数据, 是 json 格式的字符串
]
```

### 5: 验证测试用例

对工具类的所有方法编写测试用例, 确保工作正常, 覆盖率 100%
