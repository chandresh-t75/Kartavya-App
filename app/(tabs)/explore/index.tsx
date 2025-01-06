import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Animated, ScrollView, Share, View, Text, Image, Pressable, Dimensions, Alert, FlatList } from 'react-native';
import Modal from 'react-native-modal'; // Import the modal
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightGreen, lightOrange, lightPurple, tintColorDark } from '@/constants/Colors';
import LeftArrow from "../../../assets/images/left-arrow.svg"
import ShareIcon from "../../../assets/images/share.svg"
import ProgressBar from '@/components/utils/ProgressBar';
import AnimatedProgressBar from '@/components/utils/AnimatedProgressBar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import EventPhotos from '@/components/utils/EventsPhotos';
import EventVideos from '@/components/utils/EventVideos';
import Like from "../../../assets/images/like.svg";
import RedLike from "../../../assets/images/red-like.svg";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { setCampaigns, setSelectedCampaign } from '@/redux/reducers/campaignSlice';
import { useDispatch } from 'react-redux';




interface Event {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  image: string;
  targetAmount: number;
  collectedAmount: number;
  status: string;
  createdBy: string;
  likes: number;
}


const options = [
  {
    id: 1,
    title: "All"
  },
  {
    id: 2,
    title: "Active"
  },
  {
    id: 3,
    title: "Inactive"
  },
  {
    id: 4,
    title: "Upcoming"
  },
]


export default function TabTwoScreen() {
  const dispatch=useDispatch();
  const router = useRouter();
  const [liked,setLiked]=useState(false)

  const { width, height } = Dimensions.get("window")
  const [activeTab, setActiveTab] = useState("All")
  const campaigns = useSelector((state: any) => state.campaign.campaigns);
 const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);

  // const events: Event[] = [
  //   {
  //     id: 1,
  //     title: 'Winter Blanket Drive',
  //     startDate: '2021-12-10',
  //     endDate: '2021-12-15',
  //     location: 'Event Location',
  //     description: 'This is the first event description.',
  //     image: 'https://res.cloudinary.com/doagrwjza/image/upload/v1734288164/money-hands-message-quote_xa5vmx.jpg',
  //     targetAmount: 18000,
  //     collectedAmount: 12000,
  //     status:"Active",
  //     createdBy: "Chandresh",
  //     likes:300

  //   }, {
  //     id: 2,
  //     title: 'Cloth Donation Drive',
  //     startDate: '2021-12-15',
  //     endDate: '2021-12-20',
  //     location: 'Event Location 2',
  //     description: 'This is the second event description.',
  //     image: 'https://res.cloudinary.com/doagrwjza/image/upload/v1709576294/samples/balloons.jpg',
  //     targetAmount: 20000,
  //     collectedAmount: 13000,
  //     status: "Upcoming",
  //     createdBy: "Ramesh",
  //     likes:600
  //   },
  //   {
  //     id: 3,
  //     title: 'Book Donation Drive',
  //     startDate: '2021-12-20',
  //     endDate: '2021-12-25',
  //     location: 'Event Location 3',
  //     description: 'This is the third event description.',
  //     image: 'https://res.cloudinary.com/doagrwjza/image/upload/v1709576294/samples/balloons.jpg',
  //     targetAmount: 70000,
  //     collectedAmount: 44780,
  //     status:"Inactive",
  //     createdBy: "Suresh",
  //     likes:400

  //   },
  //   {
  //     id: 4,
  //     title: 'Summer Drive',
  //     startDate: '2021-12-25',
  //     endDate: '2021-12-30',
  //     location: 'Event Location 4',
  //     description: 'This is the fourth event description.',
  //     image: 'https://res.cloudinary.com/doagrwjza/image/upload/v1709576279/samples/landscapes/nature-mountains.jpg',
  //     targetAmount: 27000,
  //     collectedAmount: 25870,
  //     status:"Active",
  //     createdBy: "Mahesh",
  //     likes:800
  //   }
  // ]





  // const handleEventPress = (event: Event) => {
  //   router.push(`/(tabs)/explore/(campaign)?eventData=${JSON.stringify(event)}`);

  // };

  

  const handleEventPress = (event: Event) => {
    dispatch(setSelectedCampaign(event));
    router.push("/(tabs)/explore/(campaign)")
  };

  const handleFilterEvent = (title: string) => {

    console.log(title);
  }

  useEffect(()=>{
    fetchCampaigns(activeTab);
  
  },[activeTab])
  useEffect(()=>{
 
    fetchCampaignImages()
    fetchCampaignVideos()
  },[])

  const fetchCampaigns = async (status:string) => {
    try {
      await axios.get('http://192.168.43.243:5000/campaign/get-all-campaigns',{
        params:{
          status:status
        }
      }).then(
        (response)=>{

          dispatch(setCampaigns(response.data));
        }
      )
      
    } catch (error) {
      console.error('Error:', error);
    }

  }

  const fetchCampaignImages = async () => {
  
    try {

      setImageLoading(true);
      await axios.get('http://192.168.43.243:5000/campaign/get-all-images', {
        params: {
          page: 1,
          limit: 10,
        }
      }).then(
        (response) => {
         
         
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
    
    try {

      setVideoLoading(true);
      await axios.get('http://192.168.43.243:5000/campaign/get-all-videos', {
        params: {
        
          page:1,
          limit: 10,
        }
      }).then(
        (response) => {
       
          setVideos([...videos, ...response.data]);
          setVideoLoading(false);
        }
      )

    } catch (error) {
      console.error(error);
      setVideoLoading(false);

    }

  }



 



  return (
    <SafeAreaView style={{ position: "relative", }}>
      <ScrollView >
        <ThemedView style={{ paddingVertical: 20 }}>
          <ThemedText type="subtitle" style={{ paddingHorizontal: 20 }}>Events</ThemedText>
          <ThemedView style={{flexDirection:"row",gap:10,paddingHorizontal:20,marginTop:20,paddingBottom:10}}>

            {
              options && options.map((item) => (

                <TouchableOpacity key={item.id}
                  onPress={() => { setActiveTab(item?.title); fetchCampaigns(item?.title); }}
                  style={{
                    padding: 3,
                    paddingHorizontal:8,
                  
                    borderRadius: 10,
                    borderColor:"#31d1c9",
                    backgroundColor: activeTab === item.title? "#fff" : "white",
                    borderWidth: activeTab === item.title? 2 : 1,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#bdbdbd",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 8,
                  

                  }}
                >
                  <ThemedText  style={{ color: activeTab === item.title? "#31d1c9" : "gray" ,fontSize:12,fontWeight:600}}>
                    {item.title}
                  </ThemedText>

                </TouchableOpacity>

              ))
            }



          </ThemedView>
          <ThemedView style={{ paddingHorizontal: 10 }}>

            {/* tabs */}


            <ThemedView style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
              {campaigns.map((event:any) => (
                <TouchableOpacity key={event._id} onPress={() => handleEventPress(event)}
                  style={{
                    backgroundColor: "white", borderRadius: 16,
                    width: .45 * width,
                    height: 210,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#bdbdbd",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 8,
                    marginVertical: 10
                  }}>
                  <View style={{
                    flexDirection: 'column',
                    borderRadius: 16,
                  }}>
                    <ThemedView style={{ position: "relative" }}>
                      <Image source={{ uri: event.image }} style={{ width: .45 * width, height: 110, borderTopLeftRadius: 16, borderTopRightRadius: 16 }} />
                      
                     {
                       event?.status=="Active" &&
                       <Text
                        style={
                          {
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            backgroundColor: 'white',
                            borderTopLeftRadius: 10,
                            paddingHorizontal: 5,
                            fontWeight: 'bold',
                            shadowColor: "#000000",
                            shadowOffset: {
                              width: 2,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5,
                            color:"#4CAF50"
                          }}
                      >
                        {event.status}
                      </Text>
                     } 
                     {
                       event?.status=="Inactive" &&
                       <Text
                        style={
                          {
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            backgroundColor: 'white',
                            borderTopLeftRadius: 10,
                            paddingHorizontal: 5,
                            fontWeight: 'bold',
                            shadowColor: "#000000",
                            shadowOffset: {
                              width: 2,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5,
                            color:"#FF5252"
                          }}
                      >
                        {event.status}
                      </Text>
                     } 
                     {
                       event?.status=="Upcoming" &&
                       <Text
                        style={
                          {
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            backgroundColor: 'white',
                            borderTopLeftRadius: 10,
                            paddingHorizontal: 5,
                            fontWeight: 'bold',
                            shadowColor: "#000000",
                            shadowOffset: {
                              width: 2,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5,
                            color:"#31d1c9"
                          }}
                      >
                        {event.status}
                      </Text>
                     } 
                    </ThemedView>
                    <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 6 }}>
                      <ThemedText style={{ fontSize: 16, fontWeight: 700 }}>{event.title}</ThemedText>
                      <Text style={{ fontSize: 12, marginBottom: 8 }}>{event.location}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        {/* <View style={{
                          flex: 1,
                          height: 10,
                          backgroundColor: '#e0e0e0',
                          borderRadius: 5,
                          marginRight: 10,
                        }}>
                          <View
                            style={{
                              width: `${(event.collectedAmount / event.targetAmount) * 100
                                }%`,
                              backgroundColor: '#31d1c9',
                              height: '100%',
                              borderRadius: 5,
                            }}
                          />
                        </View> */}
                        <AnimatedProgressBar
                          collectedAmount={event?.collectedAmount}
                          targetAmount={event?.targetAmount}
                        />


                        <Text style={{ fontSize: 12, fontWeight: 600 }}>
                          {event.collectedAmount}/{event.targetAmount}
                        </Text>
                      </View>
                      {
                        <View style={{ borderRadius: 10, paddingVertical: 4, shadowColor: "#fff", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
                            {
                              
                              <View style={{flexDirection:"row",gap:4,alignItems:"center"}}>
                                <RedLike width={16} height={16}/> 
                                <Text style={{ marginLeft: 5, fontWeight: 600, color: "#bdbdbd",fontSize:12 }}>{event.likes} Likes</Text>

                              </View>
                              
                            }
                             
                        </View>
                      }

                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              {
                campaigns.length === 0 && (
                  <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <ThemedText style={{ fontSize: 14, fontWeight: 400 }}>No campaigns available.</ThemedText>
                  </View>
                )
              }

            </ThemedView>

          </ThemedView>
        </ThemedView>
        <ThemedView style={{ paddingBottom: 20 }}>

          <EventPhotos images={images}/>
          <EventVideos videos={videos} />
        </ThemedView>
      </ScrollView>

      {/* Bottom Drawer Modal */}


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({



  modal: {},
  modalContent: {

  },

  modalImage: {},
  modalText: { fontSize: 16, marginBottom: 5 },
  modalDescription: { fontSize: 14, color: '#555', marginTop: 10 },
  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  detailsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});