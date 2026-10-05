import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useApp } from '../context/AppContext';
import { getPets } from '../services/database.service';
import { MainTabParamList } from '../types/navigation.type';

type HomeNavProp = BottomTabNavigationProp<MainTabParamList, 'HomeScreen'>;

export default function HomeScreen() {
  const { user, colors } = useApp();
  const navigation = useNavigation<HomeNavProp>();
  const [totalPets, setTotalPets] = useState(0);

  // Reload SQLite count whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      async function loadMetrics() {
        try {
          const pets = await getPets();
          setTotalPets(pets.length);
        } catch (error) {
          console.error('Error fetching metrics from SQLite:', error);
        }
      }
      loadMetrics();
    }, [])
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Welcome Banner */}
        <View style={[styles.welcomeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.welcomeSub, { color: colors.subtext }]}>Bienvenido de nuevo,</Text>
          <Text style={[styles.welcomeUser, { color: colors.text }]}>{user || 'Usuario'}</Text>
          <Text style={[styles.welcomeDesc, { color: colors.subtext }]}>
            Este es tu panel central para monitorear el estado y registro de mascotas.
          </Text>
        </View>

        {/* Metrics Grid */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Resumen del Sistema</Text>
        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.metricIconWrap, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="paw" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>{totalPets}</Text>
            <Text style={[styles.metricLabel, { color: colors.subtext }]}>Mascotas Registradas</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.metricIconWrap, { backgroundColor: '#10B98120' }]}>
              <Ionicons name="server" size={24} color="#10B981" />
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>SQLite</Text>
            <Text style={[styles.metricLabel, { color: colors.subtext }]}>Base de Datos Local</Text>
          </View>
        </View>

        {/* Action Shortcuts */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Acciones Rápidas</Text>
        
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() =>
            navigation.navigate('PetsTab', {
              screen: 'DataEntryScreen',
              params: {},
            })
          }
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={[styles.actionTitle, { color: colors.text }]}>Registrar Nueva Mascota</Text>
            <Text style={[styles.actionDesc, { color: colors.subtext }]}>
              Añade un nuevo paciente al almacenamiento local
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() =>
            navigation.navigate('PetsTab', {
              screen: 'ListScreen',
            })
          }
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#8B5CF6' }]}>
            <Ionicons name="list" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={[styles.actionTitle, { color: colors.text }]}>Ver Todas las Mascotas</Text>
            <Text style={[styles.actionDesc, { color: colors.subtext }]}>
              Consulta, edita o elimina registros existentes
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  welcomeCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  welcomeSub: {
    fontSize: 14,
  },
  welcomeUser: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 8,
  },
  welcomeDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  metricIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionTextWrap: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  actionDesc: {
    fontSize: 12,
    marginTop: 2,
  },
});