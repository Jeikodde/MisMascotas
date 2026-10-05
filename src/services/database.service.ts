import * as SQLite from 'expo-sqlite';
import { NewPet, Pet } from '../types/pet.type';

let dbInstance: SQLite.SQLiteDatabase | null = null;

async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('pets.db');
  }
  return dbInstance;
}

export async function initializeDatabase(): Promise<void> {
  const db = await getDB();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      age INTEGER NOT NULL
    );
  `);
}

export async function createPet(pet: NewPet): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    'INSERT INTO pets (name, species, age) VALUES (?, ?, ?)',
    [pet.name, pet.species, pet.age]
  );
}

export async function getPets(): Promise<Pet[]> {
  const db = await getDB();
  return await db.getAllAsync<Pet>('SELECT * FROM pets ORDER BY id DESC');
}

export async function updatePet(pet: Pet): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    'UPDATE pets SET name = ?, species = ?, age = ? WHERE id = ?',
    [pet.name, pet.species, pet.age, pet.id]
  );
}

export async function deletePet(id: number): Promise<void> {
  const db = await getDB();
  await db.runAsync('DELETE FROM pets WHERE id = ?', [id]);
}