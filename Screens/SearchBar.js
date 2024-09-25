// SearchBar.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

export default function SearchBar({ value, onChangeText, theme }) {
  return (
    <View style={[styles.container, { backgroundColor: theme.searchBackground }]}>
      <Icon name="search" type="feather" color={theme.textSecondary} size={20} />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder="Search employees..."
        placeholderTextColor={theme.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
});