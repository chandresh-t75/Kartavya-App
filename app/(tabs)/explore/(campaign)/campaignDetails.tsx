import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Animated, Alert, Share, Dimensions, FlatList, Modal } from 'react-native';
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
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { ResizeMode, Video } from 'expo-av';
import { ThemedText } from '@/components/ThemedText';


const STATUS_COLORS = {
  Active: '#28a745',
  Inactive: '#dc3545',
  Upcoming: '#31d1c9',
};
const campaignDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [targetAmount, setTargetAmount] = useState(0);
  const [collectedAmount, setCollectedAmount] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [liked, setLiked] = useState(false)
  const [media, setMedia] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const campaign = useSelector((state: any) => state.campaign.selectedCampaign);
  const [moreImage, setMoreImage] = useState(true);
  const [moreVideo, setMoreVideo] = useState(true);
  const [imgPage, setImgPage] = useState(1)
  const [videoPage, setVideoPage] = useState(1)
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current; // Animated scale value
  const [photoLoading, setPhotoLoading] = useState(false);
  // const [videoLoading, setVideoLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const { width, height } = Dimensions.get("window")
  const handleImageLoad = () => {
    setPhotoLoading(false);
  };

  const handleVideoLoad = () => {
    setVideoLoading(false);
  };



  const openImageModal = (imageUrl: any) => {
    setSelectedVideo(null)
    setSelectedImage(imageUrl);
    setModalVisible(true);

    // Trigger zoom-in animation
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  const closeImageModal = () => {
    // Trigger zoom-out animation before closing the modal
    Animated.spring(scaleValue, {
      toValue: 0,
      friction: 3,
      tension: 50,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setModalVisible(false);
      setSelectedImage(null);
    }, 300); // Delay to allow the animation to complete
  };

  const fetchCampaignImages = async () => {
    if (!moreImage) return;
    try {

      setImageLoading(true);
      await axios.get('http://192.168.43.243:5000/campaign/get-campaign-images', {
        params: {
          campaignId: campaign?._id,
          page: imgPage,
          limit: 10,
        }
      }).then(
        (response) => {
          setImgPage(imgPage + 1);
          if (response.data.length < 10) setMoreImage(false);
          setImages([...images, ...response.data]);
          setImageLoading(false);
        }
      )

    } catch (error) {
      console.error(error);
      setImageLoading(false)

    }

  }

  const fetchCampaignVideos = async () => {
    if (!moreVideo) return;
    try {

      setVideoLoading(true);
      await axios.get('http://192.168.43.243:5000/campaign/get-campaign-videos', {
        params: {
          campaignId: campaign?._id,
          page: videoPage,
          limit: 10,
        }
      }).then(
        (response) => {
          setVideoPage(videoPage + 1);
          if (response.data.length < 10) setMoreVideo(false);
          setVideos([...videos, ...response.data]);
          setVideoLoading(false);
        }
      )

    } catch (error) {
      console.error(error);
      setVideoLoading(false);

    }

  }



  useEffect(() => {
    const progress = Math.min(
      (campaign?.collectedAmount / campaign?.targetAmount) * 100,
      100
    );

    console.log(progress);
    
    setProgressPercent(progress);

    fetchCampaignImages()
    fetchCampaignVideos()
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


  const openVideoModal = (videoUrl: string) => {
    setSelectedImage(null);
    setSelectedVideo(videoUrl);
    setModalVisible(true);
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  const closeVideoModal = () => {
    // Trigger the zoom-out animation before closing the modal
    Animated.spring(scaleValue, {
      toValue: 0,
      friction: 3,
      tension: 50,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setModalVisible(false);
      setSelectedVideo(null);
    }, 300); // Delay to allow the animation to complete
  };


  const renderPhotoSkeleton = () => {
    return (
      <View style={{ width: 160, height: 120, borderRadius: 10, backgroundColor: '#e0e0e0' }} />
    );
  };
  const renderPhoto = ({item}: any) => (
    <TouchableOpacity style={{ borderRadius: 10, overflow: 'hidden' }}
      onPress={() => openImageModal(item?.url)}>
      <Image
        source={{ uri: item?.url }}
        style={{ width: 160, height: 120, borderRadius: 10, resizeMode: 'cover' }}

      />
    </TouchableOpacity>


  );


  const renderVideoSkeleton = () => (

    <View style={{ width: 160, height: 120, borderRadius: 10, backgroundColor: '#e0e0e0' }} />

  );

  const renderVideo = ({ item }: any) => (
    <TouchableOpacity key={item?.url} style={{ borderRadius: 10, overflow: 'hidden' }} onPress={() => openVideoModal(item?.url)}>
      <View
        style={{
          alignItems: 'center',

        }}
      >
        <Video
          source={{ uri: item?.url }}
          style={{ width: 160, height: 120, borderRadius: 10, backgroundColor: "#000" }}
          useNativeControls

          resizeMode={ResizeMode.CONTAIN}



        />
      </View>
    </TouchableOpacity>
  );





  return (
    <ScrollView style={{ flex: 1, position: "relative", backgroundColor: '#f9f9f9' }}>
      {/* Header Image */}
      <Image
        source={{ uri: campaign?.image }}
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
          onPress={() => setLiked(!liked)}
        >
          {
            liked && <RedLike width={24} height={24} />
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
          {campaign?.title}
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
            {campaign?.status && (
              <>
                <View
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 5,
                    marginRight: 8,
                    backgroundColor: STATUS_COLORS[campaign?.status as keyof typeof STATUS_COLORS],
                  }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: STATUS_COLORS[campaign?.status as keyof typeof STATUS_COLORS],
                    textTransform: 'uppercase',
                  }}
                >
                  {campaign?.status}
                </Text>
              </>
            )}
          </View>

        </View>
      </View>

      {/* Campaign Information Card */}


      {/* Media Section */}
      <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
        <View style={{ marginHorizontal: 10, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', }}>Photos</Text>
          <TouchableOpacity onPress={() => { router.push("/(tabs)/explore/(campaign)/uploadMedia") }}>
            <Text style={{ fontSize: 14, color: '#999', fontWeight: 600 }}>Upload Photos</Text>
          </TouchableOpacity>



        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={images}
          keyExtractor={(item: any) => item._id}
          onEndReached={()=>{
               
               if(moreImage){
                console.log('End reached')
              fetchCampaignImages();
               }
            
            }}
            onEndReachedThreshold={0.8}
          renderItem={({ item }) => (
            <View style={{ margin: 5 }}>
              {imageLoading ? renderPhotoSkeleton() : renderPhoto({ item })}
            </View>
          )}


          contentContainerStyle={{
            padding: 10,
          }}
        />



        <View style={{ marginHorizontal: 10, marginVertical: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', }}>Videos</Text>
          <TouchableOpacity onPress={() => { router.push("/(tabs)/explore/(campaign)/uploadMedia") }}>
            <Text style={{ fontSize: 14, color: '#999', fontWeight: 600 }}>Upload Videos</Text>
          </TouchableOpacity>


        </View>
        <FlatList
          data={videos}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item: any) => item._id}
          onEndReached={()=>{
               
            if(moreVideo){
             console.log('End reached video')
             fetchCampaignVideos();
            }
         
         }}
         onEndReachedThreshold={0.8}
          renderItem={({ item }) => (
            <View style={{ flex: 1, margin: 3 }}>
              {videoLoading ? renderVideoSkeleton() : renderVideo({ item })}
            </View>
          )}
          horizontal
          contentContainerStyle={{
            padding: 10,
          }}
        />
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
                  {campaign?.startDate &&
                    new Intl.DateTimeFormat('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }).format(new Date(campaign?.startDate))}
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

                  {campaign?.endDate &&
                    new Intl.DateTimeFormat('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }).format(new Date(campaign?.endDate))}
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
                ₹{campaign?.collectedAmount}
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
                ₹{campaign?.targetAmount}
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
                {campaign?.location}
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
                {campaign?.description}
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
       {modalVisible && selectedImage && (
              <Modal
                visible={modalVisible}
                transparent={true}
                onRequestClose={closeImageModal}
                animationType="fade"
              >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                  <View style={{ width: .9 * width, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
                    {selectedImage && (
                      <Animated.Image
                        source={{ uri: selectedImage }}
                        style={{
                          width: width - 60,
                          height: width - 60,
                          borderRadius: 10,
                          marginBottom: 15,
                          transform: [{ scale: scaleValue }],
                        }}
                      />
                    )}
      
      
                    <TouchableOpacity onPress={closeImageModal} style={{ backgroundColor: '#31d1c9', padding: 10, borderRadius: 20 }}>
                      <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Close</ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            )}
      
            {modalVisible && selectedVideo && (
              <Modal
                visible={modalVisible}
                transparent={true}
                onRequestClose={closeVideoModal}
                animationType="fade"
              >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                  <View style={{ width: .9 * width, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
      
      
                    {selectedVideo && (
                      <Animated.View
                        style={{
                          width: width - 60,
                          height: 200,
                          borderRadius: 10,
                          marginBottom: 15,
                          transform: [{ scale: scaleValue }],
                        }}
                      >
                        <Video
                          source={{ uri: selectedVideo }}
                          style={{ width: '100%', height: '100%' }}
                          useNativeControls
                          resizeMode={ResizeMode.CONTAIN}
      
                        />
      
                      </Animated.View>
                    )}
                    <TouchableOpacity onPress={closeImageModal} style={{ backgroundColor: '#31d1c9', padding: 10, borderRadius: 20 }}>
                      <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Close</ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            )}
    </ScrollView>
  );
};


export default campaignDetails;
