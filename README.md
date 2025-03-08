# ScEmbSearch-client

ScDifformer 的客户端程序。

## 1. 环境说明

```shell
node -v
v18.12.0

npm -v
8.19.2
```

使用 `pnpm --version` 检查是否安装包管理器。报错则使用如下方法安装：

安装项目中用到的包管理器，使用`npm install pnpm -g` 安装完成之后，输入 `pnpm --version` 检查版本，输出则表示安装完成。

## 2. 安装依赖

安装依赖，此步骤只需要运行一次

进入项目根目录下，在此目录下打开命令行，输入 `pnpm install`

## 3. 打包

在项目根目录下打开命令行，输入 `pnpm run build` 会将代码进行整合和压缩，以减少文件请求时的大小。运行完成会在根目录下生成 dist 目录

将 dist 打包压缩为`dist.zip`文件以便于传输到服务器。

## 4. 部署

将`dist.zip`传输到对应服务器的 nginx 指定的资源目录下，进行解压即可，配合 nginx 完成部署。

```shell
unzip dist.zip
```
