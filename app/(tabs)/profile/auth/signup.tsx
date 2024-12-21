import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';

const signup = () => {
    const router=useRouter();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [pic, setPic] = useState<string>(''); // For profile pic
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);

  const handleSignup = () => {
    if (!name || !email || !password || !phone || !confirmPassword) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    // Handle signup logic here (API call to your backend)
    Alert.alert('Success', 'User signed up successfully!');
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
          Sign Up
        </Text>

        <Text style={{ fontSize: 14, color: '#6c757d', marginBottom: 30 }}>
          Create a new account to get started
        </Text>

        {/* Name Input */}
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
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

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

        {/* Phone Input */}
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
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
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

        {/* Confirm Password Input */}
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
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!confirmPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            style={{
              position: 'absolute',
              right: 15,
              top: '30%',
            }}
          >
            <Text style={{ color: '#31d9cf', fontWeight: 'bold' }}>
              {confirmPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Picture Upload Button */}
        <TouchableOpacity
          onPress={() => alert('Open image picker here')}
          style={{
            padding: 10,
            backgroundColor: '#31d9cf',
            borderRadius: 16,
            marginBottom: 25,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 14, color: '#fff' }}>Upload Profile Picture</Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity
          onPress={handleSignup}
          style={{
            padding: 15,
            backgroundColor: '#31d9cf',
            borderRadius: 20,
            width: '100%',
            alignItems: 'center',
            shadowColor:"#000",
            shadowOffset:{width:0,height:2},
            shadowOpacity:0.5,
            shadowRadius:4,
            elevation:5
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Sign Up</Text>
        </TouchableOpacity>

        {/* Sign In Text */}
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <Text style={{ color: '#6c757d' }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace("/(tabs)/profile/auth/login")}>
            <Text style={{ color: '#31d9cf', fontWeight: 'bold' }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default signup;
