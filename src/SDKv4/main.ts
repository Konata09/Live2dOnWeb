/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import {LAppDelegate} from './lappdelegate';
import * as LAppDefine from './lappdefine';
import {LAppLive2DManager} from "./lapplive2dmanager";
// @ts-ignore
import('!!raw-loader!./Core/live2dcubismcore.min.js').then(rawModule => eval.call(null, rawModule.default));

declare global {
    interface Window {
        live2dv4: any;
        downloadCap: any;
        webpReady: any;
    }
}
window.live2dv4 = window.live2dv4 || {};
window.live2dv4.load = (canvasId: string, modelPath: string, modelJsonName: string): void => {
    LAppDefine.defineDebug(window.live2dv4.debug ? true : false, window.live2dv4.debugMousemove ? true : false);
    LAppDefine.defineModelPath(modelPath, modelJsonName);
    if (LAppDelegate.getInstance().initialize(canvasId) == false) {
        return;
    }
    LAppDelegate.getInstance().run();
};
window.live2dv4.change = (modelPath: string, modelJsonName: string): void => {
    LAppLive2DManager.getInstance().changeScene(modelPath, modelJsonName);
}
window.live2dv4.release = (): void => {
    LAppDelegate.releaseInstance();
};
window.live2dv4.CaptureCanvas = (): void => {
    LAppDefine.setCaptureCanvas(true);
};
window.live2dv4.setPreLoadMotion = (preLoadMotion: boolean): void => {
    LAppDefine.setPreLoadMotion(preLoadMotion);
};
/**
 * 页面关闭/跳转/刷新时
 */
window.onbeforeunload = (): void => LAppDelegate.releaseInstance();
