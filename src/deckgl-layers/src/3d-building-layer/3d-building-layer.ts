// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import GL from '@luma.gl/constants';
import {CompositeLayer} from '@deck.gl/core';
import {TileLayer as DeckGLTileLayer} from '@deck.gl/geo-layers';
import {SolidPolygonLayer, SolidPolygonLayerProps} from '@deck.gl/layers';

import {getTileData} from './3d-building-utils';
import {ThreeDBuildingLayerProps, TileDataItem} from './types';

export default class ThreeDBuildingLayer extends CompositeLayer<any, ThreeDBuildingLayerProps> {
  // this layer add its subLayers to the redux store, and push sample data

  renderSubLayers(props: SolidPolygonLayerProps<any>) {
    return new SolidPolygonLayer<TileDataItem>({
      ...props,
      parameters: {
        blendFunc: [GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA, GL.ONE, GL.ONE_MINUS_SRC_ALPHA],
        blendEquation: [GL.FUNC_ADD, GL.FUNC_ADD]
      },
      extruded: true,
      opacity: 1,
      filled: true,
      getElevation: (feature: TileDataItem) => feature.properties.height || 0,
      getPolygon: (feature: TileDataItem) => feature.coordinates,
      getFillColor: this.props.threeDBuildingColor
    });
  }

  renderLayers() {
    return [
      new DeckGLTileLayer({
        id: `${this.id}-deck-3d-building` as string,
        getTileData: (tile: {
          x: number;
          y: number;
          z: number;
          url: string;
          bbox: any;
          signal: AbortSignal;
        })  =>
          getTileData(this.props.mapboxApiUrl, this.props.mapboxApiAccessToken,  {index: {x:tile.x, y: tile.y, z: tile.z}}),
        minZoom: 13,
        renderSubLayers: this.renderSubLayers.bind(this),
        updateTriggers: this.props.updateTriggers
      })
    ];
  }
}
