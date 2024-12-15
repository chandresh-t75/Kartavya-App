import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import { lightPurple } from '@/constants/Colors';

type Props = {}

const MissionVision = (props: Props) => {
    const navigation = useNavigation();
    return (
        <ThemedView style={{ paddingHorizontal: 0, paddingTop: 10, backgroundColor:lightPurple }}>
            <ThemedView style={{ paddingHorizontal: 20, marginVertical: 20, paddingVertical: 20 }}>
                <ThemedText type="subtitle" style={{ color: "#201658", marginBottom: 10 }}>About Us</ThemedText>
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
                        }}
                    >
                        <ThemedText type="defaultSemiBold" style={{ color: "#000" }}>
                            Explore Us
                        </ThemedText>
                    </Link>

                    <Link
                        href="/donate" style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: "#A25772", borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                        <ThemedText type="defaultSemiBold" style={{ color: "#fff" }}>Donate Us</ThemedText>
                    </Link>

                </ThemedView>

            </ThemedView>
            <ThemedView style={{ gap: 20, paddingVertical: 20, backgroundColor:lightPurple }}>
                <Animatable.View animation="pulse" iterationCount="infinite" iterationDelay={500} direction="alternate" style={{ backgroundColor: "#F9E2AF", width: 300, paddingHorizontal: 20, paddingVertical: 4, borderBottomEndRadius: 20, borderTopEndRadius: 20 }} >
                    <ThemedText type="subtitle" style={{ color: "#201658" }}>Our Slogan</ThemedText>
                    <ThemedText type="default" style={{ color: "#201658" }}>Give,Change Lives, Makes Impact</ThemedText>
                </Animatable.View>
                <Animatable.View animation="pulse" iterationCount="infinite" iterationDelay={500} direction="alternate" style={{ backgroundColor: "#201658", alignSelf: "flex-end", width: 300, paddingHorizontal: 20, paddingVertical: 4, borderBottomStartRadius: 20, borderTopStartRadius: 20 }} >
                    <ThemedText type="subtitle" style={{ color: "#F9E2AF", alignSelf: "flex-end" }}>Our Vision</ThemedText>
                    <ThemedText type="default" style={{ color: "#F9E2AF", alignSelf: "flex-end" }}>Give, Change Lives, Makes Impact</ThemedText>
                </Animatable.View>
                <Animatable.View animation="pulse" iterationCount="infinite" iterationDelay={500} direction="alternate" style={{ backgroundColor: "#F9E2AF", width: 300, paddingHorizontal: 20, paddingVertical: 4, borderBottomEndRadius: 20, borderTopEndRadius: 20 }} >
                    <ThemedText type="subtitle" style={{ color: "#201658" }}>Our Mission</ThemedText>
                    <ThemedText type="default" style={{ color: "#201658" }}>Give,Change Lives, Makes Impact</ThemedText>
                </Animatable.View>
            </ThemedView>
        </ThemedView>
    )
}

export default MissionVision

const styles = StyleSheet.create({})