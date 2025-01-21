import React from "react"
import { View, TextInput, StyleSheet} from "react-native"

export const FeedbackScreen = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.nameContainer, { marginTop: 20 }]}>
        <TextInput
          placeholder="First Name"
          style={styles.textInputStyles}
          />
        <TextInput
          placeholder="Last Name"
          style={styles.textInputStyles}
          />
      </View>
      <View>
        <TextInput
          placeholder="Email address"
          style={[styles.textInputStyles, { width: '100%' }]}
          />
      </View>
      <View>
        <TextInput
          multiline
          placeholder="Enter feedback"
          style={[styles.textInputStyles, { width: '100%', height: '60%' }]}
        />
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    gap: 20,
    marginHorizontal: 10
  },
  textInputStyles: {
    borderColor: 'black',
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 10,
    width: '50%'
  },
  nameContainer: {
    flexDirection: 'row',
    gap: 5
  }
})