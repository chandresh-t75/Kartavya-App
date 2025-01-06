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
  FlatList,
  Modal,
} from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { setCampaigns, setSelectedCampaign } from '@/redux/reducers/campaignSlice';

const updateCampaign = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const campaign = useSelector((state: any) => state.campaign.selectedCampaign);
  const [title, setTitle] = useState(campaign.title);
  const [description, setDescription] = useState(campaign.description);
  const [targetAmount, setTargetAmount] = useState(campaign.targetAmount.toString());
  const [collectedAmount, setCollectedAmount] = useState(campaign.collectedAmount.toString());

  const [location, setLocation] = useState(campaign.location);
  const [status, setStatus] = useState(campaign.status);

  const [startDate, setStartDate] = useState(new Date(campaign.startDate));
  const [endDate, setEndDate] = useState(new Date(campaign.endDate));
  const [image, setImage] = useState(campaign?.image);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state.userData.userDetails);
  const [modalVisible, setModalVisible] = useState(false);
  const options = ['Active', 'Inactive', 'Upcoming'];
  const [updated,setUpdated]=useState(false);


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
    const updatedFields: any = {};
  
    // Check which fields are updated and include them
    if (title !== campaign.title) updatedFields.title = title;
    if (description !== campaign.description) updatedFields.description = description;
    if (status !== campaign.status) updatedFields.status= status;
    if (targetAmount !== campaign.targetAmount.toString()) updatedFields.targetAmount = targetAmount;
    if (collectedAmount !== campaign.collectedAmount.toString()) updatedFields.collectedAmount = collectedAmount;
    if (location !== campaign.location) updatedFields.location = location;
    if (startDate.toISOString() !== new Date(campaign.startDate).toISOString())
      updatedFields.startDate = startDate.toISOString();
    if (endDate.toISOString() !== new Date(campaign.endDate).toISOString())
      updatedFields.endDate = endDate.toISOString();
    if (image!==campaign.image) updatedFields.image = image;
  
    // Check if there are any updates
    if (Object.keys(updatedFields).length === 0) {
      Alert.alert('No Changes', 'No changes were made to the campaign.');
      return;
    }
  
    try {
      setLoading(true);
  
      const formData = new FormData();
      Object.keys(updatedFields).forEach((key) => {
        if (key === 'image') {
          formData.append('imageFile', {
            uri: image,
            name: `campaign_img_${Date.now()}_${Math.floor(Math.random() * 100000)}.jpg`,
            type: 'image/jpeg',
          } as any);
        } else {
          formData.append(key, updatedFields[key]);
        }
      });
  
      formData.append('campaignId', campaign._id); // Pass campaign ID for backend reference
  
      console.log('Updating campaign with data:', updatedFields);
  
      const response = await axios.put('http://192.168.43.243:5000/campaign/update-campaign', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Campaign updated successfully:', response.data);
      dispatch(setSelectedCampaign(response.data));
      setUpdated(true);
    } catch (error) {
      console.error('Error updating campaign:', error);
      Alert.alert('Error', 'Failed to update the campaign. Please try again.');
    } finally {
      setLoading(false);
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
        Update Campaign
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
      <View>
        <Text style={{ fontSize: 14,paddingHorizontal:15, fontWeight: 'normal', marginBottom: 5 ,color:"#848181"}}>
           Title
        </Text>
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
      </View>
     

      {/* Description */}
      <View>
        <Text style={{ fontSize: 14,paddingHorizontal:15, fontWeight: 'normal', marginBottom: 5 ,color:"#848181"}}>
           Description
        </Text>
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
      </View>
      {/* Collected Amount */}

      <View>
        <Text style={{ fontSize: 14,paddingHorizontal:15, fontWeight: 'normal', marginBottom: 5 ,color:"#848181"}}>
           Collected Amount
        </Text>

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
        placeholder="Collected Amount"
        value={collectedAmount}
        onChangeText={setCollectedAmount}
        keyboardType="numeric"
      />
      </View>

      {/* Target Amount */}
      <View>
        <Text style={{ fontSize: 14,paddingHorizontal:15, fontWeight: 'normal', marginBottom: 5 ,color:"#848181"}}>
           Target Amount
        </Text>
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
      </View>

      <View>
      <Text
        style={{
          fontSize: 14,
          paddingHorizontal: 15,
          fontWeight: 'normal',
          marginBottom: 5,
          color: '#848181',
        }}
      >
        Status
      </Text>
      <TouchableOpacity
        style={{
          width: '100%',
          padding: 15,
          backgroundColor: '#fff',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#ccc',
          marginBottom: 15,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ fontSize: 14, color: '#333' }}>
          {status || 'Select Status'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '80%',
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 20,
              alignItems: 'center',
            }}
          >
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',
                    width: '100%',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    setStatus(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={{ fontSize: 16, color: '#333' }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={{
                marginTop: 15,
                padding: 10,
                backgroundColor: '#f44336',
                borderRadius: 5,
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: '#fff', fontSize: 14 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>


      

      {/* Location */}
      <View>
      <Text style={{ fontSize: 14,paddingHorizontal:15, fontWeight: 'normal', marginBottom: 5,color:"#848181" }}>
           Location
        </Text>
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
      </View>



      <View style={{ padding: 10, flexDirection: "row", gap: 15, backgroundColor: '#f8f9fa' }}>
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
        disabled={loading || updated}
        style={{
          padding: 15,
          backgroundColor: updated?"green":'#31d9cf',
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
               {updated?"Updated Successfully":"Update Campaign"} 
              </Text>)}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default updateCampaign;
