import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function ProfileScreen() {
  const { user, isDarkMode, toggleTheme, signOut, colors } = useApp();

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Deseas cerrar tu sesión actual y limpiar el almacenamiento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* User Header */}
      <View style={[styles.profileHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarLetter}>{user ? user[0].toUpperCase() : 'U'}</Text>
        </View>
        <Text style={[styles.userName, { color: colors.text }]}>{user || 'Usuario'}</Text>
        <Text style={[styles.userRole, { color: colors.subtext }]}>Administrador del Sistema</Text>
      </View>

      {/* Preferences Section */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferencias</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name={isDarkMode ? 'moon' : 'sunny'}
              size={22}
              color={colors.primary}
              style={styles.rowIcon}
            />
            <View>
              <Text style={[styles.rowTitle, { color: colors.text }]}>Tema Oscuro</Text>
              <Text style={[styles.rowSubtitle, { color: colors.subtext }]}>
                Persistido en AsyncStorage
              </Text>
            </View>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#CBD5E1', true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Danger Zone: Logout */}
      <View style={{ marginTop: 24 }}>
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: colors.danger }]}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} style={{ marginRight: 8 }} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 14,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});