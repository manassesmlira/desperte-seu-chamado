// enviarConteudo.js

import { gerarConteudo } from './gerarConteudo.js';
import enviarMensagemCrm from '../servicos/whatsappService.js';
import dotenv from 'dotenv';

dotenv.config();

const grupos = ['120363217885426939@g.us']; 

async function enviarConteudo() {
  const conteudo = await gerarConteudo();
  
  if (conteudo) {
    const sucesso = await enviarMensagemCrm(grupos, conteudo);
    if (sucesso) {
      console.log('Conteúdo enviado com sucesso para os grupos:', grupos);
    } else {
      console.error('Falha ao enviar o conteúdo.');
    }
  } else {
    console.error('Nenhum conteúdo gerado para envio.');
  }
}


enviarConteudo();