import { View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { CustomText } from '../components/CustomText';
import { Ionicons } from '@expo/vector-icons';

// Dummy user data
const USER_PROFILE = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://picsum.photos/200',
  watchHistory: [
    { id: '1', title: 'Stranger Things', progress: 75 },
    { id: '2', title: 'The Crown', progress: 30 },
    { id: '3', title: 'Black Mirror', progress: 100 },
  ],
  myList: [
    { id: '4', title: 'Breaking Bad' },
    { id: '5', title: 'The Witcher' },
    { id: '6', title: 'Money Heist' },
  ],
};

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <CustomText variant="title" style={styles.logoText}>
          Gen<CustomText style={styles.highlight}>Flix</CustomText>
        </CustomText>
      </View>

      <View style={styles.profileSection}>
        <Image source={{ uri: USER_PROFILE.avatar }} style={styles.avatar} />
        <CustomText variant="title" style={styles.name}>{USER_PROFILE.name}</CustomText>
        <CustomText variant="caption" style={styles.email}>{USER_PROFILE.email}</CustomText>
      </View>

      <View style={styles.section}>
        <CustomText variant="subtitle" style={styles.sectionTitle}>Watch History</CustomText>
        {USER_PROFILE.watchHistory.map(item => (
          <View key={item.id} style={styles.historyItem}>
            <View style={styles.historyInfo}>
              <CustomText variant="body">{item.title}</CustomText>
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: `${item.progress}%` }]} />
              </View>
            </View>
            <CustomText variant="caption">{item.progress}%</CustomText>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <CustomText variant="subtitle" style={styles.sectionTitle}>My List</CustomText>
        {USER_PROFILE.myList.map(item => (
          <View key={item.id} style={styles.listItem}>
            <CustomText variant="body">{item.title}</CustomText>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.signOutButton}>
        <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
        <CustomText variant="body" style={styles.signOutText}>Sign Out</CustomText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 16,
    paddingTop: 48,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  highlight: {
    color: '#E50914',
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    marginBottom: 4,
  },
  email: {
    color: '#666666',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  historyInfo: {
    flex: 1,
    marginRight: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    marginTop: 8,
  },
  progress: {
    height: '100%',
    backgroundColor: '#E50914',
    borderRadius: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    backgroundColor: '#333333',
    borderRadius: 4,
  },
  signOutText: {
    marginLeft: 8,
  },
}); 