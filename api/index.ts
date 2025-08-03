import { createApp } from "../dist/app";
import { DatabaseConnection } from "../dist/infrastructure/database/connection";
import { validateConfig } from "../dist/shared/config/config";
import logger from "../dist/shared/utils/logger";

// Configurar module alias para Vercel
import * as moduleAlias from "module-alias";
moduleAlias.addAliases({
  "@domain": __dirname + "/../src/domain",
  "@application": __dirname + "/../src/application", 
  "@infrastructure": __dirname + "/../src/infrastructure",
  "@presentation": __dirname + "/../src/presentation",
  "@shared": __dirname + "/../src/shared"
});

let cachedApp: any = null;
let isConnected = false;

const initializeApp = async () => {
  if (cachedApp && isConnected) {
    return cachedApp;
  }

  try {
    // Validar configuración
    validateConfig();
    
    // Conectar a la base de datos solo una vez
    if (!isConnected) {
      const db = DatabaseConnection.getInstance();
      await db.connect();
      isConnected = true;
    }
    
    // Crear aplicación
    if (!cachedApp) {
      cachedApp = createApp();
      logger.info("Aplicación inicializada para Vercel");
    }
    
    return cachedApp;
  } catch (error) {
    logger.error("Error inicializando aplicación:", error);
    throw error;
  }
};

// Handler para Vercel (Serverless Function)
export default async (req: any, res: any) => {
  try {
    const app = await initializeApp();
    return app(req, res);
  } catch (error: any) {
    console.error("Error en handler de Vercel:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error?.message : "Error de servidor",
      timestamp: new Date().toISOString()
    });
  }
};
