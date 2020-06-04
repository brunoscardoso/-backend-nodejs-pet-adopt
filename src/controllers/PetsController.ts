import { Request, Response } from 'express'
import knex from '../database/connection';

class PetsController {
  async create (request: Request, response: Response) {
    const { name, size, uf, city, latitude, longitude  } = request.body;

    const pet = {
      name,
      size,
      photo: 'https://www.hypeness.com.br/wp-content/uploads/2019/09/Vira-lata_Caramelo_3.jpg',
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
        uf : pet.uf,
        city: pet.city,
        latitude: pet.latitude,
        longitude: pet.longitude,
        photo_url: `http://localhost:3333/uploads/${pet.photo}`,
      }
    })

    return response.json(serializedPets);
  }

  async show (request: Request, response: Response) {
    const { id } = request.params;

    const pet = await knex('adopts').where('id', id).first();
    
    if (!pet) {
      return response.status(400).json({ message: 'Pet not found!'});
    }

    return response.json(pet);
  }
}

export default PetsController;