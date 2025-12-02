import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Message } from '../entities/Message';
import { User } from '../entities/User';

export const getMessages = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const messageRepo = getRepository(Message);
  const messages = await messageRepo.find({
    where: [
      { sender: { id: userId } },
      { receiver: { id: userId } }
    ],
    relations: ['sender', 'receiver'],
    order: { createdAt: 'DESC' }
  });
  res.json(messages);
};

export const sendMessage = async (req: Request, res: Response) => {
  const { receiverId, subject, content } = req.body;
  const messageRepo = getRepository(Message);
  const userRepo = getRepository(User);
  const receiver = await userRepo.findOne({ where: { id: receiverId } });
  if (!receiver) return res.status(404).json({ message: 'Receiver not found' });
  const message = messageRepo.create({
    sender: req.user,
    receiver,
    subject,
    content,
    read: false
  });
  await messageRepo.save(message);
  // Optionally: create a notification record here
  res.status(201).json(message);
};

export const getMessageById = async (req: Request, res: Response) => {
  const messageRepo = getRepository(Message);
  const message = await messageRepo.findOne({
    where: { id: req.params.id },
    relations: ['sender', 'receiver']
  });
  if (!message) return res.status(404).json({ message: 'Message not found' });
  // Mark as read if receiver is current user
  if (message.receiver.id === req.user?.id && !message.read) {
    message.read = true;
    await messageRepo.save(message);
  }
  res.json(message);
};

export const deleteMessage = async (req: Request, res: Response) => {
  const messageRepo = getRepository(Message);
  const message = await messageRepo.findOne({ where: { id: req.params.id } });
  if (!message) return res.status(404).json({ message: 'Message not found' });
  if (message.sender.id !== req.user?.id && message.receiver.id !== req.user?.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  await messageRepo.remove(message);
  res.json({ message: 'Message deleted' });
};

export const getNotifications = async (req: Request, res: Response) => {
  // For now, return unread messages as notifications
  const userId = req.user?.id;
  const messageRepo = getRepository(Message);
  const notifications = await messageRepo.find({
    where: { receiver: { id: userId }, read: false },
    relations: ['sender'],
    order: { createdAt: 'DESC' }
  });
  res.json(notifications);
}; 