# 三城天气仪表板 🌤️

实时展示湖北荆州、四川德阳和上海三座城市的天气信息，每小时自动更新。

## ✨ 功能特点

- 🌍 **三城市天气**：实时显示荆州、德阳、上海的天气状况
- 🔄 **自动更新**：每小时自动刷新天气数据
- 🎨 **现代设计**：玻璃态效果、渐变背景、流畅动画
- 📱 **响应式布局**：完美适配桌面、平板和手机
- ⚡ **快速加载**：优化的性能和加载体验

## 🛠️ 技术栈

- **前端**：HTML5, CSS3, Vanilla JavaScript
- **API**：OpenWeatherMap API
- **部署**：Netlify (免费托管)

## 📦 项目结构

```
weather-dashboard/
├── index.html          # 主页面
├── style.css          # 样式文件
├── script.js          # JavaScript 逻辑
├── netlify.toml       # Netlify 配置
└── README.md          # 项目说明
```

## 🚀 本地运行

### 方法一：直接打开

1. 克隆或下载此项目
2. 直接在浏览器中打开 `index.html` 文件

### 方法二：使用本地服务器

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js (http-server)
npx http-server

# 使用 PHP
php -S localhost:8000
```

然后在浏览器访问 `http://localhost:8000`

## 🔑 API 密钥配置

此项目已配置 API 密钥。如需使用自己的密钥：

1. 前往 [OpenWeatherMap](https://openweathermap.org/api) 注册免费账号
2. 获取 API 密钥
3. 在 `script.js` 文件中修改 `API_KEY` 变量：

```javascript
const API_KEY = '你的API密钥';
```

## 🌐 部署到 Netlify

### 方法一：拖放部署（最简单）

1. 访问 [Netlify](https://www.netlify.com/)
2. 注册/登录账号
3. 将整个 `weather-dashboard` 文件夹拖放到 Netlify 的部署区域
4. 等待部署完成，获取 URL

### 方法二：Git 部署

1. 将项目推送到 GitHub/GitLab
2. 在 Netlify 中选择 "New site from Git"
3. 连接你的仓库
4. 配置构建设置（本项目无需构建步骤）
5. 点击 "Deploy site"

### 方法三：Netlify CLI

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod
```

## 🔄 自动更新说明

天气数据每小时自动更新一次。更新机制：

- 页面加载时立即获取最新数据
- 使用 `setInterval` 每 3,600,000 毫秒（1小时）自动刷新
- 显示最后更新时间戳
- 如遇错误会显示友好的错误提示

## 📱 响应式设计

- **桌面**：三栏网格布局
- **平板**：自动调整为合适布局
- **手机**：单栏垂直布局

## 🎨 设计特色

- **玻璃态效果**：使用 `backdrop-filter` 实现毛玻璃效果
- **渐变动画**：动态渐变背景和文字效果
- **悬停交互**：卡片悬停时的平滑过渡和光晕效果
- **加载动画**：优雅的加载状态提示
- **浮动动画**：天气图标的浮动效果

## 🌍 支持的天气状况

应用支持所有 OpenWeatherMap 提供的天气状况，包括：

- ☀️ 晴天
- ⛅ 多云
- 🌧️ 雨天
- ⛈️ 雷暴
- ❄️ 下雪
- 🌫️ 雾霾

## 📊 显示的天气信息

每个城市卡片显示：

- **温度**：当前温度（摄氏度）
- **天气描述**：中文天气状况描述
- **湿度**：空气湿度百分比
- **风速**：风速（km/h）
- **体感温度**：实际感受到的温度

## 🔧 自定义

### 添加更多城市

在 `script.js` 中修改 `CITIES` 数组：

```javascript
const CITIES = [
    {
        id: 'city-id',
        name: '城市名',
        lat: 纬度,
        lon: 经度
    }
];
```

### 修改更新频率

在 `script.js` 中修改 `setInterval` 的时间参数：

```javascript
// 例如：30分钟更新一次（1,800,000 毫秒）
setInterval(loadAllWeatherData, 1800000);
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题或建议，欢迎反馈。

---

**享受实时天气监测！** 🌈
