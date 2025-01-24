import React from "react"
import { View, TextInput, StyleSheet, Text} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

export const FeedbackScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <TextInput
          placeholder="First Name"
          style={[styles.textInputStyles, { width: '50%' }]}
          />
        <TextInput
          placeholder="Last Name"
          style={[styles.textInputStyles, { width: '50%' }]}
          />
      </View>
      <TextInput
        placeholder="Email address"
        style={styles.textInputStyles}
        />
      <TextInput
        multiline
        placeholder="Enter feedback"
        style={[styles.textInputStyles, { height: 200 }]}
      />
      <TouchableOpacity style={styles.submitButtonContainer}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    marginHorizontal: 10,
    marginTop: 30,
  },
  textInputStyles: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  submitButtonContainer: {
    backgroundColor: '#34ceff',
    alignItems: 'center',
    padding: 15,
    borderRadius: 25
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16
  }
})