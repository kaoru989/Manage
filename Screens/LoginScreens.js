import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../App';

const auth = getAuth();

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập cả email và mật khẩu.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Đăng nhập thành công', 'Chào mừng bạn trở lại!', [{ text: 'OK', onPress: () => navigation.navigate('Home') }]);
    } catch (error) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <LinearGradient colors={['#6A82FB', '#FFC0CB']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Đăng Nhập</Text>
          <View style={styles.inputContainer}>
            <Feather name="mail" size={24} color="#000000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Feather name="lock" size={24} color="#000000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Mật Khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="#000000" />
            </TouchableOpacity>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Đăng Nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.linkButton}>
            <Text style={styles.linkButtonText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.linkButton}>
            <Text style={styles.linkButtonText}>Chưa có tài khoản? Đăng Ký</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6A82FB',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
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
  errorText: {
    color: '#FF3B30',
    marginBottom: 10,
  },
  linkButton: {
    marginTop: 20,
  },
  linkButtonText: {
    color: '#6A82FB',
    fontSize: 16,
  },
});

export default LoginScreen;
