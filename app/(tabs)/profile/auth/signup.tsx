import { Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUserBadges, setUserDetails } from '@/redux/reducers/userDataSlice';
import { useSelector } from 'react-redux';

const signup = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [pic, setPic] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const user=useSelector((state:any)=>state.userData.userDetails);

  const dispatch = useDispatch();

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permissions to access your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setPic(result?.assets[0]?.uri);
    }
  };

  const sendVerificationEmail = async () => {
    try {
      if (!email) {
        Alert.alert('Error', 'Please enter your email address');
        return;
      }
      setLoading(true);
      await axios.post('http://192.168.43.243:5000/user/send-verification', { email });
      Alert.alert('Verification Sent', 'A verification code has been sent to your email.');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error sending verification email:', error);
      Alert.alert('Error', 'Failed to send verification email.');
    }
  };

  const verifyEmailCode = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://192.168.43.243:5000/user/verify-email', { email, code: verificationCode });
      if (response.data.success) {
        setIsVerified(true);
        setVerifiedEmail(email);
        // Alert.alert('Email Verified', 'Your email address has been successfully verified.');
      } else {
        Alert.alert('Invalid OTP.');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error verifying email:', error);
      Alert.alert('Error', 'Failed to verify email.');
    }
  };

  const handleSignup = async () => {
    if (!isVerified || (email!==verifiedEmail)) {
      Alert.alert('Please verify your email!');
      return;
    }
    

    try {
      if (!name || !email || !password || !phone || !confirmPassword) {
        Alert.alert('Error', 'Please fill all the fields');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      setLoading(true);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phone', phone);
      if (pic) {
        formData.append('profilePic', {
          uri: pic,
          name: 'profile_pic.jpg',
          type: 'image/jpeg',
        } as any);
      }

      const response = await axios.post('http://192.168.43.243:5000/user/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const user = response.data.user;
      dispatch(setUserDetails(user));
      dispatch(setUserBadges(response.data.badge));
      await AsyncStorage.setItem('userDetails', JSON.stringify(user));
      router.replace('/(tabs)/profile');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error creating user:', error);
      Alert.alert('Error', 'Failed to create account.');
    }
  };

  // if(user?._id){
  //    router.push('/');
  // }

  return (
    <ScrollView style={{ backgroundColor: '#f4f7fb', flex: 1 }}>
      <View style={{ padding: 20, alignItems: 'center', paddingBottom: 50 }}>
        {/* Logo or Placeholder Image */}
        <Image
          source={{ uri: pic || 'https://via.placeholder.com/120' }}
          style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 20, marginTop: 20 }}
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
        <View style={{flexDirection:"row",justifyContent:"space-between",gap:10}}>
        <TextInput
                  style={{
                    width: '80%',
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
                  
                />
        <TouchableOpacity
              onPress={sendVerificationEmail}
              disabled={loading || !email}
              style={{
                width: '18%',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 7,
                backgroundColor: loading ? '#b0b0b0' : '#31d9cf',
                borderRadius: 20,
                marginBottom: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
              }}
            >
              <Text style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 14
              }}>
                OTP
              </Text>
            </TouchableOpacity>

        </View>
        

        {isVerified ? (
          <Text style={{
            color: 'green',
            marginBottom: 10,
            fontSize: 14,
            fontWeight: 'bold',
            textAlign: 'center',
            alignSelf:"flex-end"
          }}>
            Email verified successfully!
          </Text>
        ) : (
          <View style={{flexDirection:"row",marginBottom:10,alignSelf:"flex-end",gap:20}}>
            <TextInput
              placeholder="Enter OTP"
              value={verificationCode}
              onChangeText={setVerificationCode}
              style={{
                padding:8,
                width:100,
                paddingHorizontal:10,
                backgroundColor: '#fff',
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#ccc',
                fontSize: 14,
                color: '#333',
                textAlign: 'center'
              }}
            />

            <TouchableOpacity
              onPress={verifyEmailCode}
              disabled={loading || !verificationCode}
              style={{
                padding:8,
                paddingHorizontal:10,

                backgroundColor: loading ? '#b0b0b0' : '#31d9cf',
                borderRadius: 20,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
              }}
            >
              <Text style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 14
              }}>
                Verify Email
              </Text>
            </TouchableOpacity>
          </View>
        )}


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
          onPress={() => handleImagePicker()}
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
          disabled={loading}
          style={{
            padding: 15,
            backgroundColor: '#31d9cf',
            borderRadius: 20,
            width: '100%',
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 5
          }}
        >
          {
            loading ? (
              <ActivityIndicator color="#fff" />) :
              (
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Sign up</Text>
              )

          }

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
