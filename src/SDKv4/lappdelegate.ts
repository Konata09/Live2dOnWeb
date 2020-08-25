/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import {
    Live2DCubismFramework as live2dcubismframework,
    Option as Csm_Option
} from '@framework/live2dcubismframework';
import Csm_CubismFramework = live2dcubismframework.CubismFramework;
import {LAppView} from './lappview';
import {LAppPal} from './lapppal';
import {LAppTextureManager} from './lapptexturemanager';
import {LAppLive2DManager} from './lapplive2dmanager';
import * as LAppDefine from './lappdefine';

export let canvas: HTMLCanvasElement = null;
export let s_instance: LAppDelegate = null;
export let gl: WebGLRenderingContext = null;
export let frameBuffer: WebGLFramebuffer = null;

/**
 * 应用程序类
 * Cubism SDKの管理を行う。
 */
export class LAppDelegate {
    /**
     * 返回类实例(sington)。
     * 如果没有生成实例，则在内部生成实例。
     *
     * @return 类实例
     */
    public static getInstance(): LAppDelegate {
        if (s_instance == null) {
            s_instance = new LAppDelegate();
        }

        return s_instance;
    }

    /**
     * 释放类实例(single ton)
     */
    public static releaseInstance(): void {
        if (s_instance != null) {
            s_instance.release();
        }

        s_instance = null;
    }

    /**
     * 初始化APP需要的东西。
     */
    public initialize(canvasId: string): boolean {
        // Getting a canvas
        canvas = <HTMLCanvasElement>document.getElementById(canvasId);

        // Initialize gl context
        // @ts-ignore
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) {
            console.error('Cannot initialize WebGL. This browser does not support.');
            gl = null;

            document.body.innerHTML =
                'This browser does not support the <code>&lt;canvas&gt;</code> element.';

            // Gl initialization failed.
            return false;
        }

        // Add a canvas to the DOM
        // document.body.appendChild(canvas);

        if (!frameBuffer) {
            frameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        }

        // Transparency setting
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const supportTouch: boolean = 'ontouchend' in canvas;

        if (supportTouch) {
            // Touch related callback function registration
            window.ontouchstart = onTouchBegan;
            window.ontouchmove = onTouchMoved;
            window.ontouchend = onTouchEnded;
            window.ontouchcancel = onTouchCancel;
        } else {
            // Mouse related callback function registration
            canvas.onmousedown = onClickBegan;
            window.onmousemove = onMouseMoved; // 监听在 window 上，可以监听整个窗口内的指针
            window.onmouseout = onMouseLeave; // 指针移出窗口时
            canvas.onmouseup = onClickEnded;
        }

        // Initializing AppView
        this._view.initialize();

        // Cubism SDKの初期化
        this.initializeCubism();

        return true;
    }

    /**
     * 解放する。
     */
    public release(): void {
        // 移除监听函数
        window.ontouchstart = undefined;
        window.ontouchmove = undefined;
        window.ontouchend = undefined;
        window.ontouchcancel = undefined;
        canvas.onmousedown = undefined;
        window.onmousemove = undefined;
        window.onmouseout = undefined;
        canvas.onmouseup = undefined;

        this._textureManager.release();
        this._textureManager = null;

        this._view.release();
        this._view = null;

        // Free up resources
        LAppLive2DManager.releaseInstance();

        // Cubism SDKの解放
        Csm_CubismFramework.dispose();
    }

    /**
     * Execution processing
     */
    public run(): void {
        // Main loop
        const loop = (): void => {
            // Checking the presence or absence of instances
            if (s_instance == null) {
                return;
            }

            // 時間更新
            LAppPal.updateTime();

            // 画面の初期化
            gl.clearColor(0.0, 0.0, 0.0, 0.0);

            // Activate depth testing.
            gl.enable(gl.DEPTH_TEST);

            // The nearest object obscures the distant object
            gl.depthFunc(gl.LEQUAL);

            // Clear color and depth buffers
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.clearDepth(1.0);

            // 透過設定
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            // 描画更新
            this._view.render();

            // 检查是否截图
            if (LAppDefine.captureCanvas) {
                LAppDefine.setCaptureCanvas(false);
                canvas.toBlob(window.downloadCap);
            }
            // Recursive call for the loop
            requestAnimationFrame(loop);
        };
        loop();
    }

    /**
     * Register the shader.
     */
    public createShader(): WebGLProgram {
        // バーテックスシェーダーのコンパイル
        const vertexShaderId = gl.createShader(gl.VERTEX_SHADER);

        if (vertexShaderId == null) {
            LAppPal.printMessage('failed to create vertexShader');
            return null;
        }

        const vertexShader: string =
            'precision mediump float;' +
            'attribute vec3 position;' +
            'attribute vec2 uv;' +
            'varying vec2 vuv;' +
            'void main(void)' +
            '{' +
            '   gl_Position = vec4(position, 1.0);' +
            '   vuv = uv;' +
            '}';

        gl.shaderSource(vertexShaderId, vertexShader);
        gl.compileShader(vertexShaderId);

        // Compiling fragment shaders
        const fragmentShaderId = gl.createShader(gl.FRAGMENT_SHADER);

        if (fragmentShaderId == null) {
            LAppPal.printMessage('failed to create fragmentShader');
            return null;
        }

        const fragmentShader: string =
            'precision mediump float;' +
            'varying vec2 vuv;' +
            'uniform sampler2D texture;' +
            'void main(void)' +
            '{' +
            '   gl_FragColor = texture2D(texture, vuv);' +
            '}';

        gl.shaderSource(fragmentShaderId, fragmentShader);
        gl.compileShader(fragmentShaderId);

        // Creating program objects
        const programId = gl.createProgram();
        gl.attachShader(programId, vertexShaderId);
        gl.attachShader(programId, fragmentShaderId);

        gl.deleteShader(vertexShaderId);
        gl.deleteShader(fragmentShaderId);

        // Link
        gl.linkProgram(programId);

        gl.useProgram(programId);

        return programId;
    }

    /**
     * View information.
     */
    public getView(): LAppView {
        return this._view;
    }

    public getTextureManager(): LAppTextureManager {
        return this._textureManager;
    }

    /**
     * constructor
     */
    constructor() {
        this._captured = false;
        this._mouseX = 0.0;
        this._mouseY = 0.0;
        this._isEnd = false;

        this._cubismOption = new Csm_Option();
        this._view = new LAppView();
        this._textureManager = new LAppTextureManager();
    }

    /**
     * Cubism SDKの初期化
     */
    public initializeCubism(): void {
        // setup cubism
        this._cubismOption.logFunction = LAppPal.printMessage;
        this._cubismOption.loggingLevel = LAppDefine.CubismLoggingLevel;
        Csm_CubismFramework.startUp(this._cubismOption);

        // initialize cubism
        Csm_CubismFramework.initialize();

        // load model
        LAppLive2DManager.getInstance();

        LAppPal.updateTime();

        this._view.initializeSprite();
    }

    _cubismOption: Csm_Option; // Cubism SDK Option
    _view: LAppView; // View情報
    _captured: boolean; // Are you clicking on it?
    _mouseX: number; // Mouse x-coordinate
    _mouseY: number; // Mouse y-coordinate
    _isEnd: boolean; // Is the APP closed?
    _textureManager: LAppTextureManager; // Texture manager
}

/**
 * Called when clicked.
 */
function onClickBegan(e: MouseEvent): void {
    if (!LAppDelegate.getInstance()._view) {
        LAppPal.printMessage('view notfound');
        return;
    }
    LAppDelegate.getInstance()._captured = true;

    const posX: number = e.pageX;
    const posY: number = e.pageY;

    LAppDelegate.getInstance()._view.onTouchesBegan(posX, posY);
}

/**
 * If the mouse pointer moves, it is called.
 */
function onMouseMoved(e: MouseEvent): void {
    // 默认需要同时按下鼠标才能跟踪 注释掉
    // if (!LAppDelegate.getInstance()._captured) {
    //   return;
    // }

    if (
        !LAppDelegate.getInstance()._view ||
        !LAppDelegate.getInstance()._view._programId
    ) {
        LAppPal.printMessage('view notfound');
        return;
    }
    // DOMRect 对象，top、left 表示元素(canvas)左上角到视口左上角的距离，bottom、right表示元素右下角到视口左上角的距离
    const rect = canvas.getBoundingClientRect();
    // 这里的 e.target 是 window
    // MouseEvent 对象，clientX、clientY分别是鼠标点击位置在视口中的X、Y坐标
    const posX: number = e.clientX - rect.left;
    const posY: number = e.clientY - rect.top;

    LAppDelegate.getInstance()._view.onTouchesMoved(posX, posY);
}

/**
 * 指针移出窗口时恢复默认姿态
 */
function onMouseLeave(e: MouseEvent): void {
    // FireFox 的 window.onmouseout 触发很迷，有时在页面中央触发，有时正确触发返回的坐标仍在窗口内
    if (e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth - 6 || e.clientY >= window.innerHeight - 6)) {
        LAppDefine.DebugLogEnable && LAppPal.printMessage('[Live2Dv4] onMouseLeave');
        if (
            !LAppDelegate.getInstance()._view ||
            !LAppDelegate.getInstance()._view._programId
        ) {
            LAppPal.printMessage('view notfound');
            return;
        }
        const live2DManager: LAppLive2DManager = LAppLive2DManager.getInstance();
        live2DManager.onDrag(0.0, 0.0);
    }
}

/**
 * Call when the click is finished.
 */
function onClickEnded(e: MouseEvent): void {
    LAppDelegate.getInstance()._captured = false;
    if (
        !LAppDelegate.getInstance()._view ||
        !LAppDelegate.getInstance()._view._programId
    ) {
        LAppPal.printMessage('view notfound');
        return;
    }
    // DOMRect 对象，top、left 表示元素(这里是canvas)左上角到视口左上角的距离，bottom、right表示元素右下角到视口左上角的距离
    const rect = (e.target as Element).getBoundingClientRect();
    // MouseEvent 对象，clientX、clientY分别是鼠标点击位置在视口中的X、Y坐标
    const posX: number = e.clientX - rect.left;
    const posY: number = e.clientY - rect.top;
    if (LAppDefine.DebugLogEnable) {
        LAppPal.printMessage(
            `[Live2Dv4] onClickEnded:
       rect left: ${rect.left.toFixed(2)} rect top: ${rect.top.toFixed(2)}
       clientX: ${e.clientX.toFixed(2)} clientY: ${e.clientY.toFixed(2)}`
        );
    }
    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}

/**
 * It is called when touched.
 */
function onTouchBegan(e: TouchEvent): void {
    if (!LAppDelegate.getInstance()._view) {
        LAppPal.printMessage('view notfound');
        return;
    }

    LAppDelegate.getInstance()._captured = true;

    // DOMRect 对象，top、left 表示元素(canvas)左上角到视口左上角的距离，bottom、right表示元素右下角到视口左上角的距离
    const rect = canvas.getBoundingClientRect();
    // 这里的 e.target 是 window
    // MouseEvent 对象，clientX、clientY分别是鼠标点击位置在视口中的X、Y坐标
    const posX = e.changedTouches[0].clientX - rect.left;
    const posY = e.changedTouches[0].clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesMoved(posX, posY);

    // const posX = e.changedTouches[0].pageX;
    // const posY = e.changedTouches[0].pageY;
    //
    // LAppDelegate.getInstance()._view.onTouchesBegan(posX, posY);
}

/**
 * This is called swiping.
 */
function onTouchMoved(e: TouchEvent): void {
    // if (!LAppDelegate.getInstance()._captured) {
    //   return;
    // }

    if (!LAppDelegate.getInstance()._view) {
        LAppPal.printMessage('view notfound');
        return;
    }

    // DOMRect 对象，top、left 表示元素(canvas)左上角到视口左上角的距离，bottom、right表示元素右下角到视口左上角的距离
    const rect = canvas.getBoundingClientRect();
    // 这里的 e.target 是 window
    // MouseEvent 对象，clientX、clientY分别是鼠标点击位置在视口中的X、Y坐标
    const posX = e.changedTouches[0].clientX - rect.left;
    const posY = e.changedTouches[0].clientY - rect.top;

    LAppDelegate.getInstance()._view.onTouchesMoved(posX, posY);
}

/**
 * It is called when the touch is finished.
 */
function onTouchEnded(e: TouchEvent): void {
    LAppDelegate.getInstance()._captured = false;

    if (!LAppDelegate.getInstance()._view) {
        LAppPal.printMessage('view notfound');
        return;
    }
    const live2DManager: LAppLive2DManager = LAppLive2DManager.getInstance();
    live2DManager.onDrag(0.0, 0.0);

    const rect = canvas.getBoundingClientRect();

    const posX = e.changedTouches[0].clientX - rect.left;
    const posY = e.changedTouches[0].clientY - rect.top;

    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}

/**
 * Touch is called canceled.
 */
function onTouchCancel(e: TouchEvent): void {
    LAppDelegate.getInstance()._captured = false;

    if (!LAppDelegate.getInstance()._view) {
        LAppPal.printMessage('view notfound');
        return;
    }
    const live2DManager: LAppLive2DManager = LAppLive2DManager.getInstance();
    live2DManager.onDrag(0.0, 0.0);

    const rect = canvas.getBoundingClientRect();

    const posX = e.changedTouches[0].clientX - rect.left;
    const posY = e.changedTouches[0].clientY - rect.top;

    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}
