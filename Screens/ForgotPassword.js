import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const auth = getAuth();

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Email khôi phục mật khẩu đã được gửi. Kiểm tra hộp thư của bạn.');
    } catch (error) {
      setMessage('Gửi email khôi phục thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <LinearGradient colors={['#6A82FB', '#FFC0CB']} style={styles.gradient}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.innerContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Khôi phục mật khẩu</Text>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={24} color="#000000" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập địa chỉ email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {message ? <Text style={styles.messageText}>{message}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
              <Text style={styles.buttonText}>Gửi email khôi phục</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkButtonText}>Quay lại đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  formContainer: {
    width: '95%', // Tăng chiều rộng khung chứa
    maxWidth: 450, // Tăng chiều rộng tối đa
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 40, // Tăng padding
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 25, // Tăng kích thước tiêu đề
    fontWeight: 'bold',
    color: '#6A82FB',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#6A82FB',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageText: {
    color: '#FF3B30',
    marginBottom: 10,
    textAlign: 'center',
  },
  linkButton: {
    marginTop: 20,
  },
  linkButtonText: {
    color: '#6A82FB',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
