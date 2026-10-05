import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainTabParamList, PetStackParamList, RootStackParamList } from "../types/navigation.type";
import { useApp } from "../context/AppContext";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ListScreen from "../screens/ListScreen";
import DataEntryScreen from "../screens/DataEntryScreen";
import ProfileScreen from "../screens/ProfileScreen";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const PetStack = createNativeStackNavigator<PetStackParamList>();

const PetStackNavigator = () => {
  const { colors } = useApp();

  return (
    <PetStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false
      }}
    >
      <PetStack.Screen
        name="ListScreen"
        component={ ListScreen }
        options={({ navigation }) => ({
          title: 'Mis Mascotas',
          headerRight: () => {
            <TouchableOpacity
              onPress={() => navigation.navigate('DataEntryScreen', {})}
              style={styles.headerButton}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={28} color={colors.primary} />
            </TouchableOpacity>
          }
        })}
      />

      <PetStack.Screen
        name="DataEntryScreen"
        component={ DataEntryScreen }
        options={({ route }) => ({
          title: route.params?.pet ? 'Editar Mascota' : 'Nueva Mascota'
        })}
      />
    </PetStack.Navigator>
  )
}

const MainTabNavigator = () => {
  const { colors } = useApp();

  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveBackgroundColor: colors.subtext,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if(route.name === 'HomeScreen') {
            iconName = focused ? 'home' : 'home-outline';
          }

          if(route.name === 'PetsTab') {
            iconName = focused ? 'paw' : 'paw-outline';
          }

          if(route.name === 'ProfileScreen') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />
        }
      })}
    >
      <MainTab.Screen
        name="HomeScreen"
        component={ HomeScreen }
        options={{ title: 'Inicio', tabBarLabel: 'Inicio'}}
      />

      <MainTab.Screen
        name="PetsTab"
        component={ PetStackNavigator }
        options={{
          headerShown: false,
          tabBarLabel: 'Mascotas'
        }}
      />

      <MainTab.Screen
        name="ProfileScreen"
        component={ ProfileScreen }
        options={{ title: 'Mi Perfil', tabBarLabel: 'Perfil' }}
      />
    </MainTab.Navigator>
  );
}

const AppNavigator = () => {
  const { user, isLoading, colors } = useApp();

  if(isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        { user ? (
          <RootStack.Screen name="MainApp" component={ MainTabNavigator }/>
          ) : (
            <RootStack.Screen name="LoginScreen" component={ LoginScreen } />  
          )
        }
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    marginRight: 8,
  },
});

export default AppNavigator;