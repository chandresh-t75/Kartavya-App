import { Alert, Dimensions, Image, Modal, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import LeftArrow from "../../../../assets/images/left-arrow.svg"
import ShareIcon from "../../../../assets/images/share.svg"
import Like from "../../../../assets/images/like.svg"
import ProgressBar from '@/components/utils/ProgressBar';
import { useRouter } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useSearchParams } from 'expo-router/build/hooks'
import RedLike from "../../../../assets/images/red-like.svg"
import { formatDateTime } from '@/components/logics/formatDateTime'
import { useDispatch } from 'react-redux'
import { setSelectedCampaign } from '@/redux/reducers/campaignSlice'
import { useSelector } from 'react-redux'
import axios from 'axios'



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
const index = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const [liked, setLiked] = useState(false)

    const eventData = searchParams.get('eventData');

    const selectedEvent = useSelector((state: any) => state.campaign.selectedCampaign)
    const campaign = useSelector((state: any) => state.campaign.selectedCampaign)
    const user = useSelector((state: any) => state.userData.userDetails);




    // console.log(selectedEvent)

    const { width, height } = Dimensions.get("window")

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


    const isLikedCampaign = async () => {
        try {
            const response = await axios.post('http://192.168.43.243:5000/campaign/is-liked', {
                userId: user?._id,
                campaignId: campaign?._id,
            });
            // console.log(response.data);
            setLiked(response.data.isLiked);
        } catch (error) {
            console.error(error);
        }
    }




    const likeCampaign = async () => {
        try {
            const response = await axios.post('http://192.168.43.243:5000/campaign/like-campaign', {
                userId: user?._id,
                campaignId: campaign?._id,
            });
            dispatch(setSelectedCampaign(response.data))
            setLiked(true);
        } catch (error) {
            console.error(error);
        }
    }

    const unlikeCampaign = async () => {
        try {
            const response = await axios.post('http://192.168.43.243:5000/campaign/unlike-campaign', {
                userId: user?._id,
                campaignId: campaign?._id,
            });
            dispatch(setSelectedCampaign(response.data))
            setLiked(false);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if(user?._id){

        isLikedCampaign();
        }

    }, []);


    return (


        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {selectedEvent ? (
                    <View style={{ backgroundColor: '#fff' }}>
                        {/* Top Section */}
                        <View style={{ position: 'relative' }}>
                            <Image
                                source={{ uri: selectedEvent.image }}
                                style={{
                                    width: '100%',
                                    height: 0.4 * height,
                                    borderTopRightRadius: 20,
                                    borderTopLeftRadius: 20,
                                }}
                            />

                            {/* Action Buttons */}
                            <TouchableOpacity

                                onPress={() => { router.back(); }}
                                style={{
                                    position: 'absolute',
                                    top: 30,
                                    left: 20,
                                    zIndex: 100,
                                    padding: 10
                                }}
                            >
                                <LeftArrow width={24} height={24} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={onShare}
                                style={{
                                    position: 'absolute',
                                    top: 40,
                                    right: 80,
                                    zIndex: 100,
                                }}
                            >
                                <ShareIcon width={24} height={24} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    top: 40,
                                    right: 30,
                                    zIndex: 100,
                                }}
                                onPress={() => {
                                    if (user?._id) {
                                        if (liked) {
                                            unlikeCampaign()
                                        } else {
                                            likeCampaign()
                                        }
                                    }
                                }}
                            >
                                {
                                    liked && <RedLike width={24} height={24} />
                                }
                                {
                                    !liked && <Like width={24} height={24} />
                                }
                            </TouchableOpacity>
                        </View>

                        {/* Main Content */}
                        <View
                            style={{
                                marginTop: -20,
                                borderRadius: 20,
                                backgroundColor: 'white',
                                paddingBottom: 20,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 24,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    marginTop: 10,
                                }}
                            >
                                {selectedEvent?.title}
                            </Text>

                            {/* Status Section */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    margin: 20,
                                    padding: 10,
                                    borderRadius: 10,
                                    backgroundColor: '#fff',
                                    shadowColor: '#bdbdbd',
                                    shadowOffset: { width: 12, height: 10 },
                                    shadowOpacity: 0.9,
                                    shadowRadius: 5,
                                    elevation: 10,
                                }}
                            >
                                {/* Status Cards */}
                                <View style={{ alignItems: 'center', flex: 1 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>
                                        Status
                                    </Text>
                                    {
                                        selectedEvent.status === "Active" &&
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                color: '#4CAF50',
                                                marginTop: 5,
                                            }}
                                        >
                                            {selectedEvent?.status}
                                        </Text>
                                    }
                                    {
                                        selectedEvent.status === "Inactive" &&
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                color: '#FF5252',
                                                marginTop: 5,
                                            }}
                                        >
                                            {selectedEvent?.status}
                                        </Text>
                                    }
                                    {
                                        selectedEvent.status === "Upcoming" &&
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                color: '#31d1c9',
                                                marginTop: 5,
                                            }}
                                        >
                                            {selectedEvent?.status}
                                        </Text>
                                    }
                                </View>

                                {/* Raised */}
                                <View style={{ alignItems: 'center', flex: 1 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>
                                        Raised
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            color: '#2196F3',
                                            marginTop: 5,
                                        }}
                                    >
                                        ₹{selectedEvent?.collectedAmount}
                                    </Text>
                                </View>

                                {/* Goals */}
                                <View style={{ alignItems: 'center', flex: 1 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>
                                        Goals
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            color: '#FF9800',
                                            marginTop: 5,
                                        }}
                                    >
                                        ₹{selectedEvent?.targetAmount}
                                    </Text>
                                </View>
                            </View>

                            <ProgressBar
                                collectedAmount={selectedEvent?.collectedAmount}
                                targetAmount={selectedEvent?.targetAmount}
                            />

                            {/* Event Description */}
                            <View
                                style={{

                                    margin: 20,
                                    backgroundColor: "#fff",
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    borderRadius: 10,
                                    shadowColor: "#bdbdbd",
                                    shadowOffset: { width: 12, height: 10 },
                                    shadowOpacity: 0.9,
                                    shadowRadius: 10,
                                    elevation: 8,
                                    marginVertical: 15,
                                }}
                            >
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                                        <MaterialIcons name="event" size={24} color="#31d1c9" />
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#666" }}>
                                                Start Date
                                            </Text>
                                            <Text
                                                style={{ fontSize: 16, fontWeight: "600", color: "#000", marginTop: 3 }}
                                            >
                                                {selectedEvent?.startDate &&
                                                    new Intl.DateTimeFormat('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    }).format(new Date(selectedEvent.startDate))}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Divider */}
                                    <View
                                        style={{
                                            width: 1,
                                            height: "100%",
                                            backgroundColor: "#e0e0e0",
                                            marginHorizontal: 10,
                                        }}
                                    />

                                    {/* End Date */}
                                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                                        <MaterialIcons name="event" size={24} color="#ff6f61" />
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#666" }}>
                                                End Date
                                            </Text>
                                            <Text
                                                style={{ fontSize: 16, fontWeight: "600", color: "#000", marginTop: 3 }}
                                            >
                                                {selectedEvent?.endDate &&
                                                    new Intl.DateTimeFormat('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    }).format(new Date(selectedEvent.endDate))}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <Text
                                    style={{
                                        fontSize: 14,
                                        lineHeight: 22,
                                        color: "#555",
                                        // textAlign: "justify",
                                        paddingVertical: 20
                                    }}
                                >
                                    {selectedEvent?.description?.substring(0, 100)}
                                </Text>

                            </View>

                            <View style={{ marginTop: 20, paddingHorizontal: 20, flexDirection: "row", gap: 20, justifyContent: "space-evenly" }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        dispatch(setSelectedCampaign(selectedEvent))
                                        router.push("/(tabs)/explore/(campaign)/campaignDetails")
                                    }}

                                    style={{
                                        backgroundColor: "#31d1c9",
                                        paddingHorizontal: 20,
                                        paddingVertical: 10,
                                        borderRadius: 20,
                                        shadowColor: "#000",
                                        shadowOpacity: 0.5,
                                        shadowOffset: {
                                            width: 0,
                                            height: 4,
                                        },
                                        shadowRadius: 10,
                                        elevation: 5,
                                    }}>
                                    <Text style={{ fontSize: 14, color: "white" }}>View Details</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {

                                         dispatch(setSelectedCampaign(selectedEvent))
                                            router.push(`/(tabs)/donate/(camapigndonation)`); 
                                    }}
                                    style={{
                                        backgroundColor: "#31d1c9",
                                        paddingHorizontal: 20,
                                        paddingVertical: 10,
                                        borderRadius: 20,
                                        shadowColor: "#000",
                                        shadowOpacity: 0.5,
                                        shadowOffset: {
                                            width: 0,
                                            height: 4,
                                        },
                                        shadowRadius: 10,
                                        elevation: 5,
                                    }}>
                                    <Text style={{ fontSize: 14, color: "white" }}>Donate Now</Text>
                                </TouchableOpacity>
                            </View>


                        </View>
                    </View>
                ) : (
                    <View /> // Fallback content
                )}
            </ScrollView>
        </View>


    )
}

export default index

const styles = StyleSheet.create({})