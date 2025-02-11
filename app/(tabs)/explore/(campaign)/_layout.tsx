import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="index" />
            {/* <Stack.Screen name="(campaign)/index" /> */}
            <Stack.Screen name="campaignDetails" />
            <Stack.Screen name="uploadMedia" />
            <Stack.Screen name="updateCampaign" />


        </Stack>
    );
}
