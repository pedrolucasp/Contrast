// @flow
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ART,
} from 'react-native';

const { Surface, Group, Rectangle, ClippingRectangle, LinearGradient, Shape } = ART;

import AnimShape   from '../animations/AnimShape';
import * as scale  from 'd3-scale';
import * as shape  from 'd3-shape';
import * as format from 'd3-format';
import * as axis   from 'd3-axis';

const d3 = { scale, shape, format, axis };

import { scaleBand, scaleLinear } from 'd3-scale';

type Props = {
  height: number,
  width: number,
  color: any,
  data: any
};

const margin = 20;
const AnimationDurationMs = 250;

export class HourlyChart extends React.Component {

  constructor(props: Props) {
    super(props);
    this.createArea    = this.createArea.bind(this);
    this.valueForX     = this.valueForX.bind(this);
    this.valueForY     = this.valueForY.bind(this);
  }

  valueForY(item, index) {
    // Invert the temperature value, so the graph will be displayed 
    // pointing to the correct direction
    return -item.temperature;
  }

  valueForX(item, index) { 
    // This will determinate the graph width
    return index * 15.5; 
  }

  createArea(data) {
    var self = this;
    var area = d3.shape.area()
        .x(function(d, index) { return self.valueForX(d, index); })
        .y1(function(d, index) { return self.valueForY(d, index); })
        .curve(d3.shape.curveNatural)
        (data)

    return { path : area };
  }

  setColor(chartType) {
    return chartType == 'past' ? '#E4C478' : '#74B49B';
  }

  hoursLabels() {
    return this.props.past.slice(0, 12).map((h, i) => (
      <Text key={i} style={[styles.barText]}>{i * 2}</Text>
    ));
  }

  render() {
    const x = 72;
    const y = this.props.height - 10;

    return (
      <View width={this.props.width} height={this.props.height}>
        <Surface width={this.props.width} height={this.props.height}>
           <Group x={x} y={y}>
             <AnimShape
               color={this.setColor('past')}
               d={() => this.createArea(this.props.past)} />

             <AnimShape
               color={this.setColor('future')}
               opacity={0.5}
               d={() => this.createArea(this.props.future)} />
           </Group>
        </Surface>

        <View style={styles.container}>
          <View style={styles.chartItems}>{this.hoursLabels()}</View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 500,
  },

  chartItems: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginLeft: 70
  },

  barText: {
    fontSize: 11,
    textAlign: 'center',
    marginRight: 2,
    width: 28,
    fontWeight: 'bold',
    color: '#ff666688'
  }
});