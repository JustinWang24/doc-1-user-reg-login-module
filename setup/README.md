# 搭建本地的开发环境

## 开发环境

为了提供程序的运行效率, 建议对使用的 PHP 及其模块均使用从源码直接安装编译的方式, 从而让 PHP 只挂载本程序必须的模块.

- 开发环境: PHP7.3.8 + Nginx + MySQL 5.7
- 确保 gcc 和 autoconf 工具已经安装在系统中
- 可能需要的依赖包, 以下是可能用到的, 不是非要必须安装的, 仅供参考

```bash
sudo apt-get install \
build-essential \
gcc \
g++ \
autoconf \
libiconv-hook-dev \
libmcrypt-dev \
libxml2-dev \
libmysqlclient-dev \
libcurl4-openssl-dev \
libjpeg8-dev \
libpng12-dev \
libfreetype6-dev \
```

### 从源码安装 PHP

```bash
cd php-7.3.8
sudo apt-get install libmysqlclient-dev
./configure --prefix=$HOME/softwares/php73 --enable-fpm --with-fpm-user=vagrant --with-fpm-group=vagrant --with-mysqli=/usr/bin/mysql_config --with-zlib --with-curl --with-openssl --enable-mbstring --with-pdo-mysql
make
make test
make install
```

### 从源码安装 Yaf 框架

- Yaf框架安装 3.0.8
  - 进入yaf源码目录 运行 phpize (注意: 如果php 不是通过源码安装的, 那么可能没有phpize命令， 需要通过 sudo apt install php7.2-dev命令进行安装即可)
  - 运行 ./configure - -with-php-config=WHERE_php-config_IS
  - make && make install
  - php.ini 文件中引入 yaf 模块 hahahah

### Nginx 服务器, PHP-FPM 的启动和配置

- 启动 php-fpm:
  - php 安装目录/sbin/php-fpm
  - 启动前确保:
    - php-fpm 程序是可执行的
    - 安装目录/etc/php-fpm.conf 文件存在
    - 安装目录/etc/php-fpm.d/www.conf 文件存在

- 配置 nginx
  - fast_cgi 指向 127.0.0.1:9000

- phpstorm 的 yaf [框架代码提示工具](https://github.com/elad-yosifon/php-yaf-doc)

### 安装 PHP SeasLog 扩展

- 为了获得最佳的性能, 我们使用 SeasLog 扩展作为日志工具
- [下载源码 2.0.2 版](http://pecl.php.net/get/SeasLog-2.0.2.tgz)
- 从源码安装

```bash
phpize73
./configure --with-php-config=/home/vagrant/softwares/php73/bin/php-config
make && make install
```

### 在必要的时候, 安装 PHP redis 扩展

- [下载源码 5.0.2 版](http://pecl.php.net/get/redis-5.0.2.tgz)
- 从源码安装
  
```bash
phpize73

# 可选参数 --enable-redis-igbinary 使用 igbinary 来序列化存储数据
# 可选参数 --enable-redis-msgpack 使用 msgpack 来序列化存储数据 (需要  php-msgpack >= 2.0.3)
# 可选参数 --enable-redis-lzf 在存储到 Redis 之前用 lzf 压缩数据
# 可选参数 --with-liblzf 预安装 lzf 库到系统中
./configure --with-php-config=/home/vagrant/softwares/php73/bin/php-config

make && make install
```

- 通过 phpinfo() 来查看, 确保 redis 被 php-fpm 和 php cli 加载了

### 应用程序配置文件

`/conf/application.ini` 文件是应用的基础配置文件. 由于本模块功能比较单一, 因此只有一个配置文件.

该文件处于安全原因, 并没有包含在代码仓库中, 而是维护了一个`/conf/application.ini.example`文件, 供其他开发人员的参考样例.

```ini
[common]
# 应用程序入口的根目录
application.directory = APPLICATION_PATH  "/application"
# 应用的所有异常处理都将被 Yaf 捕获并移交到 application/controllers/Error.php 处理
application.dispatcher.catchException = TRUE

# 以下为自定义的配置项
## 项目的名称, 用于发送短信是的公司名
application.owner.name.sms = "北京帕菲特"
## 当前应用的版本号
application.current_version = "3.0"
## 应用中使用的 URI
application.uris.login = GLOBAL_URI_PREFIX "user/login"
application.uris.logout = GLOBAL_URI_PREFIX "user/logout"
application.uris.register = GLOBAL_URI_PREFIX "user/reg"
application.uris.updateUserMobileInfo = GLOBAL_URI_PREFIX "user/updateUserMobileInfo"
application.uris.getVerificationCode = GLOBAL_URI_PREFIX "user/getVerificationCode"
application.uris.findUserPasswordInfo = GLOBAL_URI_PREFIX "user/findUserPasswordInfo"

# 自定义的 dev (开发环境下的) 的配置专有配置项: 对应 php.ini 中的 yaf_environ 的值
[dev : common]
## 数据库连接
application.db.driver = "mysql"
application.db.host = "127.0.0.1"
application.db.database = "purfect_auth"
application.db.username = "homestead"
application.db.password = "secret"
application.db.charset = "utf8mb4"
application.db.collation = "utf8mb4_unicode_ci"
application.db.prefix = ""

## 发送短信操作成功后的回调地址 URL
application.callback.verification_code = "http://auth.xipeng.test/api/user/sms-sent"
## 消息推送操作成功后的回调地址 URL
application.callback.push_complete = "http://auth.xipeng.test/api/user/push-complete"

## 短信的发送服务器 URL
application.services.sms.center = "http://sms.xipeng.test/api/send-sms"
## APP内消息推送服务器 URL
application.services.app.push.center = "http://apppush.xipeng.test/api/push-message"
```