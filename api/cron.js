import fs from 'fs';
import path from 'path';
import enviarMensagemCrm from '../servicos/whatsappService.js';

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Acesso negado' });
  }

  try {
    // 1. Descobrir que dia é hoje no Brasil
    const dataAtual = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    const diasDaSemana = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
      'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    const diaDeHoje = diasDaSemana[dataAtual.getDay()];

    console.log(`Iniciando CRON para: ${diaDeHoje}`);

    // 2. Ler o arquivo JSON com as mensagens da semana
    const caminhoArquivo = path.join(process.cwd(), 'dados', 'conteudoSemanal.json');
    const arquivoJSON = fs.readFileSync(caminhoArquivo, 'utf-8');
    const conteudos = JSON.parse(arquivoJSON);

    // 3. Pegar a mensagem do dia
    const mensagemDeHoje = conteudos[diaDeHoje];

    if (!mensagemDeHoje) {
      throw new Error(`Nenhum conteúdo encontrado no JSON para ${diaDeHoje}.`);
    }

    // 4. Disparar no WhatsApp
    const grupos = ['120363217885426939@g.us']; 
    const sucesso = await enviarMensagemCrm(grupos, mensagemDeHoje);

    if (sucesso) {
      return res.status(200).json({ success: true, message: `Conteúdo de ${diaDeHoje} enviado com sucesso!` });
    } else {
      return res.status(500).json({ success: false, error: "Falha ao enviar via WhatsApp." });
    }

  } catch (error) {
    console.error("Erro na execução do Cron:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}