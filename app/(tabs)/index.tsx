import {
  Image,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import Logo from "../../assets/images/kartavya.png"
import HomeSlider from "@/components/utils/HomeSlider";
import OurDrives from "@/components/utils/OurDrives";
import MissionVision from "@/components/utils/MissionVision";
import { lightBlue, lightPurple, maroonColorLight } from "@/constants/Colors";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setUserDetails } from "@/redux/reducers/userDataSlice";
import axios from "axios";
import { setCampaigns } from "@/redux/reducers/campaignSlice";
import { useSelector } from "react-redux";

const Logo="https://res.cloudinary.com/doagrwjza/image/upload/v1733722707/kartavya_lpt1hh.png"


export default function HomeScreen() {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");
  const dispatch=useDispatch();
  const campaigns = useSelector((state: any) => state.campaign.campaigns);



  useEffect(() => {
    const checkUserData = async () => {
      try {
        // Get user data from AsyncStorage
        const storedUserData = await AsyncStorage?.getItem('userDetails');
        
        // If user data exists, parse it and log to console
        if (storedUserData !== null) {
          const userData = JSON.parse(storedUserData);
          await axios.get("http://192.168.43.243:5000/user/get-user",{
            params:{
              userId:userData._id
            }
          }).then(async(response) => {
           
            dispatch(setUserDetails(response.data));
            await AsyncStorage.setItem("userDetails", JSON.stringify(response.data));
           


          })
          
        } else {
          console.log('No user data found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error checking user data in AsyncStorage:', error);
      }
    };
  
    checkUserData();
  }, []);


  useEffect(()=>{
    fetchCampaigns("All");
    
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


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", width: width }}>
      <ScrollView>
        <ThemedView style={{}}>
          <ThemedView
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 10,
              paddingBottom: 10,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: "#e7e7e7",
              backgroundColor:lightBlue

            }}
          >
            <ThemedView
              style={{ flexDirection: "row", justifyContent: "center", gap: 14, backgroundColor:lightBlue }}
              className=" flex flex-row justify-center items-center"
            >
              <Image
                source={{uri:Logo}}
                style={{ width: 50, height: 50, borderRadius: 50,  }}
              />
              <ThemedView style={{ gap: 0,backgroundColor:lightBlue }}>
                <ThemedText type="title" className="text-[#31d1c9]">
                  KARTAVYA
                </ThemedText>
                <ThemedText style={{ marginTop: -10, fontSize: 12, color: "#777474" }}>
                  For the society
                </ThemedText>

              </ThemedView>

            </ThemedView>
          </ThemedView>
          <ThemedView style={{ paddingVertical: 10}}>
            <HomeSlider />
          </ThemedView>
          <ThemedView style={{ padding: 20, }}>
            <ThemedView style={{ flexDirection: "row", gap: 2 }}>
              <ThemedText type="defaultSemiBold" style={{color:maroonColorLight}}>
                Give,
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={{color:maroonColorLight}}>
                Change Lives,
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={{color:maroonColorLight}}>
                Make Impact
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={{}}>
            <OurDrives />
          </ThemedView>
          <ThemedView style={{paddingBottom:20}}>
            <MissionVision />
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
