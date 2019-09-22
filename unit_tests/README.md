# 功能测试

## 性能监控

[xhprof for php 7](https://github.com/longxinH/xhprof)

按照该项目文档进行安装后, 需要完成一下几个步骤:

- 强烈建议安装 `graphviz` 来显示图形化的流程结果以便分析 ( `sudo apt install graphviz` )
- 设置一个虚拟域名, 根目录设置为 `/xhprof/xhprof_html`
- 修改 Yaf 程序的 index.php 文件, 内容参照 index.php.profiling 即可
- 访问返回的链接, 即可看到监控结果

## 单元测试

单元测试是为了保证应用内部的类和方法可以正常实现预想的逻辑的自动化测试手段. 我们期待测试的覆盖率可以尽可能的达到 100%, 但是由于开发进度的要求, 不一定能够满足这个要求. 但以后在维护阶段, 要尽可能的将测试用例的覆盖率提高.

::: tip
在提交代码之前, 必须保证所有测试用例正常通过. 如果因为本地测试数据的差异, 导致某些测试失败, 需要在提交的信息中加以说明.
:::

### 对单个核心类的测试: Unit

该测试组是包含的对单个类的测试. 原则上, 谁实现功能, 谁把测试用例写好.

### 对接口功能逻辑的测试: Feature

该测试组包含的是对某个接口的测试.

## AB测试 (虚拟机配置: 4G/单 cpu)

测试结果: 在此配置下, 在15万条学生数据的背景下, 单次请求(6 次数据库链接), 服务器内部耗时平均约为 110 毫秒, 对比同等 Laravel 框架的结果, 保守估计单核性能提高 5 倍左右. 多核性能暂时无法测试.

下一步可继续进行代码的重构和优化工作, 进一步提高性能的空间还是有的. 优化点:


### 测试 Yaf 框架的性能, 不包含任何应用逻辑, 仅加载所有 PHP 文件并产生一个简单的纯字符串

```bash
ab -n 10000 -c 10 http://auth.xipeng.test/
```

在我本地的虚拟机上的测试结果如下:

```bash
Concurrency Level:      10  # 并发请求数
Time taken for tests:   4.287 seconds # 整个测试持续的时间
Complete requests:      100 # 完成的请求数
Failed requests:        0   # 失败的请求书
Total transferred:      20000 bytes # 整个场景中的网络传输量
HTML transferred:       3700 bytes # 整个场景中的HTML内容传输量
Requests per second:    23.33 [#/sec] (mean) # 吞吐率 平均值
Time per request:       428.718 [ms] (mean) # 用户平均请求等待时间
Time per request:       42.872 [ms] (mean)  # 服务器平均请求处理时间, 同等 Laravel 测试结果大概在 300ms - 400 毫秒
Transfer rate:          4.56 [Kbytes/sec] received # 平均每秒网络上的流量

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.2      0       1
Processing:    54  413  88.3    424     609
Waiting:       54  413  88.4    424     608
Total:         54  413  88.3    424     609

Percentage of the requests served within a certain time (ms)
  50%    424
  66%    458
  75%    469
  80%    484
  90%    510
  95%    541
  98%    601
  99%    609
 100%    609 (longest request) # 最长的响应时间
```

### 测试 Yaf 框架 + 类加载 + 1次数据库读请求连接

```bash
ab -n 100 -c 10 http://auth.xipeng.test/api/user/ab-test/

## 以下为测试结果
Document Path:          /api/user/ab-test/
Document Length:        47 bytes

Concurrency Level:      10
Time taken for tests:   7.679 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      21000 bytes
HTML transferred:       4700 bytes
Requests per second:    13.02 [#/sec] (mean)
Time per request:       767.865 [ms] (mean)
Time per request:       76.787 [ms] (mean, across all concurrent requests)
Transfer rate:          2.67 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.2      0       1
Processing:   129  734 153.7    737    1199
Waiting:      129  734 153.7    737    1199
Total:        129  735 153.7    737    1200

Percentage of the requests served within a certain time (ms)
  50%    737
  66%    787
  75%    846
  80%    863
  90%    892
  95%    915
  98%    979
  99%   1200
 100%   1200 (longest request)
```

### 测试 Yaf 框架 + 类加载 + 6次数据库读请求连接 (相当于用户登录操作), 16万用户量级

```bash
ab -n 100 -c 10 http://auth.xipeng.test/api/user/ab-test/

## 以下为测试结果
Concurrency Level:      10
Time taken for tests:   11.076 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      38700 bytes
HTML transferred:       22400 bytes
Requests per second:    9.03 [#/sec] (mean)
Time per request:       1107.642 [ms] (mean)
Time per request:       110.764 [ms] # 服务器内部实际的处理时间, 按照我的经验, 此指标应该约为 Laravel 框架程序的 1/5
Transfer rate:          3.41 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.2      0       1
Processing:   224 1054 193.1   1086    1366
Waiting:      223 1054 193.1   1086    1366
Total:        224 1055 193.1   1086    1367

Percentage of the requests served within a certain time (ms)
  50%   1086
  66%   1146
  75%   1178
  80%   1205
  90%   1249
  95%   1310
  98%   1364
  99%   1367
 100%   1367 (longest request)
```


### 测试 Yaf 框架 + 类加载 + 6次数据库读请求连接 (相当于用户登录操作), 123万用户量级

```bash
ab -n 100 -c 10 http://auth.xipeng.test/api/user/ab-test/

## 以下为测试结果
Concurrency Level:      10
Time taken for tests:   30.973 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      39800 bytes
HTML transferred:       23500 bytes
Requests per second:    3.23 [#/sec] (mean)
Time per request:       3097.338 [ms] (mean)
Time per request:       309.734 [ms] # 服务器平均请求处理时间 在可以接受的范围范围内
Transfer rate:          1.25 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.2      0       1
Processing:   574 2950 492.8   3016    4170
Waiting:      573 2950 492.8   3016    4170
Total:        574 2950 492.8   3016    4170

Percentage of the requests served within a certain time (ms)
  50%   3016
  66%   3122
  75%   3150
  80%   3172
  90%   3343
  95%   3479
  98%   3707
  99%   4170
 100%   4170 (longest request)
```