import { storage } from '../../server/storage';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    const existingAdmins = await storage.getRaffles(1, 1);
    if (existingAdmins.length > 0) {
      return res.status(400).json({ message: "Ya existe un administrador configurado" });
    }
    const admin = await storage.createAdmin({
      username: "admin",
      password: "admin123",
      name: "Administrador"
    });
    res.status(201).json({
      message: "Administrador creado correctamente",
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error al configurar el administrador" });
  }
} 