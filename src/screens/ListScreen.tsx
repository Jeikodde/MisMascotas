import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { PetStackParamList } from '../types/navigation.type';
import { Pet } from '../types/pet.type';
import { deletePet, getPets } from '../services/database.service';

type ListNavProp = NativeStackNavigationProp<PetStackParamList, 'ListScreen'>;

export default function ListScreen() {
  const { colors } = useApp();
  const navigation = useNavigation<ListNavProp>();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPets = async () => {
    try {
      const data = await getPets();
      setPets(data);
    } catch (error) {
      console.error('Error fetching pets:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de SQLite.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPets();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPets();
  };

  const confirmDelete = (pet: Pet) => {
    Alert.alert(
      'Eliminar Mascota',
      `¿Estás seguro de que deseas eliminar a "${pet.name}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePet(pet.id);
              fetchPets();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el registro.');
            }
          },
        },
      ]
    );
  };

  const renderPetItem = ({ item }: { item: Pet }) => {
    const getSpeciesIcon = (species: string): keyof typeof Ionicons.glyphMap => {
      const lower = species.toLowerCase();
      if (lower.includes('perro') || lower.includes('dog')) return 'paw';
      if (lower.includes('gato') || lower.includes('cat')) return 'paw';
      return 'medical';
    };

    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name={getSpeciesIcon(item.species)} size={26} color={colors.primary} />
        </View>

        <View style={styles.petInfo}>
          <Text style={[styles.petName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.petDetails, { color: colors.subtext }]}>
            {item.species} • {item.age} {item.age === 1 ? 'año' : 'años'}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primary + '20' }]}
            onPress={() => navigation.navigate('DataEntryScreen', { pet: item })}
          >
            <Ionicons name="pencil" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.danger + '20' }]}
            onPress={() => confirmDelete(item)}
          >
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPetItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="paw-outline" size={64} color={colors.subtext} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No hay mascotas registradas</Text>
            <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
              Presiona el botón "+" en la parte superior para añadir la primera.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  petDetails: {
    fontSize: 14,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});