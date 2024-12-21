import { maroonColorLight } from '@/constants/Colors';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Profile from "../../../assets/images/profile.svg"
import { FontAwesome } from '@expo/vector-icons';
import MemberCard from '@/components/utils/MemberCard';

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
  profileImage: string;
}

type MemberType = {
  name: string;
  email: string;
  phone: string;
  role: string;
  city: string;
  state: string;
  country: string;
  profileImage: string ;
};

const JoinCommunityScreen = () => {
  const [member, setMember] = useState<MemberType | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    role: 'Member',
    city: '',
    state: '',
    country: '',
    profileImage: "",
  });

  console.log("member", member);
  const [topMembers] = useState<Member[]>([
    {
      name: 'Chandresh Prajapati',
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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri)
      setSelectedImage(result.assets[0].uri);
      handleInputChange('profileImage', result.assets[0].uri); // Update form data with selected image
    }
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


    console.log('Form Data:', formData);
    setMember({ ...formData });


    Alert.alert('Success', 'You have successfully joined the community!');
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#f9f9f9' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', marginVertical: 20 }}>
          Join the Kartavya Community
        </Text>

        {/* Top Recent Members Section */}
        <View style={{ marginBottom: 20, }}>
          <Text style={{ fontSize: 20, paddingLeft: 20, fontWeight: 'bold', color: '#31d1c9', marginBottom: 15 }}>
            Our Members
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', paddingLeft: 20, paddingBottom: 20, paddingTop: 5 }}>
              {topMembers.map((member, index) => (
                <View
                  key={index}
                  style={{
                    width: 120, height: 120,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: "center",
                    backgroundColor: '#fff',
                    padding: 15,
                    marginRight: 15,
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                    borderRadius: 200

                  }}
                >
                  <Image
                    source={{ uri: member.profileImage }}
                    style={{ width: 50, height: 50, borderRadius: 50, marginBottom: 5 }}
                  />
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: "center" }}>{member.name}</Text>
                    <Text style={{ fontSize: 12, color: '#777', textAlign: "center" }}>{member.role}</Text>

                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

        </View>
        {
          !member &&
          <View>


            <Text style={{ textAlign: "center", fontSize: 16, marginBottom: 20, fontWeight: 700, color: maroonColorLight }}>Join Us</Text>

            {/* Join Community Form */}
            <View style={{ backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 20, padding: 25, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginTop: 10, marginBottom: 30 }}>
              {selectedImage && (
                <Image source={{ uri: selectedImage }} style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 15 }} />
              )}
              {!selectedImage && (
                <View style={{ width: 100, height: 100, borderRadius: 50, alignSelf: "center", alignItems: "center", justifyContent: "center", marginBottom: 15, backgroundColor: "#e7e7e7" }} >
                  <Profile width={50} height={50} />
                </View>
              )}
              <TouchableOpacity style={{ alignSelf: 'center', marginBottom: 15 }} onPress={pickImage}>
                <Text style={{ color: '#31d1c9', fontSize: 16, fontWeight: 'bold' }}>Select Profile Image</Text>

              </TouchableOpacity>

              <TextInput
                style={{
                  height: 45,
                  borderColor: '#dcdcdc',
                  borderWidth: 1,
                  borderRadius: 16,
                  paddingHorizontal: 15,
                  marginBottom: 15,
                  fontSize: 14,
                  backgroundColor: '#fff',
                  shadowOffset: {
                    width: 2,
                    height: 2,

                  },
                  shadowColor: '#000',
                  shadowOpacity: 0.5,
                  shadowRadius: 16,
                  elevation: 8,


                }}
                placeholder="Enter your name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={{
                  height: 45,
                  borderColor: '#dcdcdc',
                  borderWidth: 1,
                  borderRadius: 16,
                  paddingHorizontal: 15,
                  marginBottom: 15,
                  fontSize: 14,
                  backgroundColor: '#fff',
                  shadowOffset: {
                    width: 2,
                    height: 2,

                  },
                  shadowColor: '#000',
                  shadowOpacity: 0.5,
                  shadowRadius: 16,
                  elevation: 8,


                }}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={{
                  height: 45,
                  borderColor: '#dcdcdc',
                  borderWidth: 1,
                  borderRadius: 16,
                  paddingHorizontal: 15,
                  marginBottom: 15,
                  fontSize: 14,
                  backgroundColor: '#fff',
                  shadowOffset: {
                    width: 2,
                    height: 2,

                  },
                  shadowColor: '#000',
                  shadowOpacity: 0.5,
                  shadowRadius: 16,
                  elevation: 8,


                }}
                keyboardType='phone-pad'
                placeholder="Enter your phone number"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={{
                  height: 45,
                  borderColor: '#dcdcdc',
                  borderWidth: 1,
                  borderRadius: 16,
                  paddingHorizontal: 15,
                  marginBottom: 15,
                  fontSize: 14,
                  backgroundColor: '#fff',
                  shadowOffset: {
                    width: 2,
                    height: 2,

                  },
                  shadowColor: '#000',
                  shadowOpacity: 0.5,
                  shadowRadius: 16,
                  elevation: 8,


                }}
                placeholder="City"
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={{
                  height: 45,
                  borderColor: '#dcdcdc',
                  borderWidth: 1,
                  borderRadius: 16,
                  paddingHorizontal: 15,
                  marginBottom: 15,
                  fontSize: 14,
                  backgroundColor: '#fff',
                  shadowOffset: {
                    width: 2,
                    height: 2,

                  },
                  shadowColor: '#000',
                  shadowOpacity: 0.5,
                  shadowRadius: 16,
                  elevation: 8,


                }}
                placeholder="State"
                value={formData.state}
                onChangeText={(value) => handleInputChange('state', value)}
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={{
                  height: 45,
                  borderColor: '#dcdcdc',
                  borderWidth: 1,
                  borderRadius: 16,
                  paddingHorizontal: 15,
                  marginBottom: 15,
                  fontSize: 14,
                  backgroundColor: '#fff',
                  shadowOffset: {
                    width: 2,
                    height: 2,

                  },
                  shadowColor: '#000',
                  shadowOpacity: 0.5,
                  shadowRadius: 16,
                  elevation: 8,


                }}
                placeholder="Country"
                value={formData.country}
                onChangeText={(value) => handleInputChange('country', value)}
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity
                style={{
                  backgroundColor: '#31d1c9',
                  paddingVertical: 15,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: 20,
                  shadowOffset: {
                    width: 2,
                    height: 2,

                  },
                  shadowColor: '#000',
                  shadowOpacity: 0.5,
                  shadowRadius: 16,
                  elevation: 8,
                }}
                onPress={handleSubmit}
              >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Become Member</Text>
              </TouchableOpacity>
            </View>
          </View>
        }

        {
          member &&
         <MemberCard member={member}/>
        }


      </ScrollView>
    </SafeAreaView>
  );
};

export default JoinCommunityScreen;
