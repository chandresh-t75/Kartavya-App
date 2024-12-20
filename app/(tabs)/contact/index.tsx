import { maroonColorLight } from '@/constants/Colors';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import * as ImagePicker from 'expo-image-picker';

interface Member {
  name: string;
  email: string;
  role: string;
  profileImage: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  city: string;
  state: string;
  country: string;
  profileImage: string | null;
}

const JoinCommunityScreen= () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    role: 'Member',
    city: '',
    state: '',
    country: '',
    profileImage: null,
  });

  const [topMembers] = useState<Member[]>([
    {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      profileImage: 'https://www.w3schools.com/w3images/avatar2.png',
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Member',
      profileImage: 'https://www.w3schools.com/w3images/avatar3.png',
    },
    {
      name: 'Michael Lee',
      email: 'michael@example.com',
      role: 'Member',
      profileImage: 'https://www.w3schools.com/w3images/avatar1.png',
    },
  ]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [4, 3],
    //   quality: 1,
    // });

    // if (!result.canceled) {
    //   setSelectedImage(result.uri);
    //   handleInputChange('profileImage', result.uri); // Update form data with selected image
    // }
  };

  const handleInputChange = (name: keyof FormData, value: string): void => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (): void => {
    // Validate form fields
    if (!formData.name || !formData.email || !formData.phone || !formData.city || !formData.state || !formData.country) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    // Simulate form submission
    console.log('Form Data:', formData);

    // Here, you would make the API call to submit the form data
    Alert.alert('Success', 'You have successfully joined the community!');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9', paddingBottom: 20 }}>
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', marginVertical: 20 }}>
          Join the Kartavya Community
      </Text>

      {/* Top Recent Members Section */}
      <View style={{ marginBottom: 20,paddingLeft:20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#31d1c9', marginBottom: 15 }}>
          Our Members
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row' ,paddingBottom:20}}>
            {topMembers.map((member, index) => (
              <View
                key={index}
                style={{
                  width:120,height:120,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent:"center",
                  backgroundColor: '#fff',
                  padding: 15,
                  marginRight: 15, 
                  elevation: 5, 
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                  borderRadius:200
                  
                }}
              >
                <Image
                  source={{ uri: member.profileImage }}
                  style={{ width: 50, height: 50, borderRadius: 50, marginBottom: 5 }}
                />
                <View>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333',textAlign:"center" }}>{member.name}</Text>
                  <Text style={{ fontSize: 12, color: '#777',textAlign:"center" }}>{member.role}</Text>
                  
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
       
      </View>
      <Text style={{textAlign:"center",fontSize:16,marginBottom:20,fontWeight:700,color:maroonColorLight}}>Join Us</Text>

      {/* Join Community Form */}
      <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 25, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginTop: 20 }}>
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 15 }} />
      )}
      <TouchableOpacity style={{ alignSelf: 'center', marginBottom: 15 }} onPress={pickImage}>
        <Text style={{ color: '#28a745', fontSize: 16, fontWeight: 'bold' }}>Select Profile Image</Text>
      </TouchableOpacity>

      <TextInput
        style={{
          height: 50,
          borderColor: '#dcdcdc',
          borderWidth: 1,
          borderRadius: 12,
          paddingHorizontal: 15,
          marginBottom: 15,
          fontSize: 16,
          backgroundColor: '#f9f9f9',
       
        }}
        placeholder="Enter your name"
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={{
          height: 50,
          borderColor: '#dcdcdc',
          borderWidth: 1,
          borderRadius: 12,
          paddingHorizontal: 15,
          marginBottom: 15,
          fontSize: 16,
       
        }}
        placeholder="Enter your email"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={{
          height: 50,
          borderColor: '#dcdcdc',
          borderWidth: 1,
          borderRadius: 12,
          paddingHorizontal: 15,
          marginBottom: 15,
          fontSize: 16,
          backgroundColor: '#f9f9f9',
     
        }}
        placeholder="Enter your phone number"
        value={formData.phone}
        onChangeText={(value) => handleInputChange('phone', value)}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={{
          height: 50,
          borderColor: '#dcdcdc',
          borderWidth: 1,
          borderRadius: 12,
          paddingHorizontal: 15,
          marginBottom: 15,
          fontSize: 16,
          backgroundColor: '#f9f9f9',
         
        }}
        placeholder="City"
        value={formData.city}
        onChangeText={(value) => handleInputChange('city', value)}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={{
          height: 50,
          borderColor: '#dcdcdc',
          borderWidth: 1,
          borderRadius: 12,
          paddingHorizontal: 15,
          marginBottom: 15,
          fontSize: 16,
          backgroundColor: '#f9f9f9',
          
        }}
        placeholder="State"
        value={formData.state}
        onChangeText={(value) => handleInputChange('state', value)}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={{
          height: 50,
          borderColor: '#dcdcdc',
          borderWidth: 1,
          borderRadius: 12,
          paddingHorizontal: 15,
          marginBottom: 20,
          fontSize: 16,
          backgroundColor: '#f9f9f9',
          
        }}
        placeholder="Country"
        value={formData.country}
        onChangeText={(value) => handleInputChange('country', value)}
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity
        style={{
          backgroundColor: '#28a745',
          paddingVertical: 15,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10,
        }}
        onPress={handleSubmit}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Join Now</Text>
      </TouchableOpacity>
    </View>
  
    </ScrollView>
    </SafeAreaView>
  );
};

export default JoinCommunityScreen;
