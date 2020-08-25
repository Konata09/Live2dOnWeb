/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { Live2DCubismFramework as cubismMatrix44 } from '@framework/math/cubismmatrix44';
import { Live2DCubismFramework as cubismviewmatrix } from '@framework/math/cubismviewmatrix';
import Csm_CubismViewMatrix = cubismviewmatrix.CubismViewMatrix;
import Csm_CubismMatrix44 = cubismMatrix44.CubismMatrix44;
import { TouchManager } from './touchmanager';
import { LAppLive2DManager } from './lapplive2dmanager';
import { LAppDelegate, canvas, gl } from './lappdelegate';
import { LAppSprite } from './lappsprite';
import { TextureInfo } from './lapptexturemanager';
import { LAppPal } from './lapppal';
import * as LAppDefine from './lappdefine';

/**
 * Drawing classes.
 */
export class LAppView {
  /**
   * constructor
   */
  constructor() {
    this._programId = null;

    // Touch related event management
    this._touchManager = new TouchManager();

    // For converting device coordinates to screen coordinates
    this._deviceToScreen = new Csm_CubismMatrix44();

    // Matrix for scaling and shifting the display
    this._viewMatrix = new Csm_CubismViewMatrix();
  }

  /**
   * Initialize
   */
  public initialize(): void {
    const { width, height } = canvas;

    const ratio: number = height / width;
    const left: number = LAppDefine.ViewLogicalLeft;
    const right: number = LAppDefine.ViewLogicalRight;
    const bottom: number = -ratio;
    const top: number = ratio;

    // Range of screen corresponding to the device.The left end of X, the right end of X, the bottom end of Y, the top end of Y
    this._viewMatrix.setScreenRect(left, right, bottom, top);

    const screenW: number = Math.abs(left - right);
    this._deviceToScreen.scaleRelative(screenW / width, -screenW / width);
    this._deviceToScreen.translateRelative(-width * 0.5, -height * 0.5);

    // Setting the display range
    this._viewMatrix.setMaxScale(LAppDefine.ViewMaxScale); // 限界拡張率
    this._viewMatrix.setMinScale(LAppDefine.ViewMinScale); // 限界縮小率

    // Maximum range that can be displayed
    this._viewMatrix.setMaxScreenRect(
      LAppDefine.ViewLogicalMaxLeft,
      LAppDefine.ViewLogicalMaxRight,
      LAppDefine.ViewLogicalMaxBottom,
      LAppDefine.ViewLogicalMaxTop
    );
  }

  /**
   * 解放する
   */
  public release(): void {
    this._viewMatrix = null;
    this._touchManager = null;
    this._deviceToScreen = null;

    gl.deleteProgram(this._programId);
    this._programId = null;
  }

  /**
   * 描画する。
   */
  public render(): void {
    gl.useProgram(this._programId);

    gl.flush();

    const live2DManager: LAppLive2DManager = LAppLive2DManager.getInstance();

    live2DManager.onUpdate();
  }

  /**
   * Initialize the image.
   */
  public initializeSprite(): void {
    const width: number = canvas.width;
    const height: number = canvas.height;

    const textureManager = LAppDelegate.getInstance().getTextureManager();

    // Create a shader.
    if (this._programId == null) {
      this._programId = LAppDelegate.getInstance().createShader();
    }
  }

  /**
   * It is called when it is touched.
   *
   * @param pointX Screen x-coordinates
   * @param pointY Screen y-coordinates
   */
  public onTouchesBegan(pointX: number, pointY: number): void {
    this._touchManager.touchesBegan(pointX, pointY);
  }

  /**
   * When the finger is touched, it is called.
   *
   * @param pointX Screen X coordinates
   * @param pointY Screen Y coordinates
   */
  public onTouchesMoved(pointX: number, pointY: number): void {
    // const viewX: number = this.transformViewX(this._touchManager.getX());
    const viewX: number = this.transformViewX(pointX);
    // const viewY: number = this.transformViewY(this._touchManager.getY());
    const viewY: number = this.transformViewY(pointY);
    // this._touchManager.touchesMoved(pointX, pointY);

    const live2DManager: LAppLive2DManager = LAppLive2DManager.getInstance();
    LAppDefine.DebugLogEnable &&
      LAppDefine.DebugTouchLogEnable &&
      console.log(`[Live2Dv4] pointX: ${pointX} pointY: ${pointY}
          viewX: ${viewX} viewY: ${viewY}`);
    live2DManager.onDrag(viewX, viewY);
  }

  /**
   * It is called when the touch is finished.
   *
   * @param pointX Screen X coordinates
   * @param pointY Screen Y coordinates
   */
  public onTouchesEnded(pointX: number, pointY: number): void {
    // Touch done.
    const live2DManager: LAppLive2DManager = LAppLive2DManager.getInstance();
    // live2DManager.onDrag(0.0, 0.0);
    {
      if (LAppDefine.DebugLogEnable) {
        LAppPal.printMessage(`[Live2Dv4] touchesEnded x: ${pointX} y: ${pointY}`);
      }
      // Single tap
      const x: number = this._deviceToScreen.transformX(
        // this._touchManager.getX()
        pointX // 原代码使用按下时的坐标，经常无法触发动作，改为使用弹起时的坐标
      ); // Logical coordinates get the transformed coordinates.
      const y: number = this._deviceToScreen.transformY(
        // this._touchManager.getY()
        pointY // 原代码使用按下时的坐标，经常无法触发动作，改为使用弹起时的坐标
      ); // Logical coordinates get changed coordinates.

      live2DManager.onTap(x, y);
    }
  }

  /**
   * Converts X coordinates to View coordinates.
   *
   * @param deviceX Device X coordinate
   */
  public transformViewX(deviceX: number): number {
    const screenX: number = this._deviceToScreen.transformX(deviceX); // 論理座標変換した座標を取得。
    return this._viewMatrix.invertTransformX(screenX); // 拡大、縮小、移動後の値。
  }

  /**
   * Converts Y coordinates to View coordinates.
   *
   * @param deviceY Device y-coordinate
   */
  public transformViewY(deviceY: number): number {
    const screenY: number = this._deviceToScreen.transformY(deviceY); // Logical coordinates get the transformed coordinates.
    return this._viewMatrix.invertTransformY(screenY);
  }

  /**
   * Converts X coordinates to Screen coordinates.
   * @param deviceX Device X coordinate
   */
  public transformScreenX(deviceX: number): number {
    return this._deviceToScreen.transformX(deviceX);
  }

  /**
   * Converts Y coordinates to Screen coordinates.
   *
   * @param deviceY Device Y coordinate
   */
  public transformScreenY(deviceY: number): number {
    return this._deviceToScreen.transformY(deviceY);
  }

  _touchManager: TouchManager; // Touch manager
  _deviceToScreen: Csm_CubismMatrix44; // Matrix from device to screen
  _viewMatrix: Csm_CubismViewMatrix; // viewMatrix
  _programId: WebGLProgram; // Sheda ID
  _changeModel: boolean; // Model switch flag
  _isClick: boolean; // I'm clicking.
}
