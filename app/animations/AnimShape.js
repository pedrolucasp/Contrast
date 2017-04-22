// @flow
import React from 'react';
import {
  ART,
  LayoutAnimation,
} from 'react-native';

const {
  Shape,
} = ART;

import Morph from 'art/morph/path';

import * as shape from 'd3-shape';

const d3 = {
  shape,
};

type Props = {
  color: any,
  opacity: any,
  d: () => any,
};

const AnimationDurationMs = 850;

export default class AnimShape extends React.Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      path: '',
    }
  }

  componentWillMount() {
    this.computeNextState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.computeNextState(nextProps);
  }

  computeNextState(nextProps) {
    const {
      d,
    } = nextProps;

    const graph = this.props.d();

    this.setState({
      path: graph.path,
    });

    if (!this.previousGraph) {
      this.previousGraph = graph;
    }

    if (this.props !== nextProps) {
      const pathFrom = this.previousGraph.path;
      const pathTo = graph.path;

      cancelAnimationFrame(this.animating);
      this.animating = null;

      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          AnimationDurationMs,
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.opacity
        )
      );

      this.setState({
        path: Morph.Tween(
          pathFrom,
          pathTo,
        ),
      }, () => {
        this.animate();
      });

      this.previousGraph = graph;
    }
  }

  animate(start) {
    this.animating = requestAnimationFrame((timestamp) => {
      if (!start) {
        start = timestamp;
      }

      const delta = (timestamp - start) / AnimationDurationMs;

      if (delta > 1) {

        this.animating = null;
        this.setState({
          path: this.previousGraph.path,
        });

        return;
      }

      this.state.path.tween(delta);

      this.setState(this.state, () => {
        this.animate(start);
      });
    });
  }

  render() {
    const path = this.state.path;
    return (
       <Shape
         d={path}
         stroke={this.props.color}
         fill={this.props.color}
         opacity={this.props.opacity}
         />
    );
  }
}
