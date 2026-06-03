// servicos/whatsappService.js

export default async function enviarMensagemCrm(grupos, mensagem) {
  const token = process.env.CRM_API_TOKEN;
  
  if (!token) {
    console.error("ERRO: Token do CRM ausente.");
    return false;
  }

  const url = `https://api-whatsapp.wascript.com.br/api/enviar-texto/${token}`;
  
  try {
    for (const grupo of grupos) {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: grupo, message: mensagem })
      });

      const data = await response.json();
      if (data.success) {
        console.log(`Mensagem enviada com sucesso para o grupo: ${grupo}`);
      } else {
        console.error(`Erro no retorno da API para o grupo ${grupo}:`, data);
      }
    }
    return true;
  } catch (erro) {
    console.error("Falha na requisição para a Wascript:", erro);
    return false;
  }
}