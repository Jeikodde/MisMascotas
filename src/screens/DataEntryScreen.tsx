import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { PetStackParamList } from '../types/navigation.type';
import { createPet, updatePet } from '../services/database.service';

type DataEntryRouteProp = RouteProp<PetStackParamList, 'DataEntryScreen'>;

export default function DataEntryScreen() {
  const { colors } = useApp();
  const navigation = useNavigation();
  const route = useRoute<DataEntryRouteProp>();

  const editingPet = route.params?.pet;

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    if (editingPet) {
      setName(editingPet.name);
      setSpecies(editingPet.species);
      setAge(editingPet.age.toString());
    }
  }, [editingPet]);

  const handleSave = async () => {
    if (!name.trim() || !species.trim() || !age.trim()) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos del formulario.');
      return;
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 100) {
      Alert.alert('Edad no válida', 'Ingresa una edad numérica razonable.');
      return;
    }

    try {
      if (editingPet) {
        await updatePet({
          id: editingPet.id,
          name: name.trim(),
          species: species.trim(),
          age: parsedAge,
        });
        Alert.alert('Éxito', 'Mascota actualizada correctamente en SQLite.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await createPet({
          name: name.trim(),
          species: species.trim(),
          age: parsedAge,
        });
        Alert.alert('Éxito', 'Mascota guardada correctamente en SQLite.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error('Error saving pet in SQLite:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar los datos.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: colors.text }]}>
            {editingPet ? 'Modificar Registro' : 'Datos de la Mascota'}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Nombre</Text>
            <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Ionicons name="pricetag-outline" size={20} color={colors.subtext} style={styles.icon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Ej. Max, Luna, Toby"
                placeholderTextColor={colors.subtext}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Especie</Text>
            <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Ionicons name="paw-outline" size={20} color={colors.subtext} style={styles.icon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Ej. Perro, Gato, Ave, Conejo"
                placeholderTextColor={colors.subtext}
                value={species}
                onChangeText={setSpecies}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Edad (en años)</Text>
            <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Ionicons name="calendar-outline" size={20} color={colors.subtext} style={styles.icon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Ej. 3"
                placeholderTextColor={colors.subtext}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Ionicons name="save-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>
              {editingPet ? 'Actualizar Mascota' : 'Guardar Mascota'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  button: {
    height: 48,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});