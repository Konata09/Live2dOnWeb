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

/***/ "./src/SDKv4/lapplive2dmanager.ts":
/*!****************************************!*\
  !*** ./src/SDKv4/lapplive2dmanager.ts ***!
  \****************************************/
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
exports.LAppLive2DManager = exports.s_instance = void 0;
var cubismmatrix44_1 = __webpack_require__(/*! @framework/math/cubismmatrix44 */ "./src/SDKv4/Framework/src/math/cubismmatrix44.ts");
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "./src/SDKv4/Framework/src/type/csmvector.ts");
var Csm_csmVector = csmvector_1.Live2DCubismFramework.csmVector;
var Csm_CubismMatrix44 = cubismmatrix44_1.Live2DCubismFramework.CubismMatrix44;
var lappmodel_1 = __webpack_require__(/*! ./lappmodel */ "./src/SDKv4/lappmodel.ts");
var lapppal_1 = __webpack_require__(/*! ./lapppal */ "./src/SDKv4/lapppal.ts");
var lappdelegate_1 = __webpack_require__(/*! ./lappdelegate */ "./src/SDKv4/lappdelegate.ts");
var LAppDefine = __importStar(__webpack_require__(/*! ./lappdefine */ "./src/SDKv4/lappdefine.ts"));
exports.s_instance = null;
var LAppLive2DManager = (function () {
    function LAppLive2DManager() {
        this._finishedMotion = function (self) {
            LAppDefine.DebugLogEnable && lapppal_1.LAppPal.printMessage('[Live2Dv4] Motion Finished');
        };
        this._viewMatrix = new Csm_CubismMatrix44();
        this._models = new Csm_csmVector();
        this.changeScene(LAppDefine.modelPath, LAppDefine.modelJsonName);
    }
    LAppLive2DManager.getInstance = function () {
        if (exports.s_instance == null) {
            exports.s_instance = new LAppLive2DManager();
        }
        return exports.s_instance;
    };
    LAppLive2DManager.releaseInstance = function () {
        if (exports.s_instance != null) {
            exports.s_instance = void 0;
        }
        exports.s_instance = null;
    };
    LAppLive2DManager.prototype.getModel = function (no) {
        if (no < this._models.getSize()) {
            return this._models.at(no);
        }
        return null;
    };
    LAppLive2DManager.prototype.releaseAllModel = function () {
        for (var i = 0; i < this._models.getSize(); i++) {
            this._models.at(i).release();
            this._models.set(i, null);
        }
        this._models.clear();
    };
    LAppLive2DManager.prototype.onDrag = function (x, y) {
        for (var i = 0; i < this._models.getSize(); i++) {
            var model = this.getModel(i);
            if (model) {
                console.log("x: " + x);
                console.log("y: " + y);
                model.setDragging(x, y);
            }
        }
    };
    LAppLive2DManager.prototype.onTap = function (x, y) {
        if (LAppDefine.DebugLogEnable) {
            lapppal_1.LAppPal.printMessage("[Live2Dv4] tap point: {x: " + x.toFixed(2) + " y: " + y.toFixed(2) + "}");
        }
        for (var i = 0; i < this._models.getSize(); i++) {
            if (this._models.at(i).hitTest(LAppDefine.HitAreaNameHead, x, y)) {
                if (LAppDefine.DebugLogEnable) {
                    lapppal_1.LAppPal.printMessage("[Live2Dv4] hit area: [" + LAppDefine.HitAreaNameHead + "]");
                }
                this._models
                    .at(i)
                    .startRandomMotion(LAppDefine.MotionGroupTapHead, LAppDefine.PriorityNormal, this._finishedMotion);
            }
            else if (this._models.at(i).hitTest(LAppDefine.HitAreaNameBody, x, y)) {
                if (LAppDefine.DebugLogEnable) {
                    lapppal_1.LAppPal.printMessage("[Live2Dv4] hit area: [" + LAppDefine.HitAreaNameBody + "]");
                }
                this._models
                    .at(i)
                    .startRandomMotion(LAppDefine.MotionGroupTapBody, LAppDefine.PriorityNormal, this._finishedMotion);
            }
        }
    };
    LAppLive2DManager.prototype.onUpdate = function () {
        var projection = new Csm_CubismMatrix44();
        var width = lappdelegate_1.canvas.width, height = lappdelegate_1.canvas.height;
        projection.scale(1.0, width / height);
        if (this._viewMatrix != null) {
            projection.multiplyByMatrix(this._viewMatrix);
        }
        var saveProjection = projection.clone();
        var modelCount = this._models.getSize();
        for (var i = 0; i < modelCount; ++i) {
            var model = this.getModel(i);
            projection = saveProjection.clone();
            model.update();
            model.draw(projection);
        }
    };
    LAppLive2DManager.prototype.changeScene = function (modelPath, modelJsonName) {
        if (LAppDefine.DebugLogEnable) {
            lapppal_1.LAppPal.printMessage("[Live2Dv4] load model: " + modelJsonName);
        }
        this.releaseAllModel();
        this._models.pushBack(new lappmodel_1.LAppModel(LAppDefine.DebugLogEnable));
        this._models.at(0).loadAssets(modelPath, modelJsonName);
    };
    return LAppLive2DManager;
}());
exports.LAppLive2DManager = LAppLive2DManager;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvU0RLdjQvbGFwcGRlbGVnYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9TREt2NC9sYXBwbGl2ZTJkbWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU0RLdjQvbGFwcHZpZXcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1NES3Y0L21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQSxnSkFHMEM7QUFDMUMsSUFBTyxtQkFBbUIsR0FBRyw2Q0FBcUIsQ0FBQyxlQUFlLENBQUM7QUFDbkUsa0ZBQXNDO0FBQ3RDLCtFQUFvQztBQUNwQyxnSEFBMEQ7QUFDMUQsNkdBQXdEO0FBQ3hELG9HQUEyQztBQUVoQyxjQUFNLEdBQXNCLElBQUksQ0FBQztBQUNqQyxrQkFBVSxHQUFpQixJQUFJLENBQUM7QUFDaEMsVUFBRSxHQUEwQixJQUFJLENBQUM7QUFDakMsbUJBQVcsR0FBcUIsSUFBSSxDQUFDO0FBTWhEO0lBeU9FO1FBQ0UsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFFcEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLDhCQUFVLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksbUJBQVEsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO0lBQ2xELENBQUM7SUEzT2Esd0JBQVcsR0FBekI7UUFDRSxJQUFJLGtCQUFVLElBQUksSUFBSSxFQUFFO1lBQ3RCLGtCQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztTQUNqQztRQUVELE9BQU8sa0JBQVUsQ0FBQztJQUNwQixDQUFD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QUFHO0lBQzVCLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUM7QUFDRixNQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLFVBQUMsYUFBc0I7SUFDdEQsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQy9DLENBQUMsQ0FBQztBQUlGLE1BQU0sQ0FBQyxjQUFjLEdBQUcsY0FBWSxrQ0FBWSxDQUFDLGVBQWUsRUFBRSxFQUE5QixDQUE4QixDQUFDIiwiZmlsZSI6Im1haW4uYWIyYzFlZDZiYTYwYzI4MTJjMjEuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0KGMpIExpdmUyRCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgdGhlIExpdmUyRCBPcGVuIFNvZnR3YXJlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGF0IGh0dHBzOi8vd3d3LmxpdmUyZC5jb20vZXVsYS9saXZlMmQtb3Blbi1zb2Z0d2FyZS1saWNlbnNlLWFncmVlbWVudF9lbi5odG1sLlxuICovXG5cbmltcG9ydCB7XG4gIExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBsaXZlMmRjdWJpc21mcmFtZXdvcmssXG4gIE9wdGlvbiBhcyBDc21fT3B0aW9uXG59IGZyb20gJ0BmcmFtZXdvcmsvbGl2ZTJkY3ViaXNtZnJhbWV3b3JrJztcbmltcG9ydCBDc21fQ3ViaXNtRnJhbWV3b3JrID0gbGl2ZTJkY3ViaXNtZnJhbWV3b3JrLkN1YmlzbUZyYW1ld29yaztcbmltcG9ydCB7IExBcHBWaWV3IH0gZnJvbSAnLi9sYXBwdmlldyc7XG5pbXBvcnQgeyBMQXBwUGFsIH0gZnJvbSAnLi9sYXBwcGFsJztcbmltcG9ydCB7IExBcHBUZXh0dXJlTWFuYWdlciB9IGZyb20gJy4vbGFwcHRleHR1cmVtYW5hZ2VyJztcbmltcG9ydCB7IExBcHBMaXZlMkRNYW5hZ2VyIH0gZnJvbSAnLi9sYXBwbGl2ZTJkbWFuYWdlcic7XG5pbXBvcnQgKiBhcyBMQXBwRGVmaW5lIGZyb20gJy4vbGFwcGRlZmluZSc7XG5cbmV4cG9ydCBsZXQgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IG51bGw7XG5leHBvcnQgbGV0IHNfaW5zdGFuY2U6IExBcHBEZWxlZ2F0ZSA9IG51bGw7XG5leHBvcnQgbGV0IGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgPSBudWxsO1xuZXhwb3J0IGxldCBmcmFtZUJ1ZmZlcjogV2ViR0xGcmFtZWJ1ZmZlciA9IG51bGw7XG5cbi8qKlxuICog5bqU55So56iL5bqP57G7XG4gKiBDdWJpc20gU0RL44Gu566h55CG44KS6KGM44GG44CCXG4gKi9cbmV4cG9ydCBjbGFzcyBMQXBwRGVsZWdhdGUge1xuICAvKipcbiAgICog6L+U5Zue57G75a6e5L6LKHNpbmd0b24p44CCXG4gICAqIOWmguaenOayoeacieeUn+aIkOWunuS+i++8jOWImeWcqOWGhemDqOeUn+aIkOWunuS+i+OAglxuICAgKlxuICAgKiBAcmV0dXJuIOexu+WunuS+i1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBMQXBwRGVsZWdhdGUge1xuICAgIGlmIChzX2luc3RhbmNlID09IG51bGwpIHtcbiAgICAgIHNfaW5zdGFuY2UgPSBuZXcgTEFwcERlbGVnYXRlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNfaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICog6YeK5pS+57G75a6e5L6LKHNpbmdsZSB0b24pXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlbGVhc2VJbnN0YW5jZSgpOiB2b2lkIHtcbiAgICBpZiAoc19pbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICBzX2luc3RhbmNlLnJlbGVhc2UoKTtcbiAgICB9XG5cbiAgICBzX2luc3RhbmNlID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiDliJ3lp4vljJZBUFDpnIDopoHnmoTkuJzopb/jgIJcbiAgICovXG4gIHB1YmxpYyBpbml0aWFsaXplKGNhbnZhc0lkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAvLyBHZXR0aW5nIGEgY2FudmFzXG4gICAgY2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKTtcblxuICAgIC8vIEluaXRpYWxpemUgZ2wgY29udGV4dFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcpIHx8IGNhbnZhcy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnKTtcblxuICAgIGlmICghZ2wpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Nhbm5vdCBpbml0aWFsaXplIFdlYkdMLiBUaGlzIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydC4nKTtcbiAgICAgIGdsID0gbnVsbDtcblxuICAgICAgZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPVxuICAgICAgICAnVGhpcyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdGhlIDxjb2RlPiZsdDtjYW52YXMmZ3Q7PC9jb2RlPiBlbGVtZW50Lic7XG5cbiAgICAgIC8vIEdsIGluaXRpYWxpemF0aW9uIGZhaWxlZC5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBBZGQgYSBjYW52YXMgdG8gdGhlIERPTVxuICAgIC8vIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcblxuICAgIGlmICghZnJhbWVCdWZmZXIpIHtcbiAgICAgIGZyYW1lQnVmZmVyID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLkZSQU1FQlVGRkVSX0JJTkRJTkcpO1xuICAgIH1cblxuICAgIC8vIFRyYW5zcGFyZW5jeSBzZXR0aW5nXG4gICAgZ2wuZW5hYmxlKGdsLkJMRU5EKTtcbiAgICBnbC5ibGVuZEZ1bmMoZ2wuU1JDX0FMUEhBLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBKTtcblxuICAgIGNvbnN0IHN1cHBvcnRUb3VjaDogYm9vbGVhbiA9ICdvbnRvdWNoZW5kJyBpbiBjYW52YXM7XG5cbiAgICBpZiAoc3VwcG9ydFRvdWNoKSB7XG4gICAgICAvLyBUb3VjaCByZWxhdGVkIGNhbGxiYWNrIGZ1bmN0aW9uIHJlZ2lzdHJhdGlvblxuICAgICAgd2luZG93Lm9udG91Y2hzdGFydCA9IG9uVG91Y2hCZWdhbjtcbiAgICAgIHdpbmRvdy5vbnRvdWNobW92ZSA9IG9uVG91Y2hNb3ZlZDtcbiAgICAgIHdpbmRvdy5vbnRvdWNoZW5kID0gb25Ub3VjaEVuZGVkO1xuICAgICAgd2luZG93Lm9udG91Y2hjYW5jZWwgPSBvblRvdWNoQ2FuY2VsO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBNb3VzZSByZWxhdGVkIGNhbGxiYWNrIGZ1bmN0aW9uIHJlZ2lzdHJhdGlvblxuICAgICAgY2FudmFzLm9ubW91c2Vkb3duID0gb25DbGlja0JlZ2FuO1xuICAgICAgd2luZG93Lm9ubW91c2Vtb3ZlID0gb25Nb3VzZU1vdmVkOyAvLyDnm5HlkKzlnKggd2luZG93IOS4iu+8jOWPr+S7peebkeWQrOaVtOS4queql+WPo+WGheeahOaMh+mSiFxuICAgICAgd2luZG93Lm9ubW91c2VvdXQgPSBvbk1vdXNlTGVhdmU7IC8vIOaMh+mSiOenu+WHuueql+WPo+aXtlxuICAgICAgY2FudmFzLm9ubW91c2V1cCA9IG9uQ2xpY2tFbmRlZDtcbiAgICB9XG5cbiAgICAvLyBJbml0aWFsaXppbmcgQXBwVmlld1xuICAgIHRoaXMuX3ZpZXcuaW5pdGlhbGl6ZSgpO1xuXG4gICAgLy8gQ3ViaXNtIFNES+OBruWIneacn+WMllxuICAgIHRoaXMuaW5pdGlhbGl6ZUN1YmlzbSgpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICog6Kej5pS+44GZ44KL44CCXG4gICAqL1xuICBwdWJsaWMgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICAvLyDnp7vpmaTnm5HlkKzlh73mlbBcbiAgICB3aW5kb3cub250b3VjaHN0YXJ0ID0gdW5kZWZpbmVkO1xuICAgIHdpbmRvdy5vbnRvdWNobW92ZSA9IHVuZGVmaW5lZDtcbiAgICB3aW5kb3cub250b3VjaGVuZCA9IHVuZGVmaW5lZDtcbiAgICB3aW5kb3cub250b3VjaGNhbmNlbCA9IHVuZGVmaW5lZDtcbiAgICBjYW52YXMub25tb3VzZWRvd24gPSB1bmRlZmluZWQ7XG4gICAgd2luZG93Lm9ubW91c2Vtb3ZlID0gdW5kZWZpbmVkO1xuICAgIHdpbmRvdy5vbm1vdXNlb3V0ID0gdW5kZWZpbmVkO1xuICAgIGNhbnZhcy5vbm1vdXNldXAgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLl90ZXh0dXJlTWFuYWdlci5yZWxlYXNlKCk7XG4gICAgdGhpcy5fdGV4dHVyZU1hbmFnZXIgPSBudWxsO1xuXG4gICAgdGhpcy5fdmlldy5yZWxlYXNlKCk7XG4gICAgdGhpcy5fdmlldyA9IG51bGw7XG5cbiAgICAvLyBGcmVlIHVwIHJlc291cmNlc1xuICAgIExBcHBMaXZlMkRNYW5hZ2VyLnJlbGVhc2VJbnN0YW5jZSgpO1xuXG4gICAgLy8gQ3ViaXNtIFNES+OBruino+aUvlxuICAgIENzbV9DdWJpc21GcmFtZXdvcmsuZGlzcG9zZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGlvbiBwcm9jZXNzaW5nXG4gICAqL1xuICBwdWJsaWMgcnVuKCk6IHZvaWQge1xuICAgIC8vIE1haW4gbG9vcFxuICAgIGNvbnN0IGxvb3AgPSAoKTogdm9pZCA9PiB7XG4gICAgICAvLyBDaGVja2luZyB0aGUgcHJlc2VuY2Ugb3IgYWJzZW5jZSBvZiBpbnN0YW5jZXNcbiAgICAgIGlmIChzX2luc3RhbmNlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyDmmYLplpPmm7TmlrBcbiAgICAgIExBcHBQYWwudXBkYXRlVGltZSgpO1xuXG4gICAgICAvLyDnlLvpnaLjga7liJ3mnJ/ljJZcbiAgICAgIGdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMC4wKTtcblxuICAgICAgLy8gQWN0aXZhdGUgZGVwdGggdGVzdGluZy5cbiAgICAgIGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcblxuICAgICAgLy8gVGhlIG5lYXJlc3Qgb2JqZWN0IG9ic2N1cmVzIHRoZSBkaXN0YW50IG9iamVjdFxuICAgICAgZ2wuZGVwdGhGdW5jKGdsLkxFUVVBTCk7XG5cbiAgICAgIC8vIENsZWFyIGNvbG9yIGFuZCBkZXB0aCBidWZmZXJzXG4gICAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XG5cbiAgICAgIGdsLmNsZWFyRGVwdGgoMS4wKTtcblxuICAgICAgLy8g6YCP6YGO6Kit5a6aXG4gICAgICBnbC5lbmFibGUoZ2wuQkxFTkQpO1xuICAgICAgZ2wuYmxlbmRGdW5jKGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSk7XG5cbiAgICAgIC8vIOaPj+eUu+abtOaWsFxuICAgICAgdGhpcy5fdmlldy5yZW5kZXIoKTtcblxuICAgICAgLy8g5qOA5p+l5piv5ZCm5oiq5Zu+XG4gICAgICBpZihMQXBwRGVmaW5lLmNhcHR1cmVDYW52YXMpe1xuICAgICAgICBMQXBwRGVmaW5lLnNldENhcHR1cmVDYW52YXMoZmFsc2UpO1xuICAgICAgICBjYW52YXMudG9CbG9iKHdpbmRvdy5kb3dubG9hZENhcCk7XG4gICAgICB9XG4gICAgICAvLyBSZWN1cnNpdmUgY2FsbCBmb3IgdGhlIGxvb3BcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICB9O1xuICAgIGxvb3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgc2hhZGVyLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVNoYWRlcigpOiBXZWJHTFByb2dyYW0ge1xuICAgIC8vIOODkOODvOODhuODg+OCr+OCueOCt+OCp+ODvOODgOODvOOBruOCs+ODs+ODkeOCpOODq1xuICAgIGNvbnN0IHZlcnRleFNoYWRlcklkID0gZ2wuY3JlYXRlU2hhZGVyKGdsLlZFUlRFWF9TSEFERVIpO1xuXG4gICAgaWYgKHZlcnRleFNoYWRlcklkID09IG51bGwpIHtcbiAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCdmYWlsZWQgdG8gY3JlYXRlIHZlcnRleFNoYWRlcicpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgdmVydGV4U2hhZGVyOiBzdHJpbmcgPVxuICAgICAgJ3ByZWNpc2lvbiBtZWRpdW1wIGZsb2F0OycgK1xuICAgICAgJ2F0dHJpYnV0ZSB2ZWMzIHBvc2l0aW9uOycgK1xuICAgICAgJ2F0dHJpYnV0ZSB2ZWMyIHV2OycgK1xuICAgICAgJ3ZhcnlpbmcgdmVjMiB2dXY7JyArXG4gICAgICAndm9pZCBtYWluKHZvaWQpJyArXG4gICAgICAneycgK1xuICAgICAgJyAgIGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMS4wKTsnICtcbiAgICAgICcgICB2dXYgPSB1djsnICtcbiAgICAgICd9JztcblxuICAgIGdsLnNoYWRlclNvdXJjZSh2ZXJ0ZXhTaGFkZXJJZCwgdmVydGV4U2hhZGVyKTtcbiAgICBnbC5jb21waWxlU2hhZGVyKHZlcnRleFNoYWRlcklkKTtcblxuICAgIC8vIENvbXBpbGluZyBmcmFnbWVudCBzaGFkZXJzXG4gICAgY29uc3QgZnJhZ21lbnRTaGFkZXJJZCA9IGdsLmNyZWF0ZVNoYWRlcihnbC5GUkFHTUVOVF9TSEFERVIpO1xuXG4gICAgaWYgKGZyYWdtZW50U2hhZGVySWQgPT0gbnVsbCkge1xuICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ2ZhaWxlZCB0byBjcmVhdGUgZnJhZ21lbnRTaGFkZXInKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGZyYWdtZW50U2hhZGVyOiBzdHJpbmcgPVxuICAgICAgJ3ByZWNpc2lvbiBtZWRpdW1wIGZsb2F0OycgK1xuICAgICAgJ3ZhcnlpbmcgdmVjMiB2dXY7JyArXG4gICAgICAndW5pZm9ybSBzYW1wbGVyMkQgdGV4dHVyZTsnICtcbiAgICAgICd2b2lkIG1haW4odm9pZCknICtcbiAgICAgICd7JyArXG4gICAgICAnICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHRleHR1cmUsIHZ1dik7JyArXG4gICAgICAnfSc7XG5cbiAgICBnbC5zaGFkZXJTb3VyY2UoZnJhZ21lbnRTaGFkZXJJZCwgZnJhZ21lbnRTaGFkZXIpO1xuICAgIGdsLmNvbXBpbGVTaGFkZXIoZnJhZ21lbnRTaGFkZXJJZCk7XG5cbiAgICAvLyBDcmVhdGluZyBwcm9ncmFtIG9iamVjdHNcbiAgICBjb25zdCBwcm9ncmFtSWQgPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG4gICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1JZCwgdmVydGV4U2hhZGVySWQpO1xuICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtSWQsIGZyYWdtZW50U2hhZGVySWQpO1xuXG4gICAgZ2wuZGVsZXRlU2hhZGVyKHZlcnRleFNoYWRlcklkKTtcbiAgICBnbC5kZWxldGVTaGFkZXIoZnJhZ21lbnRTaGFkZXJJZCk7XG5cbiAgICAvLyBMaW5rXG4gICAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbUlkKTtcblxuICAgIGdsLnVzZVByb2dyYW0ocHJvZ3JhbUlkKTtcblxuICAgIHJldHVybiBwcm9ncmFtSWQ7XG4gIH1cblxuICAvKipcbiAgICogVmlldyBpbmZvcm1hdGlvbi5cbiAgICovXG4gIHB1YmxpYyBnZXRWaWV3KCk6IExBcHBWaWV3IHtcbiAgICByZXR1cm4gdGhpcy5fdmlldztcbiAgfVxuXG4gIHB1YmxpYyBnZXRUZXh0dXJlTWFuYWdlcigpOiBMQXBwVGV4dHVyZU1hbmFnZXIge1xuICAgIHJldHVybiB0aGlzLl90ZXh0dXJlTWFuYWdlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fY2FwdHVyZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9tb3VzZVggPSAwLjA7XG4gICAgdGhpcy5fbW91c2VZID0gMC4wO1xuICAgIHRoaXMuX2lzRW5kID0gZmFsc2U7XG5cbiAgICB0aGlzLl9jdWJpc21PcHRpb24gPSBuZXcgQ3NtX09wdGlvbigpO1xuICAgIHRoaXMuX3ZpZXcgPSBuZXcgTEFwcFZpZXcoKTtcbiAgICB0aGlzLl90ZXh0dXJlTWFuYWdlciA9IG5ldyBMQXBwVGV4dHVyZU1hbmFnZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDdWJpc20gU0RL44Gu5Yid5pyf5YyWXG4gICAqL1xuICBwdWJsaWMgaW5pdGlhbGl6ZUN1YmlzbSgpOiB2b2lkIHtcbiAgICAvLyBzZXR1cCBjdWJpc21cbiAgICB0aGlzLl9jdWJpc21PcHRpb24ubG9nRnVuY3Rpb24gPSBMQXBwUGFsLnByaW50TWVzc2FnZTtcbiAgICB0aGlzLl9jdWJpc21PcHRpb24ubG9nZ2luZ0xldmVsID0gTEFwcERlZmluZS5DdWJpc21Mb2dnaW5nTGV2ZWw7XG4gICAgQ3NtX0N1YmlzbUZyYW1ld29yay5zdGFydFVwKHRoaXMuX2N1YmlzbU9wdGlvbik7XG5cbiAgICAvLyBpbml0aWFsaXplIGN1YmlzbVxuICAgIENzbV9DdWJpc21GcmFtZXdvcmsuaW5pdGlhbGl6ZSgpO1xuXG4gICAgLy8gbG9hZCBtb2RlbFxuICAgIExBcHBMaXZlMkRNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG5cbiAgICBMQXBwUGFsLnVwZGF0ZVRpbWUoKTtcblxuICAgIHRoaXMuX3ZpZXcuaW5pdGlhbGl6ZVNwcml0ZSgpO1xuICB9XG5cbiAgX2N1YmlzbU9wdGlvbjogQ3NtX09wdGlvbjsgLy8gQ3ViaXNtIFNESyBPcHRpb25cbiAgX3ZpZXc6IExBcHBWaWV3OyAvLyBWaWV35oOF5aCxXG4gIF9jYXB0dXJlZDogYm9vbGVhbjsgLy8gQXJlIHlvdSBjbGlja2luZyBvbiBpdD9cbiAgX21vdXNlWDogbnVtYmVyOyAvLyBNb3VzZSB4LWNvb3JkaW5hdGVcbiAgX21vdXNlWTogbnVtYmVyOyAvLyBNb3VzZSB5LWNvb3JkaW5hdGVcbiAgX2lzRW5kOiBib29sZWFuOyAvLyBJcyB0aGUgQVBQIGNsb3NlZD9cbiAgX3RleHR1cmVNYW5hZ2VyOiBMQXBwVGV4dHVyZU1hbmFnZXI7IC8vIFRleHR1cmUgbWFuYWdlclxufVxuXG4vKipcbiAqIENhbGxlZCB3aGVuIGNsaWNrZWQuXG4gKi9cbmZ1bmN0aW9uIG9uQ2xpY2tCZWdhbihlOiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gIGlmICghTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcpIHtcbiAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgndmlldyBub3Rmb3VuZCcpO1xuICAgIHJldHVybjtcbiAgfVxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fY2FwdHVyZWQgPSB0cnVlO1xuXG4gIGNvbnN0IHBvc1g6IG51bWJlciA9IGUucGFnZVg7XG4gIGNvbnN0IHBvc1k6IG51bWJlciA9IGUucGFnZVk7XG5cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcub25Ub3VjaGVzQmVnYW4ocG9zWCwgcG9zWSk7XG59XG5cbi8qKlxuICogSWYgdGhlIG1vdXNlIHBvaW50ZXIgbW92ZXMsIGl0IGlzIGNhbGxlZC5cbiAqL1xuZnVuY3Rpb24gb25Nb3VzZU1vdmVkKGU6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgLy8g6buY6K6k6ZyA6KaB5ZCM5pe25oyJ5LiL6byg5qCH5omN6IO96Lef6LiqIOazqOmHiuaOiVxuICAvLyBpZiAoIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl9jYXB0dXJlZCkge1xuICAvLyAgIHJldHVybjtcbiAgLy8gfVxuXG4gIGlmIChcbiAgICAhTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcgfHxcbiAgICAhTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcuX3Byb2dyYW1JZFxuICApIHtcbiAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgndmlldyBub3Rmb3VuZCcpO1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBET01SZWN0IOWvueixoe+8jHRvcOOAgWxlZnQg6KGo56S65YWD57SgKGNhbnZhcynlt6bkuIrop5LliLDop4blj6Plt6bkuIrop5LnmoTot53nprvvvIxib3R0b23jgIFyaWdodOihqOekuuWFg+e0oOWPs+S4i+inkuWIsOinhuWPo+W3puS4iuinkueahOi3neemu1xuICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAvLyDov5nph4znmoQgZS50YXJnZXQg5pivIHdpbmRvd1xuICAvLyBNb3VzZUV2ZW50IOWvueixoe+8jGNsaWVudFjjgIFjbGllbnRZ5YiG5Yir5piv6byg5qCH54K55Ye75L2N572u5Zyo6KeG5Y+j5Lit55qEWOOAgVnlnZDmoIdcbiAgY29uc3QgcG9zWDogbnVtYmVyID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICBjb25zdCBwb3NZOiBudW1iZXIgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcblxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5vblRvdWNoZXNNb3ZlZChwb3NYLCBwb3NZKTtcbn1cblxuLyoqXG4gKiDmjIfpkojnp7vlh7rnqpflj6Pml7bmgaLlpI3pu5jorqTlp7/mgIFcbiAqL1xuZnVuY3Rpb24gb25Nb3VzZUxlYXZlKCk6IHZvaWQge1xuICBMQXBwRGVmaW5lLkRlYnVnTG9nRW5hYmxlICYmIExBcHBQYWwucHJpbnRNZXNzYWdlKCdbTGl2ZTJEdjRdIG9uTW91c2VMZWF2ZScpO1xuICBpZiAoXG4gICAgIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3IHx8XG4gICAgIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Ll9wcm9ncmFtSWRcbiAgKSB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ3ZpZXcgbm90Zm91bmQnKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgbGl2ZTJETWFuYWdlcjogTEFwcExpdmUyRE1hbmFnZXIgPSBMQXBwTGl2ZTJETWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuICBsaXZlMkRNYW5hZ2VyLm9uRHJhZygwLjAsIDAuMCk7XG59XG5cbi8qKlxuICogQ2FsbCB3aGVuIHRoZSBjbGljayBpcyBmaW5pc2hlZC5cbiAqL1xuZnVuY3Rpb24gb25DbGlja0VuZGVkKGU6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX2NhcHR1cmVkID0gZmFsc2U7XG4gIGlmIChcbiAgICAhTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcgfHxcbiAgICAhTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcuX3Byb2dyYW1JZFxuICApIHtcbiAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgndmlldyBub3Rmb3VuZCcpO1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBET01SZWN0IOWvueixoe+8jHRvcOOAgWxlZnQg6KGo56S65YWD57SgKOi/memHjOaYr2NhbnZhcynlt6bkuIrop5LliLDop4blj6Plt6bkuIrop5LnmoTot53nprvvvIxib3R0b23jgIFyaWdodOihqOekuuWFg+e0oOWPs+S4i+inkuWIsOinhuWPo+W3puS4iuinkueahOi3neemu1xuICBjb25zdCByZWN0ID0gKGUudGFyZ2V0IGFzIEVsZW1lbnQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAvLyBNb3VzZUV2ZW50IOWvueixoe+8jGNsaWVudFjjgIFjbGllbnRZ5YiG5Yir5piv6byg5qCH54K55Ye75L2N572u5Zyo6KeG5Y+j5Lit55qEWOOAgVnlnZDmoIdcbiAgY29uc3QgcG9zWDogbnVtYmVyID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICBjb25zdCBwb3NZOiBudW1iZXIgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgaWYgKExBcHBEZWZpbmUuRGVidWdMb2dFbmFibGUpIHtcbiAgICBMQXBwUGFsLnByaW50TWVzc2FnZShcbiAgICAgIGBbTGl2ZTJEdjRdIG9uQ2xpY2tFbmRlZDpcbiAgICAgICByZWN0IGxlZnQ6ICR7cmVjdC5sZWZ0LnRvRml4ZWQoMil9IHJlY3QgdG9wOiAke3JlY3QudG9wLnRvRml4ZWQoMil9XG4gICAgICAgY2xpZW50WDogJHtlLmNsaWVudFgudG9GaXhlZCgyKX0gY2xpZW50WTogJHtlLmNsaWVudFkudG9GaXhlZCgyKX1gXG4gICAgKTtcbiAgfVxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5vblRvdWNoZXNFbmRlZChwb3NYLCBwb3NZKTtcbn1cblxuLyoqXG4gKiBJdCBpcyBjYWxsZWQgd2hlbiB0b3VjaGVkLlxuICovXG5mdW5jdGlvbiBvblRvdWNoQmVnYW4oZTogVG91Y2hFdmVudCk6IHZvaWQge1xuICBpZiAoIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3KSB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ3ZpZXcgbm90Zm91bmQnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fY2FwdHVyZWQgPSB0cnVlO1xuXG4gIC8vIERPTVJlY3Qg5a+56LGh77yMdG9w44CBbGVmdCDooajnpLrlhYPntKAoY2FudmFzKeW3puS4iuinkuWIsOinhuWPo+W3puS4iuinkueahOi3neemu++8jGJvdHRvbeOAgXJpZ2h06KGo56S65YWD57Sg5Y+z5LiL6KeS5Yiw6KeG5Y+j5bem5LiK6KeS55qE6Led56a7XG4gIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIC8vIOi/memHjOeahCBlLnRhcmdldCDmmK8gd2luZG93XG4gIC8vIE1vdXNlRXZlbnQg5a+56LGh77yMY2xpZW50WOOAgWNsaWVudFnliIbliKvmmK/pvKDmoIfngrnlh7vkvY3nva7lnKjop4blj6PkuK3nmoRY44CBWeWdkOagh1xuICBjb25zdCBwb3NYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICBjb25zdCBwb3NZID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gcmVjdC50b3A7XG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Lm9uVG91Y2hlc01vdmVkKHBvc1gsIHBvc1kpO1xuXG4gIC8vIGNvbnN0IHBvc1ggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYO1xuICAvLyBjb25zdCBwb3NZID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWTtcbiAgLy9cbiAgLy8gTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcub25Ub3VjaGVzQmVnYW4ocG9zWCwgcG9zWSk7XG59XG5cbi8qKlxuICogVGhpcyBpcyBjYWxsZWQgc3dpcGluZy5cbiAqL1xuZnVuY3Rpb24gb25Ub3VjaE1vdmVkKGU6IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgLy8gaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fY2FwdHVyZWQpIHtcbiAgLy8gICByZXR1cm47XG4gIC8vIH1cblxuICBpZiAoIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3KSB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ3ZpZXcgbm90Zm91bmQnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBET01SZWN0IOWvueixoe+8jHRvcOOAgWxlZnQg6KGo56S65YWD57SgKGNhbnZhcynlt6bkuIrop5LliLDop4blj6Plt6bkuIrop5LnmoTot53nprvvvIxib3R0b23jgIFyaWdodOihqOekuuWFg+e0oOWPs+S4i+inkuWIsOinhuWPo+W3puS4iuinkueahOi3neemu1xuICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAvLyDov5nph4znmoQgZS50YXJnZXQg5pivIHdpbmRvd1xuICAvLyBNb3VzZUV2ZW50IOWvueixoe+8jGNsaWVudFjjgIFjbGllbnRZ5YiG5Yir5piv6byg5qCH54K55Ye75L2N572u5Zyo6KeG5Y+j5Lit55qEWOOAgVnlnZDmoIdcbiAgY29uc3QgcG9zWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgY29uc3QgcG9zWSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Lm9uVG91Y2hlc01vdmVkKHBvc1gsIHBvc1kpO1xufVxuXG4vKipcbiAqIEl0IGlzIGNhbGxlZCB3aGVuIHRoZSB0b3VjaCBpcyBmaW5pc2hlZC5cbiAqL1xuZnVuY3Rpb24gb25Ub3VjaEVuZGVkKGU6IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX2NhcHR1cmVkID0gZmFsc2U7XG5cbiAgaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldykge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCd2aWV3IG5vdGZvdW5kJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGxpdmUyRE1hbmFnZXI6IExBcHBMaXZlMkRNYW5hZ2VyID0gTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcbiAgbGl2ZTJETWFuYWdlci5vbkRyYWcoMC4wLCAwLjApO1xuXG4gIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgY29uc3QgcG9zWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgY29uc3QgcG9zWSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Lm9uVG91Y2hlc0VuZGVkKHBvc1gsIHBvc1kpO1xufVxuXG4vKipcbiAqIFRvdWNoIGlzIGNhbGxlZCBjYW5jZWxlZC5cbiAqL1xuZnVuY3Rpb24gb25Ub3VjaENhbmNlbChlOiBUb3VjaEV2ZW50KTogdm9pZCB7XG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl9jYXB0dXJlZCA9IGZhbHNlO1xuXG4gIGlmICghTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcpIHtcbiAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgndmlldyBub3Rmb3VuZCcpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBsaXZlMkRNYW5hZ2VyOiBMQXBwTGl2ZTJETWFuYWdlciA9IExBcHBMaXZlMkRNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG4gIGxpdmUyRE1hbmFnZXIub25EcmFnKDAuMCwgMC4wKTtcblxuICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gIGNvbnN0IHBvc1ggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gIGNvbnN0IHBvc1kgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSByZWN0LnRvcDtcblxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5vblRvdWNoZXNFbmRlZChwb3NYLCBwb3NZKTtcbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0KGMpIExpdmUyRCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgdGhlIExpdmUyRCBPcGVuIFNvZnR3YXJlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGF0IGh0dHBzOi8vd3d3LmxpdmUyZC5jb20vZXVsYS9saXZlMmQtb3Blbi1zb2Z0d2FyZS1saWNlbnNlLWFncmVlbWVudF9lbi5odG1sLlxuICovXG5cbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21tYXRyaXg0NCB9IGZyb20gJ0BmcmFtZXdvcmsvbWF0aC9jdWJpc21tYXRyaXg0NCc7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3NtdmVjdG9yIH0gZnJvbSAnQGZyYW1ld29yay90eXBlL2NzbXZlY3Rvcic7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgYWN1YmlzbW1vdGlvbiB9IGZyb20gJ0BmcmFtZXdvcmsvbW90aW9uL2FjdWJpc21tb3Rpb24nO1xuaW1wb3J0IENzbV9jc21WZWN0b3IgPSBjc212ZWN0b3IuY3NtVmVjdG9yO1xuaW1wb3J0IENzbV9DdWJpc21NYXRyaXg0NCA9IGN1YmlzbW1hdHJpeDQ0LkN1YmlzbU1hdHJpeDQ0O1xuaW1wb3J0IEFDdWJpc21Nb3Rpb24gPSBhY3ViaXNtbW90aW9uLkFDdWJpc21Nb3Rpb247XG5cbmltcG9ydCB7IExBcHBNb2RlbCB9IGZyb20gJy4vbGFwcG1vZGVsJztcbmltcG9ydCB7IExBcHBQYWwgfSBmcm9tICcuL2xhcHBwYWwnO1xuaW1wb3J0IHsgY2FudmFzIH0gZnJvbSAnLi9sYXBwZGVsZWdhdGUnO1xuaW1wb3J0ICogYXMgTEFwcERlZmluZSBmcm9tICcuL2xhcHBkZWZpbmUnO1xuXG5leHBvcnQgbGV0IHNfaW5zdGFuY2U6IExBcHBMaXZlMkRNYW5hZ2VyID0gbnVsbDtcblxuLyoqXG4gKiBDbGFzcyB0byBtYW5hZ2UgQ3ViaXNtTW9kZWwgaW4gdGhlIHNhbXBsZSBhcHBsaWNhdGlvblxuICogSXQgZ2VuZXJhdGVzIGFuZCBkaXNjYXJkcyBtb2RlbHMsIGhhbmRsZXMgdGFwIGV2ZW50cywgYW5kIHN3aXRjaGVzIG1vZGVscy5cbiAqL1xuZXhwb3J0IGNsYXNzIExBcHBMaXZlMkRNYW5hZ2VyIHtcbiAgLyoqXG4gICAqIEl0IHJldHVybnMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzIChzaW5nbGV0b24pLlxuICAgKiBJZiBubyBpbnN0YW5jZSBpcyBjcmVhdGVkLCBhbiBpbnN0YW5jZSBpcyBjcmVhdGVkIGludGVybmFsbHkuXG4gICAqXG4gICAqIEByZXR1cm4gSW5zdGFuY2Ugb2YgY2xhc3NcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogTEFwcExpdmUyRE1hbmFnZXIge1xuICAgIGlmIChzX2luc3RhbmNlID09IG51bGwpIHtcbiAgICAgIC8vIExBcHBEZWZpbmUubW9kZWxQYXRoXG4gICAgICBzX2luc3RhbmNlID0gbmV3IExBcHBMaXZlMkRNYW5hZ2VyKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNfaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogRnJlZSBpbnN0YW5jZSBvZiBjbGFzcyAoc2luZ2xldG9uKS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVsZWFzZUluc3RhbmNlKCk6IHZvaWQge1xuICAgIGlmIChzX2luc3RhbmNlICE9IG51bGwpIHtcbiAgICAgIHNfaW5zdGFuY2UgPSB2b2lkIDA7XG4gICAgfVxuXG4gICAgc19pbnN0YW5jZSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbW9kZWwgaGVsZCBpbiB0aGUgY3VycmVudCBzY2VuZS5cbiAgICpcbiAgICogQHBhcmFtIG5vIEluZGV4IHZhbHVlIG9mIG1vZGVsIGxpc3RcbiAgICogQHJldHVybiBSZXR1cm5zIGFuIGluc3RhbmNlIG9mIGEgbW9kZWwuSWYgdGhlIGluZGV4IHZhbHVlIGlzIG91dCBvZiB0aGUgcmFuZ2UsIHJldHVybiBOVUxMLlxuICAgKi9cbiAgcHVibGljIGdldE1vZGVsKG5vOiBudW1iZXIpOiBMQXBwTW9kZWwge1xuICAgIGlmIChubyA8IHRoaXMuX21vZGVscy5nZXRTaXplKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbHMuYXQobm8pO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGVhc2UgYWxsIHRoZSBtb2RlbHMgeW91IGhvbGQgaW4gdGhlIGN1cnJlbnQgc2NlbmVcbiAgICovXG4gIHB1YmxpYyByZWxlYXNlQWxsTW9kZWwoKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9tb2RlbHMuZ2V0U2l6ZSgpOyBpKyspIHtcbiAgICAgIHRoaXMuX21vZGVscy5hdChpKS5yZWxlYXNlKCk7XG4gICAgICB0aGlzLl9tb2RlbHMuc2V0KGksIG51bGwpO1xuICAgIH1cblxuICAgIHRoaXMuX21vZGVscy5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBwcm9jZXNzIG9mIGRyYWdnaW5nIHRoZSBzY3JlZW5cbiAgICpcbiAgICogQHBhcmFtIHgg55S76Z2i44GuWOW6p+aomVxuICAgKiBAcGFyYW0geSDnlLvpnaLjga5Z5bqn5qiZXG4gICAqL1xuICBwdWJsaWMgb25EcmFnKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9tb2RlbHMuZ2V0U2l6ZSgpOyBpKyspIHtcbiAgICAgIGNvbnN0IG1vZGVsOiBMQXBwTW9kZWwgPSB0aGlzLmdldE1vZGVsKGkpO1xuXG4gICAgICBpZiAobW9kZWwpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ4OiBcIit4KVxuICAgICAgICBjb25zb2xlLmxvZyhcInk6IFwiK3kpXG4gICAgICAgIG1vZGVsLnNldERyYWdnaW5nKHgsIHkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUYXBwaW5nIHRoZSBzY3JlZW5cbiAgICpcbiAgICogQHBhcmFtIHgg55S76Z2i44GuWOW6p+aomVxuICAgKiBAcGFyYW0geSDnlLvpnaLjga5Z5bqn5qiZXG4gICAqL1xuICBwdWJsaWMgb25UYXAoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoTEFwcERlZmluZS5EZWJ1Z0xvZ0VuYWJsZSkge1xuICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoXG4gICAgICAgIGBbTGl2ZTJEdjRdIHRhcCBwb2ludDoge3g6ICR7eC50b0ZpeGVkKDIpfSB5OiAke3kudG9GaXhlZCgyKX19YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX21vZGVscy5nZXRTaXplKCk7IGkrKykge1xuICAgICAgaWYgKHRoaXMuX21vZGVscy5hdChpKS5oaXRUZXN0KExBcHBEZWZpbmUuSGl0QXJlYU5hbWVIZWFkLCB4LCB5KSkge1xuICAgICAgICBpZiAoTEFwcERlZmluZS5EZWJ1Z0xvZ0VuYWJsZSkge1xuICAgICAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKFxuICAgICAgICAgICAgYFtMaXZlMkR2NF0gaGl0IGFyZWE6IFske0xBcHBEZWZpbmUuSGl0QXJlYU5hbWVIZWFkfV1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyDngrnlh7vlpLTpg6jpu5jorqTliqjkvZzmmK/liIfmjaLooajmg4Ug546w5Zyo5pS55Li65YOP54K55Ye7IGJvZHkg5LiA5qC35pKt5pS+5Yqo5L2cXG4gICAgICAgIC8vIHRoaXMuX21vZGVscy5hdChpKS5zZXRSYW5kb21FeHByZXNzaW9uKCk7XG4gICAgICAgIHRoaXMuX21vZGVsc1xuICAgICAgICAgIC5hdChpKVxuICAgICAgICAgIC5zdGFydFJhbmRvbU1vdGlvbihcbiAgICAgICAgICAgIExBcHBEZWZpbmUuTW90aW9uR3JvdXBUYXBIZWFkLFxuICAgICAgICAgICAgTEFwcERlZmluZS5Qcmlvcml0eU5vcm1hbCxcbiAgICAgICAgICAgIHRoaXMuX2ZpbmlzaGVkTW90aW9uXG4gICAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fbW9kZWxzLmF0KGkpLmhpdFRlc3QoTEFwcERlZmluZS5IaXRBcmVhTmFtZUJvZHksIHgsIHkpKSB7XG4gICAgICAgIGlmIChMQXBwRGVmaW5lLkRlYnVnTG9nRW5hYmxlKSB7XG4gICAgICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoXG4gICAgICAgICAgICBgW0xpdmUyRHY0XSBoaXQgYXJlYTogWyR7TEFwcERlZmluZS5IaXRBcmVhTmFtZUJvZHl9XWBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21vZGVsc1xuICAgICAgICAgIC5hdChpKVxuICAgICAgICAgIC5zdGFydFJhbmRvbU1vdGlvbihcbiAgICAgICAgICAgIExBcHBEZWZpbmUuTW90aW9uR3JvdXBUYXBCb2R5LFxuICAgICAgICAgICAgTEFwcERlZmluZS5Qcmlvcml0eU5vcm1hbCxcbiAgICAgICAgICAgIHRoaXMuX2ZpbmlzaGVkTW90aW9uXG4gICAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2hhdCB0byBkbyB3aGVuIHVwZGF0aW5nIHRoZSBzY3JlZW5cbiAgICogTW9kZWwgdXBkYXRlIHByb2Nlc3NpbmcgYW5kIGRyYXdpbmcgcHJvY2Vzc2luZ1xuICAgKi9cbiAgcHVibGljIG9uVXBkYXRlKCk6IHZvaWQge1xuICAgIGxldCBwcm9qZWN0aW9uOiBDc21fQ3ViaXNtTWF0cml4NDQgPSBuZXcgQ3NtX0N1YmlzbU1hdHJpeDQ0KCk7XG5cbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGNhbnZhcztcbiAgICBwcm9qZWN0aW9uLnNjYWxlKDEuMCwgd2lkdGggLyBoZWlnaHQpO1xuXG4gICAgaWYgKHRoaXMuX3ZpZXdNYXRyaXggIT0gbnVsbCkge1xuICAgICAgcHJvamVjdGlvbi5tdWx0aXBseUJ5TWF0cml4KHRoaXMuX3ZpZXdNYXRyaXgpO1xuICAgIH1cblxuICAgIGNvbnN0IHNhdmVQcm9qZWN0aW9uOiBDc21fQ3ViaXNtTWF0cml4NDQgPSBwcm9qZWN0aW9uLmNsb25lKCk7XG4gICAgY29uc3QgbW9kZWxDb3VudDogbnVtYmVyID0gdGhpcy5fbW9kZWxzLmdldFNpemUoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW9kZWxDb3VudDsgKytpKSB7XG4gICAgICBjb25zdCBtb2RlbDogTEFwcE1vZGVsID0gdGhpcy5nZXRNb2RlbChpKTtcbiAgICAgIHByb2plY3Rpb24gPSBzYXZlUHJvamVjdGlvbi5jbG9uZSgpO1xuXG4gICAgICBtb2RlbC51cGRhdGUoKTtcbiAgICAgIG1vZGVsLmRyYXcocHJvamVjdGlvbik7IC8vIFRoZSBwcm9qZWN0aW9uIGlzIG1vZGlmaWVkIGJ5IHJlZmVyZW5jZS5cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlIHNjZW5lc1xuICAgKiBUaGUgc2FtcGxlIGFwcGxpY2F0aW9uIHN3aXRjaGVzIHRoZSBtb2RlbCBzZXQuXG4gICAqL1xuICBwdWJsaWMgY2hhbmdlU2NlbmUobW9kZWxQYXRoOiBzdHJpbmcsIG1vZGVsSnNvbk5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmIChMQXBwRGVmaW5lLkRlYnVnTG9nRW5hYmxlKSB7XG4gICAgICBMQXBwUGFsLnByaW50TWVzc2FnZShgW0xpdmUyRHY0XSBsb2FkIG1vZGVsOiAke21vZGVsSnNvbk5hbWV9YCk7XG4gICAgfVxuXG4gICAgdGhpcy5yZWxlYXNlQWxsTW9kZWwoKTtcbiAgICB0aGlzLl9tb2RlbHMucHVzaEJhY2sobmV3IExBcHBNb2RlbChMQXBwRGVmaW5lLkRlYnVnTG9nRW5hYmxlKSk7XG4gICAgdGhpcy5fbW9kZWxzLmF0KDApLmxvYWRBc3NldHMobW9kZWxQYXRoLCBtb2RlbEpzb25OYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fdmlld01hdHJpeCA9IG5ldyBDc21fQ3ViaXNtTWF0cml4NDQoKTtcbiAgICB0aGlzLl9tb2RlbHMgPSBuZXcgQ3NtX2NzbVZlY3RvcjxMQXBwTW9kZWw+KCk7XG4gICAgdGhpcy5jaGFuZ2VTY2VuZShMQXBwRGVmaW5lLm1vZGVsUGF0aCwgTEFwcERlZmluZS5tb2RlbEpzb25OYW1lKTtcbiAgfVxuXG4gIF92aWV3TWF0cml4OiBDc21fQ3ViaXNtTWF0cml4NDQ7IC8vIFZpZXcgbWF0cml4IGZvciBtb2RlbCBkcmF3aW5nXG4gIF9tb2RlbHM6IENzbV9jc21WZWN0b3I8TEFwcE1vZGVsPjsgLy8gQ29udGFpbmVyIG9mIG1vZGVsIGluc3RhbmNlc1xuICAvLyBDYWxsYmFjayBmdW5jdGlvbiB0byBlbmQgbW90aW9uIHBsYXliYWNrXG4gIF9maW5pc2hlZE1vdGlvbiA9IChzZWxmOiBBQ3ViaXNtTW90aW9uKTogdm9pZCA9PiB7XG4gICAgTEFwcERlZmluZS5EZWJ1Z0xvZ0VuYWJsZSAmJiBMQXBwUGFsLnByaW50TWVzc2FnZSgnW0xpdmUyRHY0XSBNb3Rpb24gRmluaXNoZWQnKTtcbiAgfTtcbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0KGMpIExpdmUyRCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgdGhlIExpdmUyRCBPcGVuIFNvZnR3YXJlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGF0IGh0dHBzOi8vd3d3LmxpdmUyZC5jb20vZXVsYS9saXZlMmQtb3Blbi1zb2Z0d2FyZS1saWNlbnNlLWFncmVlbWVudF9lbi5odG1sLlxuICovXG5cbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21NYXRyaXg0NCB9IGZyb20gJ0BmcmFtZXdvcmsvbWF0aC9jdWJpc21tYXRyaXg0NCc7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtdmlld21hdHJpeCB9IGZyb20gJ0BmcmFtZXdvcmsvbWF0aC9jdWJpc212aWV3bWF0cml4JztcbmltcG9ydCBDc21fQ3ViaXNtVmlld01hdHJpeCA9IGN1YmlzbXZpZXdtYXRyaXguQ3ViaXNtVmlld01hdHJpeDtcbmltcG9ydCBDc21fQ3ViaXNtTWF0cml4NDQgPSBjdWJpc21NYXRyaXg0NC5DdWJpc21NYXRyaXg0NDtcbmltcG9ydCB7IFRvdWNoTWFuYWdlciB9IGZyb20gJy4vdG91Y2htYW5hZ2VyJztcbmltcG9ydCB7IExBcHBMaXZlMkRNYW5hZ2VyIH0gZnJvbSAnLi9sYXBwbGl2ZTJkbWFuYWdlcic7XG5pbXBvcnQgeyBMQXBwRGVsZWdhdGUsIGNhbnZhcywgZ2wgfSBmcm9tICcuL2xhcHBkZWxlZ2F0ZSc7XG5pbXBvcnQgeyBMQXBwU3ByaXRlIH0gZnJvbSAnLi9sYXBwc3ByaXRlJztcbmltcG9ydCB7IFRleHR1cmVJbmZvIH0gZnJvbSAnLi9sYXBwdGV4dHVyZW1hbmFnZXInO1xuaW1wb3J0IHsgTEFwcFBhbCB9IGZyb20gJy4vbGFwcHBhbCc7XG5pbXBvcnQgKiBhcyBMQXBwRGVmaW5lIGZyb20gJy4vbGFwcGRlZmluZSc7XG5cbi8qKlxuICogRHJhd2luZyBjbGFzc2VzLlxuICovXG5leHBvcnQgY2xhc3MgTEFwcFZpZXcge1xuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3Byb2dyYW1JZCA9IG51bGw7XG5cbiAgICAvLyBUb3VjaCByZWxhdGVkIGV2ZW50IG1hbmFnZW1lbnRcbiAgICB0aGlzLl90b3VjaE1hbmFnZXIgPSBuZXcgVG91Y2hNYW5hZ2VyKCk7XG5cbiAgICAvLyBGb3IgY29udmVydGluZyBkZXZpY2UgY29vcmRpbmF0ZXMgdG8gc2NyZWVuIGNvb3JkaW5hdGVzXG4gICAgdGhpcy5fZGV2aWNlVG9TY3JlZW4gPSBuZXcgQ3NtX0N1YmlzbU1hdHJpeDQ0KCk7XG5cbiAgICAvLyBNYXRyaXggZm9yIHNjYWxpbmcgYW5kIHNoaWZ0aW5nIHRoZSBkaXNwbGF5XG4gICAgdGhpcy5fdmlld01hdHJpeCA9IG5ldyBDc21fQ3ViaXNtVmlld01hdHJpeCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVcbiAgICovXG4gIHB1YmxpYyBpbml0aWFsaXplKCk6IHZvaWQge1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gY2FudmFzO1xuXG4gICAgY29uc3QgcmF0aW86IG51bWJlciA9IGhlaWdodCAvIHdpZHRoO1xuICAgIGNvbnN0IGxlZnQ6IG51bWJlciA9IExBcHBEZWZpbmUuVmlld0xvZ2ljYWxMZWZ0O1xuICAgIGNvbnN0IHJpZ2h0OiBudW1iZXIgPSBMQXBwRGVmaW5lLlZpZXdMb2dpY2FsUmlnaHQ7XG4gICAgY29uc3QgYm90dG9tOiBudW1iZXIgPSAtcmF0aW87XG4gICAgY29uc3QgdG9wOiBudW1iZXIgPSByYXRpbztcblxuICAgIC8vIFJhbmdlIG9mIHNjcmVlbiBjb3JyZXNwb25kaW5nIHRvIHRoZSBkZXZpY2UuVGhlIGxlZnQgZW5kIG9mIFgsIHRoZSByaWdodCBlbmQgb2YgWCwgdGhlIGJvdHRvbSBlbmQgb2YgWSwgdGhlIHRvcCBlbmQgb2YgWVxuICAgIHRoaXMuX3ZpZXdNYXRyaXguc2V0U2NyZWVuUmVjdChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3ApO1xuXG4gICAgY29uc3Qgc2NyZWVuVzogbnVtYmVyID0gTWF0aC5hYnMobGVmdCAtIHJpZ2h0KTtcbiAgICB0aGlzLl9kZXZpY2VUb1NjcmVlbi5zY2FsZVJlbGF0aXZlKHNjcmVlblcgLyB3aWR0aCwgLXNjcmVlblcgLyB3aWR0aCk7XG4gICAgdGhpcy5fZGV2aWNlVG9TY3JlZW4udHJhbnNsYXRlUmVsYXRpdmUoLXdpZHRoICogMC41LCAtaGVpZ2h0ICogMC41KTtcblxuICAgIC8vIFNldHRpbmcgdGhlIGRpc3BsYXkgcmFuZ2VcbiAgICB0aGlzLl92aWV3TWF0cml4LnNldE1heFNjYWxlKExBcHBEZWZpbmUuVmlld01heFNjYWxlKTsgLy8g6ZmQ55WM5ouh5by1546HXG4gICAgdGhpcy5fdmlld01hdHJpeC5zZXRNaW5TY2FsZShMQXBwRGVmaW5lLlZpZXdNaW5TY2FsZSk7IC8vIOmZkOeVjOe4ruWwj+eOh1xuXG4gICAgLy8gTWF4aW11bSByYW5nZSB0aGF0IGNhbiBiZSBkaXNwbGF5ZWRcbiAgICB0aGlzLl92aWV3TWF0cml4LnNldE1heFNjcmVlblJlY3QoXG4gICAgICBMQXBwRGVmaW5lLlZpZXdMb2dpY2FsTWF4TGVmdCxcbiAgICAgIExBcHBEZWZpbmUuVmlld0xvZ2ljYWxNYXhSaWdodCxcbiAgICAgIExBcHBEZWZpbmUuVmlld0xvZ2ljYWxNYXhCb3R0b20sXG4gICAgICBMQXBwRGVmaW5lLlZpZXdMb2dpY2FsTWF4VG9wXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDop6PmlL7jgZnjgotcbiAgICovXG4gIHB1YmxpYyByZWxlYXNlKCk6IHZvaWQge1xuICAgIHRoaXMuX3ZpZXdNYXRyaXggPSBudWxsO1xuICAgIHRoaXMuX3RvdWNoTWFuYWdlciA9IG51bGw7XG4gICAgdGhpcy5fZGV2aWNlVG9TY3JlZW4gPSBudWxsO1xuXG4gICAgZ2wuZGVsZXRlUHJvZ3JhbSh0aGlzLl9wcm9ncmFtSWQpO1xuICAgIHRoaXMuX3Byb2dyYW1JZCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICog5o+P55S744GZ44KL44CCXG4gICAqL1xuICBwdWJsaWMgcmVuZGVyKCk6IHZvaWQge1xuICAgIGdsLnVzZVByb2dyYW0odGhpcy5fcHJvZ3JhbUlkKTtcblxuICAgIGdsLmZsdXNoKCk7XG5cbiAgICBjb25zdCBsaXZlMkRNYW5hZ2VyOiBMQXBwTGl2ZTJETWFuYWdlciA9IExBcHBMaXZlMkRNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG5cbiAgICBsaXZlMkRNYW5hZ2VyLm9uVXBkYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgaW1hZ2UuXG4gICAqL1xuICBwdWJsaWMgaW5pdGlhbGl6ZVNwcml0ZSgpOiB2b2lkIHtcbiAgICBjb25zdCB3aWR0aDogbnVtYmVyID0gY2FudmFzLndpZHRoO1xuICAgIGNvbnN0IGhlaWdodDogbnVtYmVyID0gY2FudmFzLmhlaWdodDtcblxuICAgIGNvbnN0IHRleHR1cmVNYW5hZ2VyID0gTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuZ2V0VGV4dHVyZU1hbmFnZXIoKTtcblxuICAgIC8vIENyZWF0ZSBhIHNoYWRlci5cbiAgICBpZiAodGhpcy5fcHJvZ3JhbUlkID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3Byb2dyYW1JZCA9IExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLmNyZWF0ZVNoYWRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJdCBpcyBjYWxsZWQgd2hlbiBpdCBpcyB0b3VjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0gcG9pbnRYIFNjcmVlbiB4LWNvb3JkaW5hdGVzXG4gICAqIEBwYXJhbSBwb2ludFkgU2NyZWVuIHktY29vcmRpbmF0ZXNcbiAgICovXG4gIHB1YmxpYyBvblRvdWNoZXNCZWdhbihwb2ludFg6IG51bWJlciwgcG9pbnRZOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLl90b3VjaE1hbmFnZXIudG91Y2hlc0JlZ2FuKHBvaW50WCwgcG9pbnRZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIHRoZSBmaW5nZXIgaXMgdG91Y2hlZCwgaXQgaXMgY2FsbGVkLlxuICAgKlxuICAgKiBAcGFyYW0gcG9pbnRYIFNjcmVlbiBYIGNvb3JkaW5hdGVzXG4gICAqIEBwYXJhbSBwb2ludFkgU2NyZWVuIFkgY29vcmRpbmF0ZXNcbiAgICovXG4gIHB1YmxpYyBvblRvdWNoZXNNb3ZlZChwb2ludFg6IG51bWJlciwgcG9pbnRZOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCB2aWV3WDogbnVtYmVyID0gdGhpcy50cmFuc2Zvcm1WaWV3WCh0aGlzLl90b3VjaE1hbmFnZXIuZ2V0WCgpKTtcbiAgICBjb25zdCB2aWV3WTogbnVtYmVyID0gdGhpcy50cmFuc2Zvcm1WaWV3WSh0aGlzLl90b3VjaE1hbmFnZXIuZ2V0WSgpKTtcbiAgICB0aGlzLl90b3VjaE1hbmFnZXIudG91Y2hlc01vdmVkKHBvaW50WCwgcG9pbnRZKTtcblxuICAgIGNvbnN0IGxpdmUyRE1hbmFnZXI6IExBcHBMaXZlMkRNYW5hZ2VyID0gTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcbiAgICBMQXBwRGVmaW5lLkRlYnVnTG9nRW5hYmxlICYmXG4gICAgICBMQXBwRGVmaW5lLkRlYnVnVG91Y2hMb2dFbmFibGUgJiZcbiAgICAgIGNvbnNvbGUubG9nKGBbTGl2ZTJEdjRdIHBvaW50WDogJHtwb2ludFh9IHBvaW50WTogJHtwb2ludFl9XG4gICAgICAgICAgdmlld1g6ICR7dmlld1h9IHZpZXdZOiAke3ZpZXdZfWApO1xuICAgIGxpdmUyRE1hbmFnZXIub25EcmFnKHZpZXdYLCB2aWV3WSk7XG4gIH1cblxuICAvKipcbiAgICogSXQgaXMgY2FsbGVkIHdoZW4gdGhlIHRvdWNoIGlzIGZpbmlzaGVkLlxuICAgKlxuICAgKiBAcGFyYW0gcG9pbnRYIFNjcmVlbiBYIGNvb3JkaW5hdGVzXG4gICAqIEBwYXJhbSBwb2ludFkgU2NyZWVuIFkgY29vcmRpbmF0ZXNcbiAgICovXG4gIHB1YmxpYyBvblRvdWNoZXNFbmRlZChwb2ludFg6IG51bWJlciwgcG9pbnRZOiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBUb3VjaCBkb25lLlxuICAgIGNvbnN0IGxpdmUyRE1hbmFnZXI6IExBcHBMaXZlMkRNYW5hZ2VyID0gTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcbiAgICAvLyBsaXZlMkRNYW5hZ2VyLm9uRHJhZygwLjAsIDAuMCk7XG4gICAge1xuICAgICAgaWYgKExBcHBEZWZpbmUuRGVidWdMb2dFbmFibGUpIHtcbiAgICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoYFtMaXZlMkR2NF0gdG91Y2hlc0VuZGVkIHg6ICR7cG9pbnRYfSB5OiAke3BvaW50WX1gKTtcbiAgICAgIH1cbiAgICAgIC8vIFNpbmdsZSB0YXBcbiAgICAgIGNvbnN0IHg6IG51bWJlciA9IHRoaXMuX2RldmljZVRvU2NyZWVuLnRyYW5zZm9ybVgoXG4gICAgICAgIC8vIHRoaXMuX3RvdWNoTWFuYWdlci5nZXRYKClcbiAgICAgICAgcG9pbnRYIC8vIOWOn+S7o+eggeS9v+eUqOaMieS4i+aXtueahOWdkOagh++8jOe7j+W4uOaXoOazleinpuWPkeWKqOS9nO+8jOaUueS4uuS9v+eUqOW8uei1t+aXtueahOWdkOagh1xuICAgICAgKTsgLy8gTG9naWNhbCBjb29yZGluYXRlcyBnZXQgdGhlIHRyYW5zZm9ybWVkIGNvb3JkaW5hdGVzLlxuICAgICAgY29uc3QgeTogbnVtYmVyID0gdGhpcy5fZGV2aWNlVG9TY3JlZW4udHJhbnNmb3JtWShcbiAgICAgICAgLy8gdGhpcy5fdG91Y2hNYW5hZ2VyLmdldFkoKVxuICAgICAgICBwb2ludFkgLy8g5Y6f5Luj56CB5L2/55So5oyJ5LiL5pe255qE5Z2Q5qCH77yM57uP5bi45peg5rOV6Kem5Y+R5Yqo5L2c77yM5pS55Li65L2/55So5by56LW35pe255qE5Z2Q5qCHXG4gICAgICApOyAvLyBMb2dpY2FsIGNvb3JkaW5hdGVzIGdldCBjaGFuZ2VkIGNvb3JkaW5hdGVzLlxuXG4gICAgICBsaXZlMkRNYW5hZ2VyLm9uVGFwKHgsIHkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBYIGNvb3JkaW5hdGVzIHRvIFZpZXcgY29vcmRpbmF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBkZXZpY2VYIERldmljZSBYIGNvb3JkaW5hdGVcbiAgICovXG4gIHB1YmxpYyB0cmFuc2Zvcm1WaWV3WChkZXZpY2VYOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IHNjcmVlblg6IG51bWJlciA9IHRoaXMuX2RldmljZVRvU2NyZWVuLnRyYW5zZm9ybVgoZGV2aWNlWCk7IC8vIOirlueQhuW6p+aomeWkieaPm+OBl+OBn+W6p+aomeOCkuWPluW+l+OAglxuICAgIHJldHVybiB0aGlzLl92aWV3TWF0cml4LmludmVydFRyYW5zZm9ybVgoc2NyZWVuWCk7IC8vIOaLoeWkp+OAgee4ruWwj+OAgeenu+WLleW+jOOBruWApOOAglxuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIFkgY29vcmRpbmF0ZXMgdG8gVmlldyBjb29yZGluYXRlcy5cbiAgICpcbiAgICogQHBhcmFtIGRldmljZVkgRGV2aWNlIHktY29vcmRpbmF0ZVxuICAgKi9cbiAgcHVibGljIHRyYW5zZm9ybVZpZXdZKGRldmljZVk6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3Qgc2NyZWVuWTogbnVtYmVyID0gdGhpcy5fZGV2aWNlVG9TY3JlZW4udHJhbnNmb3JtWShkZXZpY2VZKTsgLy8gTG9naWNhbCBjb29yZGluYXRlcyBnZXQgdGhlIHRyYW5zZm9ybWVkIGNvb3JkaW5hdGVzLlxuICAgIHJldHVybiB0aGlzLl92aWV3TWF0cml4LmludmVydFRyYW5zZm9ybVkoc2NyZWVuWSk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgWCBjb29yZGluYXRlcyB0byBTY3JlZW4gY29vcmRpbmF0ZXMuXG4gICAqIEBwYXJhbSBkZXZpY2VYIERldmljZSBYIGNvb3JkaW5hdGVcbiAgICovXG4gIHB1YmxpYyB0cmFuc2Zvcm1TY3JlZW5YKGRldmljZVg6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2RldmljZVRvU2NyZWVuLnRyYW5zZm9ybVgoZGV2aWNlWCk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgWSBjb29yZGluYXRlcyB0byBTY3JlZW4gY29vcmRpbmF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBkZXZpY2VZIERldmljZSBZIGNvb3JkaW5hdGVcbiAgICovXG4gIHB1YmxpYyB0cmFuc2Zvcm1TY3JlZW5ZKGRldmljZVk6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2RldmljZVRvU2NyZWVuLnRyYW5zZm9ybVkoZGV2aWNlWSk7XG4gIH1cblxuICBfdG91Y2hNYW5hZ2VyOiBUb3VjaE1hbmFnZXI7IC8vIFRvdWNoIG1hbmFnZXJcbiAgX2RldmljZVRvU2NyZWVuOiBDc21fQ3ViaXNtTWF0cml4NDQ7IC8vIE1hdHJpeCBmcm9tIGRldmljZSB0byBzY3JlZW5cbiAgX3ZpZXdNYXRyaXg6IENzbV9DdWJpc21WaWV3TWF0cml4OyAvLyB2aWV3TWF0cml4XG4gIF9wcm9ncmFtSWQ6IFdlYkdMUHJvZ3JhbTsgLy8gU2hlZGEgSURcbiAgX2NoYW5nZU1vZGVsOiBib29sZWFuOyAvLyBNb2RlbCBzd2l0Y2ggZmxhZ1xuICBfaXNDbGljazogYm9vbGVhbjsgLy8gSSdtIGNsaWNraW5nLlxufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQoYykgTGl2ZTJEIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSB0aGUgTGl2ZTJEIE9wZW4gU29mdHdhcmUgbGljZW5zZVxuICogdGhhdCBjYW4gYmUgZm91bmQgYXQgaHR0cHM6Ly93d3cubGl2ZTJkLmNvbS9ldWxhL2xpdmUyZC1vcGVuLXNvZnR3YXJlLWxpY2Vuc2UtYWdyZWVtZW50X2VuLmh0bWwuXG4gKi9cblxuaW1wb3J0IHtMQXBwRGVsZWdhdGV9IGZyb20gJy4vbGFwcGRlbGVnYXRlJztcbmltcG9ydCAqIGFzIExBcHBEZWZpbmUgZnJvbSAnLi9sYXBwZGVmaW5lJztcbmltcG9ydCB7TEFwcExpdmUyRE1hbmFnZXJ9IGZyb20gXCIuL2xhcHBsaXZlMmRtYW5hZ2VyXCI7XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQoJyEhcmF3LWxvYWRlciEuL0NvcmUvbGl2ZTJkY3ViaXNtY29yZS5taW4uanMnKS50aGVuKHJhd01vZHVsZSA9PiBldmFsLmNhbGwobnVsbCwgcmF3TW9kdWxlLmRlZmF1bHQpKTtcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBXaW5kb3cge1xuICAgICAgICBsaXZlMmR2NDogYW55O1xuICAgICAgICBkb3dubG9hZENhcDogYW55O1xuICAgIH1cbn1cbndpbmRvdy5saXZlMmR2NCA9IHdpbmRvdy5saXZlMmR2NCB8fCB7fTtcbndpbmRvdy5saXZlMmR2NC5sb2FkID0gKGNhbnZhc0lkOiBzdHJpbmcsIG1vZGVsUGF0aDogc3RyaW5nLCBtb2RlbEpzb25OYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBMQXBwRGVmaW5lLmRlZmluZURlYnVnKHdpbmRvdy5saXZlMmR2NC5kZWJ1ZyA/IHRydWUgOiBmYWxzZSwgd2luZG93LmxpdmUyZHY0LmRlYnVnTW91c2Vtb3ZlID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICBMQXBwRGVmaW5lLmRlZmluZU1vZGVsUGF0aChtb2RlbFBhdGgsIG1vZGVsSnNvbk5hbWUpO1xuICAgIGlmIChMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5pbml0aWFsaXplKGNhbnZhc0lkKSA9PSBmYWxzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLnJ1bigpO1xufTtcbndpbmRvdy5saXZlMmR2NC5jaGFuZ2UgPSAobW9kZWxQYXRoOiBzdHJpbmcsIG1vZGVsSnNvbk5hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIExBcHBMaXZlMkRNYW5hZ2VyLmdldEluc3RhbmNlKCkuY2hhbmdlU2NlbmUobW9kZWxQYXRoLCBtb2RlbEpzb25OYW1lKTtcbn1cbndpbmRvdy5saXZlMmR2NC5yZWxlYXNlID0gKCk6IHZvaWQgPT4ge1xuICAgIExBcHBEZWxlZ2F0ZS5yZWxlYXNlSW5zdGFuY2UoKTtcbn07XG53aW5kb3cubGl2ZTJkdjQuQ2FwdHVyZUNhbnZhcyA9ICgpOiB2b2lkID0+IHtcbiAgICBMQXBwRGVmaW5lLnNldENhcHR1cmVDYW52YXModHJ1ZSk7XG59O1xud2luZG93LmxpdmUyZHY0LnNldFByZUxvYWRNb3Rpb24gPSAocHJlTG9hZE1vdGlvbjogYm9vbGVhbik6IHZvaWQgPT4ge1xuICAgIExBcHBEZWZpbmUuc2V0UHJlTG9hZE1vdGlvbihwcmVMb2FkTW90aW9uKTtcbn07XG4vKipcbiAqIOmhtemdouWFs+mXrS/ot7Povawv5Yi35paw5pe2XG4gKi9cbndpbmRvdy5vbmJlZm9yZXVubG9hZCA9ICgpOiB2b2lkID0+IExBcHBEZWxlZ2F0ZS5yZWxlYXNlSW5zdGFuY2UoKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=