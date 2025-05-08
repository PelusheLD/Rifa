import 'dotenv/config';
import { storage } from "./storage";

async function seed() {
  try {
    // Verificar si ya existe un administrador
    const existingAdmin = await storage.getAdminByUsername("admin");
    
    if (existingAdmin) {
      console.log("Ya existe un administrador en la base de datos.");
      return;
    }

    // Crear el administrador inicial
    const admin = await storage.createAdmin({
      username: "admin",
      password: "admin123",
      name: "Administrador"
    });

    console.log("Administrador creado exitosamente:", {
      id: admin.id,
      username: admin.username,
      name: admin.name
    });
  } catch (error) {
    console.error("Error al crear el administrador:", error);
  }
}

// Ejecutar el seed
seed(); 