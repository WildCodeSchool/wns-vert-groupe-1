"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var isEqual = require('deep-equal');
var diff_1 = __importDefault(require("./util/diff"));
var eventToHandler = {
    touchstart: 'onTouchStart',
    touchend: 'onTouchEnd',
    touchcancel: 'onTouchCancel',
    mousemove: 'onMouseMove',
    mouseenter: 'onMouseEnter',
    mouseleave: 'onMouseLeave',
    mousedown: 'onMouseDown',
    mouseup: 'onMouseUp',
    click: 'onClick'
};
var Layer = (function (_super) {
    __extends(Layer, _super);
    function Layer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.source = __assign({ type: 'geojson' }, _this.props.geoJSONSourceOptions, { data: {
                type: 'FeatureCollection',
                features: []
            } });
        _this.geometry = function (coordinates) {
            switch (_this.props.type) {
                case 'symbol':
                case 'circle':
                    return {
                        type: 'Point',
                        coordinates: coordinates
                    };
                case 'fill':
                    if (Array.isArray(coordinates[0][0][0])) {
                        return {
                            type: 'MultiPolygon',
                            coordinates: coordinates
                        };
                    }
                    return {
                        type: 'Polygon',
                        coordinates: coordinates
                    };
                case 'line':
                    return {
                        type: 'LineString',
                        coordinates: coordinates
                    };
                default:
                    return {
                        type: 'Point',
                        coordinates: coordinates
                    };
            }
        };
        _this.makeFeature = function (props, id) { return ({
            type: 'Feature',
            geometry: _this.geometry(props.coordinates),
            properties: __assign({}, props.properties, { id: id })
        }); };
        _this.initialize = function () {
            var _a = _this.props, type = _a.type, layout = _a.layout, paint = _a.paint, sourceId = _a.sourceId, before = _a.before, images = _a.images, id = _a.id, metadata = _a.metadata, sourceLayer = _a.sourceLayer, minZoom = _a.minZoom, maxZoom = _a.maxZoom, filter = _a.filter;
            var map = _this.props.map;
            var layer = {
                id: id,
                source: sourceId || id,
                type: type,
                layout: layout,
                paint: paint,
                metadata: metadata
            };
            if (sourceLayer) {
                layer['source-layer'] = sourceLayer;
            }
            if (minZoom) {
                layer.minzoom = minZoom;
            }
            if (maxZoom) {
                layer.maxzoom = maxZoom;
            }
            if (filter) {
                layer.filter = filter;
            }
            if (images) {
                var normalizedImages = !Array.isArray(images[0]) ? [images] : images;
                normalizedImages
                    .filter(function (image) { return !map.hasImage(image[0]); })
                    .forEach(function (image) {
                    map.addImage(image[0], image[1], image[2]);
                });
            }
            if (!sourceId && !map.getSource(id)) {
                map.addSource(id, _this.source);
            }
            if (!map.getLayer(id)) {
                map.addLayer(layer, before);
            }
            Object.entries(eventToHandler).forEach(function (_a) {
                var event = _a[0], propName = _a[1];
                var handler = _this.props[propName];
                if (handler) {
                    map.on(event, id, handler);
                }
            });
        };
        _this.onStyleDataChange = function () {
            if (!_this.props.map.getLayer(_this.props.id)) {
                _this.initialize();
                _this.forceUpdate();
            }
        };
        _this.getChildren = function () {
            var children = _this.props.children;
            if (!children) {
                return [];
            }
            if (Array.isArray(children)) {
                return children.reduce(function (arr, next) { return arr.concat(next); }, []);
            }
            return [children];
        };
        return _this;
    }
    Layer.prototype.componentDidMount = function () {
        var map = this.props.map;
        this.initialize();
        map.on('styledata', this.onStyleDataChange);
    };
    Layer.prototype.componentWillUnmount = function () {
        var _this = this;
        var map = this.props.map;
        var _a = this.props, images = _a.images, id = _a.id;
        if (!map || !map.getStyle()) {
            return;
        }
        map.off('styledata', this.onStyleDataChange);
        Object.entries(eventToHandler).forEach(function (_a) {
            var event = _a[0], propName = _a[1];
            var handler = _this.props[propName];
            if (handler) {
                map.off(event, id, handler);
            }
        });
        if (map.getLayer(id)) {
            map.removeLayer(id);
        }
        if (!this.props.sourceId) {
            map.removeSource(id);
        }
        if (images) {
            var normalizedImages = !Array.isArray(images[0]) ? [images] : images;
            normalizedImages
                .map(function (_a) {
                var key = _a[0], rest = _a.slice(1);
                return key;
            })
                .forEach(map.removeImage.bind(map));
        }
    };
    Layer.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        var paint = prevProps.paint, layout = prevProps.layout, before = prevProps.before, filter = prevProps.filter, id = prevProps.id, minZoom = prevProps.minZoom, maxZoom = prevProps.maxZoom, map = prevProps.map;
        if (!isEqual(this.props.paint, paint)) {
            var paintDiff_1 = diff_1.default(paint, this.props.paint);
            Object.keys(paintDiff_1).forEach(function (key) {
                map.setPaintProperty(id, key, paintDiff_1[key]);
            });
        }
        if (!isEqual(this.props.layout, layout)) {
            var layoutDiff_1 = diff_1.default(layout, this.props.layout);
            Object.keys(layoutDiff_1).forEach(function (key) {
                map.setLayoutProperty(id, key, layoutDiff_1[key]);
            });
        }
        if (!isEqual(this.props.filter, filter)) {
            map.setFilter(id, this.props.filter);
        }
        if (before !== this.props.before) {
            map.moveLayer(id, this.props.before);
        }
        if (minZoom !== this.props.minZoom || maxZoom !== this.props.maxZoom) {
            map.setLayerZoomRange(id, this.props.minZoom, this.props.maxZoom);
        }
        Object.entries(eventToHandler).forEach(function (_a) {
            var event = _a[0], propName = _a[1];
            var oldHandler = prevProps[propName];
            var newHandler = _this.props[propName];
            if (oldHandler !== newHandler) {
                if (oldHandler) {
                    map.off(event, id, oldHandler);
                }
                if (newHandler) {
                    map.on(event, id, newHandler);
                }
            }
        });
    };
    Layer.prototype.render = function () {
        var _this = this;
        var map = this.props.map;
        var _a = this.props, sourceId = _a.sourceId, draggedChildren = _a.draggedChildren;
        var children = this.getChildren();
        if (draggedChildren) {
            var draggableChildrenIds_1 = draggedChildren.map(function (child) { return child.key; });
            children = children.map(function (child) {
                var indexChildren = draggableChildrenIds_1.indexOf(child.key);
                if (indexChildren !== -1) {
                    return draggedChildren[indexChildren];
                }
                return child;
            });
        }
        var features = children
            .map(function (_a, id) {
            var props = _a.props;
            return _this.makeFeature(props, id);
        })
            .filter(Boolean);
        var source = map.getSource(sourceId || this.props.id);
        if (source && !sourceId && source.setData) {
            source.setData({
                type: 'FeatureCollection',
                features: features
            });
        }
        return null;
    };
    Layer.defaultProps = {
        type: 'symbol',
        layout: {},
        paint: {}
    };
    return Layer;
}(React.Component));
exports.default = Layer;
//# sourceMappingURL=layer.js.map