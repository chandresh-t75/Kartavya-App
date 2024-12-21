import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const allmembers = () => {
  const [members, setMembers] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '1234567890',
      role: 'Admin',
      joinedAt: '2024-01-01',
      address: { city: 'New York', state: 'NY', country: 'USA' },
      profileImage: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      phone: '0987654321',
      role: 'Member',
      joinedAt: '2023-12-15',
      address: { city: 'San Francisco', state: 'CA', country: 'USA' },
      profileImage: 'https://via.placeholder.com/150',
    },
  ]);

  useEffect(() => {
    // Fetch members data from API
    // Example: fetch('/api/members').then(res => res.json()).then(setMembers);
  }, []);

  const handleMemberPress = (member:any) => {
    
  };

  const renderMember = ({ item }:any) => (
    <TouchableOpacity style={styles.card} onPress={() => handleMemberPress(item)}>
      <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.role}>{item.role}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.phone}>📞 {item.phone}</Text>
        <Text style={styles.joinedAt}>Joined: {new Date(item.joinedAt).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team Members</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
   
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginHorizontal: 20,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#31d1cf',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
    marginBottom: 6,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  joinedAt: {
    fontSize: 12,
    color: '#999',
  },
});

export default allmembers;
