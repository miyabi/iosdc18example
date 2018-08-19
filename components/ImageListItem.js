// @flow

import * as React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import ImageLoader from './ImageLoader'

type Props = {
  imageUris: Array<string>,
  imageSize: number,
  defaultImage: Image.propTypes.source,
};
type State = {};

export default class ImageListItem extends React.Component<Props, State> {
  static defaultProps = {
    imageUris: [],
    imageSize: 0,
    defaultImage: undefined,
  }
  state = {}

  render(): React.Node {
    const { imageUris, imageSize } = this.props

    if (imageUris.length < 1) {
      return null
    }

    return (
      <View style={styles.container}>
        {
          imageUris
            .map((_, index) => (
              <ImageLoader
                key={index}
                style={[styles.image, { width: imageSize, height: imageSize }]}
                uri={_}
                defaultImage={this.props.defaultImage}
              />
            ))
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  image: {
    marginLeft: 1,
    marginBottom: 1,
    backgroundColor: '#f1f3f4',
  },
})
