import React, { useState, useEffect, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import LoadingScreen from './Screens/Loading';

import { auth, db } from './firebaseConfig';

// Import screens
import LoginScreen from './Screens/LoginScreens';
import SignupScreen from './Screens/Signup';
import ForgotPasswordScreen from './Screens/ForgotPassword';
import Home from './Screens/Home';
// import AddService from './Screens/AddService';
// import ServiceDetail from './Screens/ServiceDetail';
// import EditService from './Screens/EditService';
import HomeUser from './Screens/HomeUser';
// import UserFavoriteService from './Screens/UserFavoriteService';
// import Profile from './Screens/Profile';

const Stack = createStackNavigator();
export const AuthContext = React.createContext();

// Stack cho admin
function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      {/* <Stack.Screen name="AddService" component={AddService} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetail} />
      <Stack.Screen name="EditService" component={EditService} />
      <Stack.Screen name="Profile" component={Profile} /> */}
    </Stack.Navigator>
  );
}

// Stack cho user thông thường
function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeUser" component={HomeUser} />
      {/* <Stack.Screen name="UserFavoriteService" component={UserFavoriteService} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetail} />
      <Stack.Screen name="Profile" component={Profile} /> */}
    </Stack.Navigator>
  );
}

// Stack cho người dùng chưa đăng nhập
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

// Điều hướng chính dựa trên trạng thái đăng nhập và vai trò
function RootNavigator() {
  const { user, userRole } = React.useContext(AuthContext); // Sử dụng useContext mà không có điều kiện
  
  if (user == null) {
    return <AuthStack />;  // Hiển thị màn hình xác thực nếu chưa đăng nhập
  }

  // Hiển thị stack theo vai trò người dùng
  return userRole === 'admin' ? <AdminStack /> : <UserStack />;
}

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm loading state

  useEffect(() => {
    // Lắng nghe thay đổi xác thực
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);  // Đặt thông tin người dùng
        const userDocRef = doc(db, 'user', authUser.uid); // Lấy thông tin user từ Firestore
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserRole(userData?.role);  // Đặt vai trò của người dùng
        }
      } else {
        setUser(null);
        setUserRole(null);  // Đặt lại trạng thái nếu không có người dùng
      }
      setLoading(false); // Kết thúc trạng thái chờ
    });
  
    return () => unsubscribe(); // Cleanup listener khi component unmount
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (user, userRole) => {
        setUser(user);
        setUserRole(userRole);
      },
      signOut: () => {
        setUser(null);
        setUserRole(null);
      },
      user,
      userRole,
    }),
    [user, userRole] // Thêm các dependencies vào useMemo
  );

  // Di chuyển điều kiện loading vào trong phần JSX
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loading ? (
          <LoadingScreen />  // Hiển thị màn hình chờ nếu đang loading
        ) : (
          <RootNavigator />  // Điều hướng chính sau khi load xong
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}


export default App;
