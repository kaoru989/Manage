import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Button, Input, Icon } from 'react-native-elements';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function EmployeeItem({ employee, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(employee.name);
  const [editedEmail, setEditedEmail] = useState(employee.email);
  const [editedAge, setEditedAge] = useState(employee.age.toString());

  const handleUpdate = async () => {
    if (!isValidInput(editedName) || !isValidInput(editedAge)) {
      alert('Invalid input. Please use only letters, numbers, and spaces.');
      return;
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedEmail)) {
      alert('Please enter a valid email address');
      return;
    }
  
    const age = parseInt(editedAge, 10);
    if (isNaN(age) || age < 18 || age > 100) {
      alert('Please enter a valid age between 18 and 100');
      return;
    }
  
    if (!(await isEmailUnique(editedEmail.trim())) && editedEmail.trim() !== employee.email) {
      alert('This email is already in use');
      return;
    }
  
    try {
      const employeeRef = doc(db, 'employees', employee.id);
      await updateDoc(employeeRef, {
        name: editedName.trim(),
        email: editedEmail.trim(),
        age: age,
      });
      onUpdate({ ...employee, name: editedName.trim(), email: editedEmail.trim(), age: age });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating employee: ', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'employees', employee.id));
      onDelete(employee.id);
    } catch (error) {
      console.error('Error deleting employee: ', error);
    }
  };

  if (isEditing) {
    return (
      <Card containerStyle={styles.card}>
        <Input
          value={editedName}
          onChangeText={setEditedName}
          placeholder="Name"
          containerStyle={styles.input}
        />
        <Input
          value={editedEmail}
          onChangeText={setEditedEmail}
          placeholder="Email"
          keyboardType="email-address"
          containerStyle={styles.input}
        />
        <Input
          value={editedAge}
          onChangeText={setEditedAge}
          placeholder="Age"
          keyboardType="numeric"
          containerStyle={styles.input}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Save"
            onPress={handleUpdate}
            buttonStyle={[styles.button, styles.saveButton]}
          />
          <Button
            title="Cancel"
            onPress={() => setIsEditing(false)}
            buttonStyle={[styles.button, styles.cancelButton]}
          />
        </View>
      </Card>
    );
  }

  return (
    <Card containerStyle={styles.card}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.name}>{employee.ID}</Text>
          <Text style={styles.name}>{employee.name}</Text>
          <Text style={styles.email}>{employee.email}</Text>
          <Text style={styles.age}>Age: {employee.age}</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Icon
              name="edit"
              type="feather"
              color="#007AFF"
              containerStyle={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Icon
              name="trash-2"
              type="feather"
              color="#FF3B30"
              containerStyle={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#E8DAD6', // Background color for the card
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  age: {
    fontSize: 14,
    color: '#666',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 16,
  },
  input: {
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#FFFFFF', // Input background color
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
});
