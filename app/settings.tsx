import React from 'react';
import { View, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { CustomText } from './components/CustomText';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(true);
  const [autoPlayEnabled, setAutoPlayEnabled] = React.useState(true);

  const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);
  const toggleDarkMode = () => setDarkModeEnabled(previousState => !previousState);
  const toggleAutoPlay = () => setAutoPlayEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <CustomText variant="title" style={styles.title}>Settings</CustomText>
      
      <View style={styles.section}>
        <CustomText variant="subtitle" style={styles.sectionTitle}>Account</CustomText>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="person-outline" size={24} color="#FFFFFF" />
            <CustomText style={styles.settingText}>Profile</CustomText>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="lock-closed-outline" size={24} color="#FFFFFF" />
            <CustomText style={styles.settingText}>Password</CustomText>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <CustomText variant="subtitle" style={styles.sectionTitle}>Preferences</CustomText>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            <CustomText style={styles.settingText}>Notifications</CustomText>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#E50914' }}
            thumbColor={notificationsEnabled ? '#FFFFFF' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleNotifications}
            value={notificationsEnabled}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon-outline" size={24} color="#FFFFFF" />
            <CustomText style={styles.settingText}>Dark Mode</CustomText>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#E50914' }}
            thumbColor={darkModeEnabled ? '#FFFFFF' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleDarkMode}
            value={darkModeEnabled}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="play-outline" size={24} color="#FFFFFF" />
            <CustomText style={styles.settingText}>Auto-Play</CustomText>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#E50914' }}
            thumbColor={autoPlayEnabled ? '#FFFFFF' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleAutoPlay}
            value={autoPlayEnabled}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <CustomText variant="subtitle" style={styles.sectionTitle}>About</CustomText>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="information-circle-outline" size={24} color="#FFFFFF" />
            <CustomText style={styles.settingText}>About GenFlix</CustomText>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle-outline" size={24} color="#FFFFFF" />
            <CustomText style={styles.settingText}>Help & Support</CustomText>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    marginTop: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: '#AAAAAA',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: 15,
    fontSize: 16,
  },
}); 