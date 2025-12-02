import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: req.user?.id } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const userRepository = getRepository(User);
    
    const user = await userRepository.findOne({ where: { id: req.user?.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await userRepository.save(user);
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: req.user?.id } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await userRepository.remove(user);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const users = await userRepository.find({
      select: ['id', 'firstName', 'lastName', 'email', 'isAdmin', 'createdAt']
    });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 