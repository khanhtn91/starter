import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  ListView,
  TouchableHighlight
} from 'react-native'
import Modal from 'react-native-modalbox'

const screen = Dimensions.get('window')

/**
 * USAGE
 * Add <PopupSelectModal.PopupSelect /> into the most parent component
 * Then put this component :
 *
 *  dataSource structure:
 *  [
 *    {id: i, title:`item${i}`}
 *    {id: i, title:`item${i}`}
 *    {id: i, title:`item${i}`}
 *  ]
 *
 *  <TouchableOpacity
 *    onPress={() => PopupSelectModal.open({
 *      onSelect: (item) => this.setState({selectedItem: item}),
 *      dataSource,
 *        buttons: [
 *          {
 *            onPress: () => { console.log('on sync') },
 *            style: {},
 *            textStyle: {},
 *            title: 'Sync',
 *            willClose: true
 *          },
 *          {
 *            onPress: () => { console.log('on sort') },
 *            style: {},
 *            textStyle: {},
 *            title: 'Sort'
 *          }
 *        ]
 *      }
 *   )}
 *  >
 *    <Text style={[styles.btnText, { backgroundColor: '#ddd' }]}>{this.state.selectedItem.title || 'Popup'}</Text>
 *  </TouchableOpacity>
 *
 */
class PopupSelect extends Component {
  constructor (props) {
    super(props)

    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      selectedItem: {}
    }
  }

  componentDidMount () {
    PopupSelect.instance = this
  }

  componentWillUnmount () {
    delete PopupSelect.instance
  }

  open = (props) => {
    this.refs.modal.open()
    this.setState({ ...props })
  }

  close = () => {
    this.refs.modal.close()
  }

  onItemChoose = (rowData) => {
    const { onSelect } = this.state

    this.setState({ selectedItem: rowData })
    if (onSelect) {
      onSelect(rowData)
    }
    this.refs.modal.close()
  }

  renderList = () => {
    const { dataSource } = this.state
    let list = []

    if (!dataSource) {
      return this.dataSource.cloneWithRows(list)
    }
    list = this.dataSource.cloneWithRows(dataSource)
    return list
  }

  render () {
    const { highlightBackgroundColor, itemStyle, itemTextStyle, buttons } = this.state
    return (
      <View style={styles.wrapper}>
        <Modal style={[styles.modal]}
          position={'center'}
          ref={'modal'}
          backdropOpacity={0}
        >
          <ListView
            showsVerticalScrollIndicator
            style={styles.itemWrapper}
            dataSource={this.renderList()}
            enableEmptySections
            renderRow={(rowData, id) => {
              let backgroundColor = (this.state.selectedItem.id && this.state.selectedItem.id === rowData.id)
                ? { backgroundColor: highlightBackgroundColor || '#ccc' } : {}
              return (
                <TouchableHighlight key={id}
                  style={[styles.item, backgroundColor, itemStyle || {}]}
                  onPress={() => this.onItemChoose(rowData)}
                  underlayColor='#ddd'
                >
                  <Text style={itemTextStyle}>{rowData.title}</Text>
                </TouchableHighlight>
              )
            }}
          />
          <View style={styles.footer}>
            {buttons && buttons.map((button, id) => (
              <TouchableOpacity
                key={id}
                onPress={() => {
                  button.onPress()
                  if (button.willClose) {
                    this.refs.modal.close()
                  }
                }}
                style={[styles.btn, button.style]}
              >
                <Text style={[styles.btnText, button.textStyle]}>{button.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      </View>
    )
  }
}

const PopupSelectModal = {
  PopupSelect,
  open: (props) => {
    if (PopupSelect.instance) {
      PopupSelect.instance.open(props)
    }
  },
  close: () => {
    if (PopupSelect.instance) {
      PopupSelect.instance.close()
    }
  }
}

export default PopupSelectModal

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    paddingTop: 50,
    flex: 1,
    zIndex: 999
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: screen.height / 3,
    width: screen.width * 2 / 3,
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1
  },
  btn: {
    width: 100,
    margin: 10,
    padding: 6,
    backgroundColor: '#2d6ec7',
    borderRadius: 4,
    alignItems: 'center'
  },
  btnText: {
    color: '#fff'
  },
  btnModal: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: 'transparent'
  },
  text: {
    color: '#000',
    fontSize: 22
  },
  picker: {
    width: 150,
    borderWidth: 0
  },
  itemWrapper: {
    width: '100%'
  },
  item: {
    width: '100%',
    padding: 10
  },
  footer: {
    flexDirection: 'row',
    width: '100%',
    borderColor: '#ccc',
    borderTopWidth: 1,
    paddingTop: 10,
    justifyContent: 'flex-end'
  }
})
