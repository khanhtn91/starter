import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  PanResponder
} from 'react-native'
import NumberPad from './NumberPad'

class Modal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      x: 0,
      y: 0
    }

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gesture) => {
        this._left = this._previousLeft + gesture.dx
        this._top = this._previousTop + gesture.dy

        this.setState({
          x: this._left,
          y: this._top
        })
      },
      onPanResponderRelease: (e, gesture) => {
        this._previousLeft += gesture.dx
        this._previousTop += gesture.dy
      }
    })
  }

  _previousLeft = null
  _previousTop = null
  _left = null
  _top = null

  panResponder = null

  componentDidMount () {
    Modal.instance = this
  }

  componentWillUnmount () {
    delete Modal.instance
  }

  resetPosition = () => {
    this.setState({
      x: 0,
      y: 0
    })
  }

  open = () => {
    this.setState({
      show: !(this.state.show)
    })
  }

  close = () => {
    this.setState({
      show: !(this.state.show)
    })
  }

  render () {
    const { extraButtons } = this.props
    const { show, x, y } = this.state
    const popupContainer = show ? { width: '100%', height: '100%' } : {}

    return (
      <View
        onStartShouldSetResponder={() => true}
        onResponderRelease={(e, gesture) => {
          NumberPadModal.close()
        }}
        style={[pStyle.popupContainer, popupContainer]}
      >
        {show && (
          <View style={pStyle.popupDisplay}>
            <View
              style={{
                width: 264,
                minHeight: 350,
                maxHeight: 400
              }}
              {...this.panResponder.panHandlers}
            >
              <NumberPad
                position={{ left: x, top: y }}
                onClose={() => { NumberPadModal.close() }} extraButtons={extraButtons}
              />
            </View>
          </View>
        )}
      </View>
    )
  }
}

/*
 TODO: USAGE: add this component (<NumberPadModal.Modal />) to the most outside component
 TODO: add NumberPadModal.open() to button or anything else to open it
 TODO: add NumberPadModal.close() to button or anything else to close it
*/
const NumberPadModal = {
  Modal,
  open: () => {
    if (Modal.instance) {
      Modal.instance._previousLeft = null
      Modal.instance._previousTop = null
      Modal.instance._left = null
      Modal.instance._top = null
      Modal.instance.resetPosition()
      Modal.instance.open()
    }
  },
  close: () => {
    if (Modal.instance) {
      Modal.instance.close()
    }
  }
}

const pStyle = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    zIndex: 999,
    backgroundColor: 'transparent'
  },
  buttonShow: {
    width: 115,
    height: 35,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 2,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  buttonShowText: {
    color: '#333'
  },
  popupDisplay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  }
})

export default NumberPadModal
