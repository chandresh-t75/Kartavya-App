import { Text, View, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as MediaLibrary from 'expo-media-library';

const UploadMedia = () => {
  const [media, setMedia] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [uploadComplete, setUploadComplete] = useState(false);
  const campaign = useSelector((state: any) => state.campaign.selectedCampaign);

  const handleMediaPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      aspect: [4, 3],
      allowsMultipleSelection: true,

      selectionLimit: 10,
    });

    if (!result.canceled) {
      try {
        const updatedMedia = await Promise.all(
          result.assets.map(async (file) => {
            if (file.type === 'video') {
              try {
                const thumbnail = await getVideoThumbnail(file.uri);
                return {
                  ...file,
                  thumbnail,
                };
              } catch (error) {
                console.error('Error generating thumbnail for video:', error);
                return null;
              }
            }
            return file;
          })
        );

        const validMedia = updatedMedia.filter((media) => media !== null);
        setMedia((prevMedia) => [...prevMedia, ...validMedia]);
      } catch (error) {
        console.error('Error processing media:', error);
      }
    }
  };

  const getVideoThumbnail = async (uri: string) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      const { uri: thumbnailUri } = await MediaLibrary.getAssetInfoAsync(asset);
      return thumbnailUri;
    } catch (error) {
      console.error('Error getting video thumbnail:', error);
      return '';
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setUploadProgress(new Array(media.length).fill(0));

      const formData = new FormData();
      formData.append('caption', campaign.title);
      formData.append('campaignId', campaign._id);

      media.forEach((file, index) => {
        const fileType = file?.type?.startsWith('image') ? 'image/jpeg' : 'video/mp4';
        const fieldName = fileType === 'image/jpeg' ? 'imageFile' : 'donationVideos';

        formData.append(fieldName, {
          uri: file.uri,
          name: `campaign_media_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
          type: fileType,
        } as any);
      });

      await axios.post('http://192.168.43.243:5000/upload/upload-media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: any) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress((prev) => {
            const newProgress = [...prev];
            for (let i = 0; i < media.length; i++) {
              newProgress[i] = percent;
            }
            return newProgress;
          });
        },
      });

      setLoading(false);
      setUploadComplete(true);
      console.log('Upload Successful!');
    } catch (error) {
      setLoading(false);
      console.error('Error in uploading:', error);
      alert('Upload Failed. Please try again.');
    }
  };

  const handleRemoveMedia = (index: number) => {
    const newMedia = [...media];
    newMedia.splice(index, 1);
    setMedia(newMedia);
  };

  const renderItem = ({ item, index }: any) => {
    return (
      <View
        style={{
          marginBottom: 16,
          backgroundColor: '#f8f8f8',
          padding: 16,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          elevation: 6,
          alignItems: 'center',
          flexDirection: 'row',
          gap: 20

        }}
      >
        {item.type.startsWith('image') ? (
          <Image
            source={{ uri: item.uri }}
            style={{
              width: 120,
              height: 120,
              marginRight: 16,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: '#ddd',
              resizeMode: 'cover',
            }}
          />
        ) : (
          item.thumbnail ? (
            <Image
              source={{ uri: item.thumbnail }}
              style={{
                width: 120,
                height: 120,
                marginRight: 16,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: '#ddd',
                resizeMode: 'cover',
              }}
            />
          ) : (
            <Text
              style={{
                width: 120,
                height: 120,
                marginRight: 16,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: '#ddd',
                textAlign: 'center',
                lineHeight: 120,
                color: '#888',
              }}
            >
              Video (No Thumbnail)
            </Text>
          )
        )}
        <View>
          <View style={{ gap: 10 }}>

            <TouchableOpacity
              onPress={() => handleRemoveMedia(index)}
              style={{
                backgroundColor: '#ff4d4d',
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Remove</Text>
            </TouchableOpacity>
            {uploadProgress[index] !== undefined && (
              <View style={{ marginTop: 8, width: 120 }}>
                <Text style={{ fontSize: 14, color: '#31d1c9', marginBottom: 4 }}>
                  {`Uploading ${uploadProgress[index]}%`}
                </Text>
                <View style={{ width: 120, height: 8, backgroundColor: '#ddd', borderRadius: 4 }}>
                  <View
                    style={{
                      height: '100%',
                      backgroundColor: '#31d1c9',
                      borderRadius: 4,
                      width: `${uploadProgress[index]}%`,
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>


      </View>
    );
  };

  return (
    <View style={{ padding: 16, backgroundColor: '#f9f9f9', flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333', marginVertical: 20, textAlign: 'center' }}>
        Upload Media
      </Text>

      <View style={{ paddingBottom: 200 }}>
        {media.length > 0 && (
          <FlatList
            data={media}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>

      <View
        style={{
          backgroundColor: '#ffffff',
          padding: 15,
          margin: 10,
          borderRadius: 15,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
          gap: 10,
          marginTop: 50,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: '#31d1c9',
            padding: 15,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handleMediaPick}
        >
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Pick Media</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: loading ? '#ccc' : uploadComplete ? 'green' : '#31d1c9',
            padding: 15,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handleSubmit}
          disabled={loading || media.length === 0 || uploadComplete}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : uploadComplete ? (
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Uploaded</Text>
          ) : (
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UploadMedia;
