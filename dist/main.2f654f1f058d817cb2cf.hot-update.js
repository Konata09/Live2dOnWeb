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
        var viewX = this.transformViewX(pointX);
        var viewY = this.transformViewY(pointY);
        var live2DManager = lapplive2dmanager_1.LAppLive2DManager.getInstance();
        LAppDefine.DebugLogEnable &&
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


/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvU0RLdjQvbGFwcGRlbGVnYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9TREt2NC9sYXBwdmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9BLGdKQUcwQztBQUMxQyxJQUFPLG1CQUFtQixHQUFHLDZDQUFxQixDQUFDLGVBQWUsQ0FBQztBQUNuRSxrRkFBc0M7QUFDdEMsK0VBQW9DO0FBQ3BDLGdIQUEwRDtBQUMxRCw2R0FBd0Q7QUFDeEQsb0dBQTJDO0FBRWhDLGNBQU0sR0FBc0IsSUFBSSxDQUFDO0FBQ2pDLGtCQUFVLEdBQWlCLElBQUksQ0FBQztBQUNoQyxVQUFFLEdBQTBCLElBQUksQ0FBQztBQUNqQyxtQkFBVyxHQUFxQixJQUFJLENBQUM7QUFNaEQ7SUF5T0U7UUFDRSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUVwQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksOEJBQVUsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxtQkFBUSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7SUFDbEQsQ0FBQztJQTNPYSx3QkFBVyxHQUF6QjtRQUNFLElBQUksa0JBQVUsSUFBSSxJQUFJLEVBQUU7WUFDdEIsa0JBQVUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1NBQ2pDO1FBRUQsT0FBTyxrQkFBVSxDQUFDO0lBQ3BCLENBQUM7SUFLYSw0QkFBZSxHQUE3QjtRQUNFLElBQUksa0JBQVUsSUFBSSxJQUFJLEVBQUU7WUFDdEIsa0JBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FB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O1lBRUYsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDM0I7SUFDSCxDQUFDO0lBT00saUNBQWMsR0FBckIsVUFBc0IsT0FBZTtRQUNuQyxJQUFNLE9BQU8sR0FBVyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQU9NLGlDQUFjLEdBQXJCLFVBQXNCLE9BQWU7UUFDbkMsSUFBTSxPQUFPLEdBQVcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakUsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFNTSxtQ0FBZ0IsR0FBdkIsVUFBd0IsT0FBZTtRQUNyQyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFPTSxtQ0FBZ0IsR0FBdkIsVUFBd0IsT0FBZTtRQUNyQyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFRSCxlQUFDO0FBQUQsQ0FBQztBQS9MWSw0QkFBUSIsImZpbGUiOiJtYWluLjJmNjU0ZjFmMDU4ZDgxN2NiMmNmLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodChjKSBMaXZlMkQgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IHRoZSBMaXZlMkQgT3BlbiBTb2Z0d2FyZSBsaWNlbnNlXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBhdCBodHRwczovL3d3dy5saXZlMmQuY29tL2V1bGEvbGl2ZTJkLW9wZW4tc29mdHdhcmUtbGljZW5zZS1hZ3JlZW1lbnRfZW4uaHRtbC5cbiAqL1xuXG5pbXBvcnQge1xuICBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgbGl2ZTJkY3ViaXNtZnJhbWV3b3JrLFxuICBPcHRpb24gYXMgQ3NtX09wdGlvblxufSBmcm9tICdAZnJhbWV3b3JrL2xpdmUyZGN1YmlzbWZyYW1ld29yayc7XG5pbXBvcnQgQ3NtX0N1YmlzbUZyYW1ld29yayA9IGxpdmUyZGN1YmlzbWZyYW1ld29yay5DdWJpc21GcmFtZXdvcms7XG5pbXBvcnQgeyBMQXBwVmlldyB9IGZyb20gJy4vbGFwcHZpZXcnO1xuaW1wb3J0IHsgTEFwcFBhbCB9IGZyb20gJy4vbGFwcHBhbCc7XG5pbXBvcnQgeyBMQXBwVGV4dHVyZU1hbmFnZXIgfSBmcm9tICcuL2xhcHB0ZXh0dXJlbWFuYWdlcic7XG5pbXBvcnQgeyBMQXBwTGl2ZTJETWFuYWdlciB9IGZyb20gJy4vbGFwcGxpdmUyZG1hbmFnZXInO1xuaW1wb3J0ICogYXMgTEFwcERlZmluZSBmcm9tICcuL2xhcHBkZWZpbmUnO1xuXG5leHBvcnQgbGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBudWxsO1xuZXhwb3J0IGxldCBzX2luc3RhbmNlOiBMQXBwRGVsZWdhdGUgPSBudWxsO1xuZXhwb3J0IGxldCBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0ID0gbnVsbDtcbmV4cG9ydCBsZXQgZnJhbWVCdWZmZXI6IFdlYkdMRnJhbWVidWZmZXIgPSBudWxsO1xuXG4vKipcbiAqIOW6lOeUqOeoi+W6j+exu1xuICogQ3ViaXNtIFNES+OBrueuoeeQhuOCkuihjOOBhuOAglxuICovXG5leHBvcnQgY2xhc3MgTEFwcERlbGVnYXRlIHtcbiAgLyoqXG4gICAqIOi/lOWbnuexu+WunuS+iyhzaW5ndG9uKeOAglxuICAgKiDlpoLmnpzmsqHmnInnlJ/miJDlrp7kvovvvIzliJnlnKjlhoXpg6jnlJ/miJDlrp7kvovjgIJcbiAgICpcbiAgICogQHJldHVybiDnsbvlrp7kvotcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogTEFwcERlbGVnYXRlIHtcbiAgICBpZiAoc19pbnN0YW5jZSA9PSBudWxsKSB7XG4gICAgICBzX2luc3RhbmNlID0gbmV3IExBcHBEZWxlZ2F0ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBzX2luc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIOmHiuaUvuexu+WunuS+iyhzaW5nbGUgdG9uKVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWxlYXNlSW5zdGFuY2UoKTogdm9pZCB7XG4gICAgaWYgKHNfaW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgc19pbnN0YW5jZS5yZWxlYXNlKCk7XG4gICAgfVxuXG4gICAgc19pbnN0YW5jZSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICog5Yid5aeL5YyWQVBQ6ZyA6KaB55qE5Lic6KW/44CCXG4gICAqL1xuICBwdWJsaWMgaW5pdGlhbGl6ZShjYW52YXNJZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgLy8gR2V0dGluZyBhIGNhbnZhc1xuICAgIGNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCk7XG5cbiAgICAvLyBJbml0aWFsaXplIGdsIGNvbnRleHRcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnKSB8fCBjYW52YXMuZ2V0Q29udGV4dCgnZXhwZXJpbWVudGFsLXdlYmdsJyk7XG5cbiAgICBpZiAoIWdsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdDYW5ub3QgaW5pdGlhbGl6ZSBXZWJHTC4gVGhpcyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQuJyk7XG4gICAgICBnbCA9IG51bGw7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID1cbiAgICAgICAgJ1RoaXMgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHRoZSA8Y29kZT4mbHQ7Y2FudmFzJmd0OzwvY29kZT4gZWxlbWVudC4nO1xuXG4gICAgICAvLyBHbCBpbml0aWFsaXphdGlvbiBmYWlsZWQuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gQWRkIGEgY2FudmFzIHRvIHRoZSBET01cbiAgICAvLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG5cbiAgICBpZiAoIWZyYW1lQnVmZmVyKSB7XG4gICAgICBmcmFtZUJ1ZmZlciA9IGdsLmdldFBhcmFtZXRlcihnbC5GUkFNRUJVRkZFUl9CSU5ESU5HKTtcbiAgICB9XG5cbiAgICAvLyBUcmFuc3BhcmVuY3kgc2V0dGluZ1xuICAgIGdsLmVuYWJsZShnbC5CTEVORCk7XG4gICAgZ2wuYmxlbmRGdW5jKGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSk7XG5cbiAgICBjb25zdCBzdXBwb3J0VG91Y2g6IGJvb2xlYW4gPSAnb250b3VjaGVuZCcgaW4gY2FudmFzO1xuXG4gICAgaWYgKHN1cHBvcnRUb3VjaCkge1xuICAgICAgLy8gVG91Y2ggcmVsYXRlZCBjYWxsYmFjayBmdW5jdGlvbiByZWdpc3RyYXRpb25cbiAgICAgIHdpbmRvdy5vbnRvdWNoc3RhcnQgPSBvblRvdWNoQmVnYW47XG4gICAgICB3aW5kb3cub250b3VjaG1vdmUgPSBvblRvdWNoTW92ZWQ7XG4gICAgICB3aW5kb3cub250b3VjaGVuZCA9IG9uVG91Y2hFbmRlZDtcbiAgICAgIHdpbmRvdy5vbnRvdWNoY2FuY2VsID0gb25Ub3VjaENhbmNlbDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTW91c2UgcmVsYXRlZCBjYWxsYmFjayBmdW5jdGlvbiByZWdpc3RyYXRpb25cbiAgICAgIGNhbnZhcy5vbm1vdXNlZG93biA9IG9uQ2xpY2tCZWdhbjtcbiAgICAgIHdpbmRvdy5vbm1vdXNlbW92ZSA9IG9uTW91c2VNb3ZlZDsgLy8g55uR5ZCs5ZyoIHdpbmRvdyDkuIrvvIzlj6/ku6Xnm5HlkKzmlbTkuKrnqpflj6PlhoXnmoTmjIfpkohcbiAgICAgIHdpbmRvdy5vbm1vdXNlb3V0ID0gb25Nb3VzZUxlYXZlOyAvLyDmjIfpkojnp7vlh7rnqpflj6Pml7ZcbiAgICAgIGNhbnZhcy5vbm1vdXNldXAgPSBvbkNsaWNrRW5kZWQ7XG4gICAgfVxuXG4gICAgLy8gSW5pdGlhbGl6aW5nIEFwcFZpZXdcbiAgICB0aGlzLl92aWV3LmluaXRpYWxpemUoKTtcblxuICAgIC8vIEN1YmlzbSBTREvjga7liJ3mnJ/ljJZcbiAgICB0aGlzLmluaXRpYWxpemVDdWJpc20oKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIOino+aUvuOBmeOCi+OAglxuICAgKi9cbiAgcHVibGljIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgLy8g56e76Zmk55uR5ZCs5Ye95pWwXG4gICAgd2luZG93Lm9udG91Y2hzdGFydCA9IHVuZGVmaW5lZDtcbiAgICB3aW5kb3cub250b3VjaG1vdmUgPSB1bmRlZmluZWQ7XG4gICAgd2luZG93Lm9udG91Y2hlbmQgPSB1bmRlZmluZWQ7XG4gICAgd2luZG93Lm9udG91Y2hjYW5jZWwgPSB1bmRlZmluZWQ7XG4gICAgY2FudmFzLm9ubW91c2Vkb3duID0gdW5kZWZpbmVkO1xuICAgIHdpbmRvdy5vbm1vdXNlbW92ZSA9IHVuZGVmaW5lZDtcbiAgICB3aW5kb3cub25tb3VzZW91dCA9IHVuZGVmaW5lZDtcbiAgICBjYW52YXMub25tb3VzZXVwID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5fdGV4dHVyZU1hbmFnZXIucmVsZWFzZSgpO1xuICAgIHRoaXMuX3RleHR1cmVNYW5hZ2VyID0gbnVsbDtcblxuICAgIHRoaXMuX3ZpZXcucmVsZWFzZSgpO1xuICAgIHRoaXMuX3ZpZXcgPSBudWxsO1xuXG4gICAgLy8gRnJlZSB1cCByZXNvdXJjZXNcbiAgICBMQXBwTGl2ZTJETWFuYWdlci5yZWxlYXNlSW5zdGFuY2UoKTtcblxuICAgIC8vIEN1YmlzbSBTREvjga7op6PmlL5cbiAgICBDc21fQ3ViaXNtRnJhbWV3b3JrLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRpb24gcHJvY2Vzc2luZ1xuICAgKi9cbiAgcHVibGljIHJ1bigpOiB2b2lkIHtcbiAgICAvLyBNYWluIGxvb3BcbiAgICBjb25zdCBsb29wID0gKCk6IHZvaWQgPT4ge1xuICAgICAgLy8gQ2hlY2tpbmcgdGhlIHByZXNlbmNlIG9yIGFic2VuY2Ugb2YgaW5zdGFuY2VzXG4gICAgICBpZiAoc19pbnN0YW5jZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8g5pmC6ZaT5pu05pawXG4gICAgICBMQXBwUGFsLnVwZGF0ZVRpbWUoKTtcblxuICAgICAgLy8g55S76Z2i44Gu5Yid5pyf5YyWXG4gICAgICBnbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDAuMCk7XG5cbiAgICAgIC8vIEFjdGl2YXRlIGRlcHRoIHRlc3RpbmcuXG4gICAgICBnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7XG5cbiAgICAgIC8vIFRoZSBuZWFyZXN0IG9iamVjdCBvYnNjdXJlcyB0aGUgZGlzdGFudCBvYmplY3RcbiAgICAgIGdsLmRlcHRoRnVuYyhnbC5MRVFVQUwpO1xuXG4gICAgICAvLyBDbGVhciBjb2xvciBhbmQgZGVwdGggYnVmZmVyc1xuICAgICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xuXG4gICAgICBnbC5jbGVhckRlcHRoKDEuMCk7XG5cbiAgICAgIC8vIOmAj+mBjuioreWumlxuICAgICAgZ2wuZW5hYmxlKGdsLkJMRU5EKTtcbiAgICAgIGdsLmJsZW5kRnVuYyhnbC5TUkNfQUxQSEEsIGdsLk9ORV9NSU5VU19TUkNfQUxQSEEpO1xuXG4gICAgICAvLyDmj4/nlLvmm7TmlrBcbiAgICAgIHRoaXMuX3ZpZXcucmVuZGVyKCk7XG5cbiAgICAgIC8vIOajgOafpeaYr+WQpuaIquWbvlxuICAgICAgaWYoTEFwcERlZmluZS5jYXB0dXJlQ2FudmFzKXtcbiAgICAgICAgTEFwcERlZmluZS5zZXRDYXB0dXJlQ2FudmFzKGZhbHNlKTtcbiAgICAgICAgY2FudmFzLnRvQmxvYih3aW5kb3cuZG93bmxvYWRDYXApO1xuICAgICAgfVxuICAgICAgLy8gUmVjdXJzaXZlIGNhbGwgZm9yIHRoZSBsb29wXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgfTtcbiAgICBsb29wKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgdGhlIHNoYWRlci5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVTaGFkZXIoKTogV2ViR0xQcm9ncmFtIHtcbiAgICAvLyDjg5Djg7zjg4bjg4Pjgq/jgrnjgrfjgqfjg7zjg4Djg7zjga7jgrPjg7Pjg5HjgqTjg6tcbiAgICBjb25zdCB2ZXJ0ZXhTaGFkZXJJZCA9IGdsLmNyZWF0ZVNoYWRlcihnbC5WRVJURVhfU0hBREVSKTtcblxuICAgIGlmICh2ZXJ0ZXhTaGFkZXJJZCA9PSBudWxsKSB7XG4gICAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgnZmFpbGVkIHRvIGNyZWF0ZSB2ZXJ0ZXhTaGFkZXInKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHZlcnRleFNoYWRlcjogc3RyaW5nID1cbiAgICAgICdwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDsnICtcbiAgICAgICdhdHRyaWJ1dGUgdmVjMyBwb3NpdGlvbjsnICtcbiAgICAgICdhdHRyaWJ1dGUgdmVjMiB1djsnICtcbiAgICAgICd2YXJ5aW5nIHZlYzIgdnV2OycgK1xuICAgICAgJ3ZvaWQgbWFpbih2b2lkKScgK1xuICAgICAgJ3snICtcbiAgICAgICcgICBnbF9Qb3NpdGlvbiA9IHZlYzQocG9zaXRpb24sIDEuMCk7JyArXG4gICAgICAnICAgdnV2ID0gdXY7JyArXG4gICAgICAnfSc7XG5cbiAgICBnbC5zaGFkZXJTb3VyY2UodmVydGV4U2hhZGVySWQsIHZlcnRleFNoYWRlcik7XG4gICAgZ2wuY29tcGlsZVNoYWRlcih2ZXJ0ZXhTaGFkZXJJZCk7XG5cbiAgICAvLyBDb21waWxpbmcgZnJhZ21lbnQgc2hhZGVyc1xuICAgIGNvbnN0IGZyYWdtZW50U2hhZGVySWQgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuRlJBR01FTlRfU0hBREVSKTtcblxuICAgIGlmIChmcmFnbWVudFNoYWRlcklkID09IG51bGwpIHtcbiAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCdmYWlsZWQgdG8gY3JlYXRlIGZyYWdtZW50U2hhZGVyJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBmcmFnbWVudFNoYWRlcjogc3RyaW5nID1cbiAgICAgICdwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDsnICtcbiAgICAgICd2YXJ5aW5nIHZlYzIgdnV2OycgK1xuICAgICAgJ3VuaWZvcm0gc2FtcGxlcjJEIHRleHR1cmU7JyArXG4gICAgICAndm9pZCBtYWluKHZvaWQpJyArXG4gICAgICAneycgK1xuICAgICAgJyAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh0ZXh0dXJlLCB2dXYpOycgK1xuICAgICAgJ30nO1xuXG4gICAgZ2wuc2hhZGVyU291cmNlKGZyYWdtZW50U2hhZGVySWQsIGZyYWdtZW50U2hhZGVyKTtcbiAgICBnbC5jb21waWxlU2hhZGVyKGZyYWdtZW50U2hhZGVySWQpO1xuXG4gICAgLy8gQ3JlYXRpbmcgcHJvZ3JhbSBvYmplY3RzXG4gICAgY29uc3QgcHJvZ3JhbUlkID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtSWQsIHZlcnRleFNoYWRlcklkKTtcbiAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbUlkLCBmcmFnbWVudFNoYWRlcklkKTtcblxuICAgIGdsLmRlbGV0ZVNoYWRlcih2ZXJ0ZXhTaGFkZXJJZCk7XG4gICAgZ2wuZGVsZXRlU2hhZGVyKGZyYWdtZW50U2hhZGVySWQpO1xuXG4gICAgLy8gTGlua1xuICAgIGdsLmxpbmtQcm9ncmFtKHByb2dyYW1JZCk7XG5cbiAgICBnbC51c2VQcm9ncmFtKHByb2dyYW1JZCk7XG5cbiAgICByZXR1cm4gcHJvZ3JhbUlkO1xuICB9XG5cbiAgLyoqXG4gICAqIFZpZXcgaW5mb3JtYXRpb24uXG4gICAqL1xuICBwdWJsaWMgZ2V0VmlldygpOiBMQXBwVmlldyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZpZXc7XG4gIH1cblxuICBwdWJsaWMgZ2V0VGV4dHVyZU1hbmFnZXIoKTogTEFwcFRleHR1cmVNYW5hZ2VyIHtcbiAgICByZXR1cm4gdGhpcy5fdGV4dHVyZU1hbmFnZXI7XG4gIH1cblxuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2NhcHR1cmVkID0gZmFsc2U7XG4gICAgdGhpcy5fbW91c2VYID0gMC4wO1xuICAgIHRoaXMuX21vdXNlWSA9IDAuMDtcbiAgICB0aGlzLl9pc0VuZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5fY3ViaXNtT3B0aW9uID0gbmV3IENzbV9PcHRpb24oKTtcbiAgICB0aGlzLl92aWV3ID0gbmV3IExBcHBWaWV3KCk7XG4gICAgdGhpcy5fdGV4dHVyZU1hbmFnZXIgPSBuZXcgTEFwcFRleHR1cmVNYW5hZ2VyKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3ViaXNtIFNES+OBruWIneacn+WMllxuICAgKi9cbiAgcHVibGljIGluaXRpYWxpemVDdWJpc20oKTogdm9pZCB7XG4gICAgLy8gc2V0dXAgY3ViaXNtXG4gICAgdGhpcy5fY3ViaXNtT3B0aW9uLmxvZ0Z1bmN0aW9uID0gTEFwcFBhbC5wcmludE1lc3NhZ2U7XG4gICAgdGhpcy5fY3ViaXNtT3B0aW9uLmxvZ2dpbmdMZXZlbCA9IExBcHBEZWZpbmUuQ3ViaXNtTG9nZ2luZ0xldmVsO1xuICAgIENzbV9DdWJpc21GcmFtZXdvcmsuc3RhcnRVcCh0aGlzLl9jdWJpc21PcHRpb24pO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBjdWJpc21cbiAgICBDc21fQ3ViaXNtRnJhbWV3b3JrLmluaXRpYWxpemUoKTtcblxuICAgIC8vIGxvYWQgbW9kZWxcbiAgICBMQXBwTGl2ZTJETWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuXG4gICAgTEFwcFBhbC51cGRhdGVUaW1lKCk7XG5cbiAgICB0aGlzLl92aWV3LmluaXRpYWxpemVTcHJpdGUoKTtcbiAgfVxuXG4gIF9jdWJpc21PcHRpb246IENzbV9PcHRpb247IC8vIEN1YmlzbSBTREsgT3B0aW9uXG4gIF92aWV3OiBMQXBwVmlldzsgLy8gVmlld+aDheWgsVxuICBfY2FwdHVyZWQ6IGJvb2xlYW47IC8vIEFyZSB5b3UgY2xpY2tpbmcgb24gaXQ/XG4gIF9tb3VzZVg6IG51bWJlcjsgLy8gTW91c2UgeC1jb29yZGluYXRlXG4gIF9tb3VzZVk6IG51bWJlcjsgLy8gTW91c2UgeS1jb29yZGluYXRlXG4gIF9pc0VuZDogYm9vbGVhbjsgLy8gSXMgdGhlIEFQUCBjbG9zZWQ/XG4gIF90ZXh0dXJlTWFuYWdlcjogTEFwcFRleHR1cmVNYW5hZ2VyOyAvLyBUZXh0dXJlIG1hbmFnZXJcbn1cblxuLyoqXG4gKiBDYWxsZWQgd2hlbiBjbGlja2VkLlxuICovXG5mdW5jdGlvbiBvbkNsaWNrQmVnYW4oZTogTW91c2VFdmVudCk6IHZvaWQge1xuICBpZiAoIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3KSB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ3ZpZXcgbm90Zm91bmQnKTtcbiAgICByZXR1cm47XG4gIH1cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX2NhcHR1cmVkID0gdHJ1ZTtcblxuICBjb25zdCBwb3NYOiBudW1iZXIgPSBlLnBhZ2VYO1xuICBjb25zdCBwb3NZOiBudW1iZXIgPSBlLnBhZ2VZO1xuXG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Lm9uVG91Y2hlc0JlZ2FuKHBvc1gsIHBvc1kpO1xufVxuXG4vKipcbiAqIElmIHRoZSBtb3VzZSBwb2ludGVyIG1vdmVzLCBpdCBpcyBjYWxsZWQuXG4gKi9cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlZChlOiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gIC8vIOm7mOiupOmcgOimgeWQjOaXtuaMieS4i+m8oOagh+aJjeiDvei3n+i4qiDms6jph4rmjolcbiAgLy8gaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fY2FwdHVyZWQpIHtcbiAgLy8gICByZXR1cm47XG4gIC8vIH1cblxuICBpZiAoXG4gICAgIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3IHx8XG4gICAgIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Ll9wcm9ncmFtSWRcbiAgKSB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ3ZpZXcgbm90Zm91bmQnKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gRE9NUmVjdCDlr7nosaHvvIx0b3DjgIFsZWZ0IOihqOekuuWFg+e0oChjYW52YXMp5bem5LiK6KeS5Yiw6KeG5Y+j5bem5LiK6KeS55qE6Led56a777yMYm90dG9t44CBcmlnaHTooajnpLrlhYPntKDlj7PkuIvop5LliLDop4blj6Plt6bkuIrop5LnmoTot53nprtcbiAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgLy8g6L+Z6YeM55qEIGUudGFyZ2V0IOaYryB3aW5kb3dcbiAgLy8gTW91c2VFdmVudCDlr7nosaHvvIxjbGllbnRY44CBY2xpZW50WeWIhuWIq+aYr+m8oOagh+eCueWHu+S9jee9ruWcqOinhuWPo+S4reeahFjjgIFZ5Z2Q5qCHXG4gIGNvbnN0IHBvc1g6IG51bWJlciA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgY29uc3QgcG9zWTogbnVtYmVyID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcub25Ub3VjaGVzTW92ZWQocG9zWCwgcG9zWSk7XG59XG5cbi8qKlxuICog5oyH6ZKI56e75Ye656qX5Y+j5pe25oGi5aSN6buY6K6k5ae/5oCBXG4gKi9cbmZ1bmN0aW9uIG9uTW91c2VMZWF2ZSgpOiB2b2lkIHtcbiAgTEFwcERlZmluZS5EZWJ1Z0xvZ0VuYWJsZSAmJiBMQXBwUGFsLnByaW50TWVzc2FnZSgnW0xpdmUyRHY0XSBvbk1vdXNlTGVhdmUnKTtcbiAgaWYgKFxuICAgICFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldyB8fFxuICAgICFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5fcHJvZ3JhbUlkXG4gICkge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCd2aWV3IG5vdGZvdW5kJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGxpdmUyRE1hbmFnZXI6IExBcHBMaXZlMkRNYW5hZ2VyID0gTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcbiAgbGl2ZTJETWFuYWdlci5vbkRyYWcoMC4wLCAwLjApO1xufVxuXG4vKipcbiAqIENhbGwgd2hlbiB0aGUgY2xpY2sgaXMgZmluaXNoZWQuXG4gKi9cbmZ1bmN0aW9uIG9uQ2xpY2tFbmRlZChlOiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl9jYXB0dXJlZCA9IGZhbHNlO1xuICBpZiAoXG4gICAgIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3IHx8XG4gICAgIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Ll9wcm9ncmFtSWRcbiAgKSB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ3ZpZXcgbm90Zm91bmQnKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gRE9NUmVjdCDlr7nosaHvvIx0b3DjgIFsZWZ0IOihqOekuuWFg+e0oCjov5nph4zmmK9jYW52YXMp5bem5LiK6KeS5Yiw6KeG5Y+j5bem5LiK6KeS55qE6Led56a777yMYm90dG9t44CBcmlnaHTooajnpLrlhYPntKDlj7PkuIvop5LliLDop4blj6Plt6bkuIrop5LnmoTot53nprtcbiAgY29uc3QgcmVjdCA9IChlLnRhcmdldCBhcyBFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgLy8gTW91c2VFdmVudCDlr7nosaHvvIxjbGllbnRY44CBY2xpZW50WeWIhuWIq+aYr+m8oOagh+eCueWHu+S9jee9ruWcqOinhuWPo+S4reeahFjjgIFZ5Z2Q5qCHXG4gIGNvbnN0IHBvc1g6IG51bWJlciA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgY29uc3QgcG9zWTogbnVtYmVyID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG4gIGlmIChMQXBwRGVmaW5lLkRlYnVnTG9nRW5hYmxlKSB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoXG4gICAgICBgW0xpdmUyRHY0XSBvbkNsaWNrRW5kZWQ6XG4gICAgICAgcmVjdCBsZWZ0OiAke3JlY3QubGVmdC50b0ZpeGVkKDIpfSByZWN0IHRvcDogJHtyZWN0LnRvcC50b0ZpeGVkKDIpfVxuICAgICAgIGNsaWVudFg6ICR7ZS5jbGllbnRYLnRvRml4ZWQoMil9IGNsaWVudFk6ICR7ZS5jbGllbnRZLnRvRml4ZWQoMil9YFxuICAgICk7XG4gIH1cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcub25Ub3VjaGVzRW5kZWQocG9zWCwgcG9zWSk7XG59XG5cbi8qKlxuICogSXQgaXMgY2FsbGVkIHdoZW4gdG91Y2hlZC5cbiAqL1xuZnVuY3Rpb24gb25Ub3VjaEJlZ2FuKGU6IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldykge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCd2aWV3IG5vdGZvdW5kJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX2NhcHR1cmVkID0gdHJ1ZTtcblxuICAvLyBET01SZWN0IOWvueixoe+8jHRvcOOAgWxlZnQg6KGo56S65YWD57SgKGNhbnZhcynlt6bkuIrop5LliLDop4blj6Plt6bkuIrop5LnmoTot53nprvvvIxib3R0b23jgIFyaWdodOihqOekuuWFg+e0oOWPs+S4i+inkuWIsOinhuWPo+W3puS4iuinkueahOi3neemu1xuICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAvLyDov5nph4znmoQgZS50YXJnZXQg5pivIHdpbmRvd1xuICAvLyBNb3VzZUV2ZW50IOWvueixoe+8jGNsaWVudFjjgIFjbGllbnRZ5YiG5Yir5piv6byg5qCH54K55Ye75L2N572u5Zyo6KeG5Y+j5Lit55qEWOOAgVnlnZDmoIdcbiAgY29uc3QgcG9zWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgY29uc3QgcG9zWSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSAtIHJlY3QudG9wO1xuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5vblRvdWNoZXNNb3ZlZChwb3NYLCBwb3NZKTtcblxuICAvLyBjb25zdCBwb3NYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcbiAgLy8gY29uc3QgcG9zWSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVk7XG4gIC8vXG4gIC8vIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Lm9uVG91Y2hlc0JlZ2FuKHBvc1gsIHBvc1kpO1xufVxuXG4vKipcbiAqIFRoaXMgaXMgY2FsbGVkIHN3aXBpbmcuXG4gKi9cbmZ1bmN0aW9uIG9uVG91Y2hNb3ZlZChlOiBUb3VjaEV2ZW50KTogdm9pZCB7XG4gIC8vIGlmICghTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX2NhcHR1cmVkKSB7XG4gIC8vICAgcmV0dXJuO1xuICAvLyB9XG5cbiAgaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldykge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCd2aWV3IG5vdGZvdW5kJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRE9NUmVjdCDlr7nosaHvvIx0b3DjgIFsZWZ0IOihqOekuuWFg+e0oChjYW52YXMp5bem5LiK6KeS5Yiw6KeG5Y+j5bem5LiK6KeS55qE6Led56a777yMYm90dG9t44CBcmlnaHTooajnpLrlhYPntKDlj7PkuIvop5LliLDop4blj6Plt6bkuIrop5LnmoTot53nprtcbiAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgLy8g6L+Z6YeM55qEIGUudGFyZ2V0IOaYryB3aW5kb3dcbiAgLy8gTW91c2VFdmVudCDlr7nosaHvvIxjbGllbnRY44CBY2xpZW50WeWIhuWIq+aYr+m8oOagh+eCueWHu+S9jee9ruWcqOinhuWPo+S4reeahFjjgIFZ5Z2Q5qCHXG4gIGNvbnN0IHBvc1ggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gIGNvbnN0IHBvc1kgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSByZWN0LnRvcDtcblxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5vblRvdWNoZXNNb3ZlZChwb3NYLCBwb3NZKTtcbn1cblxuLyoqXG4gKiBJdCBpcyBjYWxsZWQgd2hlbiB0aGUgdG91Y2ggaXMgZmluaXNoZWQuXG4gKi9cbmZ1bmN0aW9uIG9uVG91Y2hFbmRlZChlOiBUb3VjaEV2ZW50KTogdm9pZCB7XG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl9jYXB0dXJlZCA9IGZhbHNlO1xuXG4gIGlmICghTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcpIHtcbiAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgndmlldyBub3Rmb3VuZCcpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBsaXZlMkRNYW5hZ2VyOiBMQXBwTGl2ZTJETWFuYWdlciA9IExBcHBMaXZlMkRNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG4gIGxpdmUyRE1hbmFnZXIub25EcmFnKDAuMCwgMC4wKTtcblxuICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gIGNvbnN0IHBvc1ggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gIGNvbnN0IHBvc1kgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSByZWN0LnRvcDtcblxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5vblRvdWNoZXNFbmRlZChwb3NYLCBwb3NZKTtcbn1cblxuLyoqXG4gKiBUb3VjaCBpcyBjYWxsZWQgY2FuY2VsZWQuXG4gKi9cbmZ1bmN0aW9uIG9uVG91Y2hDYW5jZWwoZTogVG91Y2hFdmVudCk6IHZvaWQge1xuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fY2FwdHVyZWQgPSBmYWxzZTtcblxuICBpZiAoIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3KSB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ3ZpZXcgbm90Zm91bmQnKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgbGl2ZTJETWFuYWdlcjogTEFwcExpdmUyRE1hbmFnZXIgPSBMQXBwTGl2ZTJETWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuICBsaXZlMkRNYW5hZ2VyLm9uRHJhZygwLjAsIDAuMCk7XG5cbiAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICBjb25zdCBwb3NYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICBjb25zdCBwb3NZID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcub25Ub3VjaGVzRW5kZWQocG9zWCwgcG9zWSk7XG59XG4iLCIvKipcbiAqIENvcHlyaWdodChjKSBMaXZlMkQgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IHRoZSBMaXZlMkQgT3BlbiBTb2Z0d2FyZSBsaWNlbnNlXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBhdCBodHRwczovL3d3dy5saXZlMmQuY29tL2V1bGEvbGl2ZTJkLW9wZW4tc29mdHdhcmUtbGljZW5zZS1hZ3JlZW1lbnRfZW4uaHRtbC5cbiAqL1xuXG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtTWF0cml4NDQgfSBmcm9tICdAZnJhbWV3b3JrL21hdGgvY3ViaXNtbWF0cml4NDQnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbXZpZXdtYXRyaXggfSBmcm9tICdAZnJhbWV3b3JrL21hdGgvY3ViaXNtdmlld21hdHJpeCc7XG5pbXBvcnQgQ3NtX0N1YmlzbVZpZXdNYXRyaXggPSBjdWJpc212aWV3bWF0cml4LkN1YmlzbVZpZXdNYXRyaXg7XG5pbXBvcnQgQ3NtX0N1YmlzbU1hdHJpeDQ0ID0gY3ViaXNtTWF0cml4NDQuQ3ViaXNtTWF0cml4NDQ7XG5pbXBvcnQgeyBUb3VjaE1hbmFnZXIgfSBmcm9tICcuL3RvdWNobWFuYWdlcic7XG5pbXBvcnQgeyBMQXBwTGl2ZTJETWFuYWdlciB9IGZyb20gJy4vbGFwcGxpdmUyZG1hbmFnZXInO1xuaW1wb3J0IHsgTEFwcERlbGVnYXRlLCBjYW52YXMsIGdsIH0gZnJvbSAnLi9sYXBwZGVsZWdhdGUnO1xuaW1wb3J0IHsgTEFwcFNwcml0ZSB9IGZyb20gJy4vbGFwcHNwcml0ZSc7XG5pbXBvcnQgeyBUZXh0dXJlSW5mbyB9IGZyb20gJy4vbGFwcHRleHR1cmVtYW5hZ2VyJztcbmltcG9ydCB7IExBcHBQYWwgfSBmcm9tICcuL2xhcHBwYWwnO1xuaW1wb3J0ICogYXMgTEFwcERlZmluZSBmcm9tICcuL2xhcHBkZWZpbmUnO1xuXG4vKipcbiAqIERyYXdpbmcgY2xhc3Nlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIExBcHBWaWV3IHtcbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9wcm9ncmFtSWQgPSBudWxsO1xuXG4gICAgLy8gVG91Y2ggcmVsYXRlZCBldmVudCBtYW5hZ2VtZW50XG4gICAgdGhpcy5fdG91Y2hNYW5hZ2VyID0gbmV3IFRvdWNoTWFuYWdlcigpO1xuXG4gICAgLy8gRm9yIGNvbnZlcnRpbmcgZGV2aWNlIGNvb3JkaW5hdGVzIHRvIHNjcmVlbiBjb29yZGluYXRlc1xuICAgIHRoaXMuX2RldmljZVRvU2NyZWVuID0gbmV3IENzbV9DdWJpc21NYXRyaXg0NCgpO1xuXG4gICAgLy8gTWF0cml4IGZvciBzY2FsaW5nIGFuZCBzaGlmdGluZyB0aGUgZGlzcGxheVxuICAgIHRoaXMuX3ZpZXdNYXRyaXggPSBuZXcgQ3NtX0N1YmlzbVZpZXdNYXRyaXgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplXG4gICAqL1xuICBwdWJsaWMgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGNhbnZhcztcblxuICAgIGNvbnN0IHJhdGlvOiBudW1iZXIgPSBoZWlnaHQgLyB3aWR0aDtcbiAgICBjb25zdCBsZWZ0OiBudW1iZXIgPSBMQXBwRGVmaW5lLlZpZXdMb2dpY2FsTGVmdDtcbiAgICBjb25zdCByaWdodDogbnVtYmVyID0gTEFwcERlZmluZS5WaWV3TG9naWNhbFJpZ2h0O1xuICAgIGNvbnN0IGJvdHRvbTogbnVtYmVyID0gLXJhdGlvO1xuICAgIGNvbnN0IHRvcDogbnVtYmVyID0gcmF0aW87XG5cbiAgICAvLyBSYW5nZSBvZiBzY3JlZW4gY29ycmVzcG9uZGluZyB0byB0aGUgZGV2aWNlLlRoZSBsZWZ0IGVuZCBvZiBYLCB0aGUgcmlnaHQgZW5kIG9mIFgsIHRoZSBib3R0b20gZW5kIG9mIFksIHRoZSB0b3AgZW5kIG9mIFlcbiAgICB0aGlzLl92aWV3TWF0cml4LnNldFNjcmVlblJlY3QobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wKTtcblxuICAgIGNvbnN0IHNjcmVlblc6IG51bWJlciA9IE1hdGguYWJzKGxlZnQgLSByaWdodCk7XG4gICAgdGhpcy5fZGV2aWNlVG9TY3JlZW4uc2NhbGVSZWxhdGl2ZShzY3JlZW5XIC8gd2lkdGgsIC1zY3JlZW5XIC8gd2lkdGgpO1xuICAgIHRoaXMuX2RldmljZVRvU2NyZWVuLnRyYW5zbGF0ZVJlbGF0aXZlKC13aWR0aCAqIDAuNSwgLWhlaWdodCAqIDAuNSk7XG5cbiAgICAvLyBTZXR0aW5nIHRoZSBkaXNwbGF5IHJhbmdlXG4gICAgdGhpcy5fdmlld01hdHJpeC5zZXRNYXhTY2FsZShMQXBwRGVmaW5lLlZpZXdNYXhTY2FsZSk7IC8vIOmZkOeVjOaLoeW8teeOh1xuICAgIHRoaXMuX3ZpZXdNYXRyaXguc2V0TWluU2NhbGUoTEFwcERlZmluZS5WaWV3TWluU2NhbGUpOyAvLyDpmZDnlYznuK7lsI/njodcblxuICAgIC8vIE1heGltdW0gcmFuZ2UgdGhhdCBjYW4gYmUgZGlzcGxheWVkXG4gICAgdGhpcy5fdmlld01hdHJpeC5zZXRNYXhTY3JlZW5SZWN0KFxuICAgICAgTEFwcERlZmluZS5WaWV3TG9naWNhbE1heExlZnQsXG4gICAgICBMQXBwRGVmaW5lLlZpZXdMb2dpY2FsTWF4UmlnaHQsXG4gICAgICBMQXBwRGVmaW5lLlZpZXdMb2dpY2FsTWF4Qm90dG9tLFxuICAgICAgTEFwcERlZmluZS5WaWV3TG9naWNhbE1heFRvcFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICog6Kej5pS+44GZ44KLXG4gICAqL1xuICBwdWJsaWMgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICB0aGlzLl92aWV3TWF0cml4ID0gbnVsbDtcbiAgICB0aGlzLl90b3VjaE1hbmFnZXIgPSBudWxsO1xuICAgIHRoaXMuX2RldmljZVRvU2NyZWVuID0gbnVsbDtcblxuICAgIGdsLmRlbGV0ZVByb2dyYW0odGhpcy5fcHJvZ3JhbUlkKTtcbiAgICB0aGlzLl9wcm9ncmFtSWQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIOaPj+eUu+OBmeOCi+OAglxuICAgKi9cbiAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcbiAgICBnbC51c2VQcm9ncmFtKHRoaXMuX3Byb2dyYW1JZCk7XG5cbiAgICBnbC5mbHVzaCgpO1xuXG4gICAgY29uc3QgbGl2ZTJETWFuYWdlcjogTEFwcExpdmUyRE1hbmFnZXIgPSBMQXBwTGl2ZTJETWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuXG4gICAgbGl2ZTJETWFuYWdlci5vblVwZGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGltYWdlLlxuICAgKi9cbiAgcHVibGljIGluaXRpYWxpemVTcHJpdGUoKTogdm9pZCB7XG4gICAgY29uc3Qgd2lkdGg6IG51bWJlciA9IGNhbnZhcy53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQ6IG51bWJlciA9IGNhbnZhcy5oZWlnaHQ7XG5cbiAgICBjb25zdCB0ZXh0dXJlTWFuYWdlciA9IExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLmdldFRleHR1cmVNYW5hZ2VyKCk7XG5cbiAgICAvLyBDcmVhdGUgYSBzaGFkZXIuXG4gICAgaWYgKHRoaXMuX3Byb2dyYW1JZCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9wcm9ncmFtSWQgPSBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5jcmVhdGVTaGFkZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSXQgaXMgY2FsbGVkIHdoZW4gaXQgaXMgdG91Y2hlZC5cbiAgICpcbiAgICogQHBhcmFtIHBvaW50WCBTY3JlZW4geC1jb29yZGluYXRlc1xuICAgKiBAcGFyYW0gcG9pbnRZIFNjcmVlbiB5LWNvb3JkaW5hdGVzXG4gICAqL1xuICBwdWJsaWMgb25Ub3VjaGVzQmVnYW4ocG9pbnRYOiBudW1iZXIsIHBvaW50WTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5fdG91Y2hNYW5hZ2VyLnRvdWNoZXNCZWdhbihwb2ludFgsIHBvaW50WSk7XG4gIH1cblxuICAvKipcbiAgICogV2hlbiB0aGUgZmluZ2VyIGlzIHRvdWNoZWQsIGl0IGlzIGNhbGxlZC5cbiAgICpcbiAgICogQHBhcmFtIHBvaW50WCBTY3JlZW4gWCBjb29yZGluYXRlc1xuICAgKiBAcGFyYW0gcG9pbnRZIFNjcmVlbiBZIGNvb3JkaW5hdGVzXG4gICAqL1xuICBwdWJsaWMgb25Ub3VjaGVzTW92ZWQocG9pbnRYOiBudW1iZXIsIHBvaW50WTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gY29uc3Qgdmlld1g6IG51bWJlciA9IHRoaXMudHJhbnNmb3JtVmlld1godGhpcy5fdG91Y2hNYW5hZ2VyLmdldFgoKSk7XG4gICAgY29uc3Qgdmlld1g6IG51bWJlciA9IHRoaXMudHJhbnNmb3JtVmlld1gocG9pbnRYKTtcbiAgICAvLyBjb25zdCB2aWV3WTogbnVtYmVyID0gdGhpcy50cmFuc2Zvcm1WaWV3WSh0aGlzLl90b3VjaE1hbmFnZXIuZ2V0WSgpKTtcbiAgICBjb25zdCB2aWV3WTogbnVtYmVyID0gdGhpcy50cmFuc2Zvcm1WaWV3WShwb2ludFkpO1xuICAgIC8vIHRoaXMuX3RvdWNoTWFuYWdlci50b3VjaGVzTW92ZWQocG9pbnRYLCBwb2ludFkpO1xuXG4gICAgY29uc3QgbGl2ZTJETWFuYWdlcjogTEFwcExpdmUyRE1hbmFnZXIgPSBMQXBwTGl2ZTJETWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuICAgIExBcHBEZWZpbmUuRGVidWdMb2dFbmFibGUgJiZcbiAgICAgIC8vIExBcHBEZWZpbmUuRGVidWdUb3VjaExvZ0VuYWJsZSAmJlxuICAgICAgY29uc29sZS5sb2coYFtMaXZlMkR2NF0gcG9pbnRYOiAke3BvaW50WH0gcG9pbnRZOiAke3BvaW50WX1cbiAgICAgICAgICB2aWV3WDogJHt2aWV3WH0gdmlld1k6ICR7dmlld1l9YCk7XG4gICAgbGl2ZTJETWFuYWdlci5vbkRyYWcodmlld1gsIHZpZXdZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCBpcyBjYWxsZWQgd2hlbiB0aGUgdG91Y2ggaXMgZmluaXNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSBwb2ludFggU2NyZWVuIFggY29vcmRpbmF0ZXNcbiAgICogQHBhcmFtIHBvaW50WSBTY3JlZW4gWSBjb29yZGluYXRlc1xuICAgKi9cbiAgcHVibGljIG9uVG91Y2hlc0VuZGVkKHBvaW50WDogbnVtYmVyLCBwb2ludFk6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIFRvdWNoIGRvbmUuXG4gICAgY29uc3QgbGl2ZTJETWFuYWdlcjogTEFwcExpdmUyRE1hbmFnZXIgPSBMQXBwTGl2ZTJETWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuICAgIC8vIGxpdmUyRE1hbmFnZXIub25EcmFnKDAuMCwgMC4wKTtcbiAgICB7XG4gICAgICBpZiAoTEFwcERlZmluZS5EZWJ1Z0xvZ0VuYWJsZSkge1xuICAgICAgICBMQXBwUGFsLnByaW50TWVzc2FnZShgW0xpdmUyRHY0XSB0b3VjaGVzRW5kZWQgeDogJHtwb2ludFh9IHk6ICR7cG9pbnRZfWApO1xuICAgICAgfVxuICAgICAgLy8gU2luZ2xlIHRhcFxuICAgICAgY29uc3QgeDogbnVtYmVyID0gdGhpcy5fZGV2aWNlVG9TY3JlZW4udHJhbnNmb3JtWChcbiAgICAgICAgLy8gdGhpcy5fdG91Y2hNYW5hZ2VyLmdldFgoKVxuICAgICAgICBwb2ludFggLy8g5Y6f5Luj56CB5L2/55So5oyJ5LiL5pe255qE5Z2Q5qCH77yM57uP5bi45peg5rOV6Kem5Y+R5Yqo5L2c77yM5pS55Li65L2/55So5by56LW35pe255qE5Z2Q5qCHXG4gICAgICApOyAvLyBMb2dpY2FsIGNvb3JkaW5hdGVzIGdldCB0aGUgdHJhbnNmb3JtZWQgY29vcmRpbmF0ZXMuXG4gICAgICBjb25zdCB5OiBudW1iZXIgPSB0aGlzLl9kZXZpY2VUb1NjcmVlbi50cmFuc2Zvcm1ZKFxuICAgICAgICAvLyB0aGlzLl90b3VjaE1hbmFnZXIuZ2V0WSgpXG4gICAgICAgIHBvaW50WSAvLyDljp/ku6PnoIHkvb/nlKjmjInkuIvml7bnmoTlnZDmoIfvvIznu4/luLjml6Dms5Xop6blj5HliqjkvZzvvIzmlLnkuLrkvb/nlKjlvLnotbfml7bnmoTlnZDmoIdcbiAgICAgICk7IC8vIExvZ2ljYWwgY29vcmRpbmF0ZXMgZ2V0IGNoYW5nZWQgY29vcmRpbmF0ZXMuXG5cbiAgICAgIGxpdmUyRE1hbmFnZXIub25UYXAoeCwgeSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIFggY29vcmRpbmF0ZXMgdG8gVmlldyBjb29yZGluYXRlcy5cbiAgICpcbiAgICogQHBhcmFtIGRldmljZVggRGV2aWNlIFggY29vcmRpbmF0ZVxuICAgKi9cbiAgcHVibGljIHRyYW5zZm9ybVZpZXdYKGRldmljZVg6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3Qgc2NyZWVuWDogbnVtYmVyID0gdGhpcy5fZGV2aWNlVG9TY3JlZW4udHJhbnNmb3JtWChkZXZpY2VYKTsgLy8g6KuW55CG5bqn5qiZ5aSJ5o+b44GX44Gf5bqn5qiZ44KS5Y+W5b6X44CCXG4gICAgcmV0dXJuIHRoaXMuX3ZpZXdNYXRyaXguaW52ZXJ0VHJhbnNmb3JtWChzY3JlZW5YKTsgLy8g5ouh5aSn44CB57iu5bCP44CB56e75YuV5b6M44Gu5YCk44CCXG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgWSBjb29yZGluYXRlcyB0byBWaWV3IGNvb3JkaW5hdGVzLlxuICAgKlxuICAgKiBAcGFyYW0gZGV2aWNlWSBEZXZpY2UgeS1jb29yZGluYXRlXG4gICAqL1xuICBwdWJsaWMgdHJhbnNmb3JtVmlld1koZGV2aWNlWTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBzY3JlZW5ZOiBudW1iZXIgPSB0aGlzLl9kZXZpY2VUb1NjcmVlbi50cmFuc2Zvcm1ZKGRldmljZVkpOyAvLyBMb2dpY2FsIGNvb3JkaW5hdGVzIGdldCB0aGUgdHJhbnNmb3JtZWQgY29vcmRpbmF0ZXMuXG4gICAgcmV0dXJuIHRoaXMuX3ZpZXdNYXRyaXguaW52ZXJ0VHJhbnNmb3JtWShzY3JlZW5ZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBYIGNvb3JkaW5hdGVzIHRvIFNjcmVlbiBjb29yZGluYXRlcy5cbiAgICogQHBhcmFtIGRldmljZVggRGV2aWNlIFggY29vcmRpbmF0ZVxuICAgKi9cbiAgcHVibGljIHRyYW5zZm9ybVNjcmVlblgoZGV2aWNlWDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZGV2aWNlVG9TY3JlZW4udHJhbnNmb3JtWChkZXZpY2VYKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBZIGNvb3JkaW5hdGVzIHRvIFNjcmVlbiBjb29yZGluYXRlcy5cbiAgICpcbiAgICogQHBhcmFtIGRldmljZVkgRGV2aWNlIFkgY29vcmRpbmF0ZVxuICAgKi9cbiAgcHVibGljIHRyYW5zZm9ybVNjcmVlblkoZGV2aWNlWTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZGV2aWNlVG9TY3JlZW4udHJhbnNmb3JtWShkZXZpY2VZKTtcbiAgfVxuXG4gIF90b3VjaE1hbmFnZXI6IFRvdWNoTWFuYWdlcjsgLy8gVG91Y2ggbWFuYWdlclxuICBfZGV2aWNlVG9TY3JlZW46IENzbV9DdWJpc21NYXRyaXg0NDsgLy8gTWF0cml4IGZyb20gZGV2aWNlIHRvIHNjcmVlblxuICBfdmlld01hdHJpeDogQ3NtX0N1YmlzbVZpZXdNYXRyaXg7IC8vIHZpZXdNYXRyaXhcbiAgX3Byb2dyYW1JZDogV2ViR0xQcm9ncmFtOyAvLyBTaGVkYSBJRFxuICBfY2hhbmdlTW9kZWw6IGJvb2xlYW47IC8vIE1vZGVsIHN3aXRjaCBmbGFnXG4gIF9pc0NsaWNrOiBib29sZWFuOyAvLyBJJ20gY2xpY2tpbmcuXG59XG4iXSwic291cmNlUm9vdCI6IiJ9