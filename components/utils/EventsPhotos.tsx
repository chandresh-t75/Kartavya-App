import React, { useState, useRef } from 'react';
import { View, FlatList, Image, TouchableOpacity, Modal, Dimensions, Animated } from 'react-native';  // Assuming you have Themed components
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useRouter } from 'expo-router';
import { maroonColorLight } from '@/constants/Colors';


const { width } = Dimensions.get('window');


const EventPhotos = ({images}:any) => {
    const router=useRouter()
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const scaleValue = useRef(new Animated.Value(0)).current; // Initial scale value for the zoom effect


    // const images = [
    //     'https://picsum.photos/id/1067/1000/600',
    //     'https://picsum.photos/id/1068/1000/600',
    //     'https://picsum.photos/id/1069/1000/600',
    //     'https://picsum.photos/id/1070/1000/600',
    //     'https://picsum.photos/id/1071/1000/600',
    //     'https://picsum.photos/id/1072/1000/600',
    //     'https://picsum.photos/id/1073/1000/600',
    //     'https://picsum.photos/id/1074/1000/600',
    //     'https://picsum.photos/id/1075/1000/600',
    // ];
    const [loading, setLoading] = useState(false);

    const handleImageLoad = () => {
        setLoading(false);
    };

    const openImageModal = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);

        // Trigger the zoom-in animation
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 3,
            tension: 50,
            useNativeDriver: true,
        }).start();
    };

    const closeImageModal = () => {
        // Trigger the zoom-out animation before closing the modal
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


    const renderSkeleton = () => {
        return (
            <View style={{ width: width / 3 - 20, height: 120, borderRadius: 10, backgroundColor: '#e0e0e0' }} />
        );
    };

    const renderImage = (uri: string) => {
        return (
            <TouchableOpacity style={{ borderRadius: 10, overflow: 'hidden' }}
                onPress={() => openImageModal(uri)}>
                <Image
                    source={{ uri }}
                    style={{ width: width / 3 - 20, height: 120, borderRadius: 10, resizeMode: 'cover' }}

                    onLoad={handleImageLoad}
                />
            </TouchableOpacity>
        );
    };

    return (
        <ThemedView style={{width:width,  padding: 10, backgroundColor: '#fff',justifyContent:"center" }}>
            <ThemedView style={{flexDirection: "row", justifyContent: "space-between",paddingHorizontal:20 }}>
                <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Photos</ThemedText>
                <TouchableOpacity onPress={()=>{router.push("/(tabs)/explore/campaignMedia")}}>
                <ThemedText style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 15,color:maroonColorLight }}>See More</ThemedText>
                     
                </TouchableOpacity>
            </ThemedView>
            <FlatList
                data={images}
                keyExtractor={(item) => item._id}
                numColumns={3}
                renderItem={({ item }) => (
                    <View style={{ flex: 1, margin: 5 }}>
                        {loading ? renderSkeleton() : renderImage(item?.url)}
                    </View>
                )}
                ListEmptyComponent={
                    <ThemedText style={{ textAlign: 'center', fontSize: 14, marginBottom: 20 }}>
                        No images available
                    </ThemedText>
                }
            />

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
        </ThemedView>
    );
};

export default EventPhotos;
