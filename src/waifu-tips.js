/*****************************************************************************************************
 く__,.ヘヽ.　　　　/　,ー､ 〉
 　　　　　＼ ', !-─‐-i　/　/´
 　　　 　 ／｀ｰ'　　　 L/／｀ヽ､             Live2D 看板娘 参数设置
 　　 　 /　 ／,　 /|　 ,　 ,　　　 ',           Version 2.0.0
 　　　ｲ 　/ /-‐/　ｉ　L_ ﾊ ヽ!　 i                Konata
 　　　 ﾚ ﾍ 7ｲ｀ﾄ　 ﾚ'ｧ-ﾄ､!ハ|　 |
 　　　　 !,/7 '0'　　 ´0iソ| 　 |　　　
 　　　　 |.从"　　_　　 ,,,, / |./ 　 |    网页添加 Live2D 看板娘
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
    'debug': true,                              // 全局 DEBUG 设置
    'debugMousemove': false,                    // 打印指针移动坐标
    'logMessageToConsole': true,                // 在控制台显示看板娘消息
    'modelUrl': 'model',
    'tipsMessage': 'waifu-tips.json',         // waifu-tips.json 路径
    // 模型设置
    'modelName': 'miku',                        // 默认模型名称
    'preLoadMotion': false,                     // 是否预载动作数据，只对 model3 模型有效，不预载可以提高 model3 模型的加载速度，但可能导致首次触发动作时有卡顿
    // 工具栏设置
    'showToolMenu': true,                       // 显示 工具栏，可选 true(真), false(假)
    'canCloseLive2d': true,                     // 显示 关闭看板娘  按钮，可选 true(真), false(假)
    'canSwitchModel': true,                     // 显示 模型切换    按钮，可选 true(真), false(假)
    'canSwitchHitokoto': true,                  // 显示 一言切换    按钮，可选 true(真), false(假)
    'canTakeScreenshot': true,                  // 显示 看板娘截图  按钮，可选 true(真), false(假)
    'canTurnToHomePage': true,                  // 显示 返回首页    按钮，可选 true(真), false(假)
    'canTurnToAboutPage': true,                 // 显示 跳转关于页  按钮，可选 true(真), false(假)
    'showVolumeBtn': true,
    // 模型切换模式
    'modelStorage': true,                       // 记忆上次选择的模型，可选 true(真), false(假)
    'modelRandMode': false,                     // 随机切换模型，可选 true(真), false(假)
    // 提示消息选项
    'showHitokoto': true,                       // 显示一言
    'hitokotoAPI': '',                          // 一言 API，可选 'lwl12.com', 'hitokoto.cn', 'jinrishici.com'(古诗词)
    'showF12OpenMsg': true,                     // 显示控制台打开提示
    'showCopyMessage': true,                    // 显示 复制内容 提示
    'showWelcomeMessage': true,                 // 显示进入面页欢迎词
    //看板娘样式设置
    'live2dHeight': 680,                        // 看板娘高度
    'live2dWidth': 500,                         // 看板娘宽度
    'waifuMinWidth': '1px',                     // 面页小于 指定宽度 隐藏看板娘，例如 'disable'(禁用), '推荐1040px'
    'waifuEdgeSide': 'right:0',                 // 看板娘贴边方向，例如 'left:0'(靠左 0px), 'right:30'(靠右 30px)
    // 其他杂项设置
    'l2dVersion': '2.0.0',                      // 当前版本
    'homePageUrl': 'auto',                      // 主页地址，可选 'auto'(自动), '{URL 网址}'
    'aboutPageUrl': 'https://konata.tech/',     // 关于页地址, '{URL 网址}'
    'screenshotCaptureName': 'bronyaMoe.png',   // 看板娘截图文件名，例如 'live2d.png'
}
// 模型列表
const live2d_models = [
    {
        name: 'miku',                               // 模型名称要与文件夹名相同
        message: 'SDK2.1 official sample 初音ミク',  // 切换时的提示信息
        version: 2                                  // 模型版本，不同版本入口文件不同： 2: model.json 或 3: 模型名.model3.json
    },
    {
        name: 'shizuku',
        message: 'SDK2.1 official sample しずく',
        version: 2
    },
    {
        name: 'houmuya',
        message: 'SDK3 吼姆布洛妮娅 bilibili@呦克里斯汀娜呦',
        version: 3
    },
    {
        name: 'Rice',
        message: 'SDK4 official sample',
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

function initModel(waifuPath) {
    if (getSS('waifuHide') === '1') {
        waifu.classList.add('hide');
        return;
    } else {
        waifu.classList.remove('hide');
    }
    /* console welcome message */
    console.log("\u304f__,.\u30d8\u30fd.\u3000\u3000\u3000\u3000/\u3000,\u30fc\uff64 \u3009\n\u3000\u3000\u3000\u3000\u3000\uff3c ', !-\u2500\u2010-i\u3000/\u3000/\u00b4\n\u3000\u3000\u3000 \u3000 \uff0f\uff40\uff70'\u3000\u3000\u3000 L/\uff0f\uff40\u30fd\uff64\n\u3000\u3000 \u3000 /\u3000 \uff0f,\u3000 /|\u3000 ,\u3000 ,\u3000\u3000\u3000 ',\n\u3000\u3000\u3000\uff72 \u3000/ /-\u2010/\u3000\uff49\u3000L_ \uff8a \u30fd!\u3000 i\n\u3000\u3000\u3000 \uff9a \uff8d 7\uff72\uff40\uff84\u3000 \uff9a'\uff67-\uff84\uff64!\u30cf|\u3000 |\n\u3000\u3000\u3000\u3000 !,/7 '0'\u3000\u3000 \u00b40i\u30bd| \u3000 |\u3000\u3000\u3000\n\u3000\u3000\u3000\u3000 |.\u4ece\"\u3000\u3000_\u3000\u3000 ,,,, / |./ \u3000 |\n\u3000\u3000\u3000\u3000 \uff9a'| i\uff1e.\uff64,,__\u3000_,.\u30a4 / \u3000.i \u3000|\n\u3000\u3000\u3000\u3000\u3000 \uff9a'| | / k_\uff17_/\uff9a'\u30fd,\u3000\uff8a.\u3000|\n\u3000\u3000\u3000\u3000\u3000\u3000 | |/i \u3008|/\u3000 i\u3000,.\uff8d |\u3000i\u3000|\n\u3000\u3000\u3000\u3000\u3000\u3000.|/ /\u3000\uff49\uff1a \u3000 \uff8d!\u3000\u3000\uff3c\u3000|\n\u3000\u3000\u3000 \u3000 \u3000 k\u30fd>\uff64\uff8a \u3000 _,.\uff8d\uff64 \u3000 /\uff64!\n\u3000\u3000\u3000\u3000\u3000\u3000 !'\u3008//\uff40\uff34\u00b4', \uff3c \uff40'7'\uff70r'\n\u3000\u3000\u3000\u3000\u3000\u3000 \uff9a'\u30fdL__|___i,___,\u30f3\uff9a|\u30ce\n\u3000\u3000\u3000\u3000\u3000 \u3000\u3000\u3000\uff84-,/\u3000|___./\n\u3000\u3000\u3000\u3000\u3000 \u3000\u3000\u3000'\uff70'\u3000\u3000!_,.:\nLive2D \u770b\u677f\u5a18 v" + live2d_settings.l2dVersion + " / Konata");

    /* 加载看板娘样式 */
    live2d_settings.waifuEdgeSide = live2d_settings.waifuEdgeSide.split(':');
    if (live2d_settings.waifuEdgeSide[0] === 'left')
        waifu.style.left = live2d_settings.waifuEdgeSide[1] + 'px';
    else if (live2d_settings.waifuEdgeSide[0] === 'right')
        waifu.style.right = live2d_settings.waifuEdgeSide[1] + 'px';
    $$(`#${live2dId2}`).setAttribute('height', live2d_settings.live2dHeight);
    $$(`#${live2dId2}`).setAttribute('width', live2d_settings.live2dWidth);
    $$(`#${live2dId4}`).setAttribute('height', live2d_settings.live2dHeight);
    $$(`#${live2dId4}`).setAttribute('width', live2d_settings.live2dWidth);

    window.waifuResize = () => {
        window.innerWidth <= Number(live2d_settings.waifuMinWidth.replace('px', '')) ? waifu.classList.add('hide') : waifu.classList.remove('hide');
    };

    if (live2d_settings.waifuMinWidth !== 'disable') {
        waifuResize();
        window.addEventListener('resize', waifuResize)
    }

    live2d_settings.homePageUrl = live2d_settings.homePageUrl === 'auto' ? window.location.protocol + '//' + window.location.hostname + '/' : live2d_settings.homePageUrl;

    if (typeof (waifuPath) === "object")
        loadTipsMessage(waifuPath);
    else {
        window.fetch(!waifuPath ? live2d_settings.tipsMessage : (waifuPath.substr(waifuPath.length - 15) === 'waifu-tips.json' ? waifuPath : waifuPath + 'waifu-tips.json'))
            .then(res => res.json())
            .then(resjson => loadTipsMessage(resjson));
    }

    if (!live2d_settings.showToolMenu) $$('.waifu-tool').classList.add('hide');
    if (!live2d_settings.canCloseLive2d) $$('.waifu-tool .icon-cross').classList.add('hide');
    if (!live2d_settings.canSwitchModel) $$('.waifu-tool .icon-next').classList.add('hide');
    if (!live2d_settings.canSwitchHitokoto) $$('.waifu-tool .icon-message').classList.add('hide');
    if (!live2d_settings.canTakeScreenshot) $$('.waifu-tool .icon-camera').classList.add('hide');
    if (!live2d_settings.canTurnToHomePage) $$('.waifu-tool .icon-home').classList.add('hide');
    if (!live2d_settings.canTurnToAboutPage) $$('.waifu-tool .icon-about').classList.add('hide');
    if (!live2d_settings.showVolumeBtn) $$('.waifu-tool .icon-volumeup').classList.add('hide') || $$('.waifu-tool .icon-volumedown').classList.add('hide');

    let modelName = getLS('modelName');

    if (!live2d_settings.modelStorage || modelName == null)
        modelName = live2d_settings.modelName;

    window.live2dv4.setPreLoadMotion(live2d_settings.preLoadMotion);
    window.live2dv2.debug = live2d_settings.debug;
    window.live2dv4.debug = live2d_settings.debug;
    window.live2dv2.debugMousemove = live2d_settings.debug && live2d_settings.debugMousemove;
    window.live2dv4.debugMousemove = live2d_settings.debug && live2d_settings.debugMousemove;
    loadModel(modelName);
}

function loadModel(modelName) {
    if (live2d_settings.modelStorage)
        setLS('modelName', modelName);
    else
        setSS('modelName', modelName);
    live2d_settings.debug && console.log(`[WaifuTips] 加载模型 ${modelName}`);
    let modelVersion = 2;
    for (let model of live2d_models) {
        if (model.name === modelName) {
            modelVersion = model.version;
            break;
        }
    }
    //
    if (window.live2dCurrentVersion !== modelVersion) {
        if (window.live2dCurrentVersion === 2) {
            window.live2dv2.release();
            $$(`#${live2dId2}`).style.display = 'none';
        } else {
            window.live2dv4.release();
            $$(`#${live2dId4}`).style.display = 'none';
        }
    }
    if (modelVersion === 2) {
        $$(`#${live2dId2}`).style.display = 'block';
        window.live2dv2.load(live2dId2, `${live2d_settings.modelUrl}/${modelName}/model.json`);
    } else if (window.live2dCurrentVersion === modelVersion && modelVersion === 3) {
        window.live2dv4.change(`${live2d_settings.modelUrl}/${modelName}`, `${modelName}.model3.json`);
    } else {
        $$(`#${live2dId4}`).style.display = 'block';
        window.live2dv4.load(live2dId4, `${live2d_settings.modelUrl}/${modelName}`, `${modelName}.model3.json`);
    }
    window.live2dCurrentVersion = modelVersion;
}

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
    showMessage(live2d_models[modelIndex].message, 3000, true);
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

    $$('.waifu-tool .icon-next').addEventListener('click', () => loadOtherModel());
    $$('.waifu-tool .icon-message').addEventListener('click', () => showHitokoto());
    $$('.waifu-tool .icon-home').addEventListener('click', () => window.location = live2d_settings.homePageUrl)
    $$('.waifu-tool .icon-about').addEventListener('click', () => window.open(live2d_settings.aboutPageUrl))
    $$('.waifu-tool .icon-camera').addEventListener('click', () => {
        showMessage(getRandText(result.waifu.screenshot_message), 5000, true);
        window.live2dCurrentVersion === 3 ? window.live2dv4.CaptureCanvas() : window.live2dv2.captureFrame = true;
    });
    $$('.waifu-tool .icon-cross').addEventListener('click', () => {
        sessionStorage.setItem('waifuHide', '1');
        showMessage(getRandText(result.waifu.hidden_message), 1300, true);
        window.setTimeout(function () {
            waifu.classList.add('hide');
            document.getElementById('show-live2d').classList.remove('btnHide');
        }, 1000);
    })
}

initModel();

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

window.downloadCap = blobDownload;
export {showMessage, initModel}