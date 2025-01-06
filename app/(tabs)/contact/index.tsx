import { maroonColorLight } from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Profile from "../../../assets/images/profile.svg"
import { FontAwesome } from '@expo/vector-icons';
import MemberCard from '@/components/utils/MemberCard';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { setMember } from '@/redux/reducers/userDataSlice';

interface Member {
  name: string;
  email: string;
  role: string;
  profileImage: string;
}

interface UserFormData {
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
  profileImage: string;
};

const JoinCommunityScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [userformData, setUserformData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'Member',
    city: '',
    state: '',
    country: '',
    profileImage: "",
  });

  const [loading, setLoading] = useState(false);
  const member = useSelector((state: any) => state.userData.member);
  const user = useSelector((state: any) => state.userData.userDetails);
  const [topMembers,setTopMembers] = useState([]);


  console.log("member", member);
  // const [topMembers] = useState<Member[]>([
  //   {
  //     name: 'Chandresh Prajapati',
  //     email: 'john@example.com',
  //     role: 'Admin',
  //     profileImage: 'https://www.w3schools.com/w3images/avatar2.png',
  //   },
  //   {
  //     name: 'Jane Smith',
  //     email: 'jane@example.com',
  //     role: 'Member',
  //     profileImage: 'https://www.w3schools.com/w3images/avatar3.png',
  //   },
  //   {
  //     name: 'Michael Lee',
  //     email: 'michael@example.com',
  //     role: 'Member',
  //     profileImage: 'https://www.w3schools.com/w3images/avatar1.png',
  //   },
  // ]);


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

  const handleInputChange = (name: keyof UserFormData, value: string): void => {
    setUserformData({
      ...userformData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    // Validate form fields
    if (!userformData.name || !userformData.email || !userformData.phone || !userformData.city || !userformData?.state || !userformData?.country || !userformData?.profileImage) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }


    try {

      setLoading(true);
      const formData = new FormData();
      formData.append('name', userformData?.name);
      formData.append('email', userformData?.email);
      formData.append('phone', userformData?.phone);
      formData.append('city', userformData?.city);
      formData.append('state', userformData?.state);
      formData.append('country', userformData?.country);
      formData.append('userId', user?._id);


      if (userformData?.profileImage) {
        formData.append('profilePic', {
          uri: userformData?.profileImage,
          name: `member_img_${Date.now()}_${Math.floor(Math.random() * 100000)}.jpg`,
          type: 'image/jpeg',
        } as any);
      }
      console.log("creating user", formData);

      await axios.post('http://192.168.43.243:5000/member/create-member', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(async (response) => {
        console.log(response.data);
        const newmember = response.data;
        dispatch(setMember(newmember));
        setLoading(false);
      })

    } catch (error) {
      console.error(error);
      setLoading(false);

    }
  };

  const fetchMember = async () => {
    try {
      await axios.get('http://192.168.43.243:5000/member/single-member', {
        params: {
          userId: user?._id
        }
      }).then(
        (response) => {
          // console.log("member", response.data);
          dispatch(setMember(response.data));

        }
      )

    } catch (error) {
      console.error('Error finding member here:', error);
    }

  }

  const getEminentMembers=async()=>{
    try {
      await axios.get('http://192.168.43.243:5000/member/eminent-members')
       .then(
          (response) => {
            // console.log("top members", response.data);
            setTopMembers(response.data);
          })
        }
         catch (error) {
             console.error('Error fetching top members:', error);
          }
  }

  useEffect(() => {
    getEminentMembers();
    if(user?._id){
    fetchMember();
    }
  }, [])

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
              {topMembers && topMembers?.map((member:any) => (
                <View
                  key={member.id}
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
                    source={{ uri: member.img }}
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
          member?.length === 0 && user?._id &&
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
                value={userformData.name}
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
                value={userformData.email}
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
                value={userformData.phone}
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
                value={userformData.city}
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
                value={userformData.state}
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
                value={userformData.country}
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
                {
                  loading ? (
                    <ActivityIndicator color="#fff" />) :
                    (
                      <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Become Member</Text>)
                }
              </TouchableOpacity>
            </View>
          </View>
        }

        {
          member?._id && user?._id &&
          <MemberCard member={member} />
        }

        {
          user?.length === 0 &&
          <View
            style={{
              backgroundColor: '#ffffff',
              padding: 15,
              margin: 20,
              borderRadius: 15,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 5,
              gap: 10,
              marginTop: 50
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: "center" }}>Join us!</Text>
            <Text style={{ fontSize: 16, marginBottom: 10, textAlign: "center" }}>Please signup / log in to become our member</Text>

            <TouchableOpacity
              style={{
                backgroundColor: '#31d1c9',
                padding: 15,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                router.push("/(tabs)/profile/auth/signup")
              }}
            >
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>SignUp</Text>
            </TouchableOpacity>

            <Text style={{ marginTop: 10, fontSize: 14, color: '#6c757d', textAlign: "center" }}>Already have an account? </Text>

            <TouchableOpacity
              style={{
                backgroundColor: '#31d1c9',
                padding: 15,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',

              }}
              onPress={() => {
                router.push("/(tabs)/profile/auth/login")
              }}

            >
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Log In</Text>
            </TouchableOpacity>
          </View>
        }

      </ScrollView>
    </SafeAreaView>
  );
};

export default JoinCommunityScreen;
