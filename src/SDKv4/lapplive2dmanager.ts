/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import {Live2DCubismFramework as cubismmatrix44} from '@framework/math/cubismmatrix44';
import {Live2DCubismFramework as csmvector} from '@framework/type/csmvector';
import {Live2DCubismFramework as acubismmotion} from '@framework/motion/acubismmotion';
import Csm_csmVector = csmvector.csmVector;
import Csm_CubismMatrix44 = cubismmatrix44.CubismMatrix44;
import ACubismMotion = acubismmotion.ACubismMotion;

import {LAppModel} from './lappmodel';
import {LAppPal} from './lapppal';
import {canvas} from './lappdelegate';
import * as LAppDefine from './lappdefine';

export let s_instance: LAppLive2DManager = null;

/**
 * Class to manage CubismModel in the sample application
 * It generates and discards models, handles tap events, and switches models.
 */
export class LAppLive2DManager {
    /**
     * It returns an instance of the class (singleton).
     * If no instance is created, an instance is created internally.
     *
     * @return Instance of class
     */
    public static getInstance(): LAppLive2DManager {
        if (s_instance == null) {
            // LAppDefine.modelPath
            s_instance = new LAppLive2DManager();
        }

        return s_instance;
    }

    /**
     * Free instance of class (singleton).
     */
    public static releaseInstance(): void {
        if (s_instance != null) {
            s_instance = void 0;
        }

        s_instance = null;
    }

    /**
     * Returns the model held in the current scene.
     *
     * @param no Index value of model list
     * @return Returns an instance of a model.If the index value is out of the range, return NULL.
     */
    public getModel(no: number): LAppModel {
        if (no < this._models.getSize()) {
            return this._models.at(no);
        }

        return null;
    }

    /**
     * Release all the models you hold in the current scene
     */
    public releaseAllModel(): void {
        for (let i = 0; i < this._models.getSize(); i++) {
            this._models.at(i).release();
            this._models.set(i, null);
        }

        this._models.clear();
    }

    /**
     * The process of dragging the screen
     *
     * @param x 画面のX座標
     * @param y 画面のY座標
     */
    public onDrag(x: number, y: number): void {
        for (let i = 0; i < this._models.getSize(); i++) {
            const model: LAppModel = this.getModel(i);

            if (model) {
                model.setDragging(x, y);
            }
        }
    }

    /**
     * Tapping the screen
     *
     * @param x 画面のX座標
     * @param y 画面のY座標
     */
    public onTap(x: number, y: number): void {
        if (LAppDefine.DebugLogEnable) {
            LAppPal.printMessage(
                `[Live2Dv4] tap point: {x: ${x.toFixed(2)} y: ${y.toFixed(2)}}`
            );
        }

        for (let i = 0; i < this._models.getSize(); i++) {
            const hitArea = this._models.at(i).getHitAreaName(x, y);
            if (hitArea) {
                if (LAppDefine.DebugLogEnable)
                    LAppPal.printMessage(`[Live2Dv4] hit area: [${hitArea}]`);
                this._models
                    .at(i)
                    .startRandomMotion(
                        `Tap${hitArea}`,
                        LAppDefine.PriorityNormal,
                        this._finishedMotion
                    );
            }
        }
    }

    /**
     * What to do when updating the screen
     * Model update processing and drawing processing
     */
    public onUpdate(): void {
        let projection: Csm_CubismMatrix44 = new Csm_CubismMatrix44();

        const {width, height} = canvas;
        projection.scale(1.0, width / height);

        if (this._viewMatrix != null) {
            projection.multiplyByMatrix(this._viewMatrix);
        }

        const saveProjection: Csm_CubismMatrix44 = projection.clone();
        const modelCount: number = this._models.getSize();

        for (let i = 0; i < modelCount; ++i) {
            const model: LAppModel = this.getModel(i);
            projection = saveProjection.clone();

            model.update();
            model.draw(projection); // The projection is modified by reference.
        }
    }

    /**
     * Change scenes
     * The sample application switches the model set.
     */
    public changeScene(modelPath: string, modelJsonName: string): void {
        if (LAppDefine.DebugLogEnable) {
            LAppPal.printMessage(`[Live2Dv4] load model: ${modelJsonName}`);
        }

        this.releaseAllModel();
        this._models.pushBack(new LAppModel(LAppDefine.DebugLogEnable));
        this._models.at(0).loadAssets(modelPath, modelJsonName);
    }

    /**
     * constructor
     */
    constructor() {
        this._viewMatrix = new Csm_CubismMatrix44();
        this._models = new Csm_csmVector<LAppModel>();
        this.changeScene(LAppDefine.modelPath, LAppDefine.modelJsonName);
    }

    _viewMatrix: Csm_CubismMatrix44; // View matrix for model drawing
    _models: Csm_csmVector<LAppModel>; // Container of model instances
    // Callback function to end motion playback
    _finishedMotion = (self: ACubismMotion): void => {
        LAppDefine.DebugLogEnable && LAppPal.printMessage('[Live2Dv4] Motion Finished');
    };
}
