var LAppDefineV2 = {
    
    
    DEBUG_LOG : false,
    DEBUG_MOUSE_LOG : false,
    DEBUG_DRAW_HIT_AREA : false,
    DEBUG_DRAW_ALPHA_MODEL : false, 

    VIEW_MAX_SCALE : 2,
    VIEW_MIN_SCALE : 0.8,

    VIEW_LOGICAL_LEFT : -1,
    VIEW_LOGICAL_RIGHT : 1,

    VIEW_LOGICAL_MAX_LEFT : -2,
    VIEW_LOGICAL_MAX_RIGHT : 2,
    VIEW_LOGICAL_MAX_BOTTOM : -2,
    VIEW_LOGICAL_MAX_TOP : 2,

    PRIORITY_NONE : 0,
    PRIORITY_IDLE : 1,
    PRIORITY_SLEEPY : 2,
    PRIORITY_NORMAL : 3,
    PRIORITY_FORCE : 4,

    MOTION_GROUP_IDLE : "idle", 
    MOTION_GROUP_SLEEPY : "sleepy",
    MOTION_GROUP_TAP_FACE : "tap_face",
    MOTION_GROUP_FLICK_HEAD : "flick_head",
    MOTION_GROUP_TAP_BODY : "tap_body",
    MOTION_GROUP_TAP_BREAST : "tap_breast",
    MOTION_GROUP_TAP_BELLY : "tap_belly",
    MOTION_GROUP_TAP_LEG : "tap_leg",
    MOTION_GROUP_PINCH_IN : "pinch_in",
    MOTION_GROUP_PINCH_OUT : "pinch_out", 
    MOTION_GROUP_SHAKE : "shake", 

    HIT_AREA_HEAD : "head",
    HIT_AREA_BODY : "body",
    HIT_AREA_FACE : "face",
    HIT_AREA_BREAST : "breast",
    HIT_AREA_BELLY : "belly",
    HIT_AREA_LEG : "leg",

    HIT_AREA_CUSTOM_HEAD : "head",
    HIT_AREA_CUSTOM_BODY : "body",
};

module.exports = LAppDefineV2;