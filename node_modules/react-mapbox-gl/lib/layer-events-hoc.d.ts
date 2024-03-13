import * as React from 'react';
import { Props as FeatureProps } from './feature';
import { LayerCommonProps, Props as LayerProps } from './layer';
import { Map } from 'mapbox-gl';
export interface EnhancedLayerProps {
    id?: string;
    map: Map;
}
export declare type OwnProps = EnhancedLayerProps & LayerCommonProps;
export declare function layerMouseTouchEvents(WrappedComponent: React.ComponentClass<LayerProps>): {
    new (props: Readonly<OwnProps>): {
        hover: number[];
        draggedChildren: React.ReactElement<FeatureProps, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>[] | undefined;
        id: string;
        getChildren: () => React.ReactElement<FeatureProps, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>[];
        getChildFromId: (children: React.ReactElement<FeatureProps, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>[], id: number) => React.ReactElement<FeatureProps, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
        areFeaturesDraggable: (children: React.ReactElement<FeatureProps, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>[], featureIds?: number[]) => boolean;
        onClick: (evt: any) => void;
        onMouseEnter: (evt: any) => void;
        onMouseLeave: (evt: any) => void;
        onMouseDown: () => void;
        onTouchStart: (evt: any) => void;
        onFeatureDown: (startEvent: string) => void;
        onFeatureDragStart: (evt: any) => void;
        onFeatureDrag: (evt: any) => void;
        onFeatureDragEnd: (evt: any) => void;
        componentDidMount(): void;
        componentWillUnmount(): void;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<OwnProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<OwnProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    new (props: OwnProps, context?: any): {
        hover: number[];
        draggedChildren: React.ReactElement<FeatureProps, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>[] | undefined;
        id: string;
        getChildren: () => React.ReactElement<FeatureProps, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>[];
        getChildFromId: (children: React.ReactElement<FeatureProps, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>[], id: number) => React.ReactElement<FeatureProps, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
        areFeaturesDraggable: (children: React.ReactElement<FeatureProps, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>[], featureIds?: number[]) => boolean;
        onClick: (evt: any) => void;
        onMouseEnter: (evt: any) => void;
        onMouseLeave: (evt: any) => void;
        onMouseDown: () => void;
        onTouchStart: (evt: any) => void;
        onFeatureDown: (startEvent: string) => void;
        onFeatureDragStart: (evt: any) => void;
        onFeatureDrag: (evt: any) => void;
        onFeatureDragEnd: (evt: any) => void;
        componentDidMount(): void;
        componentWillUnmount(): void;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<OwnProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<OwnProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    contextType?: React.Context<any> | undefined;
};
export default layerMouseTouchEvents;
