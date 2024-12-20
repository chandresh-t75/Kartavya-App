import React, { useState } from 'react';
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
import Like from "../../../assets/images/like.svg"
import ProgressBar from '@/components/utils/ProgressBar';
import AnimatedProgressBar from '@/components/utils/AnimatedProgressBar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import EventPhotos from '@/components/utils/EventsPhotos';
import EventVideos from '@/components/utils/EventVideos';



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
}


export default function Donate() {
  const router = useRouter();

  const { width, height } = Dimensions.get("window")
  const [activeTab, setActiveTab] = useState("All")

  const events: Event[] = [
    {
      id: 1,
      title: 'Winter Blanket Drive',
      startDate: '2021-12-10',
      endDate: '2021-12-15',
      location: 'Event Location',
      description: 'This is the first event description.',
      image: 'https://res.cloudinary.com/doagrwjza/image/upload/v1734288164/money-hands-message-quote_xa5vmx.jpg',
      targetAmount: 18000,
      collectedAmount: 12000,
      status:"Active",
      createdBy: "Chandresh"

    }, {
      id: 2,
      title: 'Cloth Donation Drive',
      startDate: '2021-12-15',
      endDate: '2021-12-20',
      location: 'Event Location 2',
      description: 'This is the second event description.',
      image: 'https://res.cloudinary.com/doagrwjza/image/upload/v1709576294/samples/balloons.jpg',
      targetAmount: 20000,
      collectedAmount: 13000,
      status: "Active",
      createdBy: "Ramesh"
    },
   
  ]





  // const handleEventPress = (event: Event) => {
  //   router.push(`/(tabs)/explore/(campaign)?eventData=${JSON.stringify(event)}`);

  // };

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

  const handleEventPress = (event: Event) => {
    const eventData = JSON.stringify(event); 
    router.push(`/(tabs)/donate/(camapigndonation)`); 
  };

  const handleFilterEvent = (title: string) => {
    console.log(title);
  }




  return (
    <SafeAreaView style={{ position: "relative",backgroundColor:"#fff",}}>
      <ScrollView >
        <ThemedView style={{ paddingVertical: 20 }}>
          <ThemedText type="subtitle" style={{ paddingHorizontal: 20 }}>Active Events</ThemedText>
          <ThemedText  style={{ paddingHorizontal: 20,fontSize:12,fontWeight:400 }}>Click on events to make donation</ThemedText>


          
          <ThemedView style={{ paddingHorizontal: 10 }}>

            {/* tabs */}


            <ThemedView style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10,justifyContent:"center" }}>
              {events.map((event: Event) => (
                <TouchableOpacity key={event.id} onPress={() => handleEventPress(event)}
                  style={{
                    backgroundColor: "white", borderRadius: 16,
                    width: .85 * width,
                    height: 180,
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
                      <Image source={{ uri: event.image }} style={{ width: .85 * width, height: 110, borderTopLeftRadius: 16, borderTopRightRadius: 16 }} />
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
                    <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 6,gap:4 }}>
                      <ThemedText style={{ fontSize: 16, fontWeight: 700 }}>{event.title}</ThemedText>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      
                        <AnimatedProgressBar
                          collectedAmount={event?.collectedAmount}
                          targetAmount={event?.targetAmount}
                        />


                        <Text style={{ fontSize: 12, fontWeight: 600 }}>
                          {event.collectedAmount}/{event.targetAmount}
                        </Text>
                      </View>

                    </View>
                  </View>
                </TouchableOpacity>
              ))}

            </ThemedView>
            <ThemedView style={{marginVertical:10}}>
              <ThemedText style={{textAlign:"center",fontSize:12}}>Or</ThemedText>
              <ThemedText style={{textAlign:"center",fontWeight:700}}>Scan To Donate Directly</ThemedText>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                <Image 
                source={require('../../../assets/images/qr-img.jpg')}
                style={{ width: 100, height: 100 }} />
              </View>

            </ThemedView>
           

          </ThemedView>
        </ThemedView>
        
      </ScrollView>

      {/* Bottom Drawer Modal */}


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({


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