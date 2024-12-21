import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';

const login = () => {
    const router=useRouter()
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    // Handle login logic here (API call to your backend)
    Alert.alert('Success', 'User logged in successfully!');
  };

  return (
    <ScrollView style={{ backgroundColor: '#f4f7fb', flex: 1 }}>
      <View style={{ padding: 20, alignItems: 'center',paddingBottom:50 }}>
        {/* Logo or Placeholder Image */}
        <Image
          source={{ uri: 'https://via.placeholder.com/120' }}
          style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 20,marginTop:20 }}
        />

        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 15 }}>
          Welcome Back
        </Text>

        <Text style={{ fontSize: 14, color: '#6c757d', marginBottom: 30 }}>
          Login to continue to your account
        </Text>

        {/* Email Input */}
        <TextInput
          style={{
            width: '100%',
            padding: 15,
            backgroundColor: '#fff',
            borderRadius: 20,
            marginBottom: 15,
            borderColor: '#ccc',
            borderWidth: 1,
            fontSize: 14,
            color: '#333',
          }}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Password Input */}
        <View style={{ width: '100%', position: 'relative', marginBottom: 15 }}>
          <TextInput
            style={{
              padding: 15,
              backgroundColor: '#fff',
              borderRadius: 20,
              borderColor: '#ccc',
              borderWidth: 1,
              fontSize: 14,
              color: '#333',
            }}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={{
              position: 'absolute',
              right: 15,
              top: '30%',
            }}
          >
            <Text style={{ color: '#31d9cf', fontWeight: 'bold' }}>
              {passwordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'Navigate to reset password screen')}>
          <Text style={{ fontSize: 14, color: '#31d9cf', marginBottom: 25 }}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            padding: 15,
            backgroundColor: '#31d9cf',
            borderRadius: 20,
            width: '100%',
            alignItems: 'center',
            marginTop:100,
            shadowColor:"#000",
            shadowOffset:{width:0,height:2},
            shadowOpacity:0.5,
            shadowRadius:4,
            elevation:5
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Login</Text>
        </TouchableOpacity>

        {/* Divider */}
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
            width: '100%',
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
          <Text style={{ marginHorizontal: 10, color: '#6c757d' }}>or</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
        </View> */}

        {/* Login with Social Media */}
        {/* <TouchableOpacity
          onPress={() => Alert.alert('Social Login', 'Login with Google')}
          style={{
            padding: 15,
            backgroundColor: '#ffffff',
            borderRadius: 10,
            borderColor: '#ccc',
            borderWidth: 1,
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png',
            }}
            style={{ width: 20, height: 20, marginRight: 10 }}
          />
          <Text style={{ fontSize: 16, color: '#333' }}>Login with Google</Text>
        </TouchableOpacity> */}

        {/* Sign Up Text */}
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <Text style={{ color: '#6c757d' }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.replace("/(tabs)/profile/auth/signup")}>
            <Text style={{ color: '#31d9cf', fontWeight: 'bold' }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default login;
