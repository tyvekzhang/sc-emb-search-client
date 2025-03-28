# ScEmbSearch-client部署文档

本文档提供了两种部署方式：源码部署和 Docker 部署。

---

## 1. 源码部署

### 1.1 环境准备

在开始部署之前，请确保您的系统已经安装了以下软件并配置了国内下载源：

- **Node.js v20.15.0**（推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node.js 版本）
- **pnpm**（可以通过 `npm install -g pnpm` 安装）
- Git

### 1.2 克隆代码库

将代码库克隆到本地：

```bash
git clone <repository-url>/sc-emb-search-client.git
cd sc-emb-search-client
```

### 1.3 安装依赖

使用 `pnpm` 安装项目所需的依赖：

```bash
pnpm install
```

### 1.4 构建项目

在安装完依赖后，构建项目, 然后配合Nginx搭建前端服务

```bash
pnpm run build
```

### 1.5 启动开发服务器

如果您希望在开发模式下运行项目，可以使用以下命令：

```bash
pnpm run dev
```

默认情况下，开发服务器将在 `http://localhost:3000` 上运行, 可以通过修改scripts下的信息, 自定义端口号

---

## 2. Docker 部署

### 2.1 环境准备

在开始 Docker 部署之前，请确保您的系统已经安装了以下软件：

- **Docker**
- **Docker Compose**

### 2.2 创建 Dockerfile

在项目根目录下创建一个名为 `Dockerfile` 的文件，内容如下：

```Dockerfile
# 使用 Node.js v20.15.0 作为基础镜像
FROM node:20.15.0

# 安装 pnpm
RUN npm install -g pnpm

# 设置 pnpm 的 registry 为阿里云
RUN pnpm config set registry https://registry.npmmirror.com

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install

# 复制项目文件
COPY . .

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["pnpm", "start"]
```

### 2.3 创建 docker-compose.yml 文件

在项目根目录下创建一个名为 `docker-compose.yml` 的文件，内容如下：

```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - CHECK_TIMEOUT=10
    restart: always
```

### 2.4 构建 Docker 镜像

使用以下命令构建 Docker 镜像：

```bash
docker-compose build
```

### 2.5 启动 Docker 容器

使用以下命令启动 Docker 容器：

```bash
docker-compose up -d
```

### 2.6 访问应用

应用将在 `http://localhost:3000` 上运行。

---

## 3. 其他说明

- 如果您需要修改端口号，可以在 `docker-compose.yml` 文件中修改 `ports` 配置。
- 如果您需要在生产环境中使用 HTTPS，请配置反向代理（如 Nginx）并设置 SSL 证书。

---

## 4. 常见问题

### 4.1 如何停止 Docker 容器？

使用以下命令停止 Docker 容器：

```bash
docker-compose down
```

### 4.2 如何查看 Docker 容器的日志？

使用以下命令查看 Docker 容器的日志：

```bash
docker-compose logs -f
```

### 4.3 如何更新依赖？

在源码部署中，您可以运行以下命令更新依赖：

```bash
pnpm install
```

在 Docker 部署中，您需要重新构建 Docker 镜像：

```bash
docker-compose build
docker-compose up -d
```