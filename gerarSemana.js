import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import promptPrincipal from './prompts/promptPrincipal.js';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function gerarConteudoSemanal() {
  console.log("⏳ Solicitando conteúdo da semana ao Gemini. Aguarde...");

  const promptJSON = `
${promptPrincipal}

INSTRUÇÃO CRÍTICA PARA FORMATAÇÃO DA SAÍDA:
Gere o conteúdo para TODOS os 7 dias da semana. 
Você DEVE retornar EXATAMENTE um objeto JSON válido. 
As chaves do JSON devem ser estritamente os nomes dos dias: "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo".
Os valores devem ser as mensagens completas correspondentes, formatadas com as quebras de linha (\\n) para o WhatsApp.
Não retorne blocos de código (markdown como \`\`\`json), retorne APENAS o JSON puro.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'models/gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: promptJSON }] }]
    });

    let textoResposta = response.text.trim();
    
    // Limpeza de segurança caso a IA envie com markdown
    if (textoResposta.startsWith("```json")) {
        textoResposta = textoResposta.substring(7, textoResposta.length - 3).trim();
    } else if (textoResposta.startsWith("```")) {
        textoResposta = textoResposta.substring(3, textoResposta.length - 3).trim();
    }

    // Valida se é um JSON legível e salva
    const jsonParseado = JSON.parse(textoResposta);
    const caminhoArquivo = path.join(process.cwd(), 'dados', 'conteudoSemanal.json');
    
    fs.writeFileSync(caminhoArquivo, JSON.stringify(jsonParseado, null, 2), 'utf-8');
    console.log("✅ Sucesso! Arquivo 'dados/conteudoSemanal.json' criado. Revise os textos, faça o git push e o Vercel fará o resto.");

  } catch (error) {
    console.error("❌ Erro ao gerar ou salvar o conteúdo:", error);
  }
}

gerarConteudoSemanal();