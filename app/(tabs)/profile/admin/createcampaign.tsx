import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

const createcampaign = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [image, setImage] = useState(null);

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

  const handleSubmit = () => {
    if (!title || !description || !targetAmount || !location || !image) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    Alert.alert('Success', 'Campaign created successfully!');
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
          height: 150,
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

      {/* Start Date */}
      <View style={{ marginBottom: 15 }}>
        <Text
          style={{
            fontSize: 14,
            color: '#333',
            marginBottom: 5,
            paddingHorizontal:10
          }}
        >
          Start Date
        </Text>
        {/* <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, date) => setStartDate(date || startDate)}
        /> */}
      </View>

      {/* End Date */}
      <View style={{ marginBottom: 15 }}>
        <Text
          style={{
            fontSize: 14,
            color: '#333',
            marginBottom: 5,
            paddingHorizontal:10

          }}
        >
          End Date
        </Text>
        {/* <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, date) => setEndDate(date || endDate)}
        /> */}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={{
            padding: 15,
            backgroundColor: '#31d9cf',
            borderRadius: 20,
            width: '100%',
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 60,
            shadowColor:"#000",
            shadowOffset:{width:0,height:2},
            shadowOpacity:0.5,
            shadowRadius:4,
            elevation:5

        }}
        onPress={handleSubmit}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          Create Campaign
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default createcampaign;
