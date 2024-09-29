import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { collection, getDocs, doc, deleteDoc, addDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../App';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

const theme = {
  background: '#FFC0CB',  // Màu nền hồng
  text: '#171717',
  primary: '#6A82FB',     // Màu chính xanh
  secondary: '#444444',
  accent: '#FFFFFF',      // Màu phụ trắng
};

const Home = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddServiceVisible, setIsAddServiceVisible] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '' });
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  
  useEffect(() => {
    navigation.setOptions({
      headerTitle: `${user?.fullname || 'Admin'}`,
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarButton}>
          <Icon name="account-circle" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, user]);

  useFocusEffect(
    React.useCallback(() => {
      fetchServices();
    }, [])
  );

  const fetchServices = async () => {
    const servicesCollection = collection(db, 'service');
    const servicesSnapshot = await getDocs(servicesCollection);
    const servicesList = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setServices(servicesList);
  };

  const handleDelete = (serviceId) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa dịch vụ này?",
      [ 
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa", 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "service", serviceId));
              fetchServices();
            } catch (error) {
              console.error("Lỗi khi xóa dịch vụ: ", error);
              Alert.alert("Lỗi", "Không thể xóa dịch vụ. Vui lòng thử lại.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      fetchServices();
      return;
    }

    const servicesCollection = collection(db, 'service');
    const q = query(servicesCollection, where("name", ">=", searchQuery), where("name", "<=", searchQuery + '\uf8ff'));
    const querySnapshot = await getDocs(q);
    const searchResults = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setServices(searchResults);
  };

  const handleAddService = async () => {
    if (newService.name.trim() === '' || newService.price.trim() === '') {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      await addDoc(collection(db, "service"), {
        name: newService.name.trim(),
        price: parseFloat(newService.price),
        creator: user?.fullname || 'Admin',
      });
      setIsAddServiceVisible(false);
      setNewService({ name: '', price: '' });
      fetchServices();
    } catch (error) {
      console.error("Lỗi khi thêm dịch vụ: ", error);
      Alert.alert("Lỗi", "Không thể thêm dịch vụ. Vui lòng thử lại.");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('ServiceDetail', { service: item })}
    >
      <View style={styles.serviceInfo}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.creator}>Người tạo: {item.creator}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('EditService', { service: { ...item, id: item.id } })}
        >
          <Feather name="edit" size={24} color={theme.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleDelete(item.id)}
        >
          <AntDesign name="delete" size={24} color={theme.primary}  />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm dịch vụ..."
          placeholderTextColor={theme.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <AntDesign name="search1" size={24} color={theme.accent} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={services}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsAddServiceVisible(true)}
      >
        <AntDesign name="plus" size={24} color={theme.accent}  />
      </TouchableOpacity>
      <Modal
        visible={isAddServiceVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddServiceVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm Dịch Vụ Mới</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên dịch vụ"
              placeholderTextColor={theme.secondary}
              value={newService.name}
              onChangeText={(text) => setNewService({ ...newService, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Giá"
              placeholderTextColor={theme.secondary}
              value={newService.price}
              onChangeText={(text) => setNewService({ ...newService, price: text })}
              keyboardType="numeric"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddService}>
                <Text style={styles.modalButtonText}>Thêm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsAddServiceVisible(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.background,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: theme.secondary,
    borderRadius: 24,
    paddingHorizontal: 16,
    backgroundColor: theme.accent,
    color: theme.text,
  },
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: theme.primary,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  list: {
    paddingBottom: 80,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.accent,
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  serviceInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: theme.text,
  },
  price: {
    fontSize: 16,
    color: theme.primary,
    marginBottom: 4,
  },
  creator: {
    fontSize: 14,
    color: theme.secondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 8,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: theme.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: theme.accent,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.text,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.secondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: theme.accent,
    color: theme.text,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    height: 48,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#FF5A5F',
  },
  modalButtonText: {
    color: theme.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
