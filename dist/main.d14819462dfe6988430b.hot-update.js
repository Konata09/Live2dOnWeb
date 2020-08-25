webpackHotUpdate("main",{

/***/ "./src/SDKv4/lappdelegate.ts":
/*!***********************************!*\
  !*** ./src/SDKv4/lappdelegate.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LAppDelegate = exports.frameBuffer = exports.gl = exports.s_instance = exports.canvas = void 0;
var live2dcubismframework_1 = __webpack_require__(/*! @framework/live2dcubismframework */ "./src/SDKv4/Framework/src/live2dcubismframework.ts");
var Csm_CubismFramework = live2dcubismframework_1.Live2DCubismFramework.CubismFramework;
var lappview_1 = __webpack_require__(/*! ./lappview */ "./src/SDKv4/lappview.ts");
var lapppal_1 = __webpack_require__(/*! ./lapppal */ "./src/SDKv4/lapppal.ts");
var lapptexturemanager_1 = __webpack_require__(/*! ./lapptexturemanager */ "./src/SDKv4/lapptexturemanager.ts");
var lapplive2dmanager_1 = __webpack_require__(/*! ./lapplive2dmanager */ "./src/SDKv4/lapplive2dmanager.ts");
var LAppDefine = __importStar(__webpack_require__(/*! ./lappdefine */ "./src/SDKv4/lappdefine.ts"));
exports.canvas = null;
exports.s_instance = null;
exports.gl = null;
exports.frameBuffer = null;
var LAppDelegate = (function () {
    function LAppDelegate() {
        this._captured = false;
        this._mouseX = 0.0;
        this._mouseY = 0.0;
        this._isEnd = false;
        this._cubismOption = new live2dcubismframework_1.Option();
        this._view = new lappview_1.LAppView();
        this._textureManager = new lapptexturemanager_1.LAppTextureManager();
    }
    LAppDelegate.getInstance = function () {
        if (exports.s_instance == null) {
            exports.s_instance = new LAppDelegate();
        }
        return exports.s_instance;
    };
    LAppDelegate.releaseInstance = function () {
        if (exports.s_instance != null) {
            exports.s_instance.release();
        }
        exports.s_instance = null;
    };
    LAppDelegate.prototype.initialize = function (canvasId) {
        exports.canvas = document.getElementById(canvasId);
        exports.gl = exports.canvas.getContext('webgl') || exports.canvas.getContext('experimental-webgl');
        if (!exports.gl) {
            console.error('Cannot initialize WebGL. This browser does not support.');
            exports.gl = null;
            document.body.innerHTML =
                'This browser does not support the <code>&lt;canvas&gt;</code> element.';
            return false;
        }
        if (!exports.frameBuffer) {
            exports.frameBuffer = exports.gl.getParameter(exports.gl.FRAMEBUFFER_BINDING);
        }
        exports.gl.enable(exports.gl.BLEND);
        exports.gl.blendFunc(exports.gl.SRC_ALPHA, exports.gl.ONE_MINUS_SRC_ALPHA);
        var supportTouch = 'ontouchend' in exports.canvas;
        if (supportTouch) {
            window.ontouchstart = onTouchBegan;
            window.ontouchmove = onTouchMoved;
            window.ontouchend = onTouchEnded;
            window.ontouchcancel = onTouchCancel;
        }
        else {
            exports.canvas.onmousedown = onClickBegan;
            window.onmousemove = onMouseMoved;
            window.onmouseout = onMouseLeave;
            exports.canvas.onmouseup = onClickEnded;
        }
        this._view.initialize();
        this.initializeCubism();
        return true;
    };
    LAppDelegate.prototype.release = function () {
        window.ontouchstart = undefined;
        window.ontouchmove = undefined;
        window.ontouchend = undefined;
        window.ontouchcancel = undefined;
        exports.canvas.onmousedown = undefined;
        window.onmousemove = undefined;
        window.onmouseout = undefined;
        exports.canvas.onmouseup = undefined;
        this._textureManager.release();
        this._textureManager = null;
        this._view.release();
        this._view = null;
        lapplive2dmanager_1.LAppLive2DManager.releaseInstance();
        Csm_CubismFramework.dispose();
    };
    LAppDelegate.prototype.run = function () {
        var _this = this;
        var loop = function () {
            if (exports.s_instance == null) {
                return;
            }
            lapppal_1.LAppPal.updateTime();
            exports.gl.clearColor(0.0, 0.0, 0.0, 0.0);
            exports.gl.enable(exports.gl.DEPTH_TEST);
            exports.gl.depthFunc(exports.gl.LEQUAL);
            exports.gl.clear(exports.gl.COLOR_BUFFER_BIT | exports.gl.DEPTH_BUFFER_BIT);
            exports.gl.clearDepth(1.0);
            exports.gl.enable(exports.gl.BLEND);
            exports.gl.blendFunc(exports.gl.SRC_ALPHA, exports.gl.ONE_MINUS_SRC_ALPHA);
            _this._view.render();
            if (LAppDefine.captureCanvas) {
                LAppDefine.setCaptureCanvas(false);
                exports.canvas.toBlob(window.downloadCap);
            }
            requestAnimationFrame(loop);
        };
        loop();
    };
    LAppDelegate.prototype.createShader = function () {
        var vertexShaderId = exports.gl.createShader(exports.gl.VERTEX_SHADER);
        if (vertexShaderId == null) {
            lapppal_1.LAppPal.printMessage('failed to create vertexShader');
            return null;
        }
        var vertexShader = 'precision mediump float;' +
            'attribute vec3 position;' +
            'attribute vec2 uv;' +
            'varying vec2 vuv;' +
            'void main(void)' +
            '{' +
            '   gl_Position = vec4(position, 1.0);' +
            '   vuv = uv;' +
            '}';
        exports.gl.shaderSource(vertexShaderId, vertexShader);
        exports.gl.compileShader(vertexShaderId);
        var fragmentShaderId = exports.gl.createShader(exports.gl.FRAGMENT_SHADER);
        if (fragmentShaderId == null) {
            lapppal_1.LAppPal.printMessage('failed to create fragmentShader');
            return null;
        }
        var fragmentShader = 'precision mediump float;' +
            'varying vec2 vuv;' +
            'uniform sampler2D texture;' +
            'void main(void)' +
            '{' +
            '   gl_FragColor = texture2D(texture, vuv);' +
            '}';
        exports.gl.shaderSource(fragmentShaderId, fragmentShader);
        exports.gl.compileShader(fragmentShaderId);
        var programId = exports.gl.createProgram();
        exports.gl.attachShader(programId, vertexShaderId);
        exports.gl.attachShader(programId, fragmentShaderId);
        exports.gl.deleteShader(vertexShaderId);
        exports.gl.deleteShader(fragmentShaderId);
        exports.gl.linkProgram(programId);
        exports.gl.useProgram(programId);
        return programId;
    };
    LAppDelegate.prototype.getView = function () {
        return this._view;
    };
    LAppDelegate.prototype.getTextureManager = function () {
        return this._textureManager;
    };
    LAppDelegate.prototype.initializeCubism = function () {
        this._cubismOption.logFunction = lapppal_1.LAppPal.printMessage;
        this._cubismOption.loggingLevel = LAppDefine.CubismLoggingLevel;
        Csm_CubismFramework.startUp(this._cubismOption);
        Csm_CubismFramework.initialize();
        lapplive2dmanager_1.LAppLive2DManager.getInstance();
        lapppal_1.LAppPal.updateTime();
        this._view.initializeSprite();
    };
    return LAppDelegate;
}());
exports.LAppDelegate = LAppDelegate;
function onClickBegan(e) {
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    LAppDelegate.getInstance()._captured = true;
    var posX = e.pageX;
    var posY = e.pageY;
    LAppDelegate.getInstance()._view.onTouchesBegan(posX, posY);
}
function onMouseMoved(e) {
    if (!LAppDelegate.getInstance()._view ||
        !LAppDelegate.getInstance()._view._programId) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var rect = exports.canvas.getBoundingClientRect();
    var posX = e.clientX - rect.left;
    var posY = e.clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesMoved(posX, posY);
}
function onMouseLeave() {
    LAppDefine.DebugLogEnable && lapppal_1.LAppPal.printMessage('[Live2Dv4] onMouseLeave');
    if (!LAppDelegate.getInstance()._view ||
        !LAppDelegate.getInstance()._view._programId) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var live2DManager = lapplive2dmanager_1.LAppLive2DManager.getInstance();
    live2DManager.onDrag(0.0, 0.0);
}
function onClickEnded(e) {
    LAppDelegate.getInstance()._captured = false;
    if (!LAppDelegate.getInstance()._view ||
        !LAppDelegate.getInstance()._view._programId) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.clientX - rect.left;
    var posY = e.clientY - rect.top;
    if (LAppDefine.DebugLogEnable) {
        lapppal_1.LAppPal.printMessage("[Live2Dv4] onClickEnded:\n       rect left: " + rect.left.toFixed(2) + " rect top: " + rect.top.toFixed(2) + "\n       clientX: " + e.clientX.toFixed(2) + " clientY: " + e.clientY.toFixed(2));
    }
    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}
function onTouchBegan(e) {
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    LAppDelegate.getInstance()._captured = true;
    var rect = exports.canvas.getBoundingClientRect();
    var posX = e.changedTouches[0].clientX - rect.left;
    var posY = e.changedTouches[0].clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesMoved(posX, posY);
}
function onTouchMoved(e) {
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var rect = exports.canvas.getBoundingClientRect();
    var posX = e.changedTouches[0].clientX - rect.left;
    var posY = e.changedTouches[0].clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesMoved(posX, posY);
}
function onTouchEnded(e) {
    LAppDelegate.getInstance()._captured = false;
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var live2DManager = lapplive2dmanager_1.LAppLive2DManager.getInstance();
    live2DManager.onDrag(0.0, 0.0);
    var rect = exports.canvas.getBoundingClientRect();
    var posX = e.changedTouches[0].clientX - rect.left;
    var posY = e.changedTouches[0].clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}
function onTouchCancel(e) {
    LAppDelegate.getInstance()._captured = false;
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var live2DManager = lapplive2dmanager_1.LAppLive2DManager.getInstance();
    live2DManager.onDrag(0.0, 0.0);
    var rect = exports.canvas.getBoundingClientRect();
    var posX = e.changedTouches[0].clientX - rect.left;
    var posY = e.changedTouches[0].clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}


/***/ }),

/***/ "./src/SDKv4/lapptexturemanager.ts":
/*!*****************************************!*\
  !*** ./src/SDKv4/lapptexturemanager.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TextureInfo = exports.LAppTextureManager = void 0;
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "./src/SDKv4/Framework/src/type/csmvector.ts");
var Csm_csmVector = csmvector_1.Live2DCubismFramework.csmVector;
var lappdelegate_1 = __webpack_require__(/*! ./lappdelegate */ "./src/SDKv4/lappdelegate.ts");
var LAppTextureManager = (function () {
    function LAppTextureManager() {
        this._textures = new Csm_csmVector();
    }
    LAppTextureManager.prototype.release = function () {
        for (var ite = this._textures.begin(); ite.notEqual(this._textures.end()); ite.preIncrement()) {
            lappdelegate_1.gl.deleteTexture(ite.ptr().id);
        }
        this._textures = null;
    };
    LAppTextureManager.prototype.createTextureFromPngFile = function (fileName, usePremultiply, callback) {
        var _this = this;
        var _loop_1 = function (ite) {
            if (ite.ptr().fileName == fileName &&
                ite.ptr().usePremultply == usePremultiply) {
                ite.ptr().img = new Image();
                ite.ptr().img.onload = function () { return callback(ite.ptr()); };
                ite.ptr().img.src = fileName;
                return { value: void 0 };
            }
        };
        for (var ite = this._textures.begin(); ite.notEqual(this._textures.end()); ite.preIncrement()) {
            var state_1 = _loop_1(ite);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        var img = new Image();
        img.onload = function () {
            var tex = lappdelegate_1.gl.createTexture();
            lappdelegate_1.gl.bindTexture(lappdelegate_1.gl.TEXTURE_2D, tex);
            lappdelegate_1.gl.texParameteri(lappdelegate_1.gl.TEXTURE_2D, lappdelegate_1.gl.TEXTURE_MIN_FILTER, lappdelegate_1.gl.LINEAR_MIPMAP_LINEAR);
            lappdelegate_1.gl.texParameteri(lappdelegate_1.gl.TEXTURE_2D, lappdelegate_1.gl.TEXTURE_MAG_FILTER, lappdelegate_1.gl.LINEAR);
            if (usePremultiply) {
                lappdelegate_1.gl.pixelStorei(lappdelegate_1.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            }
            lappdelegate_1.gl.texImage2D(lappdelegate_1.gl.TEXTURE_2D, 0, lappdelegate_1.gl.RGBA, lappdelegate_1.gl.RGBA, lappdelegate_1.gl.UNSIGNED_BYTE, img);
            lappdelegate_1.gl.generateMipmap(lappdelegate_1.gl.TEXTURE_2D);
            lappdelegate_1.gl.bindTexture(lappdelegate_1.gl.TEXTURE_2D, null);
            var textureInfo = new TextureInfo();
            if (textureInfo != null) {
                textureInfo.fileName = fileName;
                textureInfo.width = img.width;
                textureInfo.height = img.height;
                textureInfo.id = tex;
                textureInfo.img = img;
                textureInfo.usePremultply = usePremultiply;
                _this._textures.pushBack(textureInfo);
            }
            callback(textureInfo);
        };
        img.src = fileName;
    };
    LAppTextureManager.prototype.releaseTextures = function () {
        for (var i = 0; i < this._textures.getSize(); i++) {
            this._textures.set(i, null);
        }
        this._textures.clear();
    };
    LAppTextureManager.prototype.releaseTextureByTexture = function (texture) {
        for (var i = 0; i < this._textures.getSize(); i++) {
            if (this._textures.at(i).id != texture) {
                continue;
            }
            this._textures.set(i, null);
            this._textures.remove(i);
            break;
        }
    };
    LAppTextureManager.prototype.releaseTextureByFilePath = function (fileName) {
        for (var i = 0; i < this._textures.getSize(); i++) {
            if (this._textures.at(i).fileName == fileName) {
                this._textures.set(i, null);
                this._textures.remove(i);
                break;
            }
        }
    };
    return LAppTextureManager;
}());
exports.LAppTextureManager = LAppTextureManager;
var TextureInfo = (function () {
    function TextureInfo() {
        this.id = null;
        this.width = 0;
        this.height = 0;
    }
    return TextureInfo;
}());
exports.TextureInfo = TextureInfo;


/***/ }),

/***/ "./src/SDKv4/lappview.ts":
/*!*******************************!*\
  !*** ./src/SDKv4/lappview.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LAppView = void 0;
var cubismmatrix44_1 = __webpack_require__(/*! @framework/math/cubismmatrix44 */ "./src/SDKv4/Framework/src/math/cubismmatrix44.ts");
var cubismviewmatrix_1 = __webpack_require__(/*! @framework/math/cubismviewmatrix */ "./src/SDKv4/Framework/src/math/cubismviewmatrix.ts");
var Csm_CubismViewMatrix = cubismviewmatrix_1.Live2DCubismFramework.CubismViewMatrix;
var Csm_CubismMatrix44 = cubismmatrix44_1.Live2DCubismFramework.CubismMatrix44;
var touchmanager_1 = __webpack_require__(/*! ./touchmanager */ "./src/SDKv4/touchmanager.ts");
var lapplive2dmanager_1 = __webpack_require__(/*! ./lapplive2dmanager */ "./src/SDKv4/lapplive2dmanager.ts");
var lappdelegate_1 = __webpack_require__(/*! ./lappdelegate */ "./src/SDKv4/lappdelegate.ts");
var lapppal_1 = __webpack_require__(/*! ./lapppal */ "./src/SDKv4/lapppal.ts");
var LAppDefine = __importStar(__webpack_require__(/*! ./lappdefine */ "./src/SDKv4/lappdefine.ts"));
var LAppView = (function () {
    function LAppView() {
        this._programId = null;
        this._touchManager = new touchmanager_1.TouchManager();
        this._deviceToScreen = new Csm_CubismMatrix44();
        this._viewMatrix = new Csm_CubismViewMatrix();
    }
    LAppView.prototype.initialize = function () {
        var width = lappdelegate_1.canvas.width, height = lappdelegate_1.canvas.height;
        var ratio = height / width;
        var left = LAppDefine.ViewLogicalLeft;
        var right = LAppDefine.ViewLogicalRight;
        var bottom = -ratio;
        var top = ratio;
        this._viewMatrix.setScreenRect(left, right, bottom, top);
        var screenW = Math.abs(left - right);
        this._deviceToScreen.scaleRelative(screenW / width, -screenW / width);
        this._deviceToScreen.translateRelative(-width * 0.5, -height * 0.5);
        this._viewMatrix.setMaxScale(LAppDefine.ViewMaxScale);
        this._viewMatrix.setMinScale(LAppDefine.ViewMinScale);
        this._viewMatrix.setMaxScreenRect(LAppDefine.ViewLogicalMaxLeft, LAppDefine.ViewLogicalMaxRight, LAppDefine.ViewLogicalMaxBottom, LAppDefine.ViewLogicalMaxTop);
    };
    LAppView.prototype.release = function () {
        this._viewMatrix = null;
        this._touchManager = null;
        this._deviceToScreen = null;
        lappdelegate_1.gl.deleteProgram(this._programId);
        this._programId = null;
    };
    LAppView.prototype.render = function () {
        lappdelegate_1.gl.useProgram(this._programId);
        lappdelegate_1.gl.flush();
        var live2DManager = lapplive2dmanager_1.LAppLive2DManager.getInstance();
        live2DManager.onUpdate();
    };
    LAppView.prototype.initializeSprite = function () {
        var width = lappdelegate_1.canvas.width;
        var height = lappdelegate_1.canvas.height;
        var textureManager = lappdelegate_1.LAppDelegate.getInstance().getTextureManager();
        if (this._programId == null) {
            this._programId = lappdelegate_1.LAppDelegate.getInstance().createShader();
        }
    };
    LAppView.prototype.onTouchesBegan = function (pointX, pointY) {
        this._touchManager.touchesBegan(pointX, pointY);
    };
    LAppView.prototype.onTouchesMoved = function (pointX, pointY) {
        var viewX = this.transformViewX(this._touchManager.getX());
        var viewY = this.transformViewY(this._touchManager.getY());
        this._touchManager.touchesMoved(pointX, pointY);
        var live2DManager = lapplive2dmanager_1.LAppLive2DManager.getInstance();
        LAppDefine.DebugLogEnable &&
            LAppDefine.DebugTouchLogEnable &&
            console.log("[Live2Dv4] pointX: " + pointX + " pointY: " + pointY + "\n          viewX: " + viewX + " viewY: " + viewY);
        live2DManager.onDrag(viewX, viewY);
    };
    LAppView.prototype.onTouchesEnded = function (pointX, pointY) {
        var live2DManager = lapplive2dmanager_1.LAppLive2DManager.getInstance();
        {
            if (LAppDefine.DebugLogEnable) {
                lapppal_1.LAppPal.printMessage("[Live2Dv4] touchesEnded x: " + pointX + " y: " + pointY);
            }
            var x = this._deviceToScreen.transformX(pointX);
            var y = this._deviceToScreen.transformY(pointY);
            live2DManager.onTap(x, y);
        }
    };
    LAppView.prototype.transformViewX = function (deviceX) {
        var screenX = this._deviceToScreen.transformX(deviceX);
        return this._viewMatrix.invertTransformX(screenX);
    };
    LAppView.prototype.transformViewY = function (deviceY) {
        var screenY = this._deviceToScreen.transformY(deviceY);
        return this._viewMatrix.invertTransformY(screenY);
    };
    LAppView.prototype.transformScreenX = function (deviceX) {
        return this._deviceToScreen.transformX(deviceX);
    };
    LAppView.prototype.transformScreenY = function (deviceY) {
        return this._deviceToScreen.transformY(deviceY);
    };
    return LAppView;
}());
exports.LAppView = LAppView;


/***/ }),

/***/ "./src/SDKv4/main.ts":
/*!***************************!*\
  !*** ./src/SDKv4/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lappdelegate_1 = __webpack_require__(/*! ./lappdelegate */ "./src/SDKv4/lappdelegate.ts");
var LAppDefine = __importStar(__webpack_require__(/*! ./lappdefine */ "./src/SDKv4/lappdefine.ts"));
var lapplive2dmanager_1 = __webpack_require__(/*! ./lapplive2dmanager */ "./src/SDKv4/lapplive2dmanager.ts");
Promise.resolve().then(function () { return __importStar(__webpack_require__(/*! !raw-loader!./Core/live2dcubismcore.min.js */ "./node_modules/raw-loader/dist/cjs.js!./src/SDKv4/Core/live2dcubismcore.min.js")); }).then(function (rawModule) { return eval.call(null, rawModule.default); });
window.live2dv4 = window.live2dv4 || {};
window.live2dv4.load = function (canvasId, modelPath, modelJsonName) {
    LAppDefine.defineDebug(window.live2dv4.debug ? true : false, window.live2dv4.debugMousemove ? true : false);
    LAppDefine.defineModelPath(modelPath, modelJsonName);
    if (lappdelegate_1.LAppDelegate.getInstance().initialize(canvasId) == false) {
        return;
    }
    lappdelegate_1.LAppDelegate.getInstance().run();
};
window.live2dv4.change = function (modelPath, modelJsonName) {
    lapplive2dmanager_1.LAppLive2DManager.getInstance().changeScene(modelPath, modelJsonName);
};
window.live2dv4.release = function () {
    lappdelegate_1.LAppDelegate.releaseInstance();
};
window.live2dv4.CaptureCanvas = function () {
    LAppDefine.setCaptureCanvas(true);
};
window.live2dv4.setPreLoadMotion = function (preLoadMotion) {
    LAppDefine.setPreLoadMotion(preLoadMotion);
};
window.onbeforeunload = function () { return lappdelegate_1.LAppDelegate.releaseInstance(); };


/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvU0RLdjQvbGFwcGRlbGVnYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9TREt2NC9sYXBwdGV4dHVyZW1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1NES3Y0L2xhcHB2aWV3LnRzIiwid2VicGFjazovLy8uL3NyYy9TREt2NC9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT0EsZ0pBRzBDO0FBQzFDLElBQU8sbUJBQW1CLEdBQUcsNkNBQXFCLENBQUMsZUFBZSxDQUFDO0FBQ25FLGtGQUFzQztBQUN0QywrRUFBb0M7QUFDcEMsZ0hBQTBEO0FBQzFELDZHQUF3RDtBQUN4RCxvR0FBMkM7QUFFaEMsY0FBTSxHQUFzQixJQUFJLENBQUM7QUFDakMsa0JBQVUsR0FBaUIsSUFBSSxDQUFDO0FBQ2hDLFVBQUUsR0FBMEIsSUFBSSxDQUFDO0FBQ2pDLG1CQUFXLEdBQXFCLElBQUksQ0FBQztBQU1oRDtJQXlPRTtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBRXBCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSw4QkFBVSxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLG1CQUFRLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztJQUNsRCxDQUFDO0lBM09hLHdCQUFXLEdBQXpCO1FBQ0UsSUFBSSxrQkFBVSxJQUFJLElBQUksRUFBRTtZQUN0QixrQkFBVSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7U0FDakM7UUFFRCxPQUFPLGtCQUFVLENBQUM7SUFDcEIsQ0FB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Q0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVHLFVBQVUsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3JELElBQUksMkJBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxFQUFFO1FBQzFELE9BQU87S0FDVjtJQUNELDJCQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDckMsQ0FBQyxDQUFDO0FBQ0YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsVUFBQyxTQUFpQixFQUFFLGFBQXFCO0lBQzlELHFDQUFpQixDQUFDLFdBQVcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDMUUsQ0FBQztBQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHO0lBQ3RCLDJCQUFZLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDbkMsQ0FBQyxDQUFDO0FBQ0YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEdBQUc7SUFDNUIsVUFBVSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLENBQUMsQ0FBQztBQUNGLE1BQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEdBQUcsVUFBQyxhQUFzQjtJQUN0RCxVQUFVLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDL0MsQ0FBQyxDQUFDO0FBSUYsTUFBTSxDQUFDLGNBQWMsR0FBRyxjQUFZLGtDQUFZLENBQUMsZUFBZSxFQUFFLEVBQTlCLENBQThCLENBQUMiLCJmaWxlIjoibWFpbi5kMTQ4MTk0NjJkZmU2OTg4NDMwYi5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQoYykgTGl2ZTJEIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSB0aGUgTGl2ZTJEIE9wZW4gU29mdHdhcmUgbGljZW5zZVxuICogdGhhdCBjYW4gYmUgZm91bmQgYXQgaHR0cHM6Ly93d3cubGl2ZTJkLmNvbS9ldWxhL2xpdmUyZC1vcGVuLXNvZnR3YXJlLWxpY2Vuc2UtYWdyZWVtZW50X2VuLmh0bWwuXG4gKi9cblxuaW1wb3J0IHtcbiAgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGxpdmUyZGN1YmlzbWZyYW1ld29yayxcbiAgT3B0aW9uIGFzIENzbV9PcHRpb25cbn0gZnJvbSAnQGZyYW1ld29yay9saXZlMmRjdWJpc21mcmFtZXdvcmsnO1xuaW1wb3J0IENzbV9DdWJpc21GcmFtZXdvcmsgPSBsaXZlMmRjdWJpc21mcmFtZXdvcmsuQ3ViaXNtRnJhbWV3b3JrO1xuaW1wb3J0IHsgTEFwcFZpZXcgfSBmcm9tICcuL2xhcHB2aWV3JztcbmltcG9ydCB7IExBcHBQYWwgfSBmcm9tICcuL2xhcHBwYWwnO1xuaW1wb3J0IHsgTEFwcFRleHR1cmVNYW5hZ2VyIH0gZnJvbSAnLi9sYXBwdGV4dHVyZW1hbmFnZXInO1xuaW1wb3J0IHsgTEFwcExpdmUyRE1hbmFnZXIgfSBmcm9tICcuL2xhcHBsaXZlMmRtYW5hZ2VyJztcbmltcG9ydCAqIGFzIExBcHBEZWZpbmUgZnJvbSAnLi9sYXBwZGVmaW5lJztcblxuZXhwb3J0IGxldCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gbnVsbDtcbmV4cG9ydCBsZXQgc19pbnN0YW5jZTogTEFwcERlbGVnYXRlID0gbnVsbDtcbmV4cG9ydCBsZXQgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCA9IG51bGw7XG5leHBvcnQgbGV0IGZyYW1lQnVmZmVyOiBXZWJHTEZyYW1lYnVmZmVyID0gbnVsbDtcblxuLyoqXG4gKiDlupTnlKjnqIvluo/nsbtcbiAqIEN1YmlzbSBTREvjga7nrqHnkIbjgpLooYzjgYbjgIJcbiAqL1xuZXhwb3J0IGNsYXNzIExBcHBEZWxlZ2F0ZSB7XG4gIC8qKlxuICAgKiDov5Tlm57nsbvlrp7kvosoc2luZ3RvbinjgIJcbiAgICog5aaC5p6c5rKh5pyJ55Sf5oiQ5a6e5L6L77yM5YiZ5Zyo5YaF6YOo55Sf5oiQ5a6e5L6L44CCXG4gICAqXG4gICAqIEByZXR1cm4g57G75a6e5L6LXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCk6IExBcHBEZWxlZ2F0ZSB7XG4gICAgaWYgKHNfaW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgc19pbnN0YW5jZSA9IG5ldyBMQXBwRGVsZWdhdGUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc19pbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDph4rmlL7nsbvlrp7kvosoc2luZ2xlIHRvbilcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVsZWFzZUluc3RhbmNlKCk6IHZvaWQge1xuICAgIGlmIChzX2luc3RhbmNlICE9IG51bGwpIHtcbiAgICAgIHNfaW5zdGFuY2UucmVsZWFzZSgpO1xuICAgIH1cblxuICAgIHNfaW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIOWIneWni+WMlkFQUOmcgOimgeeahOS4nOilv+OAglxuICAgKi9cbiAgcHVibGljIGluaXRpYWxpemUoY2FudmFzSWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIC8vIEdldHRpbmcgYSBjYW52YXNcbiAgICBjYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBnbCBjb250ZXh0XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJykgfHwgY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xuXG4gICAgaWYgKCFnbCkge1xuICAgICAgY29uc29sZS5lcnJvcignQ2Fubm90IGluaXRpYWxpemUgV2ViR0wuIFRoaXMgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0LicpO1xuICAgICAgZ2wgPSBudWxsO1xuXG4gICAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9XG4gICAgICAgICdUaGlzIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgPGNvZGU+Jmx0O2NhbnZhcyZndDs8L2NvZGU+IGVsZW1lbnQuJztcblxuICAgICAgLy8gR2wgaW5pdGlhbGl6YXRpb24gZmFpbGVkLlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIEFkZCBhIGNhbnZhcyB0byB0aGUgRE9NXG4gICAgLy8gZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuXG4gICAgaWYgKCFmcmFtZUJ1ZmZlcikge1xuICAgICAgZnJhbWVCdWZmZXIgPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuRlJBTUVCVUZGRVJfQklORElORyk7XG4gICAgfVxuXG4gICAgLy8gVHJhbnNwYXJlbmN5IHNldHRpbmdcbiAgICBnbC5lbmFibGUoZ2wuQkxFTkQpO1xuICAgIGdsLmJsZW5kRnVuYyhnbC5TUkNfQUxQSEEsIGdsLk9ORV9NSU5VU19TUkNfQUxQSEEpO1xuXG4gICAgY29uc3Qgc3VwcG9ydFRvdWNoOiBib29sZWFuID0gJ29udG91Y2hlbmQnIGluIGNhbnZhcztcblxuICAgIGlmIChzdXBwb3J0VG91Y2gpIHtcbiAgICAgIC8vIFRvdWNoIHJlbGF0ZWQgY2FsbGJhY2sgZnVuY3Rpb24gcmVnaXN0cmF0aW9uXG4gICAgICB3aW5kb3cub250b3VjaHN0YXJ0ID0gb25Ub3VjaEJlZ2FuO1xuICAgICAgd2luZG93Lm9udG91Y2htb3ZlID0gb25Ub3VjaE1vdmVkO1xuICAgICAgd2luZG93Lm9udG91Y2hlbmQgPSBvblRvdWNoRW5kZWQ7XG4gICAgICB3aW5kb3cub250b3VjaGNhbmNlbCA9IG9uVG91Y2hDYW5jZWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE1vdXNlIHJlbGF0ZWQgY2FsbGJhY2sgZnVuY3Rpb24gcmVnaXN0cmF0aW9uXG4gICAgICBjYW52YXMub25tb3VzZWRvd24gPSBvbkNsaWNrQmVnYW47XG4gICAgICB3aW5kb3cub25tb3VzZW1vdmUgPSBvbk1vdXNlTW92ZWQ7IC8vIOebkeWQrOWcqCB3aW5kb3cg5LiK77yM5Y+v5Lul55uR5ZCs5pW05Liq56qX5Y+j5YaF55qE5oyH6ZKIXG4gICAgICB3aW5kb3cub25tb3VzZW91dCA9IG9uTW91c2VMZWF2ZTsgLy8g5oyH6ZKI56e75Ye656qX5Y+j5pe2XG4gICAgICBjYW52YXMub25tb3VzZXVwID0gb25DbGlja0VuZGVkO1xuICAgIH1cblxuICAgIC8vIEluaXRpYWxpemluZyBBcHBWaWV3XG4gICAgdGhpcy5fdmlldy5pbml0aWFsaXplKCk7XG5cbiAgICAvLyBDdWJpc20gU0RL44Gu5Yid5pyf5YyWXG4gICAgdGhpcy5pbml0aWFsaXplQ3ViaXNtKCk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDop6PmlL7jgZnjgovjgIJcbiAgICovXG4gIHB1YmxpYyByZWxlYXNlKCk6IHZvaWQge1xuICAgIC8vIOenu+mZpOebkeWQrOWHveaVsFxuICAgIHdpbmRvdy5vbnRvdWNoc3RhcnQgPSB1bmRlZmluZWQ7XG4gICAgd2luZG93Lm9udG91Y2htb3ZlID0gdW5kZWZpbmVkO1xuICAgIHdpbmRvdy5vbnRvdWNoZW5kID0gdW5kZWZpbmVkO1xuICAgIHdpbmRvdy5vbnRvdWNoY2FuY2VsID0gdW5kZWZpbmVkO1xuICAgIGNhbnZhcy5vbm1vdXNlZG93biA9IHVuZGVmaW5lZDtcbiAgICB3aW5kb3cub25tb3VzZW1vdmUgPSB1bmRlZmluZWQ7XG4gICAgd2luZG93Lm9ubW91c2VvdXQgPSB1bmRlZmluZWQ7XG4gICAgY2FudmFzLm9ubW91c2V1cCA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuX3RleHR1cmVNYW5hZ2VyLnJlbGVhc2UoKTtcbiAgICB0aGlzLl90ZXh0dXJlTWFuYWdlciA9IG51bGw7XG5cbiAgICB0aGlzLl92aWV3LnJlbGVhc2UoKTtcbiAgICB0aGlzLl92aWV3ID0gbnVsbDtcblxuICAgIC8vIEZyZWUgdXAgcmVzb3VyY2VzXG4gICAgTEFwcExpdmUyRE1hbmFnZXIucmVsZWFzZUluc3RhbmNlKCk7XG5cbiAgICAvLyBDdWJpc20gU0RL44Gu6Kej5pS+XG4gICAgQ3NtX0N1YmlzbUZyYW1ld29yay5kaXNwb3NlKCk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0aW9uIHByb2Nlc3NpbmdcbiAgICovXG4gIHB1YmxpYyBydW4oKTogdm9pZCB7XG4gICAgLy8gTWFpbiBsb29wXG4gICAgY29uc3QgbG9vcCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIC8vIENoZWNraW5nIHRoZSBwcmVzZW5jZSBvciBhYnNlbmNlIG9mIGluc3RhbmNlc1xuICAgICAgaWYgKHNfaW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIOaZgumWk+abtOaWsFxuICAgICAgTEFwcFBhbC51cGRhdGVUaW1lKCk7XG5cbiAgICAgIC8vIOeUu+mdouOBruWIneacn+WMllxuICAgICAgZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAwLjApO1xuXG4gICAgICAvLyBBY3RpdmF0ZSBkZXB0aCB0ZXN0aW5nLlxuICAgICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xuXG4gICAgICAvLyBUaGUgbmVhcmVzdCBvYmplY3Qgb2JzY3VyZXMgdGhlIGRpc3RhbnQgb2JqZWN0XG4gICAgICBnbC5kZXB0aEZ1bmMoZ2wuTEVRVUFMKTtcblxuICAgICAgLy8gQ2xlYXIgY29sb3IgYW5kIGRlcHRoIGJ1ZmZlcnNcbiAgICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcblxuICAgICAgZ2wuY2xlYXJEZXB0aCgxLjApO1xuXG4gICAgICAvLyDpgI/pgY7oqK3lrppcbiAgICAgIGdsLmVuYWJsZShnbC5CTEVORCk7XG4gICAgICBnbC5ibGVuZEZ1bmMoZ2wuU1JDX0FMUEhBLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBKTtcblxuICAgICAgLy8g5o+P55S75pu05pawXG4gICAgICB0aGlzLl92aWV3LnJlbmRlcigpO1xuXG4gICAgICAvLyDmo4Dmn6XmmK/lkKbmiKrlm75cbiAgICAgIGlmKExBcHBEZWZpbmUuY2FwdHVyZUNhbnZhcyl7XG4gICAgICAgIExBcHBEZWZpbmUuc2V0Q2FwdHVyZUNhbnZhcyhmYWxzZSk7XG4gICAgICAgIGNhbnZhcy50b0Jsb2Iod2luZG93LmRvd25sb2FkQ2FwKTtcbiAgICAgIH1cbiAgICAgIC8vIFJlY3Vyc2l2ZSBjYWxsIGZvciB0aGUgbG9vcFxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgIH07XG4gICAgbG9vcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSBzaGFkZXIuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlU2hhZGVyKCk6IFdlYkdMUHJvZ3JhbSB7XG4gICAgLy8g44OQ44O844OG44OD44Kv44K544K344Kn44O844OA44O844Gu44Kz44Oz44OR44Kk44OrXG4gICAgY29uc3QgdmVydGV4U2hhZGVySWQgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuVkVSVEVYX1NIQURFUik7XG5cbiAgICBpZiAodmVydGV4U2hhZGVySWQgPT0gbnVsbCkge1xuICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ2ZhaWxlZCB0byBjcmVhdGUgdmVydGV4U2hhZGVyJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB2ZXJ0ZXhTaGFkZXI6IHN0cmluZyA9XG4gICAgICAncHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7JyArXG4gICAgICAnYXR0cmlidXRlIHZlYzMgcG9zaXRpb247JyArXG4gICAgICAnYXR0cmlidXRlIHZlYzIgdXY7JyArXG4gICAgICAndmFyeWluZyB2ZWMyIHZ1djsnICtcbiAgICAgICd2b2lkIG1haW4odm9pZCknICtcbiAgICAgICd7JyArXG4gICAgICAnICAgZ2xfUG9zaXRpb24gPSB2ZWM0KHBvc2l0aW9uLCAxLjApOycgK1xuICAgICAgJyAgIHZ1diA9IHV2OycgK1xuICAgICAgJ30nO1xuXG4gICAgZ2wuc2hhZGVyU291cmNlKHZlcnRleFNoYWRlcklkLCB2ZXJ0ZXhTaGFkZXIpO1xuICAgIGdsLmNvbXBpbGVTaGFkZXIodmVydGV4U2hhZGVySWQpO1xuXG4gICAgLy8gQ29tcGlsaW5nIGZyYWdtZW50IHNoYWRlcnNcbiAgICBjb25zdCBmcmFnbWVudFNoYWRlcklkID0gZ2wuY3JlYXRlU2hhZGVyKGdsLkZSQUdNRU5UX1NIQURFUik7XG5cbiAgICBpZiAoZnJhZ21lbnRTaGFkZXJJZCA9PSBudWxsKSB7XG4gICAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgnZmFpbGVkIHRvIGNyZWF0ZSBmcmFnbWVudFNoYWRlcicpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZnJhZ21lbnRTaGFkZXI6IHN0cmluZyA9XG4gICAgICAncHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7JyArXG4gICAgICAndmFyeWluZyB2ZWMyIHZ1djsnICtcbiAgICAgICd1bmlmb3JtIHNhbXBsZXIyRCB0ZXh0dXJlOycgK1xuICAgICAgJ3ZvaWQgbWFpbih2b2lkKScgK1xuICAgICAgJ3snICtcbiAgICAgICcgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodGV4dHVyZSwgdnV2KTsnICtcbiAgICAgICd9JztcblxuICAgIGdsLnNoYWRlclNvdXJjZShmcmFnbWVudFNoYWRlcklkLCBmcmFnbWVudFNoYWRlcik7XG4gICAgZ2wuY29tcGlsZVNoYWRlcihmcmFnbWVudFNoYWRlcklkKTtcblxuICAgIC8vIENyZWF0aW5nIHByb2dyYW0gb2JqZWN0c1xuICAgIGNvbnN0IHByb2dyYW1JZCA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcbiAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbUlkLCB2ZXJ0ZXhTaGFkZXJJZCk7XG4gICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1JZCwgZnJhZ21lbnRTaGFkZXJJZCk7XG5cbiAgICBnbC5kZWxldGVTaGFkZXIodmVydGV4U2hhZGVySWQpO1xuICAgIGdsLmRlbGV0ZVNoYWRlcihmcmFnbWVudFNoYWRlcklkKTtcblxuICAgIC8vIExpbmtcbiAgICBnbC5saW5rUHJvZ3JhbShwcm9ncmFtSWQpO1xuXG4gICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtSWQpO1xuXG4gICAgcmV0dXJuIHByb2dyYW1JZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBWaWV3IGluZm9ybWF0aW9uLlxuICAgKi9cbiAgcHVibGljIGdldFZpZXcoKTogTEFwcFZpZXcge1xuICAgIHJldHVybiB0aGlzLl92aWV3O1xuICB9XG5cbiAgcHVibGljIGdldFRleHR1cmVNYW5hZ2VyKCk6IExBcHBUZXh0dXJlTWFuYWdlciB7XG4gICAgcmV0dXJuIHRoaXMuX3RleHR1cmVNYW5hZ2VyO1xuICB9XG5cbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jYXB0dXJlZCA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlWCA9IDAuMDtcbiAgICB0aGlzLl9tb3VzZVkgPSAwLjA7XG4gICAgdGhpcy5faXNFbmQgPSBmYWxzZTtcblxuICAgIHRoaXMuX2N1YmlzbU9wdGlvbiA9IG5ldyBDc21fT3B0aW9uKCk7XG4gICAgdGhpcy5fdmlldyA9IG5ldyBMQXBwVmlldygpO1xuICAgIHRoaXMuX3RleHR1cmVNYW5hZ2VyID0gbmV3IExBcHBUZXh0dXJlTWFuYWdlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1YmlzbSBTREvjga7liJ3mnJ/ljJZcbiAgICovXG4gIHB1YmxpYyBpbml0aWFsaXplQ3ViaXNtKCk6IHZvaWQge1xuICAgIC8vIHNldHVwIGN1YmlzbVxuICAgIHRoaXMuX2N1YmlzbU9wdGlvbi5sb2dGdW5jdGlvbiA9IExBcHBQYWwucHJpbnRNZXNzYWdlO1xuICAgIHRoaXMuX2N1YmlzbU9wdGlvbi5sb2dnaW5nTGV2ZWwgPSBMQXBwRGVmaW5lLkN1YmlzbUxvZ2dpbmdMZXZlbDtcbiAgICBDc21fQ3ViaXNtRnJhbWV3b3JrLnN0YXJ0VXAodGhpcy5fY3ViaXNtT3B0aW9uKTtcblxuICAgIC8vIGluaXRpYWxpemUgY3ViaXNtXG4gICAgQ3NtX0N1YmlzbUZyYW1ld29yay5pbml0aWFsaXplKCk7XG5cbiAgICAvLyBsb2FkIG1vZGVsXG4gICAgTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcblxuICAgIExBcHBQYWwudXBkYXRlVGltZSgpO1xuXG4gICAgdGhpcy5fdmlldy5pbml0aWFsaXplU3ByaXRlKCk7XG4gIH1cblxuICBfY3ViaXNtT3B0aW9uOiBDc21fT3B0aW9uOyAvLyBDdWJpc20gU0RLIE9wdGlvblxuICBfdmlldzogTEFwcFZpZXc7IC8vIFZpZXfmg4XloLFcbiAgX2NhcHR1cmVkOiBib29sZWFuOyAvLyBBcmUgeW91IGNsaWNraW5nIG9uIGl0P1xuICBfbW91c2VYOiBudW1iZXI7IC8vIE1vdXNlIHgtY29vcmRpbmF0ZVxuICBfbW91c2VZOiBudW1iZXI7IC8vIE1vdXNlIHktY29vcmRpbmF0ZVxuICBfaXNFbmQ6IGJvb2xlYW47IC8vIElzIHRoZSBBUFAgY2xvc2VkP1xuICBfdGV4dHVyZU1hbmFnZXI6IExBcHBUZXh0dXJlTWFuYWdlcjsgLy8gVGV4dHVyZSBtYW5hZ2VyXG59XG5cbi8qKlxuICogQ2FsbGVkIHdoZW4gY2xpY2tlZC5cbiAqL1xuZnVuY3Rpb24gb25DbGlja0JlZ2FuKGU6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldykge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCd2aWV3IG5vdGZvdW5kJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl9jYXB0dXJlZCA9IHRydWU7XG5cbiAgY29uc3QgcG9zWDogbnVtYmVyID0gZS5wYWdlWDtcbiAgY29uc3QgcG9zWTogbnVtYmVyID0gZS5wYWdlWTtcblxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5vblRvdWNoZXNCZWdhbihwb3NYLCBwb3NZKTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgbW91c2UgcG9pbnRlciBtb3ZlcywgaXQgaXMgY2FsbGVkLlxuICovXG5mdW5jdGlvbiBvbk1vdXNlTW92ZWQoZTogTW91c2VFdmVudCk6IHZvaWQge1xuICAvLyDpu5jorqTpnIDopoHlkIzml7bmjInkuIvpvKDmoIfmiY3og73ot5/ouKog5rOo6YeK5o6JXG4gIC8vIGlmICghTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX2NhcHR1cmVkKSB7XG4gIC8vICAgcmV0dXJuO1xuICAvLyB9XG5cbiAgaWYgKFxuICAgICFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldyB8fFxuICAgICFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5fcHJvZ3JhbUlkXG4gICkge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCd2aWV3IG5vdGZvdW5kJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIERPTVJlY3Qg5a+56LGh77yMdG9w44CBbGVmdCDooajnpLrlhYPntKAoY2FudmFzKeW3puS4iuinkuWIsOinhuWPo+W3puS4iuinkueahOi3neemu++8jGJvdHRvbeOAgXJpZ2h06KGo56S65YWD57Sg5Y+z5LiL6KeS5Yiw6KeG5Y+j5bem5LiK6KeS55qE6Led56a7XG4gIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIC8vIOi/memHjOeahCBlLnRhcmdldCDmmK8gd2luZG93XG4gIC8vIE1vdXNlRXZlbnQg5a+56LGh77yMY2xpZW50WOOAgWNsaWVudFnliIbliKvmmK/pvKDmoIfngrnlh7vkvY3nva7lnKjop4blj6PkuK3nmoRY44CBWeWdkOagh1xuICBjb25zdCBwb3NYOiBudW1iZXIgPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gIGNvbnN0IHBvc1k6IG51bWJlciA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Lm9uVG91Y2hlc01vdmVkKHBvc1gsIHBvc1kpO1xufVxuXG4vKipcbiAqIOaMh+mSiOenu+WHuueql+WPo+aXtuaBouWkjem7mOiupOWnv+aAgVxuICovXG5mdW5jdGlvbiBvbk1vdXNlTGVhdmUoKTogdm9pZCB7XG4gIExBcHBEZWZpbmUuRGVidWdMb2dFbmFibGUgJiYgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ1tMaXZlMkR2NF0gb25Nb3VzZUxlYXZlJyk7XG4gIGlmIChcbiAgICAhTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcgfHxcbiAgICAhTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcuX3Byb2dyYW1JZFxuICApIHtcbiAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgndmlldyBub3Rmb3VuZCcpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBsaXZlMkRNYW5hZ2VyOiBMQXBwTGl2ZTJETWFuYWdlciA9IExBcHBMaXZlMkRNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG4gIGxpdmUyRE1hbmFnZXIub25EcmFnKDAuMCwgMC4wKTtcbn1cblxuLyoqXG4gKiBDYWxsIHdoZW4gdGhlIGNsaWNrIGlzIGZpbmlzaGVkLlxuICovXG5mdW5jdGlvbiBvbkNsaWNrRW5kZWQoZTogTW91c2VFdmVudCk6IHZvaWQge1xuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fY2FwdHVyZWQgPSBmYWxzZTtcbiAgaWYgKFxuICAgICFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldyB8fFxuICAgICFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5fcHJvZ3JhbUlkXG4gICkge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCd2aWV3IG5vdGZvdW5kJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIERPTVJlY3Qg5a+56LGh77yMdG9w44CBbGVmdCDooajnpLrlhYPntKAo6L+Z6YeM5pivY2FudmFzKeW3puS4iuinkuWIsOinhuWPo+W3puS4iuinkueahOi3neemu++8jGJvdHRvbeOAgXJpZ2h06KGo56S65YWD57Sg5Y+z5LiL6KeS5Yiw6KeG5Y+j5bem5LiK6KeS55qE6Led56a7XG4gIGNvbnN0IHJlY3QgPSAoZS50YXJnZXQgYXMgRWxlbWVudCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIC8vIE1vdXNlRXZlbnQg5a+56LGh77yMY2xpZW50WOOAgWNsaWVudFnliIbliKvmmK/pvKDmoIfngrnlh7vkvY3nva7lnKjop4blj6PkuK3nmoRY44CBWeWdkOagh1xuICBjb25zdCBwb3NYOiBudW1iZXIgPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gIGNvbnN0IHBvc1k6IG51bWJlciA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuICBpZiAoTEFwcERlZmluZS5EZWJ1Z0xvZ0VuYWJsZSkge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKFxuICAgICAgYFtMaXZlMkR2NF0gb25DbGlja0VuZGVkOlxuICAgICAgIHJlY3QgbGVmdDogJHtyZWN0LmxlZnQudG9GaXhlZCgyKX0gcmVjdCB0b3A6ICR7cmVjdC50b3AudG9GaXhlZCgyKX1cbiAgICAgICBjbGllbnRYOiAke2UuY2xpZW50WC50b0ZpeGVkKDIpfSBjbGllbnRZOiAke2UuY2xpZW50WS50b0ZpeGVkKDIpfWBcbiAgICApO1xuICB9XG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Lm9uVG91Y2hlc0VuZGVkKHBvc1gsIHBvc1kpO1xufVxuXG4vKipcbiAqIEl0IGlzIGNhbGxlZCB3aGVuIHRvdWNoZWQuXG4gKi9cbmZ1bmN0aW9uIG9uVG91Y2hCZWdhbihlOiBUb3VjaEV2ZW50KTogdm9pZCB7XG4gIGlmICghTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcpIHtcbiAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgndmlldyBub3Rmb3VuZCcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl9jYXB0dXJlZCA9IHRydWU7XG5cbiAgLy8gRE9NUmVjdCDlr7nosaHvvIx0b3DjgIFsZWZ0IOihqOekuuWFg+e0oChjYW52YXMp5bem5LiK6KeS5Yiw6KeG5Y+j5bem5LiK6KeS55qE6Led56a777yMYm90dG9t44CBcmlnaHTooajnpLrlhYPntKDlj7PkuIvop5LliLDop4blj6Plt6bkuIrop5LnmoTot53nprtcbiAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgLy8g6L+Z6YeM55qEIGUudGFyZ2V0IOaYryB3aW5kb3dcbiAgLy8gTW91c2VFdmVudCDlr7nosaHvvIxjbGllbnRY44CBY2xpZW50WeWIhuWIq+aYr+m8oOagh+eCueWHu+S9jee9ruWcqOinhuWPo+S4reeahFjjgIFZ5Z2Q5qCHXG4gIGNvbnN0IHBvc1ggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gIGNvbnN0IHBvc1kgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcub25Ub3VjaGVzTW92ZWQocG9zWCwgcG9zWSk7XG5cbiAgLy8gY29uc3QgcG9zWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVg7XG4gIC8vIGNvbnN0IHBvc1kgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VZO1xuICAvL1xuICAvLyBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5vblRvdWNoZXNCZWdhbihwb3NYLCBwb3NZKTtcbn1cblxuLyoqXG4gKiBUaGlzIGlzIGNhbGxlZCBzd2lwaW5nLlxuICovXG5mdW5jdGlvbiBvblRvdWNoTW92ZWQoZTogVG91Y2hFdmVudCk6IHZvaWQge1xuICAvLyBpZiAoIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl9jYXB0dXJlZCkge1xuICAvLyAgIHJldHVybjtcbiAgLy8gfVxuXG4gIGlmICghTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcpIHtcbiAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgndmlldyBub3Rmb3VuZCcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIERPTVJlY3Qg5a+56LGh77yMdG9w44CBbGVmdCDooajnpLrlhYPntKAoY2FudmFzKeW3puS4iuinkuWIsOinhuWPo+W3puS4iuinkueahOi3neemu++8jGJvdHRvbeOAgXJpZ2h06KGo56S65YWD57Sg5Y+z5LiL6KeS5Yiw6KeG5Y+j5bem5LiK6KeS55qE6Led56a7XG4gIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIC8vIOi/memHjOeahCBlLnRhcmdldCDmmK8gd2luZG93XG4gIC8vIE1vdXNlRXZlbnQg5a+56LGh77yMY2xpZW50WOOAgWNsaWVudFnliIbliKvmmK/pvKDmoIfngrnlh7vkvY3nva7lnKjop4blj6PkuK3nmoRY44CBWeWdkOagh1xuICBjb25zdCBwb3NYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICBjb25zdCBwb3NZID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcub25Ub3VjaGVzTW92ZWQocG9zWCwgcG9zWSk7XG59XG5cbi8qKlxuICogSXQgaXMgY2FsbGVkIHdoZW4gdGhlIHRvdWNoIGlzIGZpbmlzaGVkLlxuICovXG5mdW5jdGlvbiBvblRvdWNoRW5kZWQoZTogVG91Y2hFdmVudCk6IHZvaWQge1xuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fY2FwdHVyZWQgPSBmYWxzZTtcblxuICBpZiAoIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3KSB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ3ZpZXcgbm90Zm91bmQnKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgbGl2ZTJETWFuYWdlcjogTEFwcExpdmUyRE1hbmFnZXIgPSBMQXBwTGl2ZTJETWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuICBsaXZlMkRNYW5hZ2VyLm9uRHJhZygwLjAsIDAuMCk7XG5cbiAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICBjb25zdCBwb3NYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICBjb25zdCBwb3NZID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcub25Ub3VjaGVzRW5kZWQocG9zWCwgcG9zWSk7XG59XG5cbi8qKlxuICogVG91Y2ggaXMgY2FsbGVkIGNhbmNlbGVkLlxuICovXG5mdW5jdGlvbiBvblRvdWNoQ2FuY2VsKGU6IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX2NhcHR1cmVkID0gZmFsc2U7XG5cbiAgaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldykge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCd2aWV3IG5vdGZvdW5kJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGxpdmUyRE1hbmFnZXI6IExBcHBMaXZlMkRNYW5hZ2VyID0gTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcbiAgbGl2ZTJETWFuYWdlci5vbkRyYWcoMC4wLCAwLjApO1xuXG4gIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgY29uc3QgcG9zWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgY29uc3QgcG9zWSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Lm9uVG91Y2hlc0VuZGVkKHBvc1gsIHBvc1kpO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQoYykgTGl2ZTJEIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSB0aGUgTGl2ZTJEIE9wZW4gU29mdHdhcmUgbGljZW5zZVxuICogdGhhdCBjYW4gYmUgZm91bmQgYXQgaHR0cHM6Ly93d3cubGl2ZTJkLmNvbS9ldWxhL2xpdmUyZC1vcGVuLXNvZnR3YXJlLWxpY2Vuc2UtYWdyZWVtZW50X2VuLmh0bWwuXG4gKi9cblxuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGNzbXZlY3RvciB9IGZyb20gJ0BmcmFtZXdvcmsvdHlwZS9jc212ZWN0b3InO1xuaW1wb3J0IENzbV9jc21WZWN0b3IgPSBjc212ZWN0b3IuY3NtVmVjdG9yO1xuaW1wb3J0IGNzbVZlY3Rvcl9pdGVyYXRvciA9IGNzbXZlY3Rvci5pdGVyYXRvcjtcbmltcG9ydCB7IGdsIH0gZnJvbSAnLi9sYXBwZGVsZWdhdGUnO1xuXG4vKipcbiAqIFRleHR1cmUgbWFuYWdlbWVudCBjbGFzc1xuICogQSBjbGFzcyB0aGF0IGxvYWRzIGFuZCBtYW5hZ2VzIGltYWdlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIExBcHBUZXh0dXJlTWFuYWdlciB7XG4gIC8qKlxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3RleHR1cmVzID0gbmV3IENzbV9jc21WZWN0b3I8VGV4dHVyZUluZm8+KCk7XG4gIH1cblxuICAvKipcbiAgICog6Kej5pS+44GZ44KL44CCXG4gICAqL1xuICBwdWJsaWMgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICBmb3IgKFxuICAgICAgbGV0IGl0ZTogY3NtVmVjdG9yX2l0ZXJhdG9yPFRleHR1cmVJbmZvPiA9IHRoaXMuX3RleHR1cmVzLmJlZ2luKCk7XG4gICAgICBpdGUubm90RXF1YWwodGhpcy5fdGV4dHVyZXMuZW5kKCkpO1xuICAgICAgaXRlLnByZUluY3JlbWVudCgpXG4gICAgKSB7XG4gICAgICBnbC5kZWxldGVUZXh0dXJlKGl0ZS5wdHIoKS5pZCk7XG4gICAgfVxuICAgIHRoaXMuX3RleHR1cmVzID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiDnlLvlg4/oqq3jgb/ovrzjgb9cbiAgICpcbiAgICogQHBhcmFtIGZpbGVOYW1lIOiqreOBv+i+vOOCgOeUu+WDj+ODleOCoeOCpOODq+ODkeOCueWQjVxuICAgKiBAcGFyYW0gdXNlUHJlbXVsdGlwbHkgUHJlbXVsdOWHpueQhuOCkuacieWKueOBq+OBmeOCi+OBi1xuICAgKiBAcmV0dXJuIOeUu+WDj+aDheWgseOAgeiqreOBv+i+vOOBv+WkseaVl+aZguOBr251bGzjgpLov5TjgZlcbiAgICovXG4gIHB1YmxpYyBjcmVhdGVUZXh0dXJlRnJvbVBuZ0ZpbGUoXG4gICAgZmlsZU5hbWU6IHN0cmluZyxcbiAgICB1c2VQcmVtdWx0aXBseTogYm9vbGVhbixcbiAgICBjYWxsYmFjazogKHRleHR1cmVJbmZvOiBUZXh0dXJlSW5mbykgPT4gdm9pZFxuICApOiB2b2lkIHtcbiAgICAvLyBzZWFyY2ggbG9hZGVkIHRleHR1cmUgYWxyZWFkeVxuICAgIGZvciAoXG4gICAgICBsZXQgaXRlOiBjc21WZWN0b3JfaXRlcmF0b3I8VGV4dHVyZUluZm8+ID0gdGhpcy5fdGV4dHVyZXMuYmVnaW4oKTtcbiAgICAgIGl0ZS5ub3RFcXVhbCh0aGlzLl90ZXh0dXJlcy5lbmQoKSk7XG4gICAgICBpdGUucHJlSW5jcmVtZW50KClcbiAgICApIHtcbiAgICAgIGlmIChcbiAgICAgICAgaXRlLnB0cigpLmZpbGVOYW1lID09IGZpbGVOYW1lICYmXG4gICAgICAgIGl0ZS5wdHIoKS51c2VQcmVtdWx0cGx5ID09IHVzZVByZW11bHRpcGx5XG4gICAgICApIHtcbiAgICAgICAgLy8gMuWbnuebruS7pemZjeOBr+OCreODo+ODg+OCt+ODpeOBjOS9v+eUqOOBleOCjOOCiyjlvoXjgaHmmYLplpPjgarjgZcpXG4gICAgICAgIC8vIFdlYktpdOOBp+OBr+WQjOOBmEltYWdl44Gub25sb2Fk44KS5YaN5bqm5ZG844G244Gr44Gv5YaN44Kk44Oz44K544K/44Oz44K544GM5b+F6KaBXG4gICAgICAgIC8vIOips+e0sO+8mmh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81MDI0MTgxXG4gICAgICAgIGl0ZS5wdHIoKS5pbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgaXRlLnB0cigpLmltZy5vbmxvYWQgPSAoKTogdm9pZCA9PiBjYWxsYmFjayhpdGUucHRyKCkpO1xuICAgICAgICBpdGUucHRyKCkuaW1nLnNyYyA9IGZpbGVOYW1lO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8g44OH44O844K/44Gu44Kq44Oz44Ot44O844OJ44KS44OI44Oq44Ks44O844Gr44GZ44KLXG4gICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgaW1nLm9ubG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIC8vIOODhuOCr+OCueODgeODo+OCquODluOCuOOCp+OCr+ODiOOBruS9nOaIkFxuICAgICAgY29uc3QgdGV4OiBXZWJHTFRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG4gICAgICAvLyDjg4bjgq/jgrnjg4Hjg6PjgpLpgbjmip5cbiAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleCk7XG5cbiAgICAgIC8vIOODhuOCr+OCueODgeODo+OBq+ODlOOCr+OCu+ODq+OCkuabuOOBjei+vOOCgFxuICAgICAgZ2wudGV4UGFyYW1ldGVyaShcbiAgICAgICAgZ2wuVEVYVFVSRV8yRCxcbiAgICAgICAgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLFxuICAgICAgICBnbC5MSU5FQVJfTUlQTUFQX0xJTkVBUlxuICAgICAgKTtcbiAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xuXG4gICAgICAvLyBQcmVtdWx05Yem55CG44KS6KGM44KP44Gb44KLXG4gICAgICBpZiAodXNlUHJlbXVsdGlwbHkpIHtcbiAgICAgICAgZ2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX1BSRU1VTFRJUExZX0FMUEhBX1dFQkdMLCAxKTtcbiAgICAgIH1cblxuICAgICAgLy8g44OG44Kv44K544OB44Oj44Gr44OU44Kv44K744Or44KS5pu444GN6L6844KAXG4gICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGltZyk7XG5cbiAgICAgIC8vIOODn+ODg+ODl+ODnuODg+ODl+OCkueUn+aIkFxuICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XG5cbiAgICAgIC8vIOODhuOCr+OCueODgeODo+OCkuODkOOCpOODs+ODiVxuICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XG5cbiAgICAgIGNvbnN0IHRleHR1cmVJbmZvOiBUZXh0dXJlSW5mbyA9IG5ldyBUZXh0dXJlSW5mbygpO1xuICAgICAgaWYgKHRleHR1cmVJbmZvICE9IG51bGwpIHtcbiAgICAgICAgdGV4dHVyZUluZm8uZmlsZU5hbWUgPSBmaWxlTmFtZTtcbiAgICAgICAgdGV4dHVyZUluZm8ud2lkdGggPSBpbWcud2lkdGg7XG4gICAgICAgIHRleHR1cmVJbmZvLmhlaWdodCA9IGltZy5oZWlnaHQ7XG4gICAgICAgIHRleHR1cmVJbmZvLmlkID0gdGV4O1xuICAgICAgICB0ZXh0dXJlSW5mby5pbWcgPSBpbWc7XG4gICAgICAgIHRleHR1cmVJbmZvLnVzZVByZW11bHRwbHkgPSB1c2VQcmVtdWx0aXBseTtcbiAgICAgICAgdGhpcy5fdGV4dHVyZXMucHVzaEJhY2sodGV4dHVyZUluZm8pO1xuICAgICAgfVxuXG4gICAgICBjYWxsYmFjayh0ZXh0dXJlSW5mbyk7XG4gICAgfTtcbiAgICBpbWcuc3JjID0gZmlsZU5hbWU7XG4gIH1cblxuICAvKipcbiAgICog55S75YOP44Gu6Kej5pS+XG4gICAqXG4gICAqIOmFjeWIl+OBq+WtmOWcqOOBmeOCi+eUu+WDj+WFqOOBpuOCkuino+aUvuOBmeOCi+OAglxuICAgKi9cbiAgcHVibGljIHJlbGVhc2VUZXh0dXJlcygpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RleHR1cmVzLmdldFNpemUoKTsgaSsrKSB7XG4gICAgICB0aGlzLl90ZXh0dXJlcy5zZXQoaSwgbnVsbCk7XG4gICAgfVxuXG4gICAgdGhpcy5fdGV4dHVyZXMuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDnlLvlg4/jga7op6PmlL5cbiAgICpcbiAgICog5oyH5a6a44GX44Gf44OG44Kv44K544OB44Oj44Gu55S75YOP44KS6Kej5pS+44GZ44KL44CCXG4gICAqIEBwYXJhbSB0ZXh0dXJlIOino+aUvuOBmeOCi+ODhuOCr+OCueODgeODo1xuICAgKi9cbiAgcHVibGljIHJlbGVhc2VUZXh0dXJlQnlUZXh0dXJlKHRleHR1cmU6IFdlYkdMVGV4dHVyZSk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGV4dHVyZXMuZ2V0U2l6ZSgpOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLl90ZXh0dXJlcy5hdChpKS5pZCAhPSB0ZXh0dXJlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl90ZXh0dXJlcy5zZXQoaSwgbnVsbCk7XG4gICAgICB0aGlzLl90ZXh0dXJlcy5yZW1vdmUoaSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog55S75YOP44Gu6Kej5pS+XG4gICAqXG4gICAqIOaMh+WumuOBl+OBn+WQjeWJjeOBrueUu+WDj+OCkuino+aUvuOBmeOCi+OAglxuICAgKiBAcGFyYW0gZmlsZU5hbWUg6Kej5pS+44GZ44KL55S75YOP44OV44Kh44Kk44Or44OR44K55ZCNXG4gICAqL1xuICBwdWJsaWMgcmVsZWFzZVRleHR1cmVCeUZpbGVQYXRoKGZpbGVOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RleHR1cmVzLmdldFNpemUoKTsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5fdGV4dHVyZXMuYXQoaSkuZmlsZU5hbWUgPT0gZmlsZU5hbWUpIHtcbiAgICAgICAgdGhpcy5fdGV4dHVyZXMuc2V0KGksIG51bGwpO1xuICAgICAgICB0aGlzLl90ZXh0dXJlcy5yZW1vdmUoaSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF90ZXh0dXJlczogQ3NtX2NzbVZlY3RvcjxUZXh0dXJlSW5mbz47XG59XG5cbi8qKlxuICog55S75YOP5oOF5aCx5qeL6YCg5L2TXG4gKi9cbmV4cG9ydCBjbGFzcyBUZXh0dXJlSW5mbyB7XG4gIGltZzogSFRNTEltYWdlRWxlbWVudDsgLy8g55S75YOPXG4gIGlkOiBXZWJHTFRleHR1cmUgPSBudWxsOyAvLyDjg4bjgq/jgrnjg4Hjg6NcbiAgd2lkdGggPSAwOyAvLyDmqKrluYVcbiAgaGVpZ2h0ID0gMDsgLy8g6auY44GVXG4gIHVzZVByZW11bHRwbHk6IGJvb2xlYW47IC8vIFByZW11bHTlh6bnkIbjgpLmnInlirnjgavjgZnjgovjgYtcbiAgZmlsZU5hbWU6IHN0cmluZzsgLy8g44OV44Kh44Kk44Or5ZCNXG59XG4iLCIvKipcbiAqIENvcHlyaWdodChjKSBMaXZlMkQgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IHRoZSBMaXZlMkQgT3BlbiBTb2Z0d2FyZSBsaWNlbnNlXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBhdCBodHRwczovL3d3dy5saXZlMmQuY29tL2V1bGEvbGl2ZTJkLW9wZW4tc29mdHdhcmUtbGljZW5zZS1hZ3JlZW1lbnRfZW4uaHRtbC5cbiAqL1xuXG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtTWF0cml4NDQgfSBmcm9tICdAZnJhbWV3b3JrL21hdGgvY3ViaXNtbWF0cml4NDQnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbXZpZXdtYXRyaXggfSBmcm9tICdAZnJhbWV3b3JrL21hdGgvY3ViaXNtdmlld21hdHJpeCc7XG5pbXBvcnQgQ3NtX0N1YmlzbVZpZXdNYXRyaXggPSBjdWJpc212aWV3bWF0cml4LkN1YmlzbVZpZXdNYXRyaXg7XG5pbXBvcnQgQ3NtX0N1YmlzbU1hdHJpeDQ0ID0gY3ViaXNtTWF0cml4NDQuQ3ViaXNtTWF0cml4NDQ7XG5pbXBvcnQgeyBUb3VjaE1hbmFnZXIgfSBmcm9tICcuL3RvdWNobWFuYWdlcic7XG5pbXBvcnQgeyBMQXBwTGl2ZTJETWFuYWdlciB9IGZyb20gJy4vbGFwcGxpdmUyZG1hbmFnZXInO1xuaW1wb3J0IHsgTEFwcERlbGVnYXRlLCBjYW52YXMsIGdsIH0gZnJvbSAnLi9sYXBwZGVsZWdhdGUnO1xuaW1wb3J0IHsgTEFwcFNwcml0ZSB9IGZyb20gJy4vbGFwcHNwcml0ZSc7XG5pbXBvcnQgeyBUZXh0dXJlSW5mbyB9IGZyb20gJy4vbGFwcHRleHR1cmVtYW5hZ2VyJztcbmltcG9ydCB7IExBcHBQYWwgfSBmcm9tICcuL2xhcHBwYWwnO1xuaW1wb3J0ICogYXMgTEFwcERlZmluZSBmcm9tICcuL2xhcHBkZWZpbmUnO1xuXG4vKipcbiAqIERyYXdpbmcgY2xhc3Nlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIExBcHBWaWV3IHtcbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9wcm9ncmFtSWQgPSBudWxsO1xuXG4gICAgLy8gVG91Y2ggcmVsYXRlZCBldmVudCBtYW5hZ2VtZW50XG4gICAgdGhpcy5fdG91Y2hNYW5hZ2VyID0gbmV3IFRvdWNoTWFuYWdlcigpO1xuXG4gICAgLy8gRm9yIGNvbnZlcnRpbmcgZGV2aWNlIGNvb3JkaW5hdGVzIHRvIHNjcmVlbiBjb29yZGluYXRlc1xuICAgIHRoaXMuX2RldmljZVRvU2NyZWVuID0gbmV3IENzbV9DdWJpc21NYXRyaXg0NCgpO1xuXG4gICAgLy8gTWF0cml4IGZvciBzY2FsaW5nIGFuZCBzaGlmdGluZyB0aGUgZGlzcGxheVxuICAgIHRoaXMuX3ZpZXdNYXRyaXggPSBuZXcgQ3NtX0N1YmlzbVZpZXdNYXRyaXgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplXG4gICAqL1xuICBwdWJsaWMgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGNhbnZhcztcblxuICAgIGNvbnN0IHJhdGlvOiBudW1iZXIgPSBoZWlnaHQgLyB3aWR0aDtcbiAgICBjb25zdCBsZWZ0OiBudW1iZXIgPSBMQXBwRGVmaW5lLlZpZXdMb2dpY2FsTGVmdDtcbiAgICBjb25zdCByaWdodDogbnVtYmVyID0gTEFwcERlZmluZS5WaWV3TG9naWNhbFJpZ2h0O1xuICAgIGNvbnN0IGJvdHRvbTogbnVtYmVyID0gLXJhdGlvO1xuICAgIGNvbnN0IHRvcDogbnVtYmVyID0gcmF0aW87XG5cbiAgICAvLyBSYW5nZSBvZiBzY3JlZW4gY29ycmVzcG9uZGluZyB0byB0aGUgZGV2aWNlLlRoZSBsZWZ0IGVuZCBvZiBYLCB0aGUgcmlnaHQgZW5kIG9mIFgsIHRoZSBib3R0b20gZW5kIG9mIFksIHRoZSB0b3AgZW5kIG9mIFlcbiAgICB0aGlzLl92aWV3TWF0cml4LnNldFNjcmVlblJlY3QobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wKTtcblxuICAgIGNvbnN0IHNjcmVlblc6IG51bWJlciA9IE1hdGguYWJzKGxlZnQgLSByaWdodCk7XG4gICAgdGhpcy5fZGV2aWNlVG9TY3JlZW4uc2NhbGVSZWxhdGl2ZShzY3JlZW5XIC8gd2lkdGgsIC1zY3JlZW5XIC8gd2lkdGgpO1xuICAgIHRoaXMuX2RldmljZVRvU2NyZWVuLnRyYW5zbGF0ZVJlbGF0aXZlKC13aWR0aCAqIDAuNSwgLWhlaWdodCAqIDAuNSk7XG5cbiAgICAvLyBTZXR0aW5nIHRoZSBkaXNwbGF5IHJhbmdlXG4gICAgdGhpcy5fdmlld01hdHJpeC5zZXRNYXhTY2FsZShMQXBwRGVmaW5lLlZpZXdNYXhTY2FsZSk7IC8vIOmZkOeVjOaLoeW8teeOh1xuICAgIHRoaXMuX3ZpZXdNYXRyaXguc2V0TWluU2NhbGUoTEFwcERlZmluZS5WaWV3TWluU2NhbGUpOyAvLyDpmZDnlYznuK7lsI/njodcblxuICAgIC8vIE1heGltdW0gcmFuZ2UgdGhhdCBjYW4gYmUgZGlzcGxheWVkXG4gICAgdGhpcy5fdmlld01hdHJpeC5zZXRNYXhTY3JlZW5SZWN0KFxuICAgICAgTEFwcERlZmluZS5WaWV3TG9naWNhbE1heExlZnQsXG4gICAgICBMQXBwRGVmaW5lLlZpZXdMb2dpY2FsTWF4UmlnaHQsXG4gICAgICBMQXBwRGVmaW5lLlZpZXdMb2dpY2FsTWF4Qm90dG9tLFxuICAgICAgTEFwcERlZmluZS5WaWV3TG9naWNhbE1heFRvcFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICog6Kej5pS+44GZ44KLXG4gICAqL1xuICBwdWJsaWMgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICB0aGlzLl92aWV3TWF0cml4ID0gbnVsbDtcbiAgICB0aGlzLl90b3VjaE1hbmFnZXIgPSBudWxsO1xuICAgIHRoaXMuX2RldmljZVRvU2NyZWVuID0gbnVsbDtcblxuICAgIGdsLmRlbGV0ZVByb2dyYW0odGhpcy5fcHJvZ3JhbUlkKTtcbiAgICB0aGlzLl9wcm9ncmFtSWQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIOaPj+eUu+OBmeOCi+OAglxuICAgKi9cbiAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcbiAgICBnbC51c2VQcm9ncmFtKHRoaXMuX3Byb2dyYW1JZCk7XG5cbiAgICBnbC5mbHVzaCgpO1xuXG4gICAgY29uc3QgbGl2ZTJETWFuYWdlcjogTEFwcExpdmUyRE1hbmFnZXIgPSBMQXBwTGl2ZTJETWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuXG4gICAgbGl2ZTJETWFuYWdlci5vblVwZGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGltYWdlLlxuICAgKi9cbiAgcHVibGljIGluaXRpYWxpemVTcHJpdGUoKTogdm9pZCB7XG4gICAgY29uc3Qgd2lkdGg6IG51bWJlciA9IGNhbnZhcy53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQ6IG51bWJlciA9IGNhbnZhcy5oZWlnaHQ7XG5cbiAgICBjb25zdCB0ZXh0dXJlTWFuYWdlciA9IExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLmdldFRleHR1cmVNYW5hZ2VyKCk7XG5cbiAgICAvLyBDcmVhdGUgYSBzaGFkZXIuXG4gICAgaWYgKHRoaXMuX3Byb2dyYW1JZCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9wcm9ncmFtSWQgPSBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5jcmVhdGVTaGFkZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSXQgaXMgY2FsbGVkIHdoZW4gaXQgaXMgdG91Y2hlZC5cbiAgICpcbiAgICogQHBhcmFtIHBvaW50WCBTY3JlZW4geC1jb29yZGluYXRlc1xuICAgKiBAcGFyYW0gcG9pbnRZIFNjcmVlbiB5LWNvb3JkaW5hdGVzXG4gICAqL1xuICBwdWJsaWMgb25Ub3VjaGVzQmVnYW4ocG9pbnRYOiBudW1iZXIsIHBvaW50WTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5fdG91Y2hNYW5hZ2VyLnRvdWNoZXNCZWdhbihwb2ludFgsIHBvaW50WSk7XG4gIH1cblxuICAvKipcbiAgICogV2hlbiB0aGUgZmluZ2VyIGlzIHRvdWNoZWQsIGl0IGlzIGNhbGxlZC5cbiAgICpcbiAgICogQHBhcmFtIHBvaW50WCBTY3JlZW4gWCBjb29yZGluYXRlc1xuICAgKiBAcGFyYW0gcG9pbnRZIFNjcmVlbiBZIGNvb3JkaW5hdGVzXG4gICAqL1xuICBwdWJsaWMgb25Ub3VjaGVzTW92ZWQocG9pbnRYOiBudW1iZXIsIHBvaW50WTogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3Qgdmlld1g6IG51bWJlciA9IHRoaXMudHJhbnNmb3JtVmlld1godGhpcy5fdG91Y2hNYW5hZ2VyLmdldFgoKSk7XG4gICAgY29uc3Qgdmlld1k6IG51bWJlciA9IHRoaXMudHJhbnNmb3JtVmlld1kodGhpcy5fdG91Y2hNYW5hZ2VyLmdldFkoKSk7XG4gICAgdGhpcy5fdG91Y2hNYW5hZ2VyLnRvdWNoZXNNb3ZlZChwb2ludFgsIHBvaW50WSk7XG5cbiAgICBjb25zdCBsaXZlMkRNYW5hZ2VyOiBMQXBwTGl2ZTJETWFuYWdlciA9IExBcHBMaXZlMkRNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG4gICAgTEFwcERlZmluZS5EZWJ1Z0xvZ0VuYWJsZSAmJlxuICAgICAgTEFwcERlZmluZS5EZWJ1Z1RvdWNoTG9nRW5hYmxlICYmXG4gICAgICBjb25zb2xlLmxvZyhgW0xpdmUyRHY0XSBwb2ludFg6ICR7cG9pbnRYfSBwb2ludFk6ICR7cG9pbnRZfVxuICAgICAgICAgIHZpZXdYOiAke3ZpZXdYfSB2aWV3WTogJHt2aWV3WX1gKTtcbiAgICBsaXZlMkRNYW5hZ2VyLm9uRHJhZyh2aWV3WCwgdmlld1kpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0IGlzIGNhbGxlZCB3aGVuIHRoZSB0b3VjaCBpcyBmaW5pc2hlZC5cbiAgICpcbiAgICogQHBhcmFtIHBvaW50WCBTY3JlZW4gWCBjb29yZGluYXRlc1xuICAgKiBAcGFyYW0gcG9pbnRZIFNjcmVlbiBZIGNvb3JkaW5hdGVzXG4gICAqL1xuICBwdWJsaWMgb25Ub3VjaGVzRW5kZWQocG9pbnRYOiBudW1iZXIsIHBvaW50WTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gVG91Y2ggZG9uZS5cbiAgICBjb25zdCBsaXZlMkRNYW5hZ2VyOiBMQXBwTGl2ZTJETWFuYWdlciA9IExBcHBMaXZlMkRNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG4gICAgLy8gbGl2ZTJETWFuYWdlci5vbkRyYWcoMC4wLCAwLjApO1xuICAgIHtcbiAgICAgIGlmIChMQXBwRGVmaW5lLkRlYnVnTG9nRW5hYmxlKSB7XG4gICAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKGBbTGl2ZTJEdjRdIHRvdWNoZXNFbmRlZCB4OiAke3BvaW50WH0geTogJHtwb2ludFl9YCk7XG4gICAgICB9XG4gICAgICAvLyBTaW5nbGUgdGFwXG4gICAgICBjb25zdCB4OiBudW1iZXIgPSB0aGlzLl9kZXZpY2VUb1NjcmVlbi50cmFuc2Zvcm1YKFxuICAgICAgICAvLyB0aGlzLl90b3VjaE1hbmFnZXIuZ2V0WCgpXG4gICAgICAgIHBvaW50WCAvLyDljp/ku6PnoIHkvb/nlKjmjInkuIvml7bnmoTlnZDmoIfvvIznu4/luLjml6Dms5Xop6blj5HliqjkvZzvvIzmlLnkuLrkvb/nlKjlvLnotbfml7bnmoTlnZDmoIdcbiAgICAgICk7IC8vIExvZ2ljYWwgY29vcmRpbmF0ZXMgZ2V0IHRoZSB0cmFuc2Zvcm1lZCBjb29yZGluYXRlcy5cbiAgICAgIGNvbnN0IHk6IG51bWJlciA9IHRoaXMuX2RldmljZVRvU2NyZWVuLnRyYW5zZm9ybVkoXG4gICAgICAgIC8vIHRoaXMuX3RvdWNoTWFuYWdlci5nZXRZKClcbiAgICAgICAgcG9pbnRZIC8vIOWOn+S7o+eggeS9v+eUqOaMieS4i+aXtueahOWdkOagh++8jOe7j+W4uOaXoOazleinpuWPkeWKqOS9nO+8jOaUueS4uuS9v+eUqOW8uei1t+aXtueahOWdkOagh1xuICAgICAgKTsgLy8gTG9naWNhbCBjb29yZGluYXRlcyBnZXQgY2hhbmdlZCBjb29yZGluYXRlcy5cblxuICAgICAgbGl2ZTJETWFuYWdlci5vblRhcCh4LCB5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgWCBjb29yZGluYXRlcyB0byBWaWV3IGNvb3JkaW5hdGVzLlxuICAgKlxuICAgKiBAcGFyYW0gZGV2aWNlWCBEZXZpY2UgWCBjb29yZGluYXRlXG4gICAqL1xuICBwdWJsaWMgdHJhbnNmb3JtVmlld1goZGV2aWNlWDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBzY3JlZW5YOiBudW1iZXIgPSB0aGlzLl9kZXZpY2VUb1NjcmVlbi50cmFuc2Zvcm1YKGRldmljZVgpOyAvLyDoq5bnkIbluqfmqJnlpInmj5vjgZfjgZ/luqfmqJnjgpLlj5blvpfjgIJcbiAgICByZXR1cm4gdGhpcy5fdmlld01hdHJpeC5pbnZlcnRUcmFuc2Zvcm1YKHNjcmVlblgpOyAvLyDmi6HlpKfjgIHnuK7lsI/jgIHnp7vli5Xlvozjga7lgKTjgIJcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBZIGNvb3JkaW5hdGVzIHRvIFZpZXcgY29vcmRpbmF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBkZXZpY2VZIERldmljZSB5LWNvb3JkaW5hdGVcbiAgICovXG4gIHB1YmxpYyB0cmFuc2Zvcm1WaWV3WShkZXZpY2VZOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IHNjcmVlblk6IG51bWJlciA9IHRoaXMuX2RldmljZVRvU2NyZWVuLnRyYW5zZm9ybVkoZGV2aWNlWSk7IC8vIExvZ2ljYWwgY29vcmRpbmF0ZXMgZ2V0IHRoZSB0cmFuc2Zvcm1lZCBjb29yZGluYXRlcy5cbiAgICByZXR1cm4gdGhpcy5fdmlld01hdHJpeC5pbnZlcnRUcmFuc2Zvcm1ZKHNjcmVlblkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIFggY29vcmRpbmF0ZXMgdG8gU2NyZWVuIGNvb3JkaW5hdGVzLlxuICAgKiBAcGFyYW0gZGV2aWNlWCBEZXZpY2UgWCBjb29yZGluYXRlXG4gICAqL1xuICBwdWJsaWMgdHJhbnNmb3JtU2NyZWVuWChkZXZpY2VYOiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9kZXZpY2VUb1NjcmVlbi50cmFuc2Zvcm1YKGRldmljZVgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIFkgY29vcmRpbmF0ZXMgdG8gU2NyZWVuIGNvb3JkaW5hdGVzLlxuICAgKlxuICAgKiBAcGFyYW0gZGV2aWNlWSBEZXZpY2UgWSBjb29yZGluYXRlXG4gICAqL1xuICBwdWJsaWMgdHJhbnNmb3JtU2NyZWVuWShkZXZpY2VZOiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9kZXZpY2VUb1NjcmVlbi50cmFuc2Zvcm1ZKGRldmljZVkpO1xuICB9XG5cbiAgX3RvdWNoTWFuYWdlcjogVG91Y2hNYW5hZ2VyOyAvLyBUb3VjaCBtYW5hZ2VyXG4gIF9kZXZpY2VUb1NjcmVlbjogQ3NtX0N1YmlzbU1hdHJpeDQ0OyAvLyBNYXRyaXggZnJvbSBkZXZpY2UgdG8gc2NyZWVuXG4gIF92aWV3TWF0cml4OiBDc21fQ3ViaXNtVmlld01hdHJpeDsgLy8gdmlld01hdHJpeFxuICBfcHJvZ3JhbUlkOiBXZWJHTFByb2dyYW07IC8vIFNoZWRhIElEXG4gIF9jaGFuZ2VNb2RlbDogYm9vbGVhbjsgLy8gTW9kZWwgc3dpdGNoIGZsYWdcbiAgX2lzQ2xpY2s6IGJvb2xlYW47IC8vIEknbSBjbGlja2luZy5cbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0KGMpIExpdmUyRCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgdGhlIExpdmUyRCBPcGVuIFNvZnR3YXJlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGF0IGh0dHBzOi8vd3d3LmxpdmUyZC5jb20vZXVsYS9saXZlMmQtb3Blbi1zb2Z0d2FyZS1saWNlbnNlLWFncmVlbWVudF9lbi5odG1sLlxuICovXG5cbmltcG9ydCB7TEFwcERlbGVnYXRlfSBmcm9tICcuL2xhcHBkZWxlZ2F0ZSc7XG5pbXBvcnQgKiBhcyBMQXBwRGVmaW5lIGZyb20gJy4vbGFwcGRlZmluZSc7XG5pbXBvcnQge0xBcHBMaXZlMkRNYW5hZ2VyfSBmcm9tIFwiLi9sYXBwbGl2ZTJkbWFuYWdlclwiO1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0KCchIXJhdy1sb2FkZXIhLi9Db3JlL2xpdmUyZGN1YmlzbWNvcmUubWluLmpzJykudGhlbihyYXdNb2R1bGUgPT4gZXZhbC5jYWxsKG51bGwsIHJhd01vZHVsZS5kZWZhdWx0KSk7XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICAgICAgbGl2ZTJkdjQ6IGFueTtcbiAgICAgICAgZG93bmxvYWRDYXA6IGFueTtcbiAgICB9XG59XG53aW5kb3cubGl2ZTJkdjQgPSB3aW5kb3cubGl2ZTJkdjQgfHwge307XG53aW5kb3cubGl2ZTJkdjQubG9hZCA9IChjYW52YXNJZDogc3RyaW5nLCBtb2RlbFBhdGg6IHN0cmluZywgbW9kZWxKc29uTmFtZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgTEFwcERlZmluZS5kZWZpbmVEZWJ1Zyh3aW5kb3cubGl2ZTJkdjQuZGVidWcgPyB0cnVlIDogZmFsc2UsIHdpbmRvdy5saXZlMmR2NC5kZWJ1Z01vdXNlbW92ZSA/IHRydWUgOiBmYWxzZSk7XG4gICAgTEFwcERlZmluZS5kZWZpbmVNb2RlbFBhdGgobW9kZWxQYXRoLCBtb2RlbEpzb25OYW1lKTtcbiAgICBpZiAoTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuaW5pdGlhbGl6ZShjYW52YXNJZCkgPT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5ydW4oKTtcbn07XG53aW5kb3cubGl2ZTJkdjQuY2hhbmdlID0gKG1vZGVsUGF0aDogc3RyaW5nLCBtb2RlbEpzb25OYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBMQXBwTGl2ZTJETWFuYWdlci5nZXRJbnN0YW5jZSgpLmNoYW5nZVNjZW5lKG1vZGVsUGF0aCwgbW9kZWxKc29uTmFtZSk7XG59XG53aW5kb3cubGl2ZTJkdjQucmVsZWFzZSA9ICgpOiB2b2lkID0+IHtcbiAgICBMQXBwRGVsZWdhdGUucmVsZWFzZUluc3RhbmNlKCk7XG59O1xud2luZG93LmxpdmUyZHY0LkNhcHR1cmVDYW52YXMgPSAoKTogdm9pZCA9PiB7XG4gICAgTEFwcERlZmluZS5zZXRDYXB0dXJlQ2FudmFzKHRydWUpO1xufTtcbndpbmRvdy5saXZlMmR2NC5zZXRQcmVMb2FkTW90aW9uID0gKHByZUxvYWRNb3Rpb246IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICBMQXBwRGVmaW5lLnNldFByZUxvYWRNb3Rpb24ocHJlTG9hZE1vdGlvbik7XG59O1xuLyoqXG4gKiDpobXpnaLlhbPpl60v6Lez6L2sL+WIt+aWsOaXtlxuICovXG53aW5kb3cub25iZWZvcmV1bmxvYWQgPSAoKTogdm9pZCA9PiBMQXBwRGVsZWdhdGUucmVsZWFzZUluc3RhbmNlKCk7XG4iXSwic291cmNlUm9vdCI6IiJ9