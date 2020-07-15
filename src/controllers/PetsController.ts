import { Request, Response } from 'express';
import crypto from 'crypto';
import knex from '../database/connection';

interface PetsArray {
  id: number;
  name: string;
  size: string;
  gender: string;
  photoUrl: string;
  adopted: boolean;
}

class PetsController {
  async create(request: Request, response: Response) {
    const { name, size, gender, uf, city, latitude, longitude } = request.body;

    const pet = {
      name,
      size,
      gender,
      photo: request.file.filename,
      uf,
      city,
      latitude,
      longitude,
    };

    await knex('adopts').insert(pet);

    return response.json(pet);
  }

  async index(request: Request, response: Response) {
    const { city, uf } = request.query;

    const pets = await knex('adopts')
      .where('city', String(city))
      .where('uf', String(uf))
      .where('adopted', 0)
      .distinct()
      .select('*');

    if (pets.length <= 0) {
      return response.status(400).json({ message: 'Pets not found in region' });
    }

    const serializedPets = pets.map((pet) => ({
      id: pet.id,
      createdAt: pet.createdAt,
      name: pet.name,
      size: pet.size,
      gender: pet.gender,
      uf: pet.uf,
      city: pet.city,
      latitude: pet.latitude,
      longitude: pet.longitude,
      photoUrl: `http://localhost:3333/uploads/${pet.photo}`,
      adopted: false,
    }));

    return response.json(serializedPets);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const pets = await knex('adopts')
      .where('id', String(id))
      .distinct()
      .select('*');

    if (!pets) {
      return response.status(400).json({ message: 'Pet not found!' });
    }

    const serializedPets = pets.map((pet) => ({
      id: pet.id,
      createdAt: pet.createdAt,
      name: pet.name,
      size: pet.size,
      gender: pet.gender,
      uf: pet.uf,
      city: pet.city,
      latitude: pet.latitude,
      longitude: pet.longitude,
      photoUrl: `http://localhost:3333/uploads/${pet.photo}`,
      adopted: false,
    }));

    return response.json(serializedPets);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;

    const hash = crypto.randomBytes(2).toString('hex');

    const find = await knex('adopts')
      .where('id', String(id))
      .where('adopted', 0)
      .distinct()
      .select('*');

    if (find.length <= 0) {
      return response.status(400).json({ message: 'Pet has have adopted' });
    }

    const update = await knex('adopts')
      .update('adopted', true)
      .update('giftedCode', String(`${hash}`))
      .where('id', String(id))
      .distinct()
      .select('*');

    return response.json(hash);
  }
}

export default PetsController;
