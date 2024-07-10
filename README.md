# 项目简介

**to-do List** 是一个简洁而高效的任务管理工具，旨在帮助用户组织和跟踪日常任务和目标。通过直观的界面和实用的功能，用户可以轻松添加、编辑和删除任务，确保所有待办事项都井然有序。

## 环境准备

在开始之前，请确保您的开发环境已安装以下软件：

- Node.js
- npm 或 yarn（包管理工具）
- MySQL 数据库

## 1. 克隆仓库

打开终端或命令提示符，使用以下命令克隆项目仓库到本地：

```bash
git clone https://github.com/Stardreama/To-do-list.git
```

## 2. 安装MySQL数据库

如果尚未安装MySQL，请下载并安装。然后，创建一个新的数据库用于To-do List项目：
在终端中输入```mysql -u your_username -p your_password```登陆到mysql,再输入以下命令

```mysql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS todolistuser;

-- 使用该数据库
USE todolistuser;

-- 创建 userinfo 表
CREATE TABLE IF NOT EXISTS userinfo (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- 创建 usertask 表
CREATE TABLE IF NOT EXISTS usertask (
    userid VARCHAR(36) NOT NULL,
    taskid VARCHAR(36) NOT NULL,
    taskinfo TEXT NOT NULL,
    ddl DATE NOT NULL,
    status TINYINT(1) NOT NULL
);
```

## 3. 配置数据库

在项目根目录下的server.js中找到数据库配置文件，设置数据库连接信息：

```js
// server.js
module.exports = {
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'todolist',
  port:3306
};
```

## 4. 安装依赖

进入项目目录，使用npm安装所有依赖项：

```bash
cd To-do-list
npm install
```

## 5. 启动本地服务器

在todolist文件夹下使用命令```node server.js``` 来启动本地服务器

## 6. 启动项目

在todolist文件夹下使用命令```npm start``` 来启动项目

## 7. 访问应用

在浏览器中访问 ```http://localhost:3301```，查看To-do List应用。
