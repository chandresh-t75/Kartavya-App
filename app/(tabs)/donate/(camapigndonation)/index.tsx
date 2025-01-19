import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Linking} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';

const index = () => {
  const [amount, setAmount] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const campaign=useSelector((state:any)=>state.campaign.selectedCampaign)
  console.log(campaign?.title)

  const UPI_PAYMENT_URL = 'upi://pay?pa=rebelkingsuperstar@okhdfcbank&pn=Chandresh&am=100&cu=INR&tn=Donation'; // Replace with your details

  const initiatePayment = async () => {
    try {
      const response = await axios.post('http://192.168.43.243:5000/donate/initiate-payment', {
        amount: '1',
        note: 'Donation',
        upiId: 'bestumeshverma1@oksbi',
        payerName: 'Chandresh',
        campaignId: campaign?._id,
      });
  
      const { transactionId, upiUrl } = response.data;
      console.log(response.data);
  
      // Open UPI App
      const supported = await Linking.canOpenURL(upiUrl);
      if (supported) {
        await Linking.openURL(upiUrl);
        // checkPaymentStatus(transactionId); 
      } else {
        Alert.alert('Error', 'No UPI app found to handle the payment.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while initiating payment.');
      console.error(error);
    }
  };


  const checkPaymentStatus = async (transactionId:any) => {
    try {
      const response = await axios.post('http://192.168.43.243:5000/donate/verify-payment', {
        transactionId,
      });
  
      const { status } = response.data;
  console.log("success",response.data);
      if (status === 'success') {
        Alert.alert('Payment Success', 'Thank you for your donation!');
      } else {
        Alert.alert('Payment Failed', 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while verifying payment.');
      console.error(error);
    }
  };

  const handleDeepLink = async ({ url }:any) => {
    const transactionId = extractTransactionId(url); // Parse transactionId from URL
    if (transactionId) {
      checkPaymentStatus(transactionId);
    }
  };
  
  useEffect(() => {
    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  const extractTransactionId = (url:any) => {
    try {
      const parsedUrl = new URL(url); // Parse the URL
      console.log(parsedUrl);
      return parsedUrl.searchParams.get('transactionId'); // Get the transactionId parameter
    } catch (error) {
      console.error('Error parsing URL:', error);
      return null;
    }
  };
  

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
        justifyContent: 'center',
      }}
    >
     
        <View>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 15,
              padding: 20,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <Ionicons name="heart-circle" size={64} color="#31d1c9" />
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: '#333',
                marginTop: 10,
              }}
            >
              Make a Donation
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#666',
                textAlign: 'center',
                marginVertical: 10,
              }}
            >
              Your generosity helps us continue our mission. Enter the amount
              you'd like to donate below.
            </Text>

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                padding: 15,
                width: '100%',
                fontSize: 16,
                backgroundColor: '#f9f9f9',
                marginVertical: 15,
              }}
              keyboardType="numeric"
              placeholder="Enter donation amount"
              value={amount}
              onChangeText={setAmount}
            />

            <TouchableOpacity
              style={{
                backgroundColor: '#31d1c9',
                padding: 15,
                borderRadius: 10,
                width: '100%',
                alignItems: 'center',
              }}
              onPress={()=>{initiatePayment()}}
              disabled={isLoading}
            >
             {
               isLoading?(
                 <ActivityIndicator size="large" color="#fff" />
                 ) : (
                  <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}
                >
                  Donate Now
                </Text>
                 )
               
             }
                
              
            </TouchableOpacity>
          </View>
       
        </View>
    </View>
  );
};

export default index;
