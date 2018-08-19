// @flow

import * as React from 'react'
import { Animated, Image, StyleSheet, View, ViewPropTypes } from 'react-native'

type Props = {
  style: ViewPropTypes.style,
  uri: string,
  defaultImage: Image.propTypes.source,
};
type State = {
  isLoaded: boolean,
  opacity: Animated.Value,
};

export default class ImageLoader extends React.Component<Props, State> {
  static defaultProps = {
    style: {},
    defaultImage: undefined,
  }
  state = {
    isLoaded: false,
    opacity: new Animated.Value(0),
  }
  onLoad = this.onLoad.bind(this)

  onLoad(): void {
    console.log(`Loaded: ${this.props.uri}`)
    Animated.timing(this.state.opacity, {
      duration: 500,
      toValue: 1,
    })
      .start()
  }

  render(): React.Node {
    const { style } = this.props
    const { width, height } = StyleSheet.flatten([style]) || {}
    return (
      <View style={style}>
        <Image
          style={[styles.defaultImage, { width, height }]}
          source={this.props.defaultImage}
        />
        <Animated.View style={[styles.imageContainer, { opacity: this.state.opacity }]}>
          <Image
            style={{ width, height }}
            source={{ uri: this.props.uri }}
            onLoad={this.onLoad}
          />
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  defaultImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
})
