import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Animated, Alert, Share } from 'react-native';
import LeftArrow from "../../../../assets/images/left-arrow.svg"
import ShareIcon from "../../../../assets/images/share.svg"
import Like from "../../../../assets/images/like.svg"
import { useRouter } from 'expo-router';
import SkeletonLoader from '@/components/utils/SkeletonLoader';
import CircularProgressBar from '@/components/utils/CircularProgressBar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import RedLike from "../../../../assets/images/red-like.svg"


const STATUS_COLORS = {
  Active: '#28a745',
  Inactive: '#dc3545',
  Upcoming: '#31d1c9',
};
const campaignDetails = () => {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [targetAmount, setTargetAmount] = useState(0);
  const [collectedAmount, setCollectedAmount] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [liked,setLiked]=useState(false)



  const campaignData = {
    id: 3,
    title: 'Food Donation Drive',
    startDate: '2023-11-10',
    endDate: '2023-11-20',
    location: 'BIET Jhansi',
    description:
      'Join us to distribute meals to the underprivileged community. Your contributions can bring a smile to someone’s face.Join us to distribute meals to the underprivileged community. Your contributions can bring a smile to someone’s face.',
    image: 'https://res.cloudinary.com/doagrwjza/image/upload/v1734288164/money-hands-message-quote_xa5vmx.jpg',
    targetAmount: 50000,
    collectedAmount: 48000,
    status: "Upcoming",
    createdBy: 'Kavita',
  };

  useEffect(() => {
    setTimeout(() => {
      setImages([
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/200',
      ]);
      setVideos(['https://via.placeholder.com/300']);
      const progress = Math.min(
        (campaignData.collectedAmount / campaignData.targetAmount) * 100,
        100
      );

      setProgressPercent(progress);
      setImageLoading(false);
      setVideoLoading(false);


    }, 2000);
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this awesome content!',
        url: 'https://example.com', // Optional: a link to share
        title: 'Awesome Content',
      });

      // Optionally handle result if needed
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          console.log('Shared via', result.activityType);
        } else {
          console.log('Content shared successfully!');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };



  useEffect(() => {
    // Request permission to access the media library
    const requestPermission = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        setHasPermission(true);
      } else {
        Alert.alert(
          'Permission Denied',
          'You need to grant media library permission to download images.'
        );
        setHasPermission(false);
      }
    };

    requestPermission();
  }, []);

  // Function to handle download
  const handleDownload = async (imageUrl: string) => {
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Cannot download without the necessary permissions.');
      return;
    }

    const uri = imageUrl; // URL of the image to be downloaded
    const fileUri = FileSystem.documentDirectory + 'downloaded_image.jpg'; // Path to save the image locally

    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        uri,
        fileUri
      );

      // Start download
      const downloadResult = await downloadResumable.downloadAsync();

      // Check if the download result contains a valid URI
      if (downloadResult && downloadResult.uri) {
        // Save the downloaded file to the media library
        await MediaLibrary.createAssetAsync(downloadResult.uri);

        Alert.alert("Download Complete", `Image downloaded to ${downloadResult.uri}`);
      } else {
        Alert.alert("Download Failed", "The download did not return a valid URI.");
      }
    } catch (error) {
      Alert.alert("Download Failed", "Failed to download the image.");
    }
  };



  return (
    <ScrollView style={{ flex: 1, position: "relative", backgroundColor: '#f9f9f9' }}>
      {/* Header Image */}
      <Image
        source={{ uri: campaignData.image }}
        style={{
          width: '100%',
          height: 250,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      />
      <View style={{ position: "absolute", top: 40, left: 0, right: 0 }}>
        <TouchableOpacity
          onPress={() => { router.back() }}
          style={{
            position: 'absolute',
            top: 0,
            left: 20,
            zIndex: 100,
            paddingHorizontal: 10
          }}
        >
          <LeftArrow width={24} height={24} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onShare}
          style={{
            position: 'absolute',
            top: 0,
            right: 80,
            zIndex: 100,
          }}
        >
          <ShareIcon width={24} height={24} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            right: 30,
            zIndex: 100,
          }}
          onPress={()=>setLiked(!liked)}
        >
          {
                                liked &&  <RedLike width={24} height={24} />
                               } 
                               {
                                !liked && <Like width={24} height={24} />
                               }
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginTop: -20,
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 10,
          marginHorizontal: 20,
          elevation: 5,
          shadowColor: '#bdbdbd',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
          {campaignData.title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >



<View
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 25,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }}
>
  {campaignData.status && (
    <>
      <View
        style={{
          height: 8,
          width: 8,
          borderRadius: 5,
          marginRight: 8,
          backgroundColor: STATUS_COLORS[campaignData.status as keyof typeof STATUS_COLORS],
        }}
      />
      <Text
        style={{
          fontSize: 10,
          fontWeight: 'bold',
          color:STATUS_COLORS[campaignData.status as keyof typeof STATUS_COLORS],
          textTransform: 'uppercase',
        }}
      >
        {campaignData.status}
      </Text>
    </>
  )}
</View>

        </View>
      </View>

      {/* Campaign Information Card */}


      {/* Media Section */}
      <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Photos</Text>
        {imageLoading ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 10
            }}
          >
            <SkeletonLoader width={120} height={120} borderRadius={10} />
            <SkeletonLoader width={120} height={120} borderRadius={10} />
            <SkeletonLoader width={120} height={120} borderRadius={10} />
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((image, index) => (
              <View key={index} style={{ position: 'relative' }}>
                <Image
                  source={{ uri: image }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 10,
                    marginRight: 10,
                    borderWidth: 2,
                    borderColor: '#f0f0f0',
                    overflow: 'hidden',
                  }}
                />
                {/* Download Icon */}
                <TouchableOpacity
                  onPress={() => { handleDownload(image) }}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 20,
                    backgroundColor: '#007bff',
                    padding: 6,
                    borderRadius: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <MaterialIcons name="file-download" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>Videos</Text>
        {videoLoading ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 10
            }}
          >
            <SkeletonLoader width={180} height={120} borderRadius={10} />
            <SkeletonLoader width={180} height={120} borderRadius={10} />
            <SkeletonLoader width={180} height={120} borderRadius={10} />
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>

            {videos.map((video, index) => (
              <View
                key={index}
                style={{
                  width: 180,
                  height: 120,
                  backgroundColor: '#6c757d',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  marginRight: 10,
                }}
              >
                <Text style={{ color: 'white', fontSize: 16 }}>Video {index + 1}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          padding: 20,
          borderRadius: 20,
          marginHorizontal: 10,
          marginTop: 20,
          elevation: 8,
          shadowColor: '#bdbdbd',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
        }}>





        {/* Dates and Progress */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            gap: 10,
            borderColor: "#e7e7e7",
            borderRadius: 20, borderWidth: .5,
            padding: 10
          }}
        >
          <View style={{
            flex: 1,
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="event" size={24} color="#31d1c9" />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: 12, fontWeight: "bold", color: "#666" }}>
                  Start Date
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#000", marginTop: 3 }}
                >
                  {campaignData?.startDate}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="event" size={24} color="#ff6f61" />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: 12, fontWeight: "bold", color: "#666" }}>
                  End Date
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#000", marginTop: 3 }}
                >
                  {campaignData?.endDate}
                </Text>
              </View>
            </View>
          </View>

          {/* Circular Progress */}
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >

            <CircularProgressBar percentage={progressPercent} size={80} strokeWidth={10} />
            <View style={{ flexDirection: "row", gap: 2 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: '#2196F3',
                  marginTop: 10,
                  textAlign: 'center',
                }}
              >
                ₹{campaignData.collectedAmount}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#555',
                  marginTop: 10,
                  textAlign: 'center',
                }}
              >
                /
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#FF9800',
                  marginTop: 10,
                  textAlign: 'center',
                }}
              >
                ₹{campaignData.targetAmount}
              </Text>
            </View>

          </View>
        </View>

        {/* Location */}
        <View
          style={{
            flex: 1,
            marginBottom: 20,
            backgroundColor: '#fff',
            borderColor: "#e7e7e7",
            borderRadius: 20, borderWidth: .5,
            padding: 15,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 0.1,
            // shadowRadius: 4,
            // elevation: 3,
          }}
        >
          {/* Location Section */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 15,
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                backgroundColor: '#007bff',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 15,
              }}
            >
              <MaterialIcons name="location-on" size={24} color="#fff" />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  color: '#888',
                  marginBottom: 2,
                }}
              >
                Location
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#333',
                }}
              >
                {campaignData.location}
              </Text>
            </View>
          </View>

          {/* Description Section */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                backgroundColor: '#28a745',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 15,
              }}
            >
              <MaterialIcons name="description" size={24} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#888',
                  marginBottom: 2,
                }}
              >
                Description
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#555',
                  lineHeight: 22,
                }}
              >
                {campaignData.description}
              </Text>
            </View>
          </View>
        </View>

      </View>
      {/* Buttons */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginVertical: 30,

          marginHorizontal: 10,
        }}
      >

        <TouchableOpacity
          style={{
            width: 150,
            backgroundColor: "#31d1c9",
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 20,
            shadowColor: "#000",
            shadowOpacity: 0.5,
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowRadius: 10,
            elevation: 5,
          }}
          onPress={() => router.push("/(tabs)/donate")}
        >
          <Text style={{ color: 'white', fontSize: 14, textAlign: "center" }}>Donate Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


export default campaignDetails;
