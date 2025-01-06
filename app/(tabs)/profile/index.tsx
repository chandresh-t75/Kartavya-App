import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Alert, Modal, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { resetState, setUserBadges, setUserDetails } from '@/redux/reducers/userDataSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Example user data
interface User {
  email: string;
  isAdmin: boolean;
  totalDonated: number;
  name: string;
  profilePic: string;
  phone: string;
  donations: Array<{ campaignname: string, amount: number, date: string }>;
}



const ProfileScreen = () => {
  const router = useRouter()
  const dispatch = useDispatch();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = useSelector((state: any) => state.userData.userDetails);
  const userBadges = useSelector((state: any) => state.userData.userBadges);
  const campaigns = useSelector((state: any) => state.campaign.campaigns);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imgLoading, setImgLoading] = useState(false)
  const [loading, setLoading] = useState(false);

  console.log("user", user?._id)
  // console.log("campaigns", campaigns)
  useEffect(() => {
    const checkUserData = async () => {
      try {
        // Get user data from AsyncStorage
        const storedUserData = await AsyncStorage?.getItem('userDetails');
        if (storedUserData !== null) {
          const userData = JSON.parse(storedUserData);
          dispatch(setUserDetails(userData));

          console.log('User data found in AsyncStorage:', userData);
        } else {
          console.log('No user data found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error checking user data in AsyncStorage:', error);
      }
    };

    checkUserData();
  }, []);

  useEffect(() => {
    // console.log("User object:", user);
    if (user?._id) {
      getUserBadges();
    }
  }, [user]);

  const getUserBadges = async () => {
    console.log("Fetching badges for user with ID:", user?._id);
    try {
      const response = await axios.get('http://192.168.43.243:5000/user/user-badges', {
        params: {
          userId: user?._id
        }
      });

      const badges = response.data;
      // console.log("Fetched badges:", badges);

      // Dispatch action or update state with the fetched badges
      dispatch(setUserBadges(badges));

    } catch (error) {
      console.log("Error fetching badges:", error);
    }
  }

  // Request permission to access the media library
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();

    if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera and media library permissions to update your profile picture.');
      return false;
    }
    return true;
  };

  // Function to update profile image by selecting from gallery or camera
  const handleProfileImageUpdate = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    setIsModalVisible(true);
  };

  // Function to pick image from camera
  const pickImageFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result?.canceled) {
      updateProfilePic(result?.assets[0]?.uri);
    }
    setIsModalVisible(false);

  };

  const pickImageFromGallery = async () => {
    const status = await MediaLibrary.requestPermissionsAsync();
    if (status.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        console.log(result.assets[0].uri)
        updateProfilePic(result.assets[0].uri);

      }
      setIsModalVisible(false);

    }
    else {
      Alert.alert('Permission Denied', 'We need access to your media library to choose an image.');
    }
  };

  // Function to pick image from gallery using expo-media-library



  const handleNameUpdate = async () => {
    setLoading(true)

    try {
      await axios.put('http://192.168.43.243:5000/user/update-profile', {
        userId: user?._id,
        name: newName,
      }).then(async(response) => {
        console.log('Profile Pic updated successfully', response.data);
        dispatch(setUserDetails(response.data))
        await AsyncStorage.setItem("userDetails", JSON.stringify(response.data));

        setIsEditingName(false);
        setLoading(false);
      })

    } catch (error) {
      console.error('Error updating profile pic:', error);
      // setIsEditingName(false);
      setLoading(false);
    }

  };

  const handleCancelEdit = () => {

    setIsEditingName(false); // Close the modal
  };

  const updateProfilePic = async (img: string) => {
    try {
      setImgLoading(true)

      const formData = new FormData();
      formData.append('userId', user?._id)
      if (img) {
        formData.append('profilePic', {
          uri: img,
          name: `profile_img_${Date.now()}_${Math.floor(Math.random() * 100000)}.jpg`,
          type: 'image/jpg',
        } as any);
      }

      await axios.put('http://192.168.43.243:5000/user/update-profile-pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(async(response) => {
        console.log('Profile Pic updated successfully', response.data);
        dispatch(setUserDetails(response.data))
        await AsyncStorage.setItem("userDetails", JSON.stringify(response.data));

        setImgLoading(false);
      })

    } catch (error) {
      console.error('Error updating profile pic:', error);
      setImgLoading(false);

    }
  }




  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f4f7fb', }}>
      {/* Profile Header */}
      <View
        style={{
          backgroundColor: '#ffffff',
          padding: 20,
          alignItems: 'center',
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 15,
          shadowOffset: { width: 0, height: 6 },
          elevation: 5,
          borderColor: '#31d9cf',
          borderBottomWidth: 4,
          borderRightWidth: 1,
          borderLeftWidth: 1,
        }}
      >
        {/* Profile Picture with Edit Icon */}
        <TouchableOpacity onPress={handleProfileImageUpdate}>
          <Image
            source={{ uri: user?.pic || 'https://via.placeholder.com/120' }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 3,
              borderColor: '#31d1c9',
              marginBottom: 15,
              marginTop: 20,
            }}
          />
          {
            user && <MaterialIcons
              name="edit"
              size={20}
              color="#31d1c9"
              style={{
                position: 'absolute',
                bottom: 10,
                right: 5,
                backgroundColor: '#f4f7fb',
                borderRadius: 20,
                padding: 5,
              }}
            />
          }
        </TouchableOpacity>

        {/* User Name with Edit Icon */}
        <TouchableOpacity onPress={() => setIsEditingName(true)}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 5,
            }}
          >
            {user?.name || 'User Name'}
          </Text>
          {
            user &&
            <MaterialIcons
              name="edit"
              size={20}
              color="#31d1c9"
              style={{
                position: 'absolute',
                right: -40,
                top: 0,
                padding: 5,
                borderRadius: 20,
                backgroundColor: "#f4f7fb"
              }}
            />
          }

        </TouchableOpacity>

        {/* Email */}
        <Text
          style={{
            fontSize: 16,
            color: '#6c757d',
            marginBottom: 10,
          }}
        >
          {user?.email || 'user@example.com'}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: '#6c757d',
            marginBottom: 10,
          }}
        >
          Phone: {user?.phone || '+91xxxxxxxxxx'}
        </Text>

        {/* Admin Badge */}
        {user?.isAdmin && (
          <Text
            style={{
              backgroundColor: '#ffcc00',
              color: '#fff',
              fontSize: 14,
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 8,
            }}
          >
            Admin
          </Text>
        )}
      </View>

      {/* user login if not */}

      {
        user?.length == 0 &&
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
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: "center" }}>Welcome!</Text>
          <Text style={{ fontSize: 16, marginBottom: 10, textAlign: "center" }}>Please signup / log in to view your profile and donation history.</Text>

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


      {/* Badges Section */}
      {
        user?._id &&
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
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Badges Acquired</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {userBadges && userBadges?.length>0 && userBadges?.map((badge: any) => (
              <TouchableOpacity
                key={badge?._id}
                style={{
                  backgroundColor: '#fff',
                  borderWidth: 2,
                  borderColor: '#31d1c9',
                  padding: 15,
                  marginRight: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 3,
                }}
              >
                <Image
                  source={{ uri: badge?.icon || `https://via.placeholder.com/60` }}
                  resizeMode='contain'
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    marginBottom: 10,
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#333',
                  }}
                >
                  {badge?.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      }


      {/* Donations Section */}
      {
        user?._id &&
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
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 10,
              color: '#333',
            }}
          >
            Donations Made
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#28a745',
              marginBottom: 10,
              fontWeight: 600
            }}
          >
            Total Donated: ${user?.totalDonated || 0}
          </Text>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 10 }}
          >
            {user?._id && user?.donations && user?.donations.map(({ donation, index }: any) => (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: '#f1f1f1',
                  padding: 10,
                  marginRight: 15,  // Added margin between items
                  borderRadius: 10,
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                  width: 200,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: 5,
                  }}
                >
                  Campaign: {donation.campaignname}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#555',
                    marginBottom: 5,
                  }}
                >
                  Amount: ${donation.amount}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#777',
                  }}
                >
                  Date: {new Date(donation.date).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      }


      {/* Admin Panel Access */}

      {
        user?._id &&
        <View
          style={{
            backgroundColor: '#ffffff',
            padding: 15,
            marginHorizontal: 20,
            borderRadius: 15,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 5,
            gap: 10
          }}
        >

          <TouchableOpacity
            style={{
              backgroundColor: '#31d1c9',
              padding: 15,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => router.push("/(tabs)/profile/admin/createcampaign")}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Create Campaign</Text>
          </TouchableOpacity>



          <TouchableOpacity
            style={{
              backgroundColor: '#31d1c9',
              padding: 15,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => router.push("/(tabs)/profile/admin/allmembers")}

          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Members</Text>
          </TouchableOpacity>
        </View>
      }

      {
        user?._id &&
        <View
          style={{
            backgroundColor: '#ffffff',
            padding: 15,
            marginBottom: 40,
            marginHorizontal: 20,
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
          <TouchableOpacity
            style={{
              backgroundColor: '#31d1c9',
              padding: 15,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={async() => {
              dispatch(resetState());
              await AsyncStorage.removeItem('userDetails');
              router.push("/")
            }}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      }







      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditingName}
        onRequestClose={handleCancelEdit}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              width: '80%',
              padding: 20,
              borderRadius: 10,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 15,
              shadowOffset: { width: 0, height: 6 },
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#333',
                marginBottom: 15,
                textAlign: 'center',
              }}
            >
              Edit Your Name
            </Text>

            <TextInput
              value={newName}
              onChangeText={setNewName}
              style={{
                height: 40,
                borderColor: '#ddd',
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 10,
                fontSize: 16,
                marginBottom: 20,
                color: '#333',
              }}
              placeholder="Enter new name"
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={handleCancelEdit}
                style={{
                  backgroundColor: '#ddd',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNameUpdate}
                style={{
                  backgroundColor: '#31d1c9',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  width: 80,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />) :
                  (
                    <Text style={{ color: '#fff', fontSize: 16, textAlign: "center" }}>Save</Text>)}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
        animationType="fade"
        onDismiss={() => setIsModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              width: '80%',
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 20,
                color: '#333',
              }}
            >
              Update Profile Image
            </Text>
            <TouchableOpacity
              onPress={pickImageFromCamera}
              style={{
                width: '100%',
                paddingVertical: 12,
                backgroundColor: '#31d9cf',
                borderRadius: 10,
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#fff',
                }}
              >
                Use Camera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={pickImageFromGallery}
              style={{
                width: '100%',
                paddingVertical: 12,
                backgroundColor: '#31d9cf',
                borderRadius: 10,
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#fff',
                }}
              >
                Choose from Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={{
                width: '100%',
                paddingVertical: 12,
                backgroundColor: '#f44336',
                borderRadius: 10,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#fff',
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProfileScreen;
