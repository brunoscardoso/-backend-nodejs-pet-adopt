import { Request, Response } from 'express'
import knex from '../database/connection';

interface PetsArray {
  id: number;
  name: string;
  size: string;
  gender: string;
  photo_url: string;
  adopted: boolean;
}

class PetsController {
  async create (request: Request, response: Response) {
    const { name, size, gender, uf, city, latitude, longitude  } = request.body;

    const pet = {
      name,
      size,
      gender,
      photo: request.file.filename,
      uf,
      city,
      latitude,
      longitude
    };
  
    await knex('adopts').insert(pet);
  
    return response.json(pet)
  }

  async index (request: Request, response: Response)  {
    const { city, uf } = request.query;

    const pets = await knex('adopts')
    .where('city', String(city))
    .where('uf', String(uf))
    .where('adopted', 0)
    .distinct()
    .select('*');

    if (pets.length <= 0) {
      return response.status(400).json({ message: 'Pets not found in region'})
    }

    const serializedPets = pets.map(pet => {
      return {
        id: pet.id,
        created_at: pet.created_at,
        name: pet.name,
        size: pet.size,
        gender: pet.gender,
        uf : pet.uf,
        city: pet.city,
        latitude: pet.latitude,
        longitude: pet.longitude,
        photo_url: `http://localhost:3333/uploads/${pet.photo}`,
        adopted: false,
      }
    })

    return response.json(serializedPets);
  }

  async show (request: Request, response: Response) {
    const { id } = request.params;

    const pets = await knex('adopts')
    .where('id', String(id))
    .distinct()
    .select('*');

    if (!pets) {
      return response.status(400).json({ message: 'Pet not found!'});
    }

    const serializedPets = pets.map(pet => {
      return {
        id: pet.id,
        created_at: pet.created_at,
        name: pet.name,
        size: pet.size,
        gender: pet.gender,
        uf : pet.uf,
        city: pet.city,
        latitude: pet.latitude,
        longitude: pet.longitude,
        photo_url: `http://localhost:3333/uploads/${pet.photo}`,
        adopted: false
      }
    });
   
    return response.json(serializedPets);
  
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;

    const pets = await knex('adopts')
    .update('adopted', 1)
    .where('id', String(id))
    .distinct()
    .select('*')

    return response.json({message: "updated, adopted true"});
  }
}

export default PetsController;