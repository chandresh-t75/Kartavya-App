import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Button,
  ActivityIndicator,
} from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { setCampaigns } from '@/redux/reducers/campaignSlice';

const createcampaign = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [image, setImage] = useState<string | null>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state.userData.userDetails);
  const campaigns = useSelector((state: any) => state.campaign.campaigns);



  const handleStartDateChange = (event: DateTimePickerEvent,
    selectedDate?: Date | undefined) => {
    if (event.type === "set") { // Ensure it's not a dismissal (optional)
      const currentDate = selectedDate || startDate;
      setStartDate(currentDate); // Set the selected date
    }
    setShowStartPicker(false); // Hide the picker after selection
  };

  const handleEndDateChange = (event: DateTimePickerEvent,
    selectedDate?: Date | undefined) => {
    if (event.type === "set") { // Ensure it's not a dismissal (optional)
      const currentDate = selectedDate || endDate;
      setEndDate(currentDate); // Set the selected date
    }
    setShowEndPicker(false); // Hide the picker after selection
  };


  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result?.canceled) {
      setImage(result?.assets[0]?.uri);
    }
  };



  const handleSubmit = async () => {
    if (!title || !description || !targetAmount || !location || !image) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    try {



      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('targetAmount', targetAmount);
      formData.append('location', location);
      formData.append('startDate', startDate.toISOString());
      formData.append('endDate', endDate.toISOString());
      formData.append('createdBy', user?._id);
      if (image) {
        formData.append('imageFile', {
          uri: image,
          name: `campaign_img_${Date.now()}_${Math.floor(Math.random() * 100000)}.jpg`,
          type: 'image/jpeg',
        } as any);
      }
      console.log("creating user", formData);

      await axios.post('http://192.168.43.243:5000/campaign/create-campaign', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(async (response) => {
        console.log(response.data);
        const createdCampaign = response.data;
        dispatch(setCampaigns([createdCampaign, ...campaigns]));
        router.push("/(tabs)/profile");
        setLoading(false);
      })

    }
    catch (error) {
      setLoading(false);
      console.log("errorin creating user", error);
    }
  };
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,

      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333',
          marginBottom: 20,
          textAlign: 'center',
          marginTop: 10,
        }}
      >
        Create New Campaign
      </Text>

      {/* Image Picker */}
      <TouchableOpacity
        onPress={handleImagePick}
        style={{
          height: 180,
          backgroundColor: '#e9ecef',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
          overflow: 'hidden',
        }}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <Text
            style={{
              color: '#6c757d',
              fontSize: 16,
            }}
          >
            Pick an Image
          </Text>
        )}
      </TouchableOpacity>

      {/* Title */}
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
        placeholder="Campaign Title"
        value={title}
        onChangeText={setTitle}
      />

      {/* Description */}
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
          height: 100,
          textAlignVertical: 'top',
          elevation: 3,
        }}
        placeholder="Campaign Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      {/* Target Amount */}
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
        placeholder="Target Amount"
        value={targetAmount}
        onChangeText={setTargetAmount}
        keyboardType="numeric"
      />

      {/* Location */}
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
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />



      <View style={{ padding: 10, flexDirection: "row", gap: 15, backgroundColor: '#f8f9fa', }}>
        {/* Start Date */}
        <View
          style={{
            flex: 1,
            marginBottom: 20,
            padding: 10,
            backgroundColor: '#ffffff',
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          }}
        >

          <TouchableOpacity
            style={{
              backgroundColor: '#31d1c9',
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => setShowStartPicker(true)}
          >
            <Text
              style={{
                color: '#ffffff',
                fontSize: 14,
                fontWeight: '500',
              }}
            >
              Set Start Date
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
          <Text
            style={{
              marginTop: 10,
              fontSize: 14,
              color: '#555',
              fontStyle: 'italic',
              textAlign: "center"

            }}
          >
            {startDate.toDateString()}
          </Text>
        </View>

        {/* End Date */}
        <View
          style={{
            flex: 1,
            marginBottom: 20,
            padding: 10,
            backgroundColor: '#ffffff',
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          }}
        >

          <TouchableOpacity
            style={{
              backgroundColor: '#31d1c9',
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => setShowEndPicker(true)}
          >
            <Text
              style={{
                color: '#ffffff',
                fontSize: 14,
                fontWeight: '500',
                textAlign: "center"
              }}
            >
              Set End Date
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
          <Text
            style={{
              marginTop: 10,
              fontSize: 14,
              color: '#555',
              fontStyle: 'italic',
              textAlign: "center"

            }}
          >
            {endDate.toDateString()}
          </Text>
        </View>
      </View>


      {/* Submit Button */}
      <TouchableOpacity
        disabled={loading}
        style={{
          padding: 15,
          backgroundColor: '#31d9cf',
          borderRadius: 20,
          width: '100%',
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 60,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
          elevation: 5

        }}
        onPress={handleSubmit}
      >
        {
          loading ? (
            <ActivityIndicator color="#fff" />) :
            (
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                Create Campaign
              </Text>)}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default createcampaign;
