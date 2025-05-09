import mongoose from 'mongoose';

const pageConfigSchema = new mongoose.Schema({
  // Configuración general
  logoUrl: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  heroImageUrl: { type: String, required: true },
  
  // Destacados
  highlight1: { type: String, required: true },
  highlight2: { type: String, required: true },
  highlight3: { type: String, required: true },
  
  // Configuración del footer
  footerLogoUrl: { type: String, required: true },
  footerCompanyName: { type: String, required: true },
  footerDescription: { type: String, required: true },
  footerSocialLinks: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    whatsapp: { type: String }
  },
  
  // Redes sociales
  socialLinks: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    whatsapp: { type: String }
  }
}, { timestamps: true });

export const PageConfig = mongoose.model('PageConfig', pageConfigSchema); 