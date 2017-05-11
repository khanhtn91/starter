import React from 'react'
import {
  TextInput as _TextInput,
  TouchableOpacity,
  Text,
  View
} from 'react-native'
import { Field as _Field } from 'redux-form'

function TextInput ({ input: { onChange, ...inputRest }, ...rest }) {
  const { meta } = rest
  return (
    <View>
      <_TextInput
        onChangeText={onChange}
        autoCorrect={false}
        autoCapitalize='none'
        {...inputRest}
        {...rest}
      />
      {meta.touched && meta.error &&
        <Text style={{ color: '#f00', fontStyle: 'italic' }}>{meta.error}</Text>
      }
    </View>
  )
}

function Field ({ name, ...rest }) {
  return <_Field name={name} {...rest} component={TextInput} />
}

function SubmitButton ({ style, label, onSubmit }) {
  return (
    <TouchableOpacity onPress={onSubmit}>
      <Text style={style}>{label}</Text>
    </TouchableOpacity>
  )
}

export {
  Field,
  SubmitButton
}
