import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

export default function ErrorMessage({ message }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  text: {
    color: '#FF3B30',
    fontSize: 14,
  },
});