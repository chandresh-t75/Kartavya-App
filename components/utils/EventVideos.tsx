import React, { useState, useRef } from 'react';
import { View, FlatList, TouchableOpacity, Modal, Dimensions, Animated } from 'react-native';
// import Video from 'react-native-video'; // For video playback
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useRouter } from 'expo-router';
import { ResizeMode, Video } from 'expo-av';
import { maroonColorLight } from '@/constants/Colors';


const { width } = Dimensions.get('window');

const EventVideos = ({ videos }: any) => {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const scaleValue = useRef(new Animated.Value(0)).current; // Initial scale value for the zoom effect

    // const videos = [
    //     'https://www.w3schools.com/html/mov_bbb.mp4',
    //     'https://www.w3schools.com/html/movie.mp4',

    // ];

    const handleVideoLoad = () => {
        setLoading(false);
    };

    const openVideoModal = (videoUrl: string) => {
        setSelectedVideo(videoUrl);
        setModalVisible(true);

        // Trigger the zoom-in animation
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

    const renderSkeleton = () => (
        <View style={{ width: width / 2 - 20, height: 120, borderRadius: 10, backgroundColor: '#e0e0e0' }} />
    );

    const renderVideo = (uri: string) => (
        <TouchableOpacity key={uri} style={{ borderRadius: 10, overflow: 'hidden' }} onPress={() => openVideoModal(uri)}>
            <View style={{ width: width / 2 - 20, height: 120, justifyContent: 'center', backgroundColor: "#000", alignItems: 'center' }}>
                <Video
                    source={{ uri: uri }}
                    style={{ width: '100%', height: '100%' }}
                    useNativeControls
                    onLoad={handleVideoLoad}
                    // resizeMode="contain"
                    resizeMode={ResizeMode.CONTAIN}


                />
            </View>
        </TouchableOpacity>
    );

    return (
        <ThemedView style={{ width, padding: 10, backgroundColor: '#fff', justifyContent: 'center' }}>
            <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Videos</ThemedText>
                <TouchableOpacity onPress={() => { router.push("/(tabs)/explore/campaignMedia") }}>

                    <ThemedText style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 15, color: maroonColorLight }}>See More</ThemedText>
                </TouchableOpacity>
            </ThemedView>
            <FlatList
                data={videos}
                keyExtractor={(item) => item?._id}
                numColumns={2}
                renderItem={({ item }) => (
                    <View style={{ flex: 1, margin: 5 }}>
                        {loading ? renderSkeleton() : renderVideo(item?.url)}
                    </View>
                )}
                ListEmptyComponent={
                    <ThemedText style={{ textAlign: 'center', fontSize: 14, marginBottom: 20 }}>
                        No videos available
                    </ThemedText>
                }
            />

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
                                    onLoad={handleVideoLoad}
                                    resizeMode={ResizeMode.CONTAIN}

                                />
                            </Animated.View>
                        )}
                        <TouchableOpacity onPress={closeVideoModal} style={{ backgroundColor: '#31d1c9', padding: 10, borderRadius: 20 }}>
                            <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Close</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ThemedView>
    );
};

export default EventVideos;
