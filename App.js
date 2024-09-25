import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, ActivityIndicator, StyleSheet, StatusBar, TouchableOpacity, Modal, TextInput,Dimensions } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import AddEmployeeForm from './Screens/AddEmployeeForm';
import EmployeeItem from './Screens/EmployeeItem';
import ErrorMessage from './Screens/ErrorMessage';
import { Icon } from 'react-native-elements';
const { width, height } = Dimensions.get('window');

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'employees'));
      const employeeList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(employeeList);
      setError(null);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to fetch employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = (newEmployee) => {
    setEmployees(prevEmployees => [...prevEmployees, newEmployee]);
    setModalVisible(false);
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees(prevEmployees =>
      prevEmployees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
  };

  const handleDeleteEmployee = (deletedEmployeeId) => {
    setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== deletedEmployeeId));
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#DFFFEC" />
      <View style={styles.header}>
        <Text style={styles.title}>Manage</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search employees..."
          placeholderTextColor="#666666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Icon name="plus" type="feather" color="#000000" />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Employee</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="x" type="feather" color="#000000" />
              </TouchableOpacity>
            </View>
            <AddEmployeeForm onAddEmployee={handleAddEmployee} />
          </View>
        </View>
      </Modal>

      {error && <ErrorMessage message={error} />}
      <FlatList
        data={filteredEmployees}
        renderItem={({ item }) => (
          <EmployeeItem
            employee={item}
            onUpdate={handleUpdateEmployee}
            onDelete={handleDeleteEmployee}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFFFEC', // Màu nền chính
  },
  header: {
    backgroundColor: '#DFFFEC', // Màu nền header
    paddingVertical: 20,
    alignItems: 'center',
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000', // Màu chữ
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF', // Màu nền ô tìm kiếm
  },
  addButton: {
    marginLeft: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DFFFEC', // Màu nền khi tải dữ liệu
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    backgroundColor: '#FFFFFF', // Màu nền modal
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Màu chữ modal
  },
});
