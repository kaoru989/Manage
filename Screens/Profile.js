import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, Animated } from 'react-native';
import { AuthContext } from '../App';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Profile = ({ navigation }) => {
  const { user, signOut } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [fullname, setFullname] = useState(user?.fullname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Xin lỗi, chúng tôi cần quyền truy cập vào thư viện ảnh để thay đổi avatar của bạn.');
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      if (!user || !user.id) {
        throw new Error('ID người dùng không tồn tại');
      }
      const userRef = doc(db, 'user', user.id);
      const updatedData = {
        fullname,
        email,
        phone,
        address,
      };

      if (avatar && avatar !== user.avatar) {
        const avatarUrl = await uploadAvatar(avatar);
        updatedData.avatar = avatarUrl;
      }

      await updateDoc(userRef, updatedData);
      setEditing(false);
      Alert.alert('Cập nhật hồ sơ thành công');
    } catch (error) {
      console.error('Lỗi khi cập nhật hồ sơ:', error);
      Alert.alert('Lỗi cập nhật hồ sơ. Vui lòng thử lại.');
    }
  };

  const uploadAvatar = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `avatars/${user.id}_${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleLogout = () => {
    signOut();
    //navigation.navigate('Auth', { screen: 'Login' });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const animateInput = () => {
    Animated.timing(animatedValue, {
      toValue: editing ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    animateInput();
  }, [editing]);

  const inputStyle = {
    ...styles.input,
    backgroundColor: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#F0F5F9', '#EDEDED'],
    }),
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitials}>{getInitials(fullname)}</Text>
          </View>
        )}
        <View style={styles.cameraIconContainer}>
          <Icon name="camera-alt" size={20} color="#EDEDED" />
        </View>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        {editing ? (
          <>
            <Animated.View style={inputStyle}>
              <TextInput
                value={fullname}
                onChangeText={setFullname}
                placeholder="Họ và tên"
                placeholderTextColor="#444444"
              />
            </Animated.View>
            <Animated.View style={inputStyle}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#444444"
              />
            </Animated.View>
            <Animated.View style={inputStyle}>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Số điện thoại"
                keyboardType="phone-pad"
                placeholderTextColor="#444444"
              />
            </Animated.View>
            <Animated.View style={inputStyle}>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Địa chỉ"
                placeholderTextColor="#444444"
              />
            </Animated.View>
          </>
        ) : (
          <>
            <Text style={styles.infoText}>Họ và tên: {fullname}</Text>
            <Text style={styles.infoText}>Email: {email}</Text>
            <Text style={styles.infoText}>Số điện thoại: {phone}</Text>
            <Text style={styles.infoText}>Địa chỉ: {address}</Text>
          </>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, editing ? styles.saveButton : styles.editButton]}
        onPress={editing ? handleSave : () => setEditing(true)}
      >
        <Text style={styles.buttonText}>
          {editing ? 'Lưu thay đổi' : 'Chỉnh sửa hồ sơ'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFC0CB',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6A82FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 40,
    color: '#EDEDED',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#444444',
    borderRadius: 20,
    padding: 8,
  },
  infoContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#444444',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#171717',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#171717',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#DA0037',
  },
  editButton: {
    backgroundColor: '#444444',
  },
  logoutButton: {
    backgroundColor: '#171717',
  },
  buttonText: {
    color: '#EDEDED',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
