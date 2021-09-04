/*****************************************************************************************************
 く__,.ヘヽ.　　　　/　,ー､ 〉
 　　　　　＼ ', !-─‐-i　/　/´
 　　　 　 ／｀ｰ'　　　 L/／｀ヽ､                 Live2D Widget Setting
 　　 　 /　 ／,　 /|　 ,　 ,　　　 ',               Version 2.0.0
 　　　ｲ 　/ /-‐/　ｉ　L_ ﾊ ヽ!　 i                     Konata
 　　　 ﾚ ﾍ 7ｲ｀ﾄ　 ﾚ'ｧ-ﾄ､!ハ|　 |
 　　　　 !,/7 '0'　　 ´0iソ| 　 |　　　
 　　　　 |.从"　　_　　 ,,,, / |./ 　 |      Add Live2D widget in your website.
 　　　　 ﾚ'| i＞.､,,__　_,.イ / 　.i 　|
 　　　　　 ﾚ'| | / k_７_/ﾚ'ヽ,　ﾊ.　|       Thanks:
 　　　　　　 | |/i 〈|/　 i　,.ﾍ |　i　|    fghrsh / https://www.fghrsh.net/post/123.html
 　　　　　　.|/ /　ｉ： 　 ﾍ!　　＼　|       journey-ad / https://github.com/journey-ad/live2d_src
 　　　 　 　 kヽ>､ﾊ 　 _,.ﾍ､ 　 /､!         xiazeyu / https://github.com/xiazeyu/live2d-widget.js
 　　　　　　 !'〈//｀Ｔ´', ＼ ｀'7'ｰr'      Cubism Web Framework & All model authors.
 　　　　　　 ﾚ'ヽL__|___i,___,ンﾚ|ノ
 　　　　　 　　　ﾄ-,/　|___./
 　　　　　 　　　'ｰ'　　!_,.
 ****************************************************************************************************/
const live2d_settings = {
    // 基本设置
    'modelUrl': 'model',                        // 存放模型的文件夹路径，末尾不需要斜杠
    'tipsMessage': 'waifu-tips.json',           // 看板娘提示消息文件的路径，可以留空不加载
    // 模型设置
    'modelName': 'paimon',                      // 默认加载的模型名称，仅在无本地记录的情况下有效
    'modelStorage': true,                       // 记忆模型，下次打开页面会加载上次选择的模型
    'modelRandMode': false,                     // 随机切换模型
    'preLoadMotion': true,                      // 是否预载动作数据，只对 model3 模型有效，不预载可以提高 model3 模型的加载速度，但可能导致首次触发动作时卡顿
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
    'waifuMinWidth': 'disable',                 // 页面小于宽度小于指定数值时隐藏看板娘，例如 'disable'(禁用)，推荐 '1040px'
    'waifuEdgeSide': 'right:0',                 // 看板娘贴边方向，例如 'left:0'(靠左 0px)，'right:30'(靠右 30px)，可以被下面的模型设置覆盖
    // 其他杂项设置
    'debug': true,                              // 全局 DEBUG 设置
    'debugMousemove': false,                    // 在控制台打印指针移动坐标，仅在 debug 为 true 时可用
    'logMessageToConsole': true,                // 在控制台打印看板娘提示消息
    'l2dVersion': '2.0.0',                      // 当前版本
    'homePageUrl': 'https://rivens.bronya.moe/',  // 主页地址，可选 'auto'(自动), '{URL 网址}'
    'aboutPageUrl': 'https://github.com/Konata09/Live2dOnWeb/', // 关于页地址, '{URL 网址}'
    'screenshotCaptureName': 'bronyaMoe.png',   // 看板娘截图文件名，例如 'live2d.png'
}
// 模型列表
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
/****************************************************************************************************/
// SessionStorage LocalStorage 操作
const setSS = (k, v) => {
    try {
        sessionStorage.setItem(k, v);
    } catch (e) {
    }
}
const removeSS = (k) => {
    try {
        sessionStorage.removeItem(k);
    } catch (e) {
    }
}
const getSS = (k) => {
    try {
        return sessionStorage.getItem(k);
    } catch (e) {
        return null
    }
}
const setLS = (k, v) => {
    try {
        localStorage.setItem(k, v);
    } catch (e) {
    }
}
const removeLS = (k) => {
    try {
        localStorage.removeItem(k);
    } catch (e) {
    }
}
const getLS = (k) => {
    try {
        return localStorage.getItem(k);
    } catch (e) {
        return null
    }
}
String.prototype.render = function (context) {
    const tokenReg = /(\\)?{([^{}\\]+)(\\)?}/g;
    return this.replace(tokenReg, function (word, slash1, token, slash2) {
        if (slash1 || slash2) {
            return word.replace('\\', '');
        }
        const variables = token.replace(/\s/g, '').split('.');
        let currentObject = context;
        let i, length, variable;

        for (i = 0, length = variables.length; i < length; ++i) {
            variable = variables[i];
            currentObject = currentObject[variable];
            if (currentObject === undefined || currentObject === null) return '';
        }
        return currentObject;
    });
};
const $$ = (selector) => {
    try {
        const e = document.querySelectorAll(selector);
        if (e.length === 1) {
            return e[0];
        } else
            return Array.from(e);
    } catch (e) {
        console.error(e);
        return null;
    }
}
const re = /x/;
console.log(re);
const live2dId2 = 'live2d2';
const live2dId4 = 'live2d4';
const waifuTips = $$('#waifu-message');
const waifu = $$('#waifu');

function getRandText(text) {
    return Array.isArray(text) ? text[Math.floor(Math.random() * text.length + 1) - 1] : text
}

let timeoutID;

function testWebP() {
    return new Promise(res => {
        const webP = new Image();
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        webP.onload = webP.onerror = () => {
            res(webP.height === 2);
        };
    })
}

function showMessage(text, timeout, flag) {
    if (flag || getSS('waifu-text') === '' || getSS('waifu-text') === null) {
        if (timeoutID) window.clearTimeout(timeoutID);
        if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1) - 1];
        if (live2d_settings.logMessageToConsole) console.log('[WaifuTips]', text.replace(/<[^<>]+>/g, ''));
        if (flag) setSS('waifu-text', text);
        waifuTips.style.opacity = 1;
        waifuTips.innerHTML = text;
        if (timeout === undefined) timeout = 5000;
        hideMessage(timeout);
    }
}

function hideMessage(timeout) {
    if (timeout === undefined) timeout = 5000;
    timeoutID = window.setTimeout(function () {
        removeSS('waifu-text');
        waifuTips.style.opacity = 0;
    }, timeout);
}

function changePosition(position) {
    if (position === 'left') {
        $$('.waifu-tool').style.right = 'unset';
        $$('.waifu-tool').style.left = '10px';
        waifu.style.right = 'unset';
        waifu.style.left = live2d_settings.waifuEdgeSide.split(":")[1];
    } else if (position === 'right') {
        $$('.waifu-tool').style.left = 'unset';
        $$('.waifu-tool').style.right = '10px';
        waifu.style.left = 'unset';
        waifu.style.right = live2d_settings.waifuEdgeSide.split(":")[1];
    } else {
        $$('.waifu-tool').style.left = '';
        $$('.waifu-tool').style.right = '';
        waifu.style.left = '';
        waifu.style.right = '';
    }
}

function initModel() {
    /* Load style sheet */
    addStyle(waifuStyle);
    if (getSS('waifuHide') === '1') {
        waifu.classList.add('hide');
        return;
    } else if (window.innerWidth <= Number(live2d_settings.waifuMinWidth.replace('px', ''))) {
        waifu.classList.add('hide');
        return;
    } else {
        waifu.classList.remove('hide');
    }
    /* console welcome message */
    console.log("\u304f__,.\u30d8\u30fd.\u3000\u3000\u3000\u3000/\u3000,\u30fc\uff64 \u3009\n\u3000\u3000\u3000\u3000\u3000\uff3c ', !-\u2500\u2010-i\u3000/\u3000/\u00b4\n\u3000\u3000\u3000 \u3000 \uff0f\uff40\uff70'\u3000\u3000\u3000 L/\uff0f\uff40\u30fd\uff64\n\u3000\u3000 \u3000 /\u3000 \uff0f,\u3000 /|\u3000 ,\u3000 ,\u3000\u3000\u3000 ',\n\u3000\u3000\u3000\uff72 \u3000/ /-\u2010/\u3000\uff49\u3000L_ \uff8a \u30fd!\u3000 i\n\u3000\u3000\u3000 \uff9a \uff8d 7\uff72\uff40\uff84\u3000 \uff9a'\uff67-\uff84\uff64!\u30cf|\u3000 |\n\u3000\u3000\u3000\u3000 !,/7 '0'\u3000\u3000 \u00b40i\u30bd| \u3000 |\u3000\u3000\u3000\n\u3000\u3000\u3000\u3000 |.\u4ece\"\u3000\u3000_\u3000\u3000 ,,,, / |./ \u3000 |\n\u3000\u3000\u3000\u3000 \uff9a'| i\uff1e.\uff64,,__\u3000_,.\u30a4 / \u3000.i \u3000|\n\u3000\u3000\u3000\u3000\u3000 \uff9a'| | / k_\uff17_/\uff9a'\u30fd,\u3000\uff8a.\u3000|\n\u3000\u3000\u3000\u3000\u3000\u3000 | |/i \u3008|/\u3000 i\u3000,.\uff8d |\u3000i\u3000|\n\u3000\u3000\u3000\u3000\u3000\u3000.|/ /\u3000\uff49\uff1a \u3000 \uff8d!\u3000\u3000\uff3c\u3000|\n\u3000\u3000\u3000 \u3000 \u3000 k\u30fd>\uff64\uff8a \u3000 _,.\uff8d\uff64 \u3000 /\uff64!\n\u3000\u3000\u3000\u3000\u3000\u3000 !'\u3008//\uff40\uff34\u00b4', \uff3c \uff40'7'\uff70r'\n\u3000\u3000\u3000\u3000\u3000\u3000 \uff9a'\u30fdL__|___i,___,\u30f3\uff9a|\u30ce\n\u3000\u3000\u3000\u3000\u3000 \u3000\u3000\u3000\uff84-,/\u3000|___./\n\u3000\u3000\u3000\u3000\u3000 \u3000\u3000\u3000'\uff70'\u3000\u3000!_,.:\nLive2D \u770b\u677f\u5a18 v" + live2d_settings.l2dVersion + " / Konata");

    $$(`#${live2dId2}`).setAttribute('height', live2d_settings.live2dHeight);
    $$(`#${live2dId2}`).setAttribute('width', live2d_settings.live2dWidth);
    $$(`#${live2dId4}`).setAttribute('height', live2d_settings.live2dHeight);
    $$(`#${live2dId4}`).setAttribute('width', live2d_settings.live2dWidth);
    if (!live2d_settings.showToolMenu) $$('.waifu-tool').classList.add('hide');
    if (!live2d_settings.canCloseLive2d) $$('.waifu-tool .icon-cross').classList.add('hide');
    if (!live2d_settings.canSwitchModel) $$('.waifu-tool .icon-next').classList.add('hide');
    if (!live2d_settings.canSwitchHitokoto) $$('.waifu-tool .icon-message').classList.add('hide');
    if (!live2d_settings.canTakeScreenshot) $$('.waifu-tool .icon-camera').classList.add('hide');
    if (!live2d_settings.canTurnToHomePage) $$('.waifu-tool .icon-home').classList.add('hide');
    if (!live2d_settings.canTurnToAboutPage) $$('.waifu-tool .icon-about').classList.add('hide');
    if (!live2d_settings.showVolumeBtn) $$('.waifu-tool .icon-volumeup').classList.add('hide') || $$('.waifu-tool .icon-volumedown').classList.add('hide');
    $$('.waifu-tool .icon-next').addEventListener('click', () => loadOtherModel());
    $$('.waifu-tool .icon-home').addEventListener('click', () => window.location = live2d_settings.homePageUrl)
    $$('.waifu-tool .icon-about').addEventListener('click', () => window.open(live2d_settings.aboutPageUrl))
    $$('.waifu-tool .icon-camera').addEventListener('click', () => {
        window.live2dCurrentVersion === 3 ? window.live2dv4.CaptureCanvas() : window.live2dv2.captureFrame = true;
    });
    $$('.waifu-tool .icon-cross').addEventListener('click', () => {
        sessionStorage.setItem('waifuHide', '1');
        window.setTimeout(function () {
            waifu.classList.add('hide');
            // document.getElementById('show-live2d').classList.remove('btnHide');
        }, 1000);
    })

    window.waifuResize = () => {
        if (getSS('waifuHide') !== '1')
            window.innerWidth <= Number(live2d_settings.waifuMinWidth.replace('px', '')) ? waifu.classList.add('hide') : waifu.classList.remove('hide');
    };

    if (live2d_settings.waifuMinWidth !== 'disable') {
        waifuResize();
        window.addEventListener('resize', waifuResize)
    }

    live2d_settings.homePageUrl = live2d_settings.homePageUrl === 'auto' ? window.location.protocol + '//' + window.location.hostname + '/' : live2d_settings.homePageUrl;

    if (live2d_settings.tipsMessage)
        window.fetch(live2d_settings.tipsMessage)
            .then(res => res.json())
            .then(resjson => loadTipsMessage(resjson));

    let modelName = getLS('modelName');

    if (!live2d_settings.modelStorage || modelName == null)
        modelName = live2d_settings.modelName;

    window.live2dv4.setPreLoadMotion(live2d_settings.preLoadMotion);
    window.live2dv2.debug = live2d_settings.debug;
    window.live2dv4.debug = live2d_settings.debug;
    window.live2dv2.debugMousemove = live2d_settings.debug && live2d_settings.debugMousemove;
    window.live2dv4.debugMousemove = live2d_settings.debug && live2d_settings.debugMousemove;
    if (live2d_settings.tryWebp) {
        testWebP().then(r => window.webpReady = r).then(() => {
            if (window.webpReady === true)
                console.log("[WaifuTips] Your browser support WebP format. Try to load WebP texture first.");
            else
                console.log("[WaifuTips] Your browser do not support WebP format.");
            loadModel(modelName);
        });
    } else {
        loadModel(modelName);
    }
}

function loadModel(modelName) {
    if (live2d_settings.modelStorage)
        setLS('modelName', modelName);
    else
        setSS('modelName', modelName);
    live2d_settings.debug && console.log(`[WaifuTips] 加载模型 ${modelName}`);
    let modelVersion = 2;
    // 在配置中找到要加载模型的版本
    for (let model of live2d_models) {
        if (model.name === modelName) {
            modelVersion = model.version;
            changePosition(model.position);
            break;
        }
    }
    // 如果要加载的模型版本不同，先释放之前的SDK并隐藏canvas
    if (window.live2dCurrentVersion !== modelVersion) {
        if (window.live2dCurrentVersion === 2) {
            window.live2dv2.release();
            $$(`#${live2dId2}`).style.display = 'none';
        } else {
            window.live2dv4.release();
            $$(`#${live2dId4}`).style.display = 'none';
        }
    }
    // 根据模型版本选择不同的SDK加载
    if (modelVersion === 2) {
        $$(`#${live2dId2}`).style.display = 'block';
        window.live2dv2.load(live2dId2, `${live2d_settings.modelUrl}/${modelName}/model.json`);
    } else if (window.live2dCurrentVersion === modelVersion) {
        window.live2dv4.change(`${live2d_settings.modelUrl}/${modelName}`, `${modelName}.model3.json`);
    } else {
        $$(`#${live2dId4}`).style.display = 'block';
        window.live2dv4.load(live2dId4, `${live2d_settings.modelUrl}/${modelName}`, `${modelName}.model3.json`);
    }
    window.live2dCurrentVersion = modelVersion;
}

// 读取记忆的模型
function modelStorageGetItem(key) {
    return live2d_settings.modelStorage ? getLS(key) : getSS(key);
}

function loadOtherModel() {
    const modelName = modelStorageGetItem('modelName');
    let modelIndex = 0;
    if (live2d_settings.modelRandMode) {
        modelIndex = Math.floor(Math.random() * live2d_models.length + 1) - 1;
    } else {
        modelIndex = live2d_models.findIndex(modelObj => modelObj.name === modelName)
        if (modelIndex < live2d_models.length - 1)
            modelIndex++;
        else
            modelIndex = 0;
    }
    if (live2d_models[modelIndex].message) showMessage(live2d_models[modelIndex].message, 3000, true);
    loadModel(live2d_models[modelIndex].name);
}


function loadTipsMessage(result) {
    window.waifu_tips = result;

    const mouseenterListener = (e, tips) => {
        e.addEventListener('mouseenter', () => {
            let text = getRandText(tips.text);
            if (text.indexOf("{text}") > 0)
                text = text.replace(/{text}/, e.innerText);
            showMessage(text, 3000);
        });
    }
    const addMouseoverListener = () => {
        for (let tips of result.mouseover) {
            const select = $$(tips.selector);
            if (Array.isArray(select))
                select.forEach(e => mouseenterListener(e, tips));
            else if (select)
                mouseenterListener(select, tips);
            else
                live2d_settings.debug && console.warn(`[WaifuTips] can not found element: ${tips.selector}`)
        }
    }
    const addClickListener = () => {
        for (let tips of result.click) {
            const select = $$(tips.selector);
            if (Array.isArray(select))
                select.forEach(e => e.addEventListener('click', () => {
                    let text = getRandText(tips.text);
                    showMessage(text, 3000, true);
                }))
            else if (select)
                select.addEventListener('click', () => {
                    let text = getRandText(tips.text);
                    showMessage(text, 3000, true);
                })
            else
                live2d_settings.debug && console.warn(`[WaifuTips] can not found element: ${tips.selector}`)
        }
    }
    for (let tips of result.seasons) {
        const now = new Date();
        const after = tips.date.split('-')[0];
        const before = tips.date.split('-')[1] || after;
        if ((after.split('/')[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split('/')[0]) &&
            (after.split('/')[1] <= now.getDate() && now.getDate() <= before.split('/')[1])) {
            let text = getRandText(tips.text);
            if (text.indexOf("{year}") > 0)
                text = text.replace(/{year}/, now.getFullYear());
            showMessage(text, 6000, true);
        }
    }
    if (live2d_settings.showF12OpenMsg) {
        re.toString = function () {
            showMessage(getRandText(result.waifu.console_open_msg), 5000, true);
            return '';
        };
    }
    const addCopyListener = () => {
        if ($$('#articleContent').length !== 0)
            $$('#articleContent').addEventListener('copy', () => (showMessage(getRandText(result.waifu.copy_message), 5000, true)));
    }
    window.showWelcomeMessage = function (result) {
        let text;
        if (window.location.href === live2d_settings.homePageUrl) {
            const now = (new Date()).getHours();
            if (now > 23 || now <= 5) text = getRandText(result.waifu.hour_tips['t23-5']);
            else if (now > 5 && now <= 7) text = getRandText(result.waifu.hour_tips['t5-7']);
            else if (now > 7 && now <= 11) text = getRandText(result.waifu.hour_tips['t7-11']);
            else if (now > 11 && now <= 14) text = getRandText(result.waifu.hour_tips['t11-14']);
            else if (now > 14 && now <= 17) text = getRandText(result.waifu.hour_tips['t14-17']);
            else if (now > 17 && now <= 19) text = getRandText(result.waifu.hour_tips['t17-19']);
            else if (now > 19 && now <= 21) text = getRandText(result.waifu.hour_tips['t19-21']);
            else if (now > 21 && now <= 23) text = getRandText(result.waifu.hour_tips['t21-23']);
            else text = getRandText(result.waifu.hour_tips.default);
        } else {
            const referrer_message = result.waifu.referrer_message;
            if (document.referrer !== '') {
                const referrer = document.createElement('a');
                referrer.href = document.referrer;
                const domain = referrer.hostname.split('.')[1];
                if (window.location.hostname === referrer.hostname)
                    text = referrer_message.localhost[0] + document.title.split(referrer_message.localhost[2])[0] + referrer_message.localhost[1];
                else if (domain === 'baidu')
                    text = referrer_message.baidu[0] + referrer.search.split('&wd=')[1].split('&')[0] + referrer_message.baidu[1];
                else if (domain === 'so')
                    text = referrer_message.so[0] + referrer.search.split('&q=')[1].split('&')[0] + referrer_message.so[1];
                else if (domain === 'google')
                    text = referrer_message.google[0] + document.title.split(referrer_message.google[2])[0] + referrer_message.google[1];
                else {
                    text = referrer_message.default[0] + referrer.hostname + referrer_message.default[1];
                    for (let host in result.waifu.referrer_hostname)
                        if (host === referrer.hostname) {
                            text = getRandText(result.waifu.referrer_hostname[host]);
                            break;
                        }
                }
            } else text = referrer_message.none[0] + document.title.split(referrer_message.none[2])[0] + referrer_message.none[1];
        }
        showMessage(text, 6000);
    };
    if (live2d_settings.showWelcomeMessage) showWelcomeMessage(result);

    const waifu_tips = result.waifu;

    if (live2d_settings.showHitokoto) {
        window.getActed = false;
        window.hitokotoTimer = 0;
        window.hitokotoInterval = false;
        setInterval(function () {
            if (!getActed) ifActed();
            else elseActed();
        }, 1000);
    }
    /* 检测用户活动状态，并在空闲时显示一言 */
    const addHitokotoListener = () => {
        document.addEventListener('mousemove', () => (getActed = true))
        document.addEventListener('keydown', () => (getActed = true))
    }

    if (document.readyState === "interactive" || document.readyState === "complete") {
        addMouseoverListener();
        addClickListener();
        if (live2d_settings.showCopyMessage) addCopyListener();
        if (live2d_settings.showHitokoto) addHitokotoListener();
    } else {
        window.addEventListener("DOMContentLoaded", addMouseoverListener);
        window.addEventListener("DOMContentLoaded", addClickListener);
        if (live2d_settings.showCopyMessage) window.addEventListener("DOMContentLoaded", addCopyListener);
        if (live2d_settings.showHitokoto) window.addEventListener("DOMContentLoaded", addHitokotoListener);
    }

    function ifActed() {
        if (!hitokotoInterval) {
            hitokotoInterval = true;
            hitokotoTimer = window.setInterval(showHitokotoActed, 30000);
        }
    }

    function elseActed() {
        getActed = hitokotoInterval = false;
        window.clearInterval(hitokotoTimer);
    }

    function showHitokotoActed() {
        if (document.visibilityState === 'visible') showHitokoto();
    }

    function showHitokoto() {
        switch (live2d_settings.hitokotoAPI) {
            case 'lwl12.com':
                window.fetch('https://api.lwl12.com/hitokoto/v1?encode=realjson')
                    .then(res => res.json())
                    .then(resJson => {
                        if (!resJson.source) {
                            let text = waifu_tips.hitokoto_api_message['lwl12.com'][0];
                            if (!resJson.author) text += waifu_tips.hitokoto_api_message['lwl12.com'][1];
                            text = text.render({source: resJson.source, creator: resJson.author});
                            window.setTimeout(function () {
                                showMessage(text + waifu_tips.hitokoto_api_message['lwl12.com'][2], 3000, true);
                            }, 5000);
                        }
                        showMessage(resJson.text, 5000, true);
                    })
                break;
            case 'fghrsh.net':
                window.fetch('https://api.fghrsh.net/hitokoto/rand/?encode=jsc&uid=3335')
                    .then(res => res.json())
                    .then(resJson => {
                        if (!resJson.source) {
                            let text = waifu_tips.hitokoto_api_message['fghrsh.net'][0];
                            text = text.render({source: resJson.source, date: resJson.date});
                            window.setTimeout(function () {
                                showMessage(text, 3000, true);
                            }, 5000);
                            showMessage(resJson.hitokoto, 5000, true);
                        }
                    })
                break;
            case 'jinrishici.com':
                window.fetch('https://v2.jinrishici.com/one.json')
                    .then(res => res.json())
                    .then(resJson => {
                        if (!resJson.data.origin.title) {
                            let text = waifu_tips.hitokoto_api_message['jinrishici.com'][0];
                            text = text.render({
                                title: resJson.data.origin.title,
                                dynasty: resJson.data.origin.dynasty,
                                author: resJson.data.origin.author
                            });
                            window.setTimeout(function () {
                                showMessage(text, 3000, true);
                            }, 5000);
                        }
                        showMessage(resJson.data.content, 5000, true);
                    })
                break;
            default:
                window.fetch('https://v1.hitokoto.cn')
                    .then(res => res.json())
                    .then(resJson => {
                        if (!resJson.from) {
                            let text = waifu_tips.hitokoto_api_message['hitokoto.cn'][0];
                            text = text.render({source: resJson.from, creator: resJson.creator});
                            window.setTimeout(function () {
                                showMessage(text, 3000, true);
                            }, 5000);
                        }
                        showMessage(resJson.hitokoto, 5000, true);
                    })
        }
    }

    $$('.waifu-tool .icon-message').addEventListener('click', () => showHitokoto());
}

const addStyle = (() => {
    const style = document.createElement('style');
    document.head.append(style);
    return (styleString) => style.textContent = styleString;
})();

const blobDownload = (blob) => {
    if (typeof blob == 'object' && blob instanceof Blob) {
        blob = URL.createObjectURL(blob); // 创建blob地址
    }
    const aLink = document.createElement('a');
    aLink.href = blob;
    aLink.download = live2d_settings.screenshotCaptureName || 'live2d.png'; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    let event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}

const waifuStyle = `
#waifu {
${live2d_settings.waifuEdgeSide}px;
position:fixed;
bottom:0;
z-index:998;
font-size:0
}

#waifu-message {
font-size:1rem;
width:-moz-fit-content;
width:fit-content;
height:auto;
left:2rem;
top:20px;
opacity:0;
z-index:998;
margin:auto;
padding:5px 10px;
border:1px solid rgba(104,216,255,0.62);
border-radius:12px;
background-color:rgba(76,191,255,0.8);
box-shadow:0 3px 15px 2px rgba(16,51,49,0.3);
text-overflow:ellipsis;
overflow:hidden;
position:relative;
animation-delay:5s;
animation-duration:50s;
animation-iteration-count:infinite;
animation-name:shake;
animation-timing-function:ease-in-out;
transition:opacity .3s ease
}

#waifu-message>a {
color:#7500b7;
}

#live2d2,#live2d4 {
position:relative;
display:none;
z-index:997
}

.waifu-tool {
display:none;
color:#d73b66;
top:130px;
${live2d_settings.waifuEdgeSide.split(":")[0]}:10px;
position:absolute;
z-index:998
}

#waifu:hover > .waifu-tool {
display:block
}

.waifu-tool > span {
font-family:"waifuico"!important;
display:block;
cursor:pointer;
color:#0396FF;
transition:.2s;
font-size:18px;
font-style:normal;
-webkit-font-smoothing:antialiased;
-moz-osx-font-smoothing:grayscale
}

.waifu-tool > span:hover {
color:#43CBFF
}

.waifu-tool > .icon-next:before{padding-left:1px;content:"\\e6ba"}.waifu-tool > .icon-message:before{content:"\\e632"}.waifu-tool > .icon-cross:before{content:"\\e606"}.waifu-tool > .icon-about:before{content:"\\e60c"}.waifu-tool > .icon-home:before{content:"\\e604"}.waifu-tool > .icon-camera:before{content:"\\e635"}.waifu-tool > .icon-volumedown:before{content:"\\e6c2"}.waifu-tool > .icon-volumeup:before{content:"\\e6c3"}#waifu.hide,.waifu-tool > span.hide{display:none}@font-face{font-family:"waifuico";src:url(data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAWcAAsAAAAAC0gAAAVNAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCEAgqIVIcCATYCJAMkCxQABCAFhG0HchuYCVGUT06K7OeB7R6lCBOgbWnZzIYDWz+EMHANCwis4uG/tdf7dmbx/wC6VAGqgCuhAwBFIEwVsNJVwEb21LKO3q1lyz+tCZvx3+UrWlPV795l73pusllKVXgcRqIMCNk9wkGaA/IP1K2mWg6WmlnR1Qqa7lwLoaYD/FpfOAE/f7i06QU2n2W5rPV/cy2K44ACGrcnLqDD0wI/YTkL68xspUBnvQo9T6CzQkdr1/bhCczKuDJQdj1LDMwmDHIFPTTqquDavDGelJricfGKl+7w8d98zFIoE/6iA9e2Ylj9lX1P9TmTXns0nA3bm0jYCGTiTaHjmRQkNprQnXOzC8C4sE0w1P4qQ/OWvPO97zOkb72kik5d+CcPlJKsUAm1hqhw1ZCot5MNv7LiUvKr4pL4NVSqQvPQKYCWoNQMvYNOAH2DTg30HQ0a0JprJoEpEPsB4i2ON7lEyOJpoGWF9Uoz6iBtQmEZSR0YgyVVYPFeOIPN3GSY5uUOTjKmlLks4xwO30ihSfCIyrtB4/PlZurwHsUBoelpYahQGMsORi9mnmOcZ53Fz4BQ8IuaCKZRdi7BW+cZ52Szpw+ehI6b5uVwWNcZJrl5XEaG4Bld+DyO/5TGe5LbP7LAWhojkRiji8z5YcW4eTbOYXEZBO3YphYFXCQmlfO4fOOcAZytB5LH1+1A0uQ5B/DIGQ0gj8ejLuvzhMI4gSALZBJK9MFFEGbOK1D72SB4ZF2DPLFhL3v8OkqZ3MwXCOi1BHU/icfLYxIMLouDs5sWjxhRQR6VjJ+FINpJiKW8dBgVnzyUAzNnYNNHlnYjV2upFMVP6IFi1tXVmW8ihqPPJMWLn3H3seGju3ci3kxPEJTA0jrAQ0fD8Bh6dl1hXf0jKHdKaRsxTzcO0JWMCoNpvbEutxBvrD4E64xscguymJWl87Zjuz13sbN3o1/REc9hj2HPEfRfUA14VOUN+7FLSlHD9gF0AN/dJbxQrsdqTB3bWeDw0/XbbtrtD/xvuymCYSI3VzoM07Joq6QFcq1EreSY1AupY67wGmL52IowWn008LOtnCa+PdJrVOzu58O13kDd54MrhoRV1HZxf/zUr1jBGrG7pF/6h14kOo20kntvDF6kSO5t+TgvfqwJSQ/VSg0rQ5KRsjB/bGg60jQ9Ai1DI9N26w1XrItJXd3kYnKRURRvBJG8CHy8T2KLtC/qq2WL2gJ6vtlO77JfPuylAcBR1HTZpJf91SwxeD4oigJToj4caJer06uTaZep061vZt/78dVJJWe2AnU4gB5PDpTgyF6yu7ScXvf3eIak4yE/dIofEGczzzlM3ABqvZvHHD39P3t+ZdNyM/gthH9c/L6TBMMoWrqXvkajeBuRb7kuP60g/JddpNzY5pNEGfo/hx8k0VMSdQi2thsxVqATC3y7PZM+hsUzjVX+THgmgkJtDpLGSmKmboTSwCJUGluhs8HOzQNTxITILdZ7ZBDGvUBh1GdIxr0RM/UdSrN+oTIeE9A5FlP3HFgd2fxOIaMUo73CLOLaSbPO+/IjSkJpJC51jDMSn4Vx2Buk0ztUkwxxgT9PRqoOnXCF2+xlVJaMjXBOkfZS1Wbc77uib+pFXMG8nQQxFIkh6wrKRFjNmeVqPrP/IyQRlAyp6HvmPUOEl62PhnoGDYg7qrpR36XUeucSI0oxB7ltKaugbbKRUiQYaoqPypGI6kk7xBpjfZrnmqp60+PqsV6BDv+YNopIkaOMKupooo1OvkmXOnODvDcJTV0W9tVTFy0Hnb6Xmpwrmr5sqjtz7PwxLkNFMV/Us6E/NAAAAAA=) format("woff2"),url(waifuico.woff?t=1597741284606) format("woff")}@keyframes shake{2%{transform:translate(0.5px,-1.5px) rotate(-0.5deg)}4%{transform:translate(0.5px,1.5px) rotate(1.5deg)}6%{transform:translate(1.5px,1.5px) rotate(1.5deg)}8%{transform:translate(2.5px,1.5px) rotate(0.5deg)}10%{transform:translate(0.5px,2.5px) rotate(0.5deg)}12%{transform:translate(1.5px,1.5px) rotate(0.5deg)}14%{transform:translate(0.5px,0.5px) rotate(0.5deg)}16%{transform:translate(-1.5px,-0.5px) rotate(1.5deg)}18%{transform:translate(0.5px,0.5px) rotate(1.5deg)}20%{transform:translate(2.5px,2.5px) rotate(1.5deg)}22%{transform:translate(0.5px,-1.5px) rotate(1.5deg)}24%{transform:translate(-1.5px,1.5px) rotate(-0.5deg)}26%{transform:translate(1.5px,0.5px) rotate(1.5deg)}28%{transform:translate(-0.5px,-0.5px) rotate(-0.5deg)}30%{transform:translate(1.5px,-0.5px) rotate(-0.5deg)}32%{transform:translate(2.5px,-1.5px) rotate(1.5deg)}34%{transform:translate(2.5px,2.5px) rotate(-0.5deg)}36%{transform:translate(0.5px,-1.5px) rotate(0.5deg)}38%{transform:translate(2.5px,-0.5px) rotate(-0.5deg)}40%{transform:translate(-0.5px,2.5px) rotate(0.5deg)}42%{transform:translate(-1.5px,2.5px) rotate(0.5deg)}44%{transform:translate(-1.5px,1.5px) rotate(0.5deg)}46%{transform:translate(1.5px,-0.5px) rotate(-0.5deg)}48%{transform:translate(2.5px,-0.5px) rotate(0.5deg)}50%{transform:translate(-1.5px,1.5px) rotate(0.5deg)}52%{transform:translate(-0.5px,1.5px) rotate(0.5deg)}54%{transform:translate(-1.5px,1.5px) rotate(0.5deg)}56%{transform:translate(0.5px,2.5px) rotate(1.5deg)}58%{transform:translate(2.5px,2.5px) rotate(0.5deg)}60%{transform:translate(2.5px,-1.5px) rotate(1.5deg)}62%{transform:translate(-1.5px,0.5px) rotate(1.5deg)}64%{transform:translate(-1.5px,1.5px) rotate(1.5deg)}66%{transform:translate(0.5px,2.5px) rotate(1.5deg)}68%{transform:translate(2.5px,-1.5px) rotate(1.5deg)}70%{transform:translate(2.5px,2.5px) rotate(0.5deg)}72%{transform:translate(-0.5px,-1.5px) rotate(1.5deg)}74%{transform:translate(-1.5px,2.5px) rotate(1.5deg)}76%{transform:translate(-1.5px,2.5px) rotate(1.5deg)}78%{transform:translate(-1.5px,2.5px) rotate(0.5deg)}80%{transform:translate(-1.5px,0.5px) rotate(-0.5deg)}82%{transform:translate(-1.5px,0.5px) rotate(-0.5deg)}84%{transform:translate(-0.5px,0.5px) rotate(1.5deg)}86%{transform:translate(2.5px,1.5px) rotate(0.5deg)}88%{transform:translate(-1.5px,0.5px) rotate(1.5deg)}90%{transform:translate(-1.5px,-0.5px) rotate(-0.5deg)}92%{transform:translate(-1.5px,-1.5px) rotate(1.5deg)}94%{transform:translate(0.5px,0.5px) rotate(-0.5deg)}96%{transform:translate(2.5px,-0.5px) rotate(-0.5deg)}98%{transform:translate(-1.5px,-1.5px) rotate(-0.5deg)}0%,100%{transform:translate(0,0) rotate(0)}}
`;
initModel();
window.downloadCap = blobDownload;
window.initModel = initModel;
export {showMessage, initModel}