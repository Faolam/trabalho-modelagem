import { PrismaClient } from "@prisma/client";

/**
 * Classe responsável por fazer a conexão com o sistema e retornar o cliente prisma.
 */
export class PrismaSession {
  public static session: PrismaClient | null = null;

  public static getSession(): PrismaClient {
    if (this.session) return this.session;

    return this.session = new PrismaClient();
  }

  public static async stopSession(): Promise<void> {
    await this.session?.$disconnect();
    
    return;
  }
}