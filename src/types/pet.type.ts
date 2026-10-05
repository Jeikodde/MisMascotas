export interface Pet {
  id: number;
  name: string;
  species: string;
  age: number;
}

export type NewPet = Omit<Pet, 'id'>;