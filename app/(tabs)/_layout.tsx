// import { Tabs } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import type { DrawerNavigationProp } from '@react-navigation/drawer';

// type RootStackParamList = {
//   '(drawer)': undefined;
//   'movie/[id]': { id: string };
//   'login': undefined;
// };

// export default function TabsLayout() {
//   const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();

//   return (
//     <Tabs
//       screenOptions={{
//         headerStyle: {
//           backgroundColor: '#1A1A1A',
//         },
//         headerTintColor: '#FFFFFF',
//         tabBarStyle: {
//           backgroundColor: '#1A1A1A',
//         },
//         tabBarActiveTintColor: '#E50914',
//         tabBarInactiveTintColor: '#FFFFFF',
//         headerLeft: () => (
//           <TouchableOpacity
//             onPress={() => navigation.openDrawer()}
//             style={{ marginLeft: 16 }}
//           >
//             <Ionicons name="menu" size={24} color="#FFFFFF" />
//           </TouchableOpacity>
//         ),
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="home" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="search"
//         options={{
//           title: 'Search',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="search" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="favorites"
//         options={{
//           title: 'My List',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="heart" size={size} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// } 




import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useColorScheme } from "react-native"

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#E50914",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#121212",
          borderTopColor: "#333",
        },
        headerShown: false, 
        headerStyle: {
          backgroundColor: "#121212",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "My List",
          tabBarIcon: ({ color, size }) => <Ionicons name="bookmark" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
