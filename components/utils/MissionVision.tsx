import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import { lightBlue, lightPurple } from '@/constants/Colors';


type Props = {}

const MissionVision = (props: Props) => {
    const navigation = useNavigation();
    const {width, height}=Dimensions.get("window")
    return (
        <ThemedView style={{ paddingHorizontal: 0,  }}>
            <ThemedView style={{ paddingHorizontal: 20, marginVertical: 10, paddingVertical: 20 }}>
                <ThemedText type="subtitle" style={{ color: "#31d1c9", marginBottom: 10 }}>About Us</ThemedText>
                <ThemedText type="default" style={{ color: "#EC8305" }}>To create a world where people are empowered to make a difference, by giving, change, and making impact.</ThemedText>
                <ThemedView style={{ flex: 1, flexDirection: "row", gap: 20, marginTop: 10, alignContent: "center" }}>
                    <Link
                        href="/explore"
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            backgroundColor: "#31d1c9",
                            borderRadius: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            shadowColor: "#bdbdbd",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.2,
                          shadowRadius: 4,
                          elevation: 10,
                          marginBottom:4,
                        }}
                    >
                        <ThemedText type="defaultSemiBold" style={{ color: "#fff" }}>
                            Explore Us
                        </ThemedText>
                    </Link>

                    <Link
                        href="/donate" style={{ 
                            paddingVertical: 8,
                             paddingHorizontal: 16,
                         backgroundColor: "#da7399", 
                         borderRadius: 50, 
                         justifyContent: "center",
                          alignItems: "center" ,
                          shadowColor: "#bdbdbd",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.2,
                          shadowRadius: 4,
                          elevation:10,
                          marginBottom:4,
                          }}>
                        <ThemedText type="defaultSemiBold" style={{ color: "#fff" }}>Donate Us</ThemedText>
                    </Link>

                </ThemedView>

            </ThemedView>
            <ThemedView style={{ gap: 20, paddingVertical: 20,justifyContent:"center" ,alignItems:"center"}}>
                <Animatable.View animation="pulse" iterationCount="infinite" iterationDelay={500} direction="alternate" style={{width:.90*width, backgroundColor: "#31d1c9",  paddingHorizontal: 20, paddingVertical: 4,borderRadius:10 }} >
                    <ThemedText type="subtitle" style={{ color: "#fff",textAlign:"center" }}>Our Slogan</ThemedText>
                    <ThemedText type="default" style={{ color: "#fff",textAlign:"center" }}>Give,Change Lives, Makes Impact</ThemedText>
                </Animatable.View>
                <Animatable.View animation="pulse" iterationCount="infinite" iterationDelay={500} direction="alternate" style={{width:.90*width, backgroundColor: "#f9e2af",   paddingHorizontal: 20, paddingVertical: 4, borderRadius:10 }} >
                    <ThemedText type="subtitle" style={{ color: "#201658",textAlign:"center"  }}>Our Vision</ThemedText>
                    <ThemedText type="default" style={{ color: "#201658",  textAlign:"center"}}>Give, Change Lives, Makes Impact</ThemedText>
                </Animatable.View>
                <Animatable.View animation="pulse" iterationCount="infinite" iterationDelay={500} direction="alternate" style={{width:.90*width, backgroundColor: "#31d1c9", paddingHorizontal: 20, paddingVertical: 4,borderRadius:10  }} >
                    <ThemedText type="subtitle" style={{ color: "#fff",textAlign:"center" }}>Our Mission</ThemedText>
                    <ThemedText type="default" style={{ color: "#fff" ,textAlign:"center"}}>Give,Change Lives, Makes Impact</ThemedText>
                </Animatable.View>
            </ThemedView>
        </ThemedView>
    )
}

export default MissionVision

const styles = StyleSheet.create({})