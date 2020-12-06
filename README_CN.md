![Webpack](https://github.com/Konata09/Live2dOnWeb/workflows/Webpack/badge.svg)

[ENGLISH](https://github.com/Konata09/Live2dOnWeb/blob/master/README.md) | 简体中文

**在网页中添加 Live2D 模型。**

**[DEMO](https://demo.bronya.moe)**

## 特性

- 基于 Cubism SDK 2.1 和 Cubism SDK 4，支持包括 model3 在内的目前全部版本的 Live2D 模型
- 支持在不同版本的模型之间切换
- 支持鼠标点击触发动作并播放音频
- 支持自定义鼠标指针移向指定 HTML 元素时的提示信息
- 支持截图、一言、跳转首页
- 无需 jquery，最少只需要引入两个 js 文件即可使用
- 无需后端

## 使用

### 准备模型

每个模型一个文件夹，其中 Cubism 2 版本模型的入口文件名为 `model.json`，Cubism 3 以上版本入口文件名为 `文件夹名.model3.json`。

### 下载脚本

`dist` 目录下的 `live2d_bundle.js` 是核心文件  
主目录下的 `waifu-tips.js` 是配置文件和提示消息的实现代码  
主目录下的 `waifu-tips.json` 是提示消息的内容配置，非必须

### 修改配置

打开 `waifu-tips.js`，在文件开始处有看板娘配置和模型列表配置，文件末尾处有相关 CSS，可以根据喜好自己修改。

#### 看板娘配置

```js
const live2d_settings = {
    // 基本设置
    'modelUrl': 'model',                        // 存放模型的文件夹路径，末尾不需要斜杠
    'tipsMessage': 'waifu-tips.json',           // 看板娘提示消息文件的路径，可以留空不加载
    // 模型设置
    'modelName': 'paimon',                      // 默认加载的模型名称，仅在无本地记录的情况下有效
    'modelStorage': true,                       // 记忆模型，下次打开页面会加载上次选择的模型
    'modelRandMode': false,                     // 随机切换模型
    'preLoadMotion': false,                     // 是否预载动作数据，只对 model3 模型有效，不预载可以提高 model3 模型的加载速度，但可能导致首次触发动作时卡顿
    'tryWebp': true,                            // 如果浏览器支持 WebP 格式，将优先加载 WebP 格式的贴图，例如默认贴图文件为 klee.8192/texture_00.png，
                                                // 启用后将优先加载 klee.8192/texture_00.png.webp，文件不存在会自动 fallback
    // 工具栏设置
    'showToolMenu': true,                       // 显示 工具栏
    'canCloseLive2d': true,                     // 显示 关闭看板娘 按钮
    'canSwitchModel': true,                     // 显示 模型切换 按钮
    'canSwitchHitokoto': true,                  // 显示 一言切换 按钮
    'canTakeScreenshot': true,                  // 显示 看板娘截图 按钮
    'canTurnToHomePage': true,                  // 显示 返回首页 按钮
    'canTurnToAboutPage': true,                 // 显示 跳转关于页 按钮
    'showVolumeBtn': false,                     // 显示 音量控制 按钮，仅作显示，相关逻辑需自己实现
    // 提示消息设置
    'showHitokoto': true,                       // 空闲时显示一言
    'hitokotoAPI': '',                          // 一言 API，可选 'hitokoto.cn'(默认), 'lwl12.com', 'jinrishici.com'(古诗词), 'fghrsh.net'
    'showWelcomeMessage': true,                 // 显示进入页面欢迎词
    'showCopyMessage': true,                    // 显示复制内容提示，默认只对 '#articleContent' 元素内的复制进行监视，如果你的文章内容不在这个标签下，可以在下方搜索并修改
    'showF12OpenMsg': true,                     // 显示控制台打开提示
    //看板娘样式设置
    'live2dHeight': 680,                        // 看板娘高度，不需要单位
    'live2dWidth': 500,                         // 看板娘宽度，不需要单位
    'waifuMinWidth': '1040px',                  // 页面小于宽度小于指定数值时隐藏看板娘，例如 'disable'(禁用)，推荐'1040px'
    'waifuEdgeSide': 'right:0',                 // 看板娘贴边方向，例如 'left:0'(靠左 0px)，'right:30'(靠右 30px)，可以被下面的模型设置覆盖
    // 其他杂项设置
    'debug': false,                             // 全局 DEBUG 设置
    'debugMousemove': false,                    // 在控制台打印指针移动坐标，仅在 debug 为 true 时可用
    'logMessageToConsole': true,                // 在控制台打印看板娘提示消息
    'l2dVersion': '2.0.0',                      // 当前版本
    'homePageUrl': 'https://demo.bronya.moe/',  // 主页地址，可选 'auto'(自动), '{URL 网址}'
    'aboutPageUrl': 'https://github.com/Konata09/Live2dOnWeb/', // 关于页地址, '{URL 网址}'
    'screenshotCaptureName': 'bronyaMoe.png',   // 看板娘截图文件名，例如 'live2d.png'
}
```

#### 模型列表配置

模型请统一放在上方的 `modelUrl` 下，每个模型单独一个文件夹

```js
const live2d_models = [
    {
        name: 'paimon',                                     // 模型名称要与文件夹名相同
        message: 'SDK4 Emergency Food bilibili@根瘤菌rkzj',  // 切换时的提示信息
        version: 3,                                         // 模型版本，model3.json 结尾的都填3，model.json 结尾的填2
        // position: 'left'                                 // 此模型的显示位置，会覆盖上面的全局设置，只对此模型生效
    },
    {
        name: 'miku',
        message: 'SDK2.1 official sample 初音ミク <a href="https://www.live2d.com/eula/live2d-free-material-license-agreement_en.html">LICENSE</a>',
        version: 2
    },
    {
        name: 'shizuku',
        message: 'SDK2.1 official sample しずく <a href="https://www.live2d.com/eula/live2d-free-material-license-agreement_en.html">LICENSE</a>',
        version: 2
    },
    {
        name: 'houmuya',
        message: 'SDK3 bronya bilibili@呦克里斯汀娜呦',
        version: 3
    },
    {
        name: 'Rice',
        message: 'SDK4 official sample Rice <a href="https://www.live2d.com/eula/live2d-free-material-license-agreement_en.html">LICENSE</a>',
        version: 3
    },
]
```

### 修改 HTML

参考项目根目录的 `index.html` 文件，在 HTML 或者模板文件的 `</body>` 前加入以下内容：  

```html
<div id="waifu">
    <div id="waifu-message"></div>
    <div class="waifu-tool">
        <span class="icon-next"></span>
        <span class="icon-home"></span>
        <span class="icon-message"></span>
        <span class="icon-camera"></span>
        <span class="icon-volumeup"></span>
        <span class="icon-volumedown"></span>
        <span class="icon-about"></span>
        <span class="icon-cross"></span>
    </div>
    <canvas id="live2d2"></canvas>
    <canvas id="live2d4"></canvas>
</div>
<!--    src 中改为你存放的路径    -->
<script src="dist/live2d_bundle.js"></script>
<script async type="module" src="waifu-tips.js"></script>
```

## 致谢

[Cubism Web Framework](https://github.com/Live2D/CubismWebFramework)  
[fghrsh](https://www.fghrsh.net/post/123.html)  
[journey-ad](https://github.com/journey-ad/live2d_src)  
[xiazeyu](https://github.com/xiazeyu/live2d-widget.js)  
EYHN
