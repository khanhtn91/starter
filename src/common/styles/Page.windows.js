import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  baseContainer: {
    width: undefined,
    height: undefined,
    flex: 1,
    backgroundColor: 'black'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  card: {
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 10
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent'
  },
  actionButton: {
    position: 'absolute',
    bottom: 40,
    right: 35,
    width: 50,
    height: 50
  }
})
