![Webpack](https://github.com/Konata09/Live2dOnWeb/workflows/Webpack/badge.svg)  

ENGLISH | [简体中文](https://github.com/Konata09/Live2dOnWeb/blob/master/README_CN.md)

**Add Live2D widget in your website.**  

**[DEMO](https://demo.bronya.moe)**

## Feature

- Base on Cubism SDK 2.1 and Cubism SDK 4, support all live2d model including model3  
- Switch model between different version  
- Play motion and sound by click or touch  
- Show customize message when hover an HTML element  
- Support take picture of model
- Show Hitokoto from API
- jquery free, only 2 javascript file required at least  
- no need for backend  

## Usage

### Prepare model

Put each model in a separate folder.  
Cubism 2 model's entry file should be named `model.json`, Cubism 3/4 model's entry file should be named `FolderName.model3.json`.

### Download script

`dist/live2d_bundle.js` is core file.  
`waifu-tips.js` contains configuration and implementation of message tips.  
`waifu-tips.json` contains content of message tips. Not required if you don't need message tips.

### Configure

Open `waifu-tips.js`, at the beginning there is the Live2D configuration and the model list, 
and at the end there is the CSS style that you can modify for yourself.

#### Live2D configure

```js
const live2d_settings = {
    // basic
    'modelUrl': 'model',                        // URL of a directory which consists of all model folder. NO slash in the end
    'tipsMessage': 'waifu-tips.json',           // message tips file. Can leave blank
    // model
    'modelName': 'paimon',                      // default model name when first visit website
    'modelStorage': true,                       // save model name in broswer
    'modelRandMode': false,                     // random switching model
    'preLoadMotion': false,                     // weather preload motion file. ONLY valid for model3 file,
                                                // not preloading may increase model loading speed, but it may cause jank when trigger motion.
    'tryWebp': true,                            // if broswer support WebP format, will try to load Webp texture first,
                                                // eg. origin texture file is klee.8192/texture_00.png, if enabled, will load klee.8192/texture_00.png.webp FIRST
                                                // will fallback to load origin file if any error occured 
    // tool menu
    'showToolMenu': true,                       // show tools
    'canCloseLive2d': true,                     // show close button
    'canSwitchModel': true,                     // show switch button
    'canSwitchHitokoto': true,                  // show switch Hitokoto button
    'canTakeScreenshot': true,                  // show screenshot button
    'canTurnToHomePage': true,                  // show home button
    'canTurnToAboutPage': true,                 // show about button
    'showVolumeBtn': false,                     // show volume control button, you could implement other logic yourself
    // message tips
    'showHitokoto': true,                       // show Hitokoto when inactive for 30 seconds
    'hitokotoAPI': '',                          // Hitokoto API, can be 'hitokoto.cn'(default), 'lwl12.com', 'jinrishici.com', 'fghrsh.net'
    'showWelcomeMessage': true,                 // show welcome message
    'showF12OpenMsg': true,                     // show message when open console
    'showCopyMessage': true,                    // show copy message. By default it watching copy operation inside '#articleContent' element,
                                                // if your article content is not under this tag, you could search and modify it below.
    // style
    'live2dHeight': 680,                        // height of Live2D model, NO 'px' in the end
    'live2dWidth': 500,                         // width of Live2D model, NO 'px' in the end
    'waifuMinWidth': '1040px',                  // hide model when window width less than setting, eg, '1040px' (Recommend) or 'disable'
    'waifuEdgeSide': 'right:0',                 // position of model, eg, 'left:0' or 'right:30', can be override by model setting
    // misc
    'debug': false,                             // global debug setting
    'debugMousemove': false,                    // log cursor postion to console, valid if debug is true
    'logMessageToConsole': true,                // log message tips to console
    'l2dVersion': '2.0.0',                      // script version
    'homePageUrl': 'https://demo.bronya.moe/',  // homepage, could be URL or 'auto'
    'aboutPageUrl': 'https://github.com/Konata09/Live2dOnWeb/', // about page
    'screenshotCaptureName': 'bronyaMoe.png',   // filename of screenshot, eg, 'live2d.png'
}
```

#### Model list configure

```js
const live2d_models = [
    {
        name: 'paimon',                                     // model name, should be same as folder name
        message: 'SDK4 Emergency Food bilibili@根瘤菌rkzj',  // meassage when switch to this model
        version: 3,                                         // model verion, different version has differnt entry file： 2: model.json , 3: FolderName.model3.json
        // position: 'left'                                 // position of this model
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

### Modify HTML

Add the following code before `</body>` tag in the HTML file or template file:

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
<!--    replace with your path in src    -->
<script src="dist/live2d_bundle.js"></script>
<script async type="module" src="waifu-tips.js"></script>
```

## Acknowledgements

[Cubism Web Framework](https://github.com/Live2D/CubismWebFramework)  
[fghrsh](https://www.fghrsh.net/post/123.html)  
[journey-ad](https://github.com/journey-ad/live2d_src)  
[xiazeyu](https://github.com/xiazeyu/live2d-widget.js)  
EYHN
