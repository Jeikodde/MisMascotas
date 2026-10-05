import { NavigatorScreenParams } from "@react-navigation/native";
import { Pet } from "./pet.type";

export type PetStackParamList = {
  ListScreen: undefined;
  DataEntryScreen: { pet?: Pet };
}

export type MainTabParamList = {
  HomeScreen: undefined;
  PetsTab: NavigatorScreenParams<PetStackParamList>;
  ProfileScreen: undefined;
}

export type RootStackParamList = {
  LoginScreen: undefined;
  MainApp: NavigatorScreenParams<MainTabParamList>;
}