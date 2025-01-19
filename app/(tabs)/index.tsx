import {
  Image,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  View,
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
import Ionicons from '@expo/vector-icons/Ionicons';
const Logo = "https://res.cloudinary.com/doagrwjza/image/upload/v1733722707/kartavya_lpt1hh.png"


export default function HomeScreen() {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");
  const dispatch = useDispatch();
  const campaigns = useSelector((state: any) => state.campaign.campaigns);
  const user = useSelector((state: any) => state.userData.userDetails)



  useEffect(() => {
    const checkUserData = async () => {
      try {
        // Get user data from AsyncStorage
        const storedUserData = await AsyncStorage?.getItem('userDetails');

        // If user data exists, parse it and log to console
        if (storedUserData !== null) {
          const userData = JSON.parse(storedUserData);
          await axios.get("http://192.168.43.243:5000/user/get-user", {
            params: {
              userId: userData?._id
            }
          }).then(async (response) => {

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


  useEffect(() => {
    fetchCampaigns("All");

  }, [])

  const fetchCampaigns = async (status: string) => {
    try {
      await axios.get('http://192.168.43.243:5000/campaign/get-all-campaigns', {
        params: {
          status: status
        }
      }).then(
        (response) => {

          dispatch(setCampaigns(response.data));
        }
      )

    } catch (error) {
      console.error('Error:', error);
    }

  }


  return (
    <SafeAreaView style={{ flex: 1, width: width, backgroundColor: "#fff" }}>
      <ScrollView>
        <ThemedView style={{}}>

          <ThemedView
            style={{
              width: width,
              flexDirection: "row",
              padding: 20,
              backgroundColor: "#fff",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 14,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#f0f0f0",
              borderBottomEndRadius: 20,
              borderBottomStartRadius: 20,
              marginBottom: 4


            }}

          >
            <View style={{
              backgroundColor: "#fff",

              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              padding: 1,
              elevation: 5,
              borderRadius: 50,

            }}>
              <Image
                source={{ uri: Logo }}
                style={{
                  width: 40, height: 40,
                  borderRadius: 50,

                }}
              />

            </View>

            <ThemedView
              style={{ flexDirection: "row", gap: 4 }}>
              <ThemedText style={{ fontSize: 16, fontWeight: 600 }}>
                Hii!
              </ThemedText>
              <ThemedText style={{ color: "", fontSize: 18, fontWeight: 800 }}>
                {user?._id ? `${user?.name.substring(0, 30)}` : "User"}
              </ThemedText>

            </ThemedView>
            <TouchableOpacity style={{
              padding: 10,
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 50,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,


            }}>
              <Ionicons name="notifications-circle-sharp" size={24} color="#31d1c9" />

            </TouchableOpacity>

          </ThemedView>




          <ThemedView style={{
            paddingVertical: 10,
            borderRadius: 20,
            borderTopStartRadius: 20,
            // borderBottomEndRadius: 20,
            // borderBottomStartRadius: 20,
            // marginBottom:4,
            shadowColor: "#bdbdbd",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 8,
            backgroundColor: "#fff",
            marginBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#f0f0f0",
          }}>
            <HomeSlider />
          </ThemedView>
          <ThemedView style={{ padding: 20,justifyContent:"center" ,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}>
           
              <ThemedText type="defaultSemiBold" style={{ color: maroonColorLight,textAlign:"center" }}>
                Give, Change Lives, Make Impact
              </ThemedText>
          </ThemedView>

          <ThemedView style={{
            marginVertical: 10,
          }}>
            <OurDrives />
          </ThemedView>
          <ThemedView style={{
             
            shadowColor: "#000",
            shadowOffset: {
              width: 2,
              height: 4,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation:4,
            marginBottom: 10,
           }}>
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
