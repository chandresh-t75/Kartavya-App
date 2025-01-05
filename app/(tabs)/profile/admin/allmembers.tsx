
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const allmembers = () => {
  const dispatch=useDispatch();

  // const members =useSelector((state:any)=>state.admin.allMembers)
  
  const [loading,setLoading]=useState(false);
  const [page,setPage]=useState(1);
  const [hasMore,setHasMore]=useState(true);
  const [members, setMembers] = useState<any[]>([]);
console.log(members);

  const fetchAllMembers = async () => {
    if(!hasMore)return;
    try {
      setLoading(true);
      console.log("Loading members...");
      const response=await axios.get("http://192.168.43.243:5000/member/get-all-members",{
        params: { 
          page,
          limit: 10 
        }
      });

      if(response.status === 200){
        if(response.data.length < 10)setHasMore(false);  
        console.log("member",response.data);
        setPage(page+1);
        setMembers([...members,...response.data]);
        setLoading(false);
      
      }
      
      
      
    } catch (error:any) {
      if(error.status === 404){
        setPage(page+1);
        setHasMore(false);
      }
      console.error('Error finding all members', error);
    }
  };

  useEffect(() => {
    console.log("fetching members...");
    fetchAllMembers();
  }, []);

  const handleMemberPress = (member:any) => {
    
  };

  const renderMember = ({item}:any) => (
    
    <TouchableOpacity key={item._id} style={styles.card} onPress={() => handleMemberPress(item)}>
     
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
        keyExtractor={(item) => item._id}
        renderItem={renderMember}
        contentContainerStyle={styles.list}
        onEndReached={ ()=>{
          if(!hasMore){
            fetchAllMembers()
          }
        }
        }
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center' }}>No members found</Text>
        }
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
