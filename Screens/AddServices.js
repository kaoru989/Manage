import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { AuthContext } from '../App'; // Giả định rằng bạn có AuthContext

const AddService = ({ navigation }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng hiện tại

  const addService = async () => {
    if (!name || !price) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
  
    try {
      // Lấy ID dịch vụ mới nhất
      const servicesRef = collection(db, 'service');
      const q = query(servicesRef, orderBy('id', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      let newId = 1;
      if (!querySnapshot.empty) {
        const latestId = querySnapshot.docs[0].data().ID;
        newId = (typeof latestId === 'number' ? latestId : parseInt(latestId, 10)) + 1;
      }
  
      const currentTime = new Date();
      await addDoc(collection(db, 'service'), {
        ID: newId,
        name,
        price: parseFloat(price),
        creator: user.fullname, // Giả định rằng đối tượng user có fullname
        time: currentTime,
        update: currentTime
      });
  
      Alert.alert('Thành công', 'Dịch vụ đã được thêm thành công', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Lỗi khi thêm dịch vụ: ', error);
      Alert.alert('Lỗi', 'Không thể thêm dịch vụ');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thêm dịch vụ mới</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên dịch vụ"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Giá"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={addService}>
        <Text style={styles.buttonText}>Thêm dịch vụ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFC0CB', // Màu nền hồng
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#6A82FB', // Màu tiêu đề xanh
  },
  input: {
    height: 40,
    borderColor: '#6A82FB', // Viền xanh
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    backgroundColor: '#FFFFFF', // Nền trắng
  },
  button: {
    backgroundColor: '#6A82FB', // Màu nút xanh
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF', // Màu chữ trắng
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AddService;
