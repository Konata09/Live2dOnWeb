webpackHotUpdate("main",{

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
        console.log(this._touchManager.getX());
        console.log(this._touchManager.getY());
        var viewX = this.transformViewX(this._touchManager.getX());
        var viewY = this.transformViewY(this._touchManager.getY());
        this._touchManager.touchesMoved(pointX, pointY);
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


/***/ }),

/***/ "./src/SDKv4/touchmanager.ts":
/*!***********************************!*\
  !*** ./src/SDKv4/touchmanager.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchManager = void 0;
var TouchManager = (function () {
    function TouchManager() {
        this._startX = 0.0;
        this._startY = 0.0;
        this._lastX = 0.0;
        this._lastY = 0.0;
        this._lastX1 = 0.0;
        this._lastY1 = 0.0;
        this._lastX2 = 0.0;
        this._lastY2 = 0.0;
        this._lastTouchDistance = 0.0;
        this._deltaX = 0.0;
        this._deltaY = 0.0;
        this._scale = 1.0;
        this._touchSingle = false;
        this._flipAvailable = false;
    }
    TouchManager.prototype.getCenterX = function () {
        return this._lastX;
    };
    TouchManager.prototype.getCenterY = function () {
        return this._lastY;
    };
    TouchManager.prototype.getDeltaX = function () {
        return this._deltaX;
    };
    TouchManager.prototype.getDeltaY = function () {
        return this._deltaY;
    };
    TouchManager.prototype.getStartX = function () {
        return this._startX;
    };
    TouchManager.prototype.getStartY = function () {
        return this._startY;
    };
    TouchManager.prototype.getScale = function () {
        return this._scale;
    };
    TouchManager.prototype.getX = function () {
        return this._lastX;
    };
    TouchManager.prototype.getY = function () {
        return this._lastY;
    };
    TouchManager.prototype.getX1 = function () {
        return this._lastX1;
    };
    TouchManager.prototype.getY1 = function () {
        return this._lastY1;
    };
    TouchManager.prototype.getX2 = function () {
        return this._lastX2;
    };
    TouchManager.prototype.getY2 = function () {
        return this._lastY2;
    };
    TouchManager.prototype.isSingleTouch = function () {
        return this._touchSingle;
    };
    TouchManager.prototype.isFlickAvailable = function () {
        return this._flipAvailable;
    };
    TouchManager.prototype.disableFlick = function () {
        this._flipAvailable = false;
    };
    TouchManager.prototype.touchesBegan = function (deviceX, deviceY) {
        console.log("devY:" + deviceX);
        console.log("devY:" + deviceY);
        this._startX = deviceX;
        this._startY = deviceY;
        this._lastTouchDistance = -1.0;
        this._flipAvailable = true;
        this._touchSingle = true;
    };
    TouchManager.prototype.touchesMoved = function (deviceX, deviceY) {
        this._lastX = deviceX;
        this._lastY = deviceY;
        this._lastTouchDistance = -1.0;
        this._touchSingle = true;
    };
    TouchManager.prototype.getFlickDistance = function () {
        return this.calculateDistance(this._startX, this._startY, this._lastX, this._lastY);
    };
    TouchManager.prototype.calculateDistance = function (x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    };
    TouchManager.prototype.calculateMovingAmount = function (v1, v2) {
        if (v1 > 0.0 != v2 > 0.0) {
            return 0.0;
        }
        var sign = v1 > 0.0 ? 1.0 : -1.0;
        var absoluteValue1 = Math.abs(v1);
        var absoluteValue2 = Math.abs(v2);
        return (sign * (absoluteValue1 < absoluteValue2 ? absoluteValue1 : absoluteValue2));
    };
    return TouchManager;
}());
exports.TouchManager = TouchManager;


/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvU0RLdjQvbGFwcHZpZXcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1NES3Y0L3RvdWNobWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9BLHFJQUF5RjtBQUN6RiwySUFBNkY7QUFDN0YsSUFBTyxvQkFBb0IsR0FBRyx3Q0FBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQztBQUNoRSxJQUFPLGtCQUFrQixHQUFHLHNDQUFjLENBQUMsY0FBYyxDQUFDO0FBQzFELDhGQUE4QztBQUM5Qyw2R0FBd0Q7QUFDeEQsOEZBQTBEO0FBRzFELCtFQUFvQztBQUNwQyxvR0FBMkM7QUFLM0M7SUFJRTtRQUNFLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBR3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSwyQkFBWSxFQUFFLENBQUM7UUFHeEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFHaEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7SUFDaEQsQ0FBQztJQUtNLDZCQUFVLEdBQWpCO1FBQ1UsU0FBSyxHQUFhLHFCQUFNLE1BQW5CLEVBQUUsTUFBTSxHQUFLLHFCQUFNLE9BQVgsQ0FBWTtRQUVqQyxJQUFNLEtBQUssR0FBVyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3JDLElBQU0sSUFBSSxHQUFXLFVBQVUsQ0FBQyxlQUFlLENBQUM7UUFDaEQsSUFBTSxLQUFLLEdBQVcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO1FBQ2xELElBQU0sTUFBTSxHQUFXLENBQUMsS0FBSyxDQUFDO1FBQzlCLElBQU0sR0FBRyxHQUFXLEtBQUssQ0FBQztRQUcxQixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUV6RCxJQUFNLE9B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QyxHQUFHLENBQUM7UUFDM0MsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwQyxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sQ0FDTCxJQUFJLEdBQUcsQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUMzRSxDQUFDO0lBQ0osQ0FBQztJQWdCSCxtQkFBQztBQUFELENBQUM7QUFwTFksb0NBQVkiLCJmaWxlIjoibWFpbi4yZmViYmExNTNkMzlmYTgyMWRiZS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQoYykgTGl2ZTJEIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSB0aGUgTGl2ZTJEIE9wZW4gU29mdHdhcmUgbGljZW5zZVxuICogdGhhdCBjYW4gYmUgZm91bmQgYXQgaHR0cHM6Ly93d3cubGl2ZTJkLmNvbS9ldWxhL2xpdmUyZC1vcGVuLXNvZnR3YXJlLWxpY2Vuc2UtYWdyZWVtZW50X2VuLmh0bWwuXG4gKi9cblxuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbU1hdHJpeDQ0IH0gZnJvbSAnQGZyYW1ld29yay9tYXRoL2N1YmlzbW1hdHJpeDQ0JztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc212aWV3bWF0cml4IH0gZnJvbSAnQGZyYW1ld29yay9tYXRoL2N1YmlzbXZpZXdtYXRyaXgnO1xuaW1wb3J0IENzbV9DdWJpc21WaWV3TWF0cml4ID0gY3ViaXNtdmlld21hdHJpeC5DdWJpc21WaWV3TWF0cml4O1xuaW1wb3J0IENzbV9DdWJpc21NYXRyaXg0NCA9IGN1YmlzbU1hdHJpeDQ0LkN1YmlzbU1hdHJpeDQ0O1xuaW1wb3J0IHsgVG91Y2hNYW5hZ2VyIH0gZnJvbSAnLi90b3VjaG1hbmFnZXInO1xuaW1wb3J0IHsgTEFwcExpdmUyRE1hbmFnZXIgfSBmcm9tICcuL2xhcHBsaXZlMmRtYW5hZ2VyJztcbmltcG9ydCB7IExBcHBEZWxlZ2F0ZSwgY2FudmFzLCBnbCB9IGZyb20gJy4vbGFwcGRlbGVnYXRlJztcbmltcG9ydCB7IExBcHBTcHJpdGUgfSBmcm9tICcuL2xhcHBzcHJpdGUnO1xuaW1wb3J0IHsgVGV4dHVyZUluZm8gfSBmcm9tICcuL2xhcHB0ZXh0dXJlbWFuYWdlcic7XG5pbXBvcnQgeyBMQXBwUGFsIH0gZnJvbSAnLi9sYXBwcGFsJztcbmltcG9ydCAqIGFzIExBcHBEZWZpbmUgZnJvbSAnLi9sYXBwZGVmaW5lJztcblxuLyoqXG4gKiBEcmF3aW5nIGNsYXNzZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBMQXBwVmlldyB7XG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fcHJvZ3JhbUlkID0gbnVsbDtcblxuICAgIC8vIFRvdWNoIHJlbGF0ZWQgZXZlbnQgbWFuYWdlbWVudFxuICAgIHRoaXMuX3RvdWNoTWFuYWdlciA9IG5ldyBUb3VjaE1hbmFnZXIoKTtcblxuICAgIC8vIEZvciBjb252ZXJ0aW5nIGRldmljZSBjb29yZGluYXRlcyB0byBzY3JlZW4gY29vcmRpbmF0ZXNcbiAgICB0aGlzLl9kZXZpY2VUb1NjcmVlbiA9IG5ldyBDc21fQ3ViaXNtTWF0cml4NDQoKTtcblxuICAgIC8vIE1hdHJpeCBmb3Igc2NhbGluZyBhbmQgc2hpZnRpbmcgdGhlIGRpc3BsYXlcbiAgICB0aGlzLl92aWV3TWF0cml4ID0gbmV3IENzbV9DdWJpc21WaWV3TWF0cml4KCk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZVxuICAgKi9cbiAgcHVibGljIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBjYW52YXM7XG5cbiAgICBjb25zdCByYXRpbzogbnVtYmVyID0gaGVpZ2h0IC8gd2lkdGg7XG4gICAgY29uc3QgbGVmdDogbnVtYmVyID0gTEFwcERlZmluZS5WaWV3TG9naWNhbExlZnQ7XG4gICAgY29uc3QgcmlnaHQ6IG51bWJlciA9IExBcHBEZWZpbmUuVmlld0xvZ2ljYWxSaWdodDtcbiAgICBjb25zdCBib3R0b206IG51bWJlciA9IC1yYXRpbztcbiAgICBjb25zdCB0b3A6IG51bWJlciA9IHJhdGlvO1xuXG4gICAgLy8gUmFuZ2Ugb2Ygc2NyZWVuIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGRldmljZS5UaGUgbGVmdCBlbmQgb2YgWCwgdGhlIHJpZ2h0IGVuZCBvZiBYLCB0aGUgYm90dG9tIGVuZCBvZiBZLCB0aGUgdG9wIGVuZCBvZiBZXG4gICAgdGhpcy5fdmlld01hdHJpeC5zZXRTY3JlZW5SZWN0KGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCk7XG5cbiAgICBjb25zdCBzY3JlZW5XOiBudW1iZXIgPSBNYXRoLmFicyhsZWZ0IC0gcmlnaHQpO1xuICAgIHRoaXMuX2RldmljZVRvU2NyZWVuLnNjYWxlUmVsYXRpdmUoc2NyZWVuVyAvIHdpZHRoLCAtc2NyZWVuVyAvIHdpZHRoKTtcbiAgICB0aGlzLl9kZXZpY2VUb1NjcmVlbi50cmFuc2xhdGVSZWxhdGl2ZSgtd2lkdGggKiAwLjUsIC1oZWlnaHQgKiAwLjUpO1xuXG4gICAgLy8gU2V0dGluZyB0aGUgZGlzcGxheSByYW5nZVxuICAgIHRoaXMuX3ZpZXdNYXRyaXguc2V0TWF4U2NhbGUoTEFwcERlZmluZS5WaWV3TWF4U2NhbGUpOyAvLyDpmZDnlYzmi6HlvLXnjodcbiAgICB0aGlzLl92aWV3TWF0cml4LnNldE1pblNjYWxlKExBcHBEZWZpbmUuVmlld01pblNjYWxlKTsgLy8g6ZmQ55WM57iu5bCP546HXG5cbiAgICAvLyBNYXhpbXVtIHJhbmdlIHRoYXQgY2FuIGJlIGRpc3BsYXllZFxuICAgIHRoaXMuX3ZpZXdNYXRyaXguc2V0TWF4U2NyZWVuUmVjdChcbiAgICAgIExBcHBEZWZpbmUuVmlld0xvZ2ljYWxNYXhMZWZ0LFxuICAgICAgTEFwcERlZmluZS5WaWV3TG9naWNhbE1heFJpZ2h0LFxuICAgICAgTEFwcERlZmluZS5WaWV3TG9naWNhbE1heEJvdHRvbSxcbiAgICAgIExBcHBEZWZpbmUuVmlld0xvZ2ljYWxNYXhUb3BcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIOino+aUvuOBmeOCi1xuICAgKi9cbiAgcHVibGljIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgdGhpcy5fdmlld01hdHJpeCA9IG51bGw7XG4gICAgdGhpcy5fdG91Y2hNYW5hZ2VyID0gbnVsbDtcbiAgICB0aGlzLl9kZXZpY2VUb1NjcmVlbiA9IG51bGw7XG5cbiAgICBnbC5kZWxldGVQcm9ncmFtKHRoaXMuX3Byb2dyYW1JZCk7XG4gICAgdGhpcy5fcHJvZ3JhbUlkID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiDmj4/nlLvjgZnjgovjgIJcbiAgICovXG4gIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XG4gICAgZ2wudXNlUHJvZ3JhbSh0aGlzLl9wcm9ncmFtSWQpO1xuXG4gICAgZ2wuZmx1c2goKTtcblxuICAgIGNvbnN0IGxpdmUyRE1hbmFnZXI6IExBcHBMaXZlMkRNYW5hZ2VyID0gTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcblxuICAgIGxpdmUyRE1hbmFnZXIub25VcGRhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBpbWFnZS5cbiAgICovXG4gIHB1YmxpYyBpbml0aWFsaXplU3ByaXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IHdpZHRoOiBudW1iZXIgPSBjYW52YXMud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0OiBudW1iZXIgPSBjYW52YXMuaGVpZ2h0O1xuXG4gICAgY29uc3QgdGV4dHVyZU1hbmFnZXIgPSBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5nZXRUZXh0dXJlTWFuYWdlcigpO1xuXG4gICAgLy8gQ3JlYXRlIGEgc2hhZGVyLlxuICAgIGlmICh0aGlzLl9wcm9ncmFtSWQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fcHJvZ3JhbUlkID0gTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuY3JlYXRlU2hhZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEl0IGlzIGNhbGxlZCB3aGVuIGl0IGlzIHRvdWNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSBwb2ludFggU2NyZWVuIHgtY29vcmRpbmF0ZXNcbiAgICogQHBhcmFtIHBvaW50WSBTY3JlZW4geS1jb29yZGluYXRlc1xuICAgKi9cbiAgcHVibGljIG9uVG91Y2hlc0JlZ2FuKHBvaW50WDogbnVtYmVyLCBwb2ludFk6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuX3RvdWNoTWFuYWdlci50b3VjaGVzQmVnYW4ocG9pbnRYLCBwb2ludFkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gdGhlIGZpbmdlciBpcyB0b3VjaGVkLCBpdCBpcyBjYWxsZWQuXG4gICAqXG4gICAqIEBwYXJhbSBwb2ludFggU2NyZWVuIFggY29vcmRpbmF0ZXNcbiAgICogQHBhcmFtIHBvaW50WSBTY3JlZW4gWSBjb29yZGluYXRlc1xuICAgKi9cbiAgcHVibGljIG9uVG91Y2hlc01vdmVkKHBvaW50WDogbnVtYmVyLCBwb2ludFk6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKHRoaXMuX3RvdWNoTWFuYWdlci5nZXRYKCkpXG4gICAgY29uc29sZS5sb2codGhpcy5fdG91Y2hNYW5hZ2VyLmdldFkoKSlcbiAgICBjb25zdCB2aWV3WDogbnVtYmVyID0gdGhpcy50cmFuc2Zvcm1WaWV3WCh0aGlzLl90b3VjaE1hbmFnZXIuZ2V0WCgpKTtcbiAgICBjb25zdCB2aWV3WTogbnVtYmVyID0gdGhpcy50cmFuc2Zvcm1WaWV3WSh0aGlzLl90b3VjaE1hbmFnZXIuZ2V0WSgpKTtcbiAgICB0aGlzLl90b3VjaE1hbmFnZXIudG91Y2hlc01vdmVkKHBvaW50WCwgcG9pbnRZKTtcblxuICAgIGNvbnN0IGxpdmUyRE1hbmFnZXI6IExBcHBMaXZlMkRNYW5hZ2VyID0gTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcbiAgICBMQXBwRGVmaW5lLkRlYnVnTG9nRW5hYmxlICYmXG4gICAgICAvLyBMQXBwRGVmaW5lLkRlYnVnVG91Y2hMb2dFbmFibGUgJiZcbiAgICAgIGNvbnNvbGUubG9nKGBbTGl2ZTJEdjRdIHBvaW50WDogJHtwb2ludFh9IHBvaW50WTogJHtwb2ludFl9XG4gICAgICAgICAgdmlld1g6ICR7dmlld1h9IHZpZXdZOiAke3ZpZXdZfWApO1xuICAgIGxpdmUyRE1hbmFnZXIub25EcmFnKHZpZXdYLCB2aWV3WSk7XG4gIH1cblxuICAvKipcbiAgICogSXQgaXMgY2FsbGVkIHdoZW4gdGhlIHRvdWNoIGlzIGZpbmlzaGVkLlxuICAgKlxuICAgKiBAcGFyYW0gcG9pbnRYIFNjcmVlbiBYIGNvb3JkaW5hdGVzXG4gICAqIEBwYXJhbSBwb2ludFkgU2NyZWVuIFkgY29vcmRpbmF0ZXNcbiAgICovXG4gIHB1YmxpYyBvblRvdWNoZXNFbmRlZChwb2ludFg6IG51bWJlciwgcG9pbnRZOiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBUb3VjaCBkb25lLlxuICAgIGNvbnN0IGxpdmUyRE1hbmFnZXI6IExBcHBMaXZlMkRNYW5hZ2VyID0gTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcbiAgICAvLyBsaXZlMkRNYW5hZ2VyLm9uRHJhZygwLjAsIDAuMCk7XG4gICAge1xuICAgICAgaWYgKExBcHBEZWZpbmUuRGVidWdMb2dFbmFibGUpIHtcbiAgICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoYFtMaXZlMkR2NF0gdG91Y2hlc0VuZGVkIHg6ICR7cG9pbnRYfSB5OiAke3BvaW50WX1gKTtcbiAgICAgIH1cbiAgICAgIC8vIFNpbmdsZSB0YXBcbiAgICAgIGNvbnN0IHg6IG51bWJlciA9IHRoaXMuX2RldmljZVRvU2NyZWVuLnRyYW5zZm9ybVgoXG4gICAgICAgIC8vIHRoaXMuX3RvdWNoTWFuYWdlci5nZXRYKClcbiAgICAgICAgcG9pbnRYIC8vIOWOn+S7o+eggeS9v+eUqOaMieS4i+aXtueahOWdkOagh++8jOe7j+W4uOaXoOazleinpuWPkeWKqOS9nO+8jOaUueS4uuS9v+eUqOW8uei1t+aXtueahOWdkOagh1xuICAgICAgKTsgLy8gTG9naWNhbCBjb29yZGluYXRlcyBnZXQgdGhlIHRyYW5zZm9ybWVkIGNvb3JkaW5hdGVzLlxuICAgICAgY29uc3QgeTogbnVtYmVyID0gdGhpcy5fZGV2aWNlVG9TY3JlZW4udHJhbnNmb3JtWShcbiAgICAgICAgLy8gdGhpcy5fdG91Y2hNYW5hZ2VyLmdldFkoKVxuICAgICAgICBwb2ludFkgLy8g5Y6f5Luj56CB5L2/55So5oyJ5LiL5pe255qE5Z2Q5qCH77yM57uP5bi45peg5rOV6Kem5Y+R5Yqo5L2c77yM5pS55Li65L2/55So5by56LW35pe255qE5Z2Q5qCHXG4gICAgICApOyAvLyBMb2dpY2FsIGNvb3JkaW5hdGVzIGdldCBjaGFuZ2VkIGNvb3JkaW5hdGVzLlxuXG4gICAgICBsaXZlMkRNYW5hZ2VyLm9uVGFwKHgsIHkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBYIGNvb3JkaW5hdGVzIHRvIFZpZXcgY29vcmRpbmF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBkZXZpY2VYIERldmljZSBYIGNvb3JkaW5hdGVcbiAgICovXG4gIHB1YmxpYyB0cmFuc2Zvcm1WaWV3WChkZXZpY2VYOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IHNjcmVlblg6IG51bWJlciA9IHRoaXMuX2RldmljZVRvU2NyZWVuLnRyYW5zZm9ybVgoZGV2aWNlWCk7IC8vIOirlueQhuW6p+aomeWkieaPm+OBl+OBn+W6p+aomeOCkuWPluW+l+OAglxuICAgIHJldHVybiB0aGlzLl92aWV3TWF0cml4LmludmVydFRyYW5zZm9ybVgoc2NyZWVuWCk7IC8vIOaLoeWkp+OAgee4ruWwj+OAgeenu+WLleW+jOOBruWApOOAglxuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIFkgY29vcmRpbmF0ZXMgdG8gVmlldyBjb29yZGluYXRlcy5cbiAgICpcbiAgICogQHBhcmFtIGRldmljZVkgRGV2aWNlIHktY29vcmRpbmF0ZVxuICAgKi9cbiAgcHVibGljIHRyYW5zZm9ybVZpZXdZKGRldmljZVk6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3Qgc2NyZWVuWTogbnVtYmVyID0gdGhpcy5fZGV2aWNlVG9TY3JlZW4udHJhbnNmb3JtWShkZXZpY2VZKTsgLy8gTG9naWNhbCBjb29yZGluYXRlcyBnZXQgdGhlIHRyYW5zZm9ybWVkIGNvb3JkaW5hdGVzLlxuICAgIHJldHVybiB0aGlzLl92aWV3TWF0cml4LmludmVydFRyYW5zZm9ybVkoc2NyZWVuWSk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgWCBjb29yZGluYXRlcyB0byBTY3JlZW4gY29vcmRpbmF0ZXMuXG4gICAqIEBwYXJhbSBkZXZpY2VYIERldmljZSBYIGNvb3JkaW5hdGVcbiAgICovXG4gIHB1YmxpYyB0cmFuc2Zvcm1TY3JlZW5YKGRldmljZVg6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2RldmljZVRvU2NyZWVuLnRyYW5zZm9ybVgoZGV2aWNlWCk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgWSBjb29yZGluYXRlcyB0byBTY3JlZW4gY29vcmRpbmF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBkZXZpY2VZIERldmljZSBZIGNvb3JkaW5hdGVcbiAgICovXG4gIHB1YmxpYyB0cmFuc2Zvcm1TY3JlZW5ZKGRldmljZVk6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2RldmljZVRvU2NyZWVuLnRyYW5zZm9ybVkoZGV2aWNlWSk7XG4gIH1cblxuICBfdG91Y2hNYW5hZ2VyOiBUb3VjaE1hbmFnZXI7IC8vIFRvdWNoIG1hbmFnZXJcbiAgX2RldmljZVRvU2NyZWVuOiBDc21fQ3ViaXNtTWF0cml4NDQ7IC8vIE1hdHJpeCBmcm9tIGRldmljZSB0byBzY3JlZW5cbiAgX3ZpZXdNYXRyaXg6IENzbV9DdWJpc21WaWV3TWF0cml4OyAvLyB2aWV3TWF0cml4XG4gIF9wcm9ncmFtSWQ6IFdlYkdMUHJvZ3JhbTsgLy8gU2hlZGEgSURcbiAgX2NoYW5nZU1vZGVsOiBib29sZWFuOyAvLyBNb2RlbCBzd2l0Y2ggZmxhZ1xuICBfaXNDbGljazogYm9vbGVhbjsgLy8gSSdtIGNsaWNraW5nLlxufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQoYykgTGl2ZTJEIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSB0aGUgTGl2ZTJEIE9wZW4gU29mdHdhcmUgbGljZW5zZVxuICogdGhhdCBjYW4gYmUgZm91bmQgYXQgaHR0cHM6Ly93d3cubGl2ZTJkLmNvbS9ldWxhL2xpdmUyZC1vcGVuLXNvZnR3YXJlLWxpY2Vuc2UtYWdyZWVtZW50X2VuLmh0bWwuXG4gKi9cblxuZXhwb3J0IGNsYXNzIFRvdWNoTWFuYWdlciB7XG4gIC8qKlxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3N0YXJ0WCA9IDAuMDtcbiAgICB0aGlzLl9zdGFydFkgPSAwLjA7XG4gICAgdGhpcy5fbGFzdFggPSAwLjA7XG4gICAgdGhpcy5fbGFzdFkgPSAwLjA7XG4gICAgdGhpcy5fbGFzdFgxID0gMC4wO1xuICAgIHRoaXMuX2xhc3RZMSA9IDAuMDtcbiAgICB0aGlzLl9sYXN0WDIgPSAwLjA7XG4gICAgdGhpcy5fbGFzdFkyID0gMC4wO1xuICAgIHRoaXMuX2xhc3RUb3VjaERpc3RhbmNlID0gMC4wO1xuICAgIHRoaXMuX2RlbHRhWCA9IDAuMDtcbiAgICB0aGlzLl9kZWx0YVkgPSAwLjA7XG4gICAgdGhpcy5fc2NhbGUgPSAxLjA7XG4gICAgdGhpcy5fdG91Y2hTaW5nbGUgPSBmYWxzZTtcbiAgICB0aGlzLl9mbGlwQXZhaWxhYmxlID0gZmFsc2U7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q2VudGVyWCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9sYXN0WDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDZW50ZXJZKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2xhc3RZO1xuICB9XG5cbiAgcHVibGljIGdldERlbHRhWCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9kZWx0YVg7XG4gIH1cblxuICBwdWJsaWMgZ2V0RGVsdGFZKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2RlbHRhWTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTdGFydFgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhcnRYO1xuICB9XG5cbiAgcHVibGljIGdldFN0YXJ0WSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9zdGFydFk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U2NhbGUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc2NhbGU7XG4gIH1cblxuICBwdWJsaWMgZ2V0WCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9sYXN0WDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRZKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2xhc3RZO1xuICB9XG5cbiAgcHVibGljIGdldFgxKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2xhc3RYMTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRZMSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9sYXN0WTE7XG4gIH1cblxuICBwdWJsaWMgZ2V0WDIoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fbGFzdFgyO1xuICB9XG5cbiAgcHVibGljIGdldFkyKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2xhc3RZMjtcbiAgfVxuXG4gIHB1YmxpYyBpc1NpbmdsZVRvdWNoKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl90b3VjaFNpbmdsZTtcbiAgfVxuXG4gIHB1YmxpYyBpc0ZsaWNrQXZhaWxhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9mbGlwQXZhaWxhYmxlO1xuICB9XG5cbiAgcHVibGljIGRpc2FibGVGbGljaygpOiB2b2lkIHtcbiAgICB0aGlzLl9mbGlwQXZhaWxhYmxlID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogVG91Y2ggc3RhcnQgZXZlbnRcbiAgICogQHBhcmFtIGRldmljZVggWCB2YWx1ZSBvZiB0aGUgdG91Y2hlZCBzY3JlZW5cbiAgICogQHBhcmFtIGRldmljZVkgWSB2YWx1ZSBvZiB0aGUgdG91Y2hlZCBzY3JlZW5cbiAgICovXG4gIHB1YmxpYyB0b3VjaGVzQmVnYW4oZGV2aWNlWDogbnVtYmVyLCBkZXZpY2VZOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZyhcImRldlk6XCIrZGV2aWNlWClcbiAgICBjb25zb2xlLmxvZyhcImRldlk6XCIrZGV2aWNlWSlcbiAgICAvLyB0aGlzLl9sYXN0WCA9IGRldmljZVg7XG4gICAgLy8gdGhpcy5fbGFzdFkgPSBkZXZpY2VZO1xuICAgIHRoaXMuX3N0YXJ0WCA9IGRldmljZVg7XG4gICAgdGhpcy5fc3RhcnRZID0gZGV2aWNlWTtcbiAgICB0aGlzLl9sYXN0VG91Y2hEaXN0YW5jZSA9IC0xLjA7XG4gICAgdGhpcy5fZmxpcEF2YWlsYWJsZSA9IHRydWU7XG4gICAgdGhpcy5fdG91Y2hTaW5nbGUgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIOODieODqeODg+OCsOaZguOBruOCpOODmeODs+ODiFxuICAgKiBAcGFyYW0gZGV2aWNlWCDjgr/jg4Pjg4HjgZfjgZ/nlLvpnaLjga5444Gu5YCkXG4gICAqIEBwYXJhbSBkZXZpY2VZIOOCv+ODg+ODgeOBl+OBn+eUu+mdouOBrnnjga7lgKRcbiAgICovXG4gIHB1YmxpYyB0b3VjaGVzTW92ZWQoZGV2aWNlWDogbnVtYmVyLCBkZXZpY2VZOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLl9sYXN0WCA9IGRldmljZVg7XG4gICAgdGhpcy5fbGFzdFkgPSBkZXZpY2VZO1xuICAgIHRoaXMuX2xhc3RUb3VjaERpc3RhbmNlID0gLTEuMDtcbiAgICB0aGlzLl90b3VjaFNpbmdsZSA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICog44OV44Oq44OD44Kv44Gu6Led6Zui5ris5a6aXG4gICAqIEByZXR1cm4g44OV44Oq44OD44Kv6Led6ZuiXG4gICAqL1xuICBwdWJsaWMgZ2V0RmxpY2tEaXN0YW5jZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZURpc3RhbmNlKFxuICAgICAgdGhpcy5fc3RhcnRYLFxuICAgICAgdGhpcy5fc3RhcnRZLFxuICAgICAgdGhpcy5fbGFzdFgsXG4gICAgICB0aGlzLl9sYXN0WVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICog54K577yR44GL44KJ54K577yS44G444Gu6Led6Zui44KS5rGC44KB44KLXG4gICAqXG4gICAqIEBwYXJhbSB4MSDvvJHjgaTnm67jga7jgr/jg4Pjg4HjgZfjgZ/nlLvpnaLjga5444Gu5YCkXG4gICAqIEBwYXJhbSB5MSDvvJHjgaTnm67jga7jgr/jg4Pjg4HjgZfjgZ/nlLvpnaLjga5544Gu5YCkXG4gICAqIEBwYXJhbSB4MiDvvJLjgaTnm67jga7jgr/jg4Pjg4HjgZfjgZ/nlLvpnaLjga5444Gu5YCkXG4gICAqIEBwYXJhbSB5MiDvvJLjgaTnm67jga7jgr/jg4Pjg4HjgZfjgZ/nlLvpnaLjga5544Gu5YCkXG4gICAqL1xuICBwdWJsaWMgY2FsY3VsYXRlRGlzdGFuY2UoXG4gICAgeDE6IG51bWJlcixcbiAgICB5MTogbnVtYmVyLFxuICAgIHgyOiBudW1iZXIsXG4gICAgeTI6IG51bWJlclxuICApOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLnNxcnQoKHgxIC0geDIpICogKHgxIC0geDIpICsgKHkxIC0geTIpICogKHkxIC0geTIpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDvvJLjgaTnm67jga7lgKTjgYvjgonjgIHnp7vli5Xph4/jgpLmsYLjgoHjgovjgIJcbiAgICog6YGV44GG5pa55ZCR44Gu5aC05ZCI44Gv56e75YuV6YeP77yQ44CC5ZCM44GY5pa55ZCR44Gu5aC05ZCI44Gv44CB57W25a++5YCk44GM5bCP44GV44GE5pa544Gu5YCk44KS5Y+C54Wn44GZ44KL44CCXG4gICAqXG4gICAqIEBwYXJhbSB2MSDvvJHjgaTnm67jga7np7vli5Xph49cbiAgICogQHBhcmFtIHYyIO+8kuOBpOebruOBruenu+WLlemHj1xuICAgKlxuICAgKiBAcmV0dXJuIOWwj+OBleOBhOaWueOBruenu+WLlemHj1xuICAgKi9cbiAgcHVibGljIGNhbGN1bGF0ZU1vdmluZ0Ftb3VudCh2MTogbnVtYmVyLCB2MjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBpZiAodjEgPiAwLjAgIT0gdjIgPiAwLjApIHtcbiAgICAgIHJldHVybiAwLjA7XG4gICAgfVxuXG4gICAgY29uc3Qgc2lnbjogbnVtYmVyID0gdjEgPiAwLjAgPyAxLjAgOiAtMS4wO1xuICAgIGNvbnN0IGFic29sdXRlVmFsdWUxID0gTWF0aC5hYnModjEpO1xuICAgIGNvbnN0IGFic29sdXRlVmFsdWUyID0gTWF0aC5hYnModjIpO1xuICAgIHJldHVybiAoXG4gICAgICBzaWduICogKGFic29sdXRlVmFsdWUxIDwgYWJzb2x1dGVWYWx1ZTIgPyBhYnNvbHV0ZVZhbHVlMSA6IGFic29sdXRlVmFsdWUyKVxuICAgICk7XG4gIH1cblxuICBfc3RhcnRZOiBudW1iZXI7IC8vIOOCv+ODg+ODgeOCkumWi+Wni+OBl+OBn+aZguOBrnjjga7lgKRcbiAgX3N0YXJ0WDogbnVtYmVyOyAvLyDjgr/jg4Pjg4HjgpLplovlp4vjgZfjgZ/mmYLjga5544Gu5YCkXG4gIF9sYXN0WDogbnVtYmVyOyAvLyDjgrfjg7PjgrDjg6vjgr/jg4Pjg4HmmYLjga5444Gu5YCkXG4gIF9sYXN0WTogbnVtYmVyOyAvLyDjgrfjg7PjgrDjg6vjgr/jg4Pjg4HmmYLjga5544Gu5YCkXG4gIF9sYXN0WDE6IG51bWJlcjsgLy8g44OA44OW44Or44K/44OD44OB5pmC44Gu5LiA44Gk55uu44GueOOBruWApFxuICBfbGFzdFkxOiBudW1iZXI7IC8vIOODgOODluODq+OCv+ODg+ODgeaZguOBruS4gOOBpOebruOBrnnjga7lgKRcbiAgX2xhc3RYMjogbnVtYmVyOyAvLyDjg4Djg5bjg6vjgr/jg4Pjg4HmmYLjga7kuozjgaTnm67jga5444Gu5YCkXG4gIF9sYXN0WTI6IG51bWJlcjsgLy8g44OA44OW44Or44K/44OD44OB5pmC44Gu5LqM44Gk55uu44GueeOBruWApFxuICBfbGFzdFRvdWNoRGlzdGFuY2U6IG51bWJlcjsgLy8gMuacrOS7peS4iuOBp+OCv+ODg+ODgeOBl+OBn+OBqOOBjeOBruaMh+OBrui3nembolxuICBfZGVsdGFYOiBudW1iZXI7IC8vIOWJjeWbnuOBruWApOOBi+OCieS7iuWbnuOBruWApOOBuOOBrnjjga7np7vli5Xot53pm6LjgIJcbiAgX2RlbHRhWTogbnVtYmVyOyAvLyDliY3lm57jga7lgKTjgYvjgonku4rlm57jga7lgKTjgbjjga5544Gu56e75YuV6Led6Zui44CCXG4gIF9zY2FsZTogbnVtYmVyOyAvLyDjgZPjga7jg5Xjg6zjg7zjg6DjgafmjpvjgZHlkIjjgo/jgZvjgovmi6HlpKfnjofjgILmi6HlpKfmk43kvZzkuK3ku6XlpJbjga8x44CCXG4gIF90b3VjaFNpbmdsZTogYm9vbGVhbjsgLy8g44K344Oz44Kw44Or44K/44OD44OB5pmC44GvdHJ1ZVxuICBfZmxpcEF2YWlsYWJsZTogYm9vbGVhbjsgLy8g44OV44Oq44OD44OX44GM5pyJ5Yq544GL44Gp44GG44GLXG59XG4iXSwic291cmNlUm9vdCI6IiJ9