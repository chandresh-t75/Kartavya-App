import { setUserDetails } from '@/redux/reducers/userDataSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const login = () => {
    const router=useRouter()
    const dispatch=useDispatch();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [loading,setLoading]=useState<boolean>(false);
  const user=useSelector((state:any)=>state.userData.userDetails);
    
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [verifiedEmail, setVerifiedEmail] = useState('');

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


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
     if (!isVerified || (email!==verifiedEmail)) {
          Alert.alert('','Please verify your email!');
          return;
    }
    setLoading(true);
    try {
      await axios.get(
        'http://192.168.43.243:5000/user/login',{
        params:{
          email: email,
          password: password,
        }
      }
      ).then(async(response) => {
        console.log(response.data);
        const userId = response.data.user._id;
        console.log('User ID:', userId);

        await axios.get(
          'http://192.168.43.243:5000/user/get-user',{
          params:{
            userId:userId
          }
        }).then(async(res)=>{
          console.log(res.data);
          dispatch(setUserDetails(res.data));
          await AsyncStorage.setItem("userDetails", JSON.stringify(res.data));
            router.replace("/(tabs)/profile");
            setLoading(false);

        })
      
    })
  
      
  
    } catch (error) {
    setLoading(false);

      console.log('Error logging in:', error);
      Alert.alert('Error', 'Failed to login');
    }
  };

//   if(user?._id){
//     router.push('/');
//  }
  
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
          disabled={loading}
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
           {
              loading ?(
               <ActivityIndicator color="#fff" />):
            (
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Login</Text>
        )
            
      }
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
