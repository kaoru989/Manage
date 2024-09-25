// EmployeeList.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SearchBar } from './SearchBar';
import { EmployeeItem } from './EmployeeItem';

export default function EmployeeList({ employees, onAddEmployee, onDelete, theme }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  useEffect(() => {
    const filterEmployees = () => {
      const filtered = employees.filter((employee) => {
        const name = employee.name.toLowerCase();
        const email = employee.email.toLowerCase();
        const query = searchQuery.toLowerCase();
        return name.includes(query) || email.includes(query);
      });
      setFilteredEmployees(filtered);
    };
    filterEmployees();
  }, [searchQuery, employees]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SearchBar value={searchQuery} onChangeText={handleSearch} theme={theme} />
      < FlatList
        data={filteredEmployees}
        renderItem={({ item }) => (
          <EmployeeItem employee={item} onUpdate={(updatedEmployee) => onAddEmployee(updatedEmployee)} onDelete={onDelete} theme={theme} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});