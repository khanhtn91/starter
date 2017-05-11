'use strict'

import React, { Component } from 'react'
import {
  WebView
} from 'react-native'

export default class ChartColumn extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  convertToStringArray (data) {
    let result = []
    if (Object.prototype.toString.call(data) !== '[object Array]' || data.length <= 0) {
      return '[]'
    }
    data.forEach((element) => {
      if (element[0] && element[1]) {
        let item = `['${element[0]}', ${element[1]}`
        if (element[2]) {
          item += `, '${element[2]}'`
        }
        item += ']'

        result.push(item)
      }
    })

    return (result.length > 0) ? `[${result.join(',')}]` : '[]'
  }

  render () {
    const { data, mStyle } = this.props
    let arrayString = this.convertToStringArray(data)

    return (
      <WebView
        style={mStyle}
        source={require('../../assets/chartColumn.html')}
        injectedJavaScript={`
          setTimeout(function () {
              var data=${arrayString};
              window.onresize = function(event) {
                  var data=${arrayString};
                  document.getElementById('chart').innerHTML = '';
                  render(data);
              };
              render(data);
          }, 300);
        `}
        automaticallyAdjustContentInsets={false}
        decelerationRate='normal'
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
      />
    )
  }
}
