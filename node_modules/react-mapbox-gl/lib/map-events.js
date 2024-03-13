"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.events = {
    onResize: 'resize',
    onDblClick: 'dblclick',
    onClick: 'click',
    onMouseMove: 'mousemove',
    onMouseOut: 'mouseout',
    onMoveStart: 'movestart',
    onMove: 'move',
    onMoveEnd: 'moveend',
    onMouseUp: 'mouseup',
    onMouseDown: 'mousedown',
    onDragStart: 'dragstart',
    onDrag: 'drag',
    onDragEnd: 'dragend',
    onZoomStart: 'zoomstart',
    onZoom: 'zoom',
    onZoomEnd: 'zoomend',
    onPitch: 'pitch',
    onPitchStart: 'pitchstart',
    onPitchEnd: 'pitchend',
    onWebGlContextLost: 'webglcontextlost',
    onWebGlContextRestored: 'webglcontextrestored',
    onRemove: 'remove',
    onContextMenu: 'contextmenu',
    onRender: 'render',
    onError: 'error',
    onSourceData: 'sourcedata',
    onDataLoading: 'dataloading',
    onStyleDataLoading: 'styledataloading',
    onStyleImageMissing: 'styleimagemissing',
    onTouchCancel: 'touchcancel',
    onData: 'data',
    onSourceDataLoading: 'sourcedataloading',
    onTouchMove: 'touchmove',
    onTouchEnd: 'touchend',
    onTouchStart: 'touchstart',
    onStyleData: 'styledata',
    onBoxZoomStart: 'boxzoomstart',
    onBoxZoomEnd: 'boxzoomend',
    onBoxZoomCancel: 'boxzoomcancel',
    onRotateStart: 'rotatestart',
    onRotate: 'rotate',
    onRotateEnd: 'rotateend'
};
exports.listenEvents = function (partialEvents, props, map) {
    return Object.keys(partialEvents).reduce(function (listeners, event) {
        var propEvent = props[event];
        if (propEvent) {
            var listener = function (evt) {
                propEvent(map, evt);
            };
            map.on(partialEvents[event], listener);
            listeners[event] = listener;
        }
        return listeners;
    }, {});
};
exports.updateEvents = function (listeners, currentProps, map) {
    var toListenOff = Object.keys(exports.events).filter(function (eventKey) {
        return listeners[eventKey] && typeof currentProps[eventKey] !== 'function';
    });
    toListenOff.forEach(function (key) {
        map.off(exports.events[key], listeners[key]);
        delete listeners[key];
    });
    var toListenOn = Object.keys(exports.events)
        .filter(function (key) { return !listeners[key] && typeof currentProps[key] === 'function'; })
        .reduce(function (acc, next) { return ((acc[next] = exports.events[next]), acc); }, {});
    var newListeners = exports.listenEvents(toListenOn, currentProps, map);
    return __assign({}, listeners, newListeners);
};
//# sourceMappingURL=map-events.js.map