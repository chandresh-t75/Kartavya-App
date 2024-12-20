import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const index = () => {
  const [amount, setAmount] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const generateTransactionId = () => {
    return 'DONATION_' + Math.floor(Math.random() * 1000000000).toString();
  };

  const initiatePayment = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount.');
      return;
    }
    setIsLoading(true);
    const txnId = generateTransactionId();
    setTransactionId(txnId);

   

    try {
      const transactionId = `DONATE_${Date.now()}`;
      const response = await axios.post('http://<YOUR_BACKEND_URL>/initiatePayment', {
        amount: parseInt(amount) * 100, // Convert to paise
        transactionId: txnId,
      });

      const { payload, checksum, url } = response.data;

      const phonepePaymentUrl = `${url}?payload=${encodeURIComponent(
        payload
      )}&checksum=${checksum}`;

      setPaymentUrl(phonepePaymentUrl);

    } catch (error) {
      Alert.alert('Error', 'Failed to initiate payment.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentCompletion = (event:any) => {
    const { url } = event.nativeEvent;

    if (url.includes('payment_success')) {
      Alert.alert('Thank You!', 'Your donation was successful.');
    } else if (url.includes('payment_failure')) {
      Alert.alert('Failed', 'Payment failed.');
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
      {!paymentUrl ? (
        <>
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
              onPress={initiatePayment}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
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
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <WebView
          source={{ uri: paymentUrl }}
          onNavigationStateChange={handlePaymentCompletion}
          style={{
            marginTop: 20,
          }}
        />
      )}
    </View>
  );
};

export default index;
