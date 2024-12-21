import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="admin/updatecampaign" />
            <Stack.Screen name="admin/allmembers" />
            <Stack.Screen name="admin/createcampaign" />

            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/signup" />


        </Stack>
    );
}
