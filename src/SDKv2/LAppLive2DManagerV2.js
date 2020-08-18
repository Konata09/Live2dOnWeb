import {Live2DFramework} from "./lib/Live2DFramework.js"
import PlatformManager from "./PlatformManager"
import LAppModelV2 from "./LAppModelV2"
import LAppDefineV2 from "./LAppDefineV2"

export default function LAppLive2DManagerV2() {
    // console.log("--> LAppLive2DManager()");


    this.models = [];


    this.count = -1;
    this.reloadFlg = false;

    Live2D.init();
    Live2DFramework.setPlatformManager(new PlatformManager);

}

LAppLive2DManagerV2.prototype.createModel = function () {


    var model = new LAppModelV2();
    this.models.push(model);

    return model;
}


LAppLive2DManagerV2.prototype.changeModel = function (gl, modelurl) {
    // console.log("--> LAppLive2DManager.update(gl)");

    if (this.reloadFlg) {

        this.reloadFlg = false;

        var thisRef = this;
        this.releaseModel(0, gl);
        this.createModel();
        this.models[0].load(gl, modelurl);
    }
};


LAppLive2DManagerV2.prototype.getModel = function (no) {
    // console.log("--> LAppLive2DManager.getModel(" + no + ")");

    if (no >= this.models.length) return null;

    return this.models[no];
};


LAppLive2DManagerV2.prototype.releaseModel = function (no, gl) {
    // console.log("--> LAppLive2DManager.releaseModel(" + no + ")");

    if (this.models.length <= no) return;

    this.models[no].release(gl);

    delete this.models[no];
    this.models.splice(no, 1);
};


LAppLive2DManagerV2.prototype.numModels = function () {
    return this.models.length;
};


LAppLive2DManagerV2.prototype.setDrag = function (x, y) {
    for (var i = 0; i < this.models.length; i++) {
        this.models[i].setDrag(x, y);
    }
}


LAppLive2DManagerV2.prototype.maxScaleEvent = function () {
    if (LAppDefineV2.DEBUG_LOG)
        console.log("[Live2Dv2] Max scale event.");
    for (var i = 0; i < this.models.length; i++) {
        this.models[i].startRandomMotion(LAppDefineV2.MOTION_GROUP_PINCH_IN,
            LAppDefineV2.PRIORITY_NORMAL);
    }
}


LAppLive2DManagerV2.prototype.minScaleEvent = function () {
    if (LAppDefineV2.DEBUG_LOG)
        console.log("[Live2Dv2] Min scale event.");
    for (var i = 0; i < this.models.length; i++) {
        this.models[i].startRandomMotion(LAppDefineV2.MOTION_GROUP_PINCH_OUT,
            LAppDefineV2.PRIORITY_NORMAL);
    }
}


LAppLive2DManagerV2.prototype.tapEvent = function (x, y) {

    if (LAppDefineV2.DEBUG_LOG)
        console.log("[Live2Dv2] tapEvent view x:" + x + " y:" + y);

    const hitTestArea = {
        'head': LAppDefineV2.HIT_AREA_HEAD,
        'body': LAppDefineV2.HIT_AREA_BODY,
        'face': LAppDefineV2.HIT_AREA_FACE,
        'breast': LAppDefineV2.HIT_AREA_BREAST,
        'belly': LAppDefineV2.HIT_AREA_BELLY,
        'leg': LAppDefineV2.HIT_AREA_LEG,
    }

    const hitTestAreaCustom = {
        'head': LAppDefineV2.HIT_AREA_CUSTOM_HEAD,
        'body': LAppDefineV2.HIT_AREA_CUSTOM_BODY,
    }

    const motionGroup = {
        'idle': LAppDefineV2.MOTION_GROUP_IDLE,
        'head': LAppDefineV2.MOTION_GROUP_FLICK_HEAD,
        'face': LAppDefineV2.MOTION_GROUP_TAP_FACE,
        'body': LAppDefineV2.MOTION_GROUP_TAP_BODY,
        'breast': LAppDefineV2.MOTION_GROUP_TAP_BREAST,
        'belly': LAppDefineV2.MOTION_GROUP_TAP_BELLY,
        'leg': LAppDefineV2.MOTION_GROUP_TAP_LEG,
        'sleepy': LAppDefineV2.MOTION_GROUP_SLEEPY,
        'shake': LAppDefineV2.MOTION_GROUP_SHAKE,
    }

    // 点击面部切换表情
    for (let i = 0; i < this.models.length; i++) {
            if (this.models[i].hitTest(hitTestArea['face'], x, y)) {
                LAppDefineV2.DEBUG_LOG && console.log(`[Live2Dv2] Tap face.`);
                this.models[i].setRandomExpression();
            }
    }

    for (let i = 0; i < this.models.length; i++) {
        let tapMotionStarted = false;
        for (let prop in hitTestArea) {
            if (this.models[i].hitTest(hitTestArea[prop], x, y)) {
                LAppDefineV2.DEBUG_LOG && console.log(`[Live2Dv2] Tap ${prop}.`);
                this.models[i].startRandomMotion(motionGroup[prop], LAppDefineV2.PRIORITY_NORMAL);
                tapMotionStarted = true;
            }
        }
        if (!tapMotionStarted)
            for (let prop in hitTestAreaCustom) {
                if (this.models[i].hitTestCustom(hitTestAreaCustom[prop], x, y)) {
                    LAppDefineV2.DEBUG_LOG && console.log(`[Live2Dv2] Tap Custom ${prop}.`);
                    this.models[i].startRandomMotion(motionGroup[prop], LAppDefineV2.PRIORITY_NORMAL);
                }
            }
    }
    return true;
};