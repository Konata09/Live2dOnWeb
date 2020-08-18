/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LogLevel } from '@framework/live2dcubismframework';

/**
 * Sample Appで使用する定数
 */
// 画面
export const ViewMaxScale = 2.0;
export const ViewMinScale = 0.8;

export const ViewLogicalLeft = -1.0;
export const ViewLogicalRight = 1.0;

export const ViewLogicalMaxLeft = -2.0;
export const ViewLogicalMaxRight = 2.0;
export const ViewLogicalMaxBottom = -2.0;
export const ViewLogicalMaxTop = 2.0;

// 外部定義ファイル（json）と合わせる
export const MotionGroupIdle = 'Idle'; // アイドリング
export const MotionGroupTapBody = 'TapBody'; // 体をタップしたとき
export const MotionGroupTapHead = 'TapHead';

// 外部定義ファイル（json）と合わせる
export const HitAreaNameHead = 'Head';
export const HitAreaNameBody = 'Body';

// モーションの優先度定数
export const PriorityNone = 0;
export const PriorityIdle = 1;
export const PriorityNormal = 2;
export const PriorityForce = 3;

// デバッグ用ログの表示オプション
export let DebugLogEnable;
export let DebugTouchLogEnable;

// Frameworkから出力するログのレベル設定
export const CubismLoggingLevel: LogLevel = LogLevel.LogLevel_Verbose;

// デフォルトのレンダーターゲットサイズ
export const RenderTargetWidth = 1900;
export const RenderTargetHeight = 1000;

export let modelPath: string;
export let modelJsonName: string;
export let preLoadMotion: boolean;

export let captureCanvas: boolean;

export const setCaptureCanvas = function(captureCanvas: boolean): void {
  this.captureCanvas = captureCanvas;
};
export const defineModelPath = function(modelPath: string, modelJsonName: string): void {
  this.modelPath = modelPath;
  this.modelJsonName = modelJsonName;
};
export const defineDebug = function(debug: boolean, debugMouse: boolean): void {
  this.DebugLogEnable = debug;
  this.DebugTouchLogEnable = debugMouse;
};
export const setPreLoadMotion = function (preLoadMotion: boolean):void{
  this.preLoadMotion = preLoadMotion;
}
