'use strict'

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import IconButton from './IconButton'

export default class PopupCalendar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      resultDisplay: '0',
      result: 0,
      currentFontSize: DEFAULT_RESULT_FONT_SIZE
    }
  }

  validateResultLength = (number) => {
    let resultLength = (number).toString().length
    return resultLength <= MAX_RESULT_LENGTH
  }

  resetFontSize = (result) => {
    let currentResultLength = (result).toString().length
    if (currentResultLength <= MAX_NUMBER_IN_ROW) {
      this.setState({
        currentFontSize: DEFAULT_RESULT_FONT_SIZE
      })
      return true
    }
    let currentFontStyle = this.state.currentFontSize
    if (currentFontStyle < DEFAULT_RESULT_FONT_SIZE) {
      return false
    }
    this.setState({
      currentFontSize: currentFontStyle - 2
    })
  }

  actionNumberPress = (number) => {
    let newResult = `${this.state.result}${number}`
    if (!this.validateResultLength(newResult)) {
      return false
    }
    let newResultDisplay = parseInt(newResult).toLocaleString('en-US', { minimumFractionDigits: 0 })

    this.setState({
      resultDisplay: newResultDisplay,
      result: parseInt(newResult)
    })
    this.resetFontSize(newResult)
  }

  actionCPress = () => {
    this.setState({
      resultDisplay: '0',
      result: 0
    })
    this.resetFontSize(0)
  }

  actionBSPress = () => {
    let oldResult = this.state.result
    let newResult = oldResult.toString().length === 1 ? 0 : parseInt((oldResult.toString()).substr(0, (oldResult.toString()).length - 1))
    if (!this.validateResultLength(newResult)) {
      return false
    }
    let newResultDisplay = parseInt(newResult).toLocaleString('en-US')

    this.setState({
      resultDisplay: newResultDisplay,
      result: newResult
    })
    this.resetFontSize(newResult)
  }

  generateFeatureButtons = () => ([
    [
      { title: '7', flex: 1, onPress: () => { this.actionNumberPress('7') } },
      { title: '8', flex: 1, onPress: () => { this.actionNumberPress('8') } },
      { title: '9', flex: 1, onPress: () => { this.actionNumberPress('9') } },
      { title: 'C', flex: 1, style: { backgroundColor: '#F2CFCE' }, onPress: () => { this.actionCPress() } }
    ],
    [
      { title: '4', flex: 1, onPress: () => { this.actionNumberPress('4') } },
      { title: '5', flex: 1, onPress: () => { this.actionNumberPress('5') } },
      { title: '6', flex: 1, onPress: () => { this.actionNumberPress('6') } },
      { title: 'BS', flex: 1, style: { backgroundColor: '#F2CFCE' }, onPress: () => { this.actionBSPress() } }
    ],
    [
      { title: '1', flex: 1, onPress: () => { this.actionNumberPress('1') } },
      { title: '2', flex: 1, onPress: () => { this.actionNumberPress('2') } },
      { title: '3', flex: 1, onPress: () => { this.actionNumberPress('3') } }
    ],
    [
      { title: '0', flex: 1, onPress: () => { this.actionNumberPress('0') } },
      { title: '00', flex: 2, onPress: () => { this.actionNumberPress('00') } }
    ]
  ])

  render () {
    const { extraButtons, onClose, position } = this.props
    let listFeatureButton = this.generateFeatureButtons()
    if (extraButtons) {
      listFeatureButton.push(extraButtons)
    }

    let modalPotsition = {}
    if (position && position.left && position.top) {
      modalPotsition = position
    }

    return (
      <View style={[nStyle.componentContainer, modalPotsition]}>
        <View style={nStyle.titleSide}>
          <View style={nStyle.titleTextWrapper}>
            <Text style={nStyle.titleText}>Please enter the quantity of Ten Thousand Yen Bill.</Text>
          </View>
          <View style={nStyle.titleButtonWrapper}>
            <IconButton
              text
              icon='md-close'
              type='ionic'
              color='#ccc'
              iconSize={30}
              containerStyle={{ backgroundColor: 'transparent', marginLeft: 10 }}
              onPress={() => onClose()}
            />
          </View>
        </View>
        <View style={nStyle.resultSide}>
          <Text style={[nStyle.resultText, { fontSize: this.state.currentFontSize }]}>
            {this.state.resultDisplay}
          </Text>
        </View>
        {listFeatureButton.map((listButton, index) => (
          <View key={index} style={nStyle.featureSide}>
            {listButton.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  nStyle.featureButton,
                  { width: (BUTTON_FEATURE_WIDTH * button.flex) + (BUTTON_FEATURE_MARGIN * (button.flex - 1)) },
                  button.style
                ]}
                onPress={!button.type ? button.onPress : () => { button.onPress(this.state.result) }}
              >
                <Text style={nStyle.featureButtonText}>{button.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    )
  }
}

const BUTTON_FEATURE_WIDTH = 53
const BUTTON_FEATURE_MARGIN = 10
const MAX_NUMBER_IN_ROW = 13
const MAX_RESULT_LENGTH = 15
const DEFAULT_RESULT_FONT_SIZE = 26

const nStyle = StyleSheet.create({
  componentContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: 264,
    minHeight: 350,
    maxHeight: 400,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10
  },
  titleSide: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 10,
    flexDirection: 'row'
  },
  titleTextWrapper: {
    flex: 3
  },
  titleText: {
    fontSize: 18
  },
  titleButtonWrapper: {
    flex: 1,
    justifyContent: 'space-around'
  },
  resultSide: {
    backgroundColor: '#3e3d3d',
    borderWidth: 0,
    alignItems: 'flex-end',
    height: 36,
    justifyContent: 'space-around',
    paddingRight: 9
  },
  resultText: {
    height: 36,
    color: '#fff',
    fontSize: 26
  },
  featureSide: {
    marginTop: 10,
    flexDirection: 'row'
  },
  featureButton: {
    width: 53,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginRight: 10
  },
  featureButtonText: {
    fontSize: 19
  }
})
