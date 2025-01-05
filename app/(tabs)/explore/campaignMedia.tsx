import { ThemedText } from '@/components/ThemedText';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
 
} from 'react-native';
// import Video from 'react-native-video';
import { ResizeMode, Video } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import LeftArrow from "../../../assets/images/left-black-arrow.svg"
import { useRouter } from 'expo-router';
import axios from 'axios';



const { width } = Dimensions.get('window');

type Photo = {
  id: string;
  uri?: string; // `uri` can be optional if there might be missing values.
};

const photos = [
  { id: '1', uri: 'https://picsum.photos/id/1067/1000/600' },
  { id: '2', uri: 'https://picsum.photos/id/1068/1000/600' },
  { id: '3', uri: 'https://picsum.photos/id/1069/1000/600' },
  { id: '4', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '5', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '6', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '7', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '8', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '9', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '10', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '11', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '12', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '13', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '14', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '15', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '16', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '17', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '18', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '18', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '19', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '19', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '20', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '21', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '22', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '23', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '24', uri: 'https://picsum.photos/id/1070/1000/600' },
  { id: '25', uri: 'https://picsum.photos/id/1070/1000/600' },

];

const videos = [
  { id: '1', uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: '2', uri: 'https://www.w3schools.com/html/movie.mp4' },
  { id: '3', uri: 'https://www.w3schools.com/html/movie.mp4' },
  { id: '4', uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: '5', uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: '6', uri: 'https://www.w3schools.com/html/movie.mp4' },
  { id: '7', uri: 'https://www.w3schools.com/html/movie.mp4' },





];

export default function campaignMedia() {
  const router=useRouter()
  const [activeTab, setActiveTab] = useState('photos'); // 'photos' or 'videos'
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current; // Animated scale value
  const [photoLoading, setPhotoLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
const [moreImage, setMoreImage] = useState(true);
  const [moreVideo, setMoreVideo] = useState(true);
  const [imgPage, setImgPage] = useState(1)
  const [videoPage, setVideoPage] = useState(1)
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState(true);
  
  
  const { width, height } = Dimensions.get("window")

  const fetchCampaignImages = async () => {
    if (!moreImage) return;
    try {

      setPhotoLoading(true);
      await axios.get('http://192.168.43.243:5000/campaign/get-all-images', {
        params: {
          page: imgPage,
          limit: 10,
        }
      }).then(
        (response) => {
          setImgPage(imgPage + 1);
          if (response.data.length < 10) setMoreImage(false);
          setImages([...images, ...response.data]);
          setPhotoLoading(false);
        }
      )

    } catch (error) {
      console.error(error);
      setPhotoLoading(false)

    }

  }

  const fetchCampaignVideos = async () => {
    if (!moreVideo) return;
    try {

      setVideoLoading(true);
      await axios.get('http://192.168.43.243:5000/campaign/get-all-videos', {
        params: {
        
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
    

    fetchCampaignImages()
    fetchCampaignVideos()
  }, []);


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

  const renderPhotoSkeleton = () => {
    return (
      <View style={{ width: width / 3 - 20, height: 120, borderRadius: 10, backgroundColor: '#e0e0e0' }} />
    );
  };
  const renderPhoto = ({ item }:any) => (
    <TouchableOpacity key={item._id} style={{ borderRadius: 10, overflow: 'hidden' }}
      onPress={() => openImageModal(item?.url)}>
      <Image
        source={{ uri: item?.url }}
        style={{ width: width / 3 - 20, height: 120, borderRadius: 10, resizeMode: 'cover' }}
        onLoad={handleImageLoad}
      />
    </TouchableOpacity>


  );


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

    const renderVideoSkeleton = () => (

      <View style={{ width: width / 3 - 20, height: 120, borderRadius: 10, backgroundColor: '#e0e0e0' }} />

    );

    const renderVideo = ({ item }: any) => (
      <TouchableOpacity key={item?._id} style={{ borderRadius: 10, overflow: 'hidden' }} onPress={() => openVideoModal(item?.url)}>
        <View
          style={{

            alignItems: 'center',

          }}
        >


          <Video
            source={{ uri: item?.url}}
            style={{ width: width / 3 - 10, height: 100, borderRadius: 10, backgroundColor: "#000" }}
            useNativeControls
            onLoad={handleVideoLoad}
            // resizeMode="contain"
            resizeMode={ResizeMode.CONTAIN}



          />
        </View>
      </TouchableOpacity>
    );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom:20
      }}
    >

      <View style={{position:"relative",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
      <TouchableOpacity
          onPress={() => { router.back() }}
          style={{
            padding:20
          }}
        >
          <LeftArrow  width={20} height={20} />
        </TouchableOpacity>
        <View style={{flex:1, position:"relative"  }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Explore Glories Of Kartavya</Text>
        </View>
      

      </View>


      {/* Tabs */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginVertical: 10,
          
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 10,
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor: activeTab === 'photos' ? '#31d1c9' : 'transparent',
          }}
          onPress={() => setActiveTab('photos')}
        >
          <Text
            style={{
              fontSize: 16,
              color: activeTab === 'photos' ? '#31d1c9' : '#888',
              fontWeight: activeTab === 'photos' ? 'bold' : 'normal',
            }}
          >
            Photos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 10,
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor: activeTab === 'videos' ? '#31d1c9' : 'transparent',
          }}
          onPress={() => setActiveTab('videos')}
        >
          <Text
            style={{
              fontSize: 16,
              color: activeTab === 'videos' ? '#31d1c9' : '#888',
              fontWeight: activeTab === 'videos' ? 'bold' : 'normal',
            }}
          >
            Videos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'photos' ? (
        <FlatList
          data={images}
          keyExtractor={(item:any) => item._id}

          renderItem={({ item }:any) => (
            <View style={{ flex: 1, margin: 5 }}>
              {photoLoading ? renderPhotoSkeleton() : renderPhoto({ item })}
            </View>
          )}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
          contentContainerStyle={{
            padding: 10,
          }}
        />
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item:any) => item._id}
          renderItem={({ item }) => (
            <View style={{ flex: 1, margin: 3 }}>
              {videoLoading ? renderVideoSkeleton() : renderVideo({ item })}
            </View>
          )}
          numColumns={3}
          contentContainerStyle={{
            padding: 10,
          }}
        />
      )}

      {/* Zoom Modal */}
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
    </SafeAreaView>
  );
}
