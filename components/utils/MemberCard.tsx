import React, { useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Share, ActivityIndicator } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { setMember } from '@/redux/reducers/userDataSlice';
import { useDispatch } from 'react-redux';


interface Member {
    profileImage?: string;
    name?: string;
    role?: string;
    email?: string;
    phone?: string;
    city?: string;
    state?: string;
    country?: string;
}

interface MemberCardProps {
    member: Member;
}



const MemberCard = ({ member }: any) => {
    const viewShotRef = useRef<ViewShot>(null);
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imgLoading, setImgLoading] = useState(false)

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            console.log(result.assets[0].uri)
            await updateProfilePic(result.assets[0].uri);

        }
    };

    const updateProfilePic = async (img: string) => {
        try {
            setImgLoading(true)

            const formData = new FormData();
            formData.append('memberId', member?._id)
            if(img){
            formData.append('profilePic', {
                uri: img,
                name: 'profilePic.jpg',
                type: 'image/jpg',
            }as any);
            }

            await axios.put('http://192.168.43.243:5000/member/update-pic', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((response) => {
                console.log('Profile Pic updated successfully', response.data);
                dispatch(setMember(response.data))
                setImgLoading(false);
            })

        } catch (error) {
            console.error('Error updating profile pic:', error);
            setImgLoading(false);

        }
    }


    const captureAndShare = async () => {
        if (viewShotRef?.current) {
            try {
                const uri = await viewShotRef?.current?.capture();
                if (uri) {
                    if (await Sharing.isAvailableAsync()) {
                        await Sharing.shareAsync(uri);
                    } else {
                        Share.share({
                            message: 'Check out this profile!',
                            url: uri,
                        });
                    }
                }
            } catch (error) {
                console.error('Error sharing profile:', error);
            }
        } else {
            console.error('ViewShot ref is not defined');
        }
    };


    return (
        <>
            <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }} style={{ marginHorizontal: 20, }}>
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 15,
                        borderColor: "#31d1c9",
                        borderWidth: 1,
                        padding: 20,

                        alignItems: 'center',
                        elevation: 5,
                        shadowColor: '#bdbdbd',
                        shadowOpacity: 0.2,
                        shadowRadius: 10,
                        shadowOffset: { width: 0, height: 4 },
                    }}
                >
                    {/* Profile Image */}
                    {member.profileImage && (
                        <Image
                            source={{ uri: member.profileImage }}
                            style={{
                                width: 120,
                                height: 120,
                                borderRadius: 60,
                                marginBottom: 15,
                                borderWidth: 3,
                                borderColor: '#31d1c9',
                            }}
                        />
                    )}

                    {/* Member Info */}
                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 5 }}>
                        {member.name || 'N/A'}
                    </Text>
                    <Text style={{ fontSize: 16, color: '#6c757d', marginBottom: 5 }}>
                        {member.role || 'N/A'}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#007bff', marginBottom: 20 }}>
                        {member.email || 'N/A'}
                    </Text>

                    {/* Member Details */}
                    <View style={{ width: '100%' }}>
                        <DetailRow
                            icon="call"
                            label="Phone"
                            value={member.phone || 'N/A'}
                            color="#4CAF50"
                        />
                        <DetailRow
                            icon="location"
                            label="City"
                            value={member?.address?.city || 'N/A'}
                            color="#FF5722"
                        />
                        <DetailRow
                            icon="navigate"
                            label="State"
                            value={member.address?.state || 'N/A'}
                            color="#2196F3"
                        />
                        <DetailRow
                            icon="earth"
                            label="Country"
                            value={member.address?.country || 'N/A'}
                            color="#9C27B0"
                        />
                    </View>
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 5
                    }}>
                        <Image source={require("../../assets/images/kartavya.png")} style={{ width: 24, height: 24, borderRadius: 50 }} />
                        <View>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#495057',

                            }}>
                                Assigned By Kartavya
                            </Text>
                            <Text style={{
                                fontSize: 10,
                                color: '#6c757d',
                                textAlign: 'center'

                            }}>
                                {member.joinedAt &&
                                    new Intl.DateTimeFormat('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    }).format(new Date(member.joinedAt))}

                            </Text>
                        </View>

                    </View>



                </View>

                {/* Share Button */}

            </ViewShot>
            <TouchableOpacity
                style={{
                    backgroundColor: '#31d1c9',
                    borderRadius: 16,
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    margin: 20,
                    marginBottom: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                }}
                onPress={captureAndShare}
            >
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Share Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    backgroundColor: '#31d1c9',
                    borderRadius: 16,
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    marginHorizontal: 20,
                    marginBottom: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                }}
                onPress={pickImage}
            >
                {
                    imgLoading ? (
                        <ActivityIndicator color="#fff" />) :
                        (
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Update Member Pic</Text>
                        )}
            </TouchableOpacity>
        </>

    );
};

const DetailRow: React.FC<{
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    color: string;
}> = ({ icon, label, value, color }) => (
    <View
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,
            justifyContent: 'space-between',
        }}
    >
        <Ionicons name={icon} size={20} color={color} style={{ marginRight: 15 }} />
        <Text
            style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#555',
                width: 100,
            }}
        >
            {label}:
        </Text>
        <Text
            style={{
                fontSize: 16,
                color: '#333',
                flex: 1,
                fontStyle: 'italic',
                textAlign: 'right',
            }}
        >
            {value}
        </Text>
    </View>
);

export default MemberCard;
