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
import { maroonColorLight } from "@/constants/Colors";

const Logo="https://res.cloudinary.com/doagrwjza/image/upload/v1733722707/kartavya_lpt1hh.png"
export default function HomeScreen() {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", width: width }}>
      <ScrollView>
        <ThemedView style={{ marginBottom: 60, gap: 10 }}>
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
              backgroundColor: "#F6F5F5"

            }}
          >
            <ThemedView
              style={{ flexDirection: "row", justifyContent: "center", gap: 14, backgroundColor: "#F6F5F5" }}
              className=" flex flex-row justify-center items-center"
            >
              <Image
                source={{uri:Logo}}
                style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: "#F6F5F5" }}
              />
              <ThemedView style={{ gap: 0, backgroundColor: "#F6F5F5" }}>
                <ThemedText type="title" className="text-[#31d1c9]">
                  KARTAVYA
                </ThemedText>
                <ThemedText style={{ marginTop: -10, fontSize: 12, color: "#777474" }}>
                  For the society
                </ThemedText>

              </ThemedView>

            </ThemedView>
          </ThemedView>
          <ThemedView style={{ marginVertical: 10, }}>
            <HomeSlider />
          </ThemedView>
          <ThemedView style={{ paddingHorizontal: 20, }}>
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

          <ThemedView>
            <OurDrives />
          </ThemedView>
          <ThemedView>
            {/* <OurDrives /> */}
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
