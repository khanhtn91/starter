'use strict'

import React, { Component } from 'react'
import {
  View,
  ScrollView,
  Slider,
  Text,
  TouchableOpacity
} from 'react-native'

export default class ListItemsPager extends Component {
  constructor (props) {
    super(props)
    this.state = {
      total: 0,
      page: 0,
      perPage: 20,
      offset: 0,
      lastWidth: props.width,
      lastHeight: props.height
    }
  }

  _scrollView = null

  componentWillReceiveProps (nextProps) {
    const { lastWidth, lastHeight } = this.state
    if (nextProps.isPrepared && (nextProps.width !== lastWidth || nextProps.height !== lastHeight)) {
      this._scrollView.scrollTo({ x: 0 })

      let perLine = Math.floor(nextProps.width / nextProps.itemWidth)
      let perColumn = Math.floor(nextProps.height / nextProps.itemHeight)
      let perPage = perLine * perColumn || 1

      this.setState({
        total: Math.ceil(nextProps.products.length / perPage),
        lastWidth: nextProps.width,
        lastHeight: nextProps.height,
        page: 1,
        perPage
      })
    }
  }

  // TODO : mutilple scrollview is a bad performent way ( a listview can't do this case)
  renderItems (products) {
    const { perPage, total } = this.state
    const { width, height, renderItem, isReadyToShow } = this.props
    let views = []
    for (let i = 0; i < total; i++) {
      let pagedItem = products.slice(i * perPage, i * perPage + perPage)
      views.push(
        (<ScrollView
          key={i}
          scrollEventThrottle={200}
          automaticallyAdjustContentInsets={false}
          contentContainerStyle={styles.subListContainer}
          style={{ width, height }}
        >
          {(isReadyToShow && pagedItem) && pagedItem.map(item => renderItem(item))}
        </ScrollView>)
      )
    }
    return views.map(item => item)
  }

  _onChangePage (value) {
    const { width } = this.props
    value = value || 1
    if (this._scrollView) {
      this._scrollView.scrollTo({ x: (value - 1) * width })
      this.setState({
        page: value
      })
    }
  }

  _pagerControl (type, data) {
    const { total } = this.state
    const { width } = this.props

    switch (type) {
      case 'next':
        data++
        if (data <= total) {
          this._scrollView.scrollTo({ x: (data - 1) * width })
          this.setState({
            page: data
          })
        }
        break
      case 'back':
        data--
        if (data >= 1) {
          this._scrollView.scrollTo({ x: (data - 1) * width })
          this.setState({
            page: data
          })
        }
        break
    }
  }

  render () {
    const { products, height, isPrepared } = this.props
    const { total, page } = this.state
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row', height: height - 50 }}>
          <ScrollView
            horizontal
            style={styles.recordList}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: 'row' }}
            scrollEventThrottle={16}
            ref={scrollView => { this._scrollView = scrollView }}
          >
            {(isPrepared && total > 0) && this.renderItems(products)}
          </ScrollView>
          {(page > 1) && (
            <TouchableOpacity
              onPress={() => this._pagerControl('back', page)}
              style={[styles.pagerControl, { left: 0, top: height / 3 }]}
            >
              <Text style={styles.pagerControlText}> {`<`} </Text>
            </TouchableOpacity>
          )}
          {(page < total) && (
            <TouchableOpacity
              onPress={() => this._pagerControl('next', page)}
              style={[styles.pagerControl, { right: 0, top: height / 3 }]}
            >
              <Text style={styles.pagerControlText}> {`>`} </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ height: 50, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Slider
              minimumValue={1}
              maximumValue={total}
              value={page}
              step={1}
              onValueChange={value => this._onChangePage(value)}
            />
          </View>
          <View style={{ width: 80, alignItems: 'center', paddingTop: 5 }}>
            <Text>{`${page} / ${total}`}</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = {
  pagerControl: {
    position: 'absolute',
    width: 25,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center'

  },
  pagerControlText: {
    color: '#fff',
    fontSize: 20,
    paddingBottom: 5
  },
  recordList: {
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5
  },
  subListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch'
  }
}
