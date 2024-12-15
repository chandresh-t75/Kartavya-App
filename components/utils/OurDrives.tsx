import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'
import Drive1 from '../../assets/images/slider3.svg'
import Drive2 from '../../assets/images/slider2.svg'
import Drive3 from '../../assets/images/slider1.svg'
import { lightPurple } from '@/constants/Colors'



const Drives = [
    {
        id: 1,
        image: "https://res.cloudinary.com/doagrwjza/image/upload/v1709576279/samples/landscapes/nature-mountains.jpg",
        title: 'Drive 1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac consectetur neque.'
    },
    {
        id: 2,
        image: "https://res.cloudinary.com/doagrwjza/image/upload/v1709576264/sample.jpg",
        title: 'Drive 2',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac consectetur neque.'
    },
    {
        id: 3,
        image: "https://res.cloudinary.com/doagrwjza/image/upload/v1709576271/samples/landscapes/girl-urban-view.jpg",
        title: 'Drive 3',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac consectetur neque.'
    }
    , {
        id: 4,
        image: "https://res.cloudinary.com/doagrwjza/image/upload/v1709576294/samples/balloons.jpg",
        title: 'Drive 4',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac consectetur neque.'
    }
]

type Props = {}

const OurDrives = (props: Props) => {
    return (
        <ThemedView style={{paddingVertical:10,backgroundColor:lightPurple}}>
            <ThemedText type="subtitle" style={{ marginBottom: 10 ,paddingLeft: 20,color:"#201658" }}>Our Drives</ThemedText>
            <ThemedView  style={{backgroundColor:lightPurple}}>
                <ScrollView horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{paddingLeft:20,paddingRight:20}}>
                    {Drives.map(drive => (
                        <View key={drive.id} style={{ marginRight:20,flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <ThemedView style={{
                                width: 200, height: 150, borderRadius: 16, overflow: 'hidden', justifyContent: "center", alignItems: "center",  // Required for shadows to render correctly
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 6,
                                elevation: 6,
                            }}>
                                <Image
                                    source={{ uri: drive.image }}
                                    width={200}
                                    height={200}
                                    resizeMode="cover"
                                    style={{borderRadius:16}}
                                />
                            </ThemedView>
                            <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
                                {drive.title}
                            </ThemedText>
                        </View>
                    ))}

                </ScrollView>
            </ThemedView>
        </ThemedView>
    )
}

export default OurDrives

const styles = StyleSheet.create({})
