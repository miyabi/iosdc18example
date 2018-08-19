/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import * as React from 'react'
import { Dimensions, FlatList, Platform, StyleSheet, Text, View } from 'react-native'
import { withSafeArea } from 'react-native-safe-area'
import codePush from 'react-native-code-push'
import ImageListItem from './components/ImageListItem'
import config from './config'

const SafeAreaFlatList = withSafeArea(FlatList, 'contentInset')

const apiUri = 'https://api.flickr.com/services/rest?method=flickr.photos.search&text=cat&sort=relevance&format=json&nojsoncallback=1&extras=url_n'
const cellCount = 2
const defaultImage = require('./images/default-image.png')

type ImageData = {
  id: string,
  uri: string,
};
type ImageListItemData = {
  images: Array<ImageData>,
}; 

type Props = {};
type State = {
  imageListItems: Array<ImageListItemData>,
};

class App extends React.Component<Props, State> {
  static defaultProps = {}
  state = {
    imageListItems: [],
  }
  imageSize = 0
  renderItem = this.renderItem.bind(this)

  componentDidMount(): void {
    const { width } = Dimensions.get('window')
    this.imageSize = (width - (cellCount + 1)) / cellCount

    this.fetchImages()
  }

  async fetchImages(): Promise<void> {
    const response = await fetch(
      `${apiUri}&api_key=${config.apiKey}`, {
        method: 'GET',
      }
    )
      .catch((error) => {
        console.log(error)
        return null
      })

    if (response) {
      const responseText = await response.text()
      const { stat, photos } = JSON.parse(responseText)
      if (stat === 'ok' && Array.isArray(photos.photo)) {
        console.log(photos.photo)

        const images: Array<ImageData> = photos.photo
          .filter(_ => !!_.url_n)
          .map(({ id, url_n }) => ({ id, uri: url_n }))

        console.log(`${images.length} images found.`)

        this.updateListItems(images)
      } else {
        console.log(responseText)
      }
    }
  }

  updateListItems(images: Array<ImageData>) {
    const imageListItems: Array<ImageListItemData> = images
      .reduce((acc, image) => {
        let imageListItem
        if (acc.length >= 1) {
          imageListItem = acc[acc.length - 1]
          if (imageListItem.images.length >= cellCount) {
            imageListItem = undefined
          }
        }
        if (!imageListItem) {
          imageListItem = { images: [] }
          acc.push(imageListItem)
        }
        imageListItem.images.push(image)
        return acc
      }, [])

    this.setState({ imageListItems })
  }

  renderItem({ item }: { item: ImageListItemData }): React.Node {
    return (
      <ImageListItem
        imageUris={item.images.map(_ => _.uri)}
        imageSize={this.imageSize}
        defaultImage={defaultImage}
      /> 
    )
  }

  render(): React.Node {
    const { imageListItems } = this.state
    if (imageListItems.length < 1) {
      return (
        <View style={styles.loadingTextContainer}>
          <Text style={styles.loadingText}>
            {'Searching for images...'}
          </Text>
        </View>
      )
    }

    return (
      <SafeAreaFlatList
        style={styles.container}
        renderItem={this.renderItem}
        data={imageListItems}
        keyExtractor={(_, index) => `${index}`}
        initialNumToRender={5}
        removeClippedSubviews
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#000000',
  },
})

App = codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
})(App)
export default App
