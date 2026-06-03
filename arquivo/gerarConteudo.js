import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import promptPrincipal from '../prompts/promptPrincipal.js';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Agora a função recebe o 'diaAtual' como parâmetro
export async function gerarConteudo(diaAtual) {
  try {
    // Injetamos uma instrução extra no final do prompt principal
    const promptDirecionado = `
${promptPrincipal}

INSTRUÇÃO CRÍTICA: Baseado em todas as regras acima, gere AGORA APENAS o conteúdo correspondente a **${diaAtual}**. 
Não gere os outros dias da semana. Não faça introduções confirmando a ação, entregue apenas o texto pronto para o envio do WhatsApp.
`;

    const response = await ai.models.generateContent({
      model: 'models/gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: promptDirecionado }] }]
    });

    if (response.text) {
      console.log(`Conteúdo de ${diaAtual} gerado:\n`, response.text);
      return response.text;
    } else {
      console.log("Nenhum conteúdo gerado.");
      return null;
    }
  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error);
    return null;
  }
}