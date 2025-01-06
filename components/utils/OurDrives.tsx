import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'
import Drive1 from '../../assets/images/slider3.svg'
import Drive2 from '../../assets/images/slider2.svg'
import Drive3 from '../../assets/images/slider1.svg'
import { lightPurple } from '@/constants/Colors'
import { useSelector } from 'react-redux'
import { setSelectedCampaign } from '@/redux/reducers/campaignSlice'
import { useDispatch } from 'react-redux'
import { useRouter } from 'expo-router'





const OurDrives = () => {
    const dispatch = useDispatch();
    const router=useRouter();
  const campaigns = useSelector((state: any) => state.campaign.campaigns);

    return (
        <ThemedView style={{paddingVertical:10,borderRadius:20}}>
            <ThemedText type="subtitle" style={{ marginBottom: 10 ,paddingLeft:20,color:"#31d1c9" ,}}>Our Drives</ThemedText>
            <ThemedView  style={{}}>
                <ScrollView horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    >
                    {campaigns.map((campaign:any) => (
                        <TouchableOpacity 
                        onPress={()=>{
                             dispatch(setSelectedCampaign(campaign));
                                router.push("/(tabs)/explore/(campaign)")
                        }}
                        key={campaign._id} style={{ marginRight:20,flexDirection: "column", justifyContent: "center", alignItems: "center",gap:10 }}>
                            <ThemedView style={{
                                width: 200, height: 150, borderRadius: 16, overflow: 'hidden', justifyContent: "center", alignItems: "center",  // Required for shadows to render correctly
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 6,
                                elevation: 6,
                            
                            }}>
                                <Image
                                    source={{ uri: campaign.image }}
                                    width={200}
                                    height={200}
                                    resizeMode="cover"
                                    style={{borderRadius:16}}
                                />
                            </ThemedView>
                            <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
                                {campaign.title}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}

                </ScrollView>
            </ThemedView>
        </ThemedView>
    )
}

export default OurDrives

const styles = StyleSheet.create({})
