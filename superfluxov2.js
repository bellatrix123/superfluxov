// Invocamos o leitor de qr code
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js'); // Mudança Buttons
const { promisify } = require('util');
const setTimeoutPromise = promisify(setTimeout);

const frasco1 = 'https://bit.ly/gv1uni';

const frasco3 = 'https://abre.ai/gv3uni';

const frasco5 = 'https://abre.ai/gv5uni';

const frasco10 = 'https://abre.ai/gv10uni';

const grupoInvite = 'https://chat.whatsapp.com/LRXaLPD7C6M7FgnTp1MP0X';

//const client = new Client();

/*const client = new Client({
    puppeteer: {
        executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    }
  });*/

//Kit com os comandos otimizados para nuvem Ubuntu Linux (créditos Pedrinho da Nasa Comunidade ZDG)
const client = new Client({
  puppeteer: {
    headless: true,
    //CAMINHO DO CHROME PARA WINDOWS (REMOVER O COMENTÁRIO ABAIXO)
    //executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    //===================================================================================
    // CAMINHO DO CHROME PARA MAC (REMOVER O COMENTÁRIO ABAIXO)
    //executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    //===================================================================================
    // CAMINHO DO CHROME PARA LINUX (REMOVER O COMENTÁRIO ABAIXO)
     executablePath: '/usr/bin/google-chrome-stable',
    //===================================================================================
    args: [
      '--no-sandbox', //Necessário para sistemas Linux
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- Este não funciona no Windows, apague caso suba numa máquina Windows
      '--disable-gpu'
    ]
  }
});

// entao habilitamos o usuario a acessar o serviço de leitura do qr code
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

// apos isso ele diz que foi tudo certin
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// E inicializa tudo para fazer a nossa magica =)
client.initialize();

//const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra
const delay = async (ms) => {
  await setTimeoutPromise(ms);
};

const handleAsyncError = (error) => {
  console.error('Ocorreu um erro assíncrono:', error);
  // Outras ações, como enviar um email de notificação, por exemplo
};

// Código Super Fluxo GotaVita

const DATABASE_FILE = 'superfluxozdb.json';

// Funções de controle e gestão do JSON

// Função auxiliar para ler o arquivo JSON
function readJSONFile(nomeArquivo) {
  if (fs.existsSync(nomeArquivo)) {
    const dados = fs.readFileSync(nomeArquivo);
    return JSON.parse(dados);
  } else {
    return [];
  }
}

// Função auxiliar para escrever no arquivo JSON
function writeJSONFile(nomeArquivo, dados) {
  const dadosJSON = JSON.stringify(dados, null, 2);
  fs.writeFileSync(nomeArquivo, dadosJSON);
}

function salvarNoJSON(nomeArquivo, numeroId) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);

  // Encontrar o objeto com o número de ID correspondente
  const objetoEncontrado = dadosAtuais.find(objeto => objeto.numeroId === numeroId);

  if (!objetoEncontrado) {
    throw new Error('Não foi encontrado um objeto com o numeroId fornecido.');
  }

  // Verificar se o nome do arquivo foi fornecido
  if (!nomeArquivo) {
    throw new Error('É necessário fornecer um nome de arquivo.');
  }

  // Adicionar a extensão .json ao nome do arquivo, se necessário
  if (!nomeArquivo.endsWith('.json')) {
    nomeArquivo += '.json';
  }

  let objetosExistente = [];
  if (fs.existsSync(nomeArquivo)) {
    // Se o arquivo já existe, ler os objetos existentes
    const arquivoExistente = fs.readFileSync(nomeArquivo, 'utf-8');
    objetosExistente = JSON.parse(arquivoExistente);
  }

  // Adicionar o objeto encontrado ao array de objetos existentes
  objetosExistente.push(objetoEncontrado);

  // Salvar os objetos no arquivo JSON
  fs.writeFileSync(nomeArquivo, JSON.stringify(objetosExistente, null, 2));
}

//Fim das Funções de controle JSON

// Adicionar um objeto e excluir o objeto mais antigo se necessário
//Vamos criar a estrutura do banco de dados que agora ficará num arquivo JSON
function addObject(numeroId, flowState, id, interact, nome, idade, tipo, estado, plano, pagamento, flowRmkt, maxObjects) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);

  // Verificar a unicidade do numeroId
  const existeNumeroId = dadosAtuais.some(objeto => objeto.numeroId === numeroId);
  if (existeNumeroId) {
    throw new Error('O numeroId já existe no banco de dados.');
  }

  const objeto = { numeroId, flowState, id, interact, nome, idade, tipo, estado, plano, pagamento, flowRmkt};

  if (dadosAtuais.length >= maxObjects) {
    // Excluir o objeto mais antigo
    dadosAtuais.shift();
  }

  dadosAtuais.push(objeto);
  writeJSONFile(DATABASE_FILE, dadosAtuais);
}

// Excluir um objeto
function deleteObject(numeroId) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);
  const novosDados = dadosAtuais.filter(obj => obj.numeroId !== numeroId);
  writeJSONFile(DATABASE_FILE, novosDados);
}

// Verificar se o objeto existe no banco de dados
function existsDB(numeroId) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);
  return dadosAtuais.some(obj => obj.numeroId === numeroId);
}

// Atualizar a propriedade "flow rmkt"
function updateFlowRmkt(numeroId, flowRmkt) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);
  const objeto = dadosAtuais.find(obj => obj.numeroId === numeroId);
  if (objeto) {
    objeto.flowRmkt = flowRmkt;
    writeJSONFile(DATABASE_FILE, dadosAtuais);
  }
}
  
// Ler a propriedade "flow rmkt"
function readFlowRmkt(numeroId) {
  const objeto = readMap(numeroId);
  return objeto ? objeto.flowRmkt : undefined;
}

// Atualizar a propriedade "pagamento"
function updatePagamento(numeroId, pagamento) {
    const dadosAtuais = readJSONFile(DATABASE_FILE);
    const objeto = dadosAtuais.find(obj => obj.numeroId === numeroId);
    if (objeto) {
      objeto.pagamento = pagamento;
      writeJSONFile(DATABASE_FILE, dadosAtuais);
    }
}
    
  // Ler a propriedade "pagamento"
function readPagamento(numeroId) {
    const objeto = readMap(numeroId);
    return objeto ? objeto.pagamento : undefined;
}

// Atualizar a propriedade "plano"
function updatePlano(numeroId, plano) {
    const dadosAtuais = readJSONFile(DATABASE_FILE);
    const objeto = dadosAtuais.find(obj => obj.numeroId === numeroId);
    if (objeto) {
      objeto.plano = plano;
      writeJSONFile(DATABASE_FILE, dadosAtuais);
    }
}
    
  // Ler a propriedade "plano"
function readPlano(numeroId) {
    const objeto = readMap(numeroId);
    return objeto ? objeto.plano : undefined;
}

// Atualizar a propriedade "estado"
function updateEstado(numeroId, estado) {
    const dadosAtuais = readJSONFile(DATABASE_FILE);
    const objeto = dadosAtuais.find(obj => obj.numeroId === numeroId);
    if (objeto) {
      objeto.estado = estado;
      writeJSONFile(DATABASE_FILE, dadosAtuais);
    }
}
    
  // Ler a propriedade "estado"
function readEstado(numeroId) {
    const objeto = readMap(numeroId);
    return objeto ? objeto.estado : undefined;
}

// Atualizar a propriedade "tipo"
function updateTipo(numeroId, tipo) {
    const dadosAtuais = readJSONFile(DATABASE_FILE);
    const objeto = dadosAtuais.find(obj => obj.numeroId === numeroId);
    if (objeto) {
      objeto.tipo = tipo;
      writeJSONFile(DATABASE_FILE, dadosAtuais);
    }
}
    
  // Ler a propriedade "tipo"
function readTipo(numeroId) {
    const objeto = readMap(numeroId);
    return objeto ? objeto.tipo : undefined;
}

// Atualizar a propriedade "idade"
function updateIdade(numeroId, idade) {
    const dadosAtuais = readJSONFile(DATABASE_FILE);
    const objeto = dadosAtuais.find(obj => obj.numeroId === numeroId);
    if (objeto) {
      objeto.idade = idade;
      writeJSONFile(DATABASE_FILE, dadosAtuais);
    }
}
    
  // Ler a propriedade "idade"
function readIdade(numeroId) {
    const objeto = readMap(numeroId);
    return objeto ? objeto.idade : undefined;
}

// Atualizar a propriedade "nome"
function updateNome(numeroId, nome) {
    const dadosAtuais = readJSONFile(DATABASE_FILE);
    const objeto = dadosAtuais.find(obj => obj.numeroId === numeroId);
    if (objeto) {
      objeto.nome = nome;
      writeJSONFile(DATABASE_FILE, dadosAtuais);
    }
}
    
  // Ler a propriedade "nome"
function readNome(numeroId) {
    const objeto = readMap(numeroId);
    return objeto ? objeto.nome : undefined;
}

// Atualizar a propriedade "flowState"
function updateFlow(numeroId, flowState) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);
  const objeto = dadosAtuais.find(obj => obj.numeroId === numeroId);
  if (objeto) {
    objeto.flowState = flowState;
    writeJSONFile(DATABASE_FILE, dadosAtuais);
  }
}
  
// Ler a propriedade "flowState"
function readFlow(numeroId) {
  if(existsDB(numeroId)){
  const objeto = readMap(numeroId);
  return objeto ? objeto.flowState : undefined;
  }
}

// Atualizar a propriedade "id"
function updateId(numeroId, id) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);
  const objeto = dadosAtuais.find(obj => obj.numeroId === numeroId);
  if (objeto) {
    objeto.id = id;
    writeJSONFile(DATABASE_FILE, dadosAtuais);
  }
}
  
// Ler a propriedade "id"
function readId(numeroId) {
  const objeto = readMap(numeroId);
  return objeto ? objeto.id : undefined;
}

// Atualizar a propriedade "interact"
function updateInteract(numeroId, interact) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);
  const objeto = dadosAtuais.find(obj => obj.numeroId === numeroId);
  if (objeto) {
    objeto.interact = interact;
    writeJSONFile(DATABASE_FILE, dadosAtuais);
  }
}
  
// Ler a propriedade "interact"
function readInteract(numeroId) {
  const objeto = readMap(numeroId);
  return objeto ? objeto.interact : undefined;
}

// Ler o objeto completo
function readMap(numeroId) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);
  const objeto = dadosAtuais.find(obj => obj.numeroId === numeroId);
  return objeto;
}

//Conteudo do Remarketing

// Remarketing dia 1
async function blocoRmkt01(numero) {
  if(readFlow(numero) !== 'stepPago' && readFlow(numero) !== 'stepExitExit' && readFlow(numero) !== 'stepExit'){      
  //await client.sendMessage(numero, `Olha o que a *Dona Lindalva* me mandou esses dias.\n\nO que você acha disso? 😱`);  
  await client.sendMessage(numero, `Olá, tudo bem com você?`);
  await delay(2000); //delay de 3 segundos        
  const a01rmkt = MessageMedia.fromFilePath('./a01rmkt.opus'); // Arquivo de audio em ogg gravado
  await client.sendMessage(numero, a01rmkt, {sendAudioAsVoice: true}); // enviando o audio16
  await delay(2000); //delay de 3 segundos        
  const v01rmkt = MessageMedia.fromFilePath('./v01rmkt.mp4'); // arquivo do video
  await client.sendMessage(numero, v01rmkt);
  await delay(2000); //delay de 3 segundos   
  const a02rmkt = MessageMedia.fromFilePath('./a02rmkt.opus'); // Arquivo de audio em ogg gravado
  await client.sendMessage(numero, a02rmkt, {sendAudioAsVoice: true}); // enviando o audio16
  await delay(2000); //delay de 3 segundos   
  const i01rmkt = MessageMedia.fromFilePath('./i01rmkt.jpeg'); // arquivo em imagem
  await client.sendMessage(numero, i01rmkt, {caption: 'O mais vantajoso!'}); //Enviando a imagem
  await delay(2000); //delay de 3 segundos  
  await client.sendMessage(numero, `Tratamento de 3 Meses💧
(Indicado pelo Laboratório)
  
===================
🔖 Valor Promoção de R$297,00
🚛 Frete Grátis
🛡  Garantia de 90 Dias! 🎉
===================
  
FORMAS DE PAGAMENTO:
  
📄  BOLETO - à vista
💲  PIX - à vista
💳 CARTÃO(Pode parcelar em até 12x)
  
===================
  
Clique no Link Abaixo para Garantir o seu Tratamento 👇
  
➡ ${frasco3}`);
  updateFlow(numero, 'step01rmkt');
  updateInteract(numero, 'done');
  salvarNoJSON('superfluxoRmkt01.json',numero);
  }
};

// Remarketing dia 2
async function blocoRmkt02(numero) {
  if(readFlow(numero) !== 'stepPago' && readFlow(numero) !== 'stepExitExit' && readFlow(numero) !== 'stepExit'){    
  await client.sendMessage(numero, `Olá, tudo bem? 👍

Passando pra te deixar uma alerta super importante... 😔
  
🔴 ASSISTA ESSE VÍDEO ABAIXO 🔴`); 
  await delay(2000); //delay de 3 segundos   
  const v02rmkt = MessageMedia.fromFilePath('./v02rmkt.mp4'); // arquivo do video
  await client.sendMessage(numero, v02rmkt);
  await delay(2000); //delay de 3 segundos 
  const a03rmkt = MessageMedia.fromFilePath('./a03rmkt.opus'); // Arquivo de audio em ogg gravado
  await client.sendMessage(numero, a03rmkt, {sendAudioAsVoice: true}); // enviando o audio16
  await delay(2000); //delay de 3 segundos
  await client.sendMessage(numero, `Se cuida! paz, prosperidade e muita saúde...

- Compre direto do laboratório com 90 dias de GARANTIA +FRETE GRÁTIS
  
  
- Digite o número correspondente a opção desejada
  
1. ✅ OFERTAS DE HOJE
2. 🛑 NÃO QUERO MAIS`);
  updateFlow(numero, 'step02rmkt');
  updateInteract(numero, 'done');
  salvarNoJSON('superfluxoRmkt02.json',numero);
  }
};

// Remarketing dia 3
async function blocoRmkt03(numero) {
  if(readFlow(numero) !== 'stepPago' && readFlow(numero) !== 'stepExitExit' && readFlow(numero) !== 'stepExit'){      
  await client.sendMessage(numero, `Olá, tudo bem? 😀`);
  await delay(2000); //delay de 3 segundos
  await client.sendMessage(numero, `Hoje, estou vindo para te dar um presentinhooooo... 

é isso mesmo ... 🥳`);
  await delay(2000); //delay de 3 segundos
  const a04rmkt = MessageMedia.fromFilePath('./a04rmkt.opus'); // Arquivo de audio em ogg gravado
  await client.sendMessage(numero, a04rmkt, {sendAudioAsVoice: true}); // enviando o audio16
  await delay(2000); //delay de 3 segundos
  await client.sendMessage(numero, `DIGITE O NÚMERO 1 para pegar seu E-book gratuitamente 👇


-Digite o número correspondente a opção desejada

1. ✅ EU QUERO
2. 🛑 NÃO QUERO MAIS`);  
  updateFlow(numero, 'step03rmkt');
  updateInteract(numero, 'done');
  salvarNoJSON('superfluxoRmkt03.json',numero);
  }
};

// Remarketing dia 6
async function blocoRmkt06(numero) {
  if(readFlow(numero) !== 'stepPago' && readFlow(numero) !== 'stepExitExit' && readFlow(numero) !== 'stepExit'){      
  await client.sendMessage(numero, `Olá, tudo bem? 

👇 OUÇA ESSE ÁUDIO`);
  await delay(2000); //delay de 3 segundos
  const a06rmkt = MessageMedia.fromFilePath('./a06rmkt.opus'); // Arquivo de audio em ogg gravado
  await client.sendMessage(numero, a06rmkt, {sendAudioAsVoice: true}); // enviando o audio16
  await delay(2000); //delay de 3 segundos
  const v04rmkt = MessageMedia.fromFilePath('./v04rmkt.mp4'); // arquivo do video
  await client.sendMessage(numero, v04rmkt);
  await delay(2000); //delay de 3 segundos
  const a07rmkt = MessageMedia.fromFilePath('./a07rmkt.opus'); // Arquivo de audio em ogg gravado
  await client.sendMessage(numero, a07rmkt, {sendAudioAsVoice: true}); // enviando o audio16
  await delay(2000); //delay de 3 segundos
  const i02rmkt = MessageMedia.fromFilePath('./i02rmkt.jpeg'); // arquivo em imagem
  await client.sendMessage(numero, i02rmkt); //Enviando a imagem
  await delay(2000); //delay de 3 segundos
  await client.sendMessage(numero, `Pague 2 e Leve 4 Meses de Tratamento💧
(Promoção por Tempo Limitado)
  
===================
🔖 Valor Promoção de R$297,00
🚛 Frete Grátis
🛡  Garantia de 90 Dias! 🎉
===================
  
FORMAS DE PAGAMENTO:
  
📄 BOLETO - à vista
💲  PIX - à vista
💳 CARTÃO(Pode parcelar em até 12x)
  
===================
  
Clique no link abaixo para garantir o seu tratamento ainda hoje.👇
  
➡ ${frasco3}`);  
  updateFlow(numero, 'stepRmkt06');
  updateInteract(numero, 'done');
  salvarNoJSON('superfluxoRmkt06.json',numero);
  }
};

// Remarketing dia 10
async function blocoRmkt10(numero) {
  if(readFlow(numero) !== 'stepPago' && readFlow(numero) !== 'stepExitExit' && readFlow(numero) !== 'stepExit'){  
  await client.sendMessage(numero, `Olá, tudo bem com você? 👍

Olha o que eu encontrei, acho que você vai gostar 🙏`);
  await delay(2000); //delay de 3 segundos
  const a08rmkt = MessageMedia.fromFilePath('./a08rmkt.opus'); // Arquivo de audio em ogg gravado
  await client.sendMessage(numero, a08rmkt, {sendAudioAsVoice: true}); // enviando o audio16
  await delay(2000); //delay de 3 segundos
  const v05rmkt = MessageMedia.fromFilePath('./v05rmkt.mp4'); // arquivo do video
  await client.sendMessage(numero, v05rmkt);
  await delay(2000); //delay de 3 segundos
  await client.sendMessage(numero, `Espero que você goste e esteja bem cuidando da sua SAÚDE 🙏

Um grande abraço. ❤
  
*DIGITE o número 1 para conferir nossas OFERTAS DE HOJE.*👇
  
DIGITE O NÚMERO correspondente a opção desejada
  
1. ✅ OFERTAS DE HOJE
2. 🛑 NÃO QUERO MAIS`);
  updateFlow(numero, 'step10rmkt');
  updateInteract(numero, 'done');
  salvarNoJSON('superfluxoRmkt10.json',numero);
  }
};

// Remarketing dia 15
async function blocoRmkt15(numero) {    
  if(readFlow(numero) !== 'stepPago' && readFlow(numero) !== 'stepExitExit' && readFlow(numero) !== 'stepExit'){  
  await client.sendMessage(numero, `Olá, tudo bem? 👍

Passando aqui para saber como você está ... 😀`);
  await delay(2000); //delay de 3 segundos
  const a09rmkt = MessageMedia.fromFilePath('./a09rmkt.opus'); // Arquivo de audio em ogg gravado
  await client.sendMessage(numero, a09rmkt, {sendAudioAsVoice: true}); // enviando o audio16
  await delay(2000); //delay de 3 segundos
  const v06rmkt = MessageMedia.fromFilePath('./v06rmkt.mp4'); // arquivo do video
  await client.sendMessage(numero, v06rmkt);
  await delay(2000); //delay de 3 segundos
  await client.sendMessage(numero, `Espero que esteja bem e cuidando da sua saúde! 😊

Um grande abraço. ❤

*DIGITE o número 1 para conferir nossas OFERTAS DE HOJE.*👇
  
DIGITE O NÚMERO correspondente a opção desejada
  
1. ✅ OFERTAS DE HOJE
2. 🛑 NÃO QUERO MAIS`);
  updateFlow(numero, 'step15rmkt');
  salvarNoJSON('superfluxoRmkt15.json',numero);
  }
};

// Remarketing dia 30
async function blocoRmkt30(numero) {    
  if(readFlow(numero) !== 'stepPago' && readFlow(numero) !== 'stepExitExit' && readFlow(numero) !== 'stepExit'){    
  const a09rmkt = MessageMedia.fromFilePath('./a10rmkt.opus'); // Arquivo de audio em ogg gravado
  await client.sendMessage(numero, a09rmkt, {sendAudioAsVoice: true}); // enviando o audio16
  await delay(2000); //delay de 3 segundos
  const v06rmkt = MessageMedia.fromFilePath('./v07rmkt.mp4'); // arquivo do video
  await client.sendMessage(numero, v06rmkt);
  await delay(2000); //delay de 3 segundos
  await client.sendMessage(numero, `CLIQUE AQUI PARA FAZER O SEU PEDIDO : 

👉 ${frasco3}`);
  updateFlow(numero, 'step15rmkt');
  salvarNoJSON('superfluxoRmkt15.json',numero);
  }
};

function agendarExecucaoEmDias(tempoEmDias, numeroId, funcaoAExecutar) {
  const tempoEmMilissegundos = tempoEmDias * 24 * 60 * 60 * 1000; // Converter dias em milissegundos
  //const tempoEmMilissegundos = tempoEmDias * 60 * 1000; // Converter dias em milissegundos
  setTimeout(() => {
    funcaoAExecutar(numeroId);
  }, tempoEmMilissegundos);
}

client.on('message', async msg => {

    //Primeiro Bloco
    
    if (!existsDB(msg.from) && (msg.body !== null && msg.body.startsWith('Olá!')) && msg.from.endsWith('@c.us') && !msg.hasMedia) {
    //if (!existsDB(msg.from) && (msg.body === 'Gotavita' || msg.body === 'gotavita' ) && msg.from.endsWith('@c.us') && !msg.hasMedia) {
        const chat = await msg.getChat();
        chat.sendSeen();
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(2000); //Delay de 3000 milisegundos mais conhecido como 2 segundos        
        await client.sendMessage(msg.from, `🥑 Olá, tudo bem? Meu nome é *Anderson*, sou *Especialista Autorizado do GotaVita!*

A partir de agora vou fazer *o seu atendimento* ok. 👍`);        
        await delay(2000); //delay de 3 segundos        
        const audiob01 = MessageMedia.fromFilePath('./a01.opus'); // Arquivo de audio em ogg gravado
        await client.sendMessage(msg.from, audiob01, {sendAudioAsVoice: true}); // enviando o audio16
        await delay(2000); //Delay de 3000 milisegundos mais conhecido como 2 segundos        
        await client.sendMessage(msg.from, `⤵️Para participar do Grupo, basta clicar no link abaixo!

${grupoInvite}`);
        await delay(5000); //delay de 3 segundos        
        const audiob02 = MessageMedia.fromFilePath('./a02.opus'); // Arquivo de audio em ogg gravado
        await client.sendMessage(msg.from, audiob02, {sendAudioAsVoice: true}); // enviando o audio17 
        await delay(3000); //delay de 3 segundos 
        const audiob03 = MessageMedia.fromFilePath('./a03.opus'); // Arquivo de audio em ogg gravado
        await client.sendMessage(msg.from, audiob03, {sendAudioAsVoice: true}); // enviando o audio17
        await delay(3000); //delay de 3 segundos    
        client.sendMessage(msg.from, 'Qual é o seu nome?');     
        addObject(msg.from, 'step00', JSON.stringify(msg.id.id), 'done', null, null, null, null, null, null, 'stepLiso', 200);
        salvarNoJSON('superfluxoz00.json',msg.from);    
    }   

    //Final Primeiro Bloco

    //Bloco Rmkt

    if (existsDB(msg.from) && (msg.body !== null) && readFlowRmkt(msg.from) === 'stepLiso' && readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {
      updateFlowRmkt(msg.from, 'stepRmkt');
      agendarExecucaoEmDias(1, msg.from, blocoRmkt01);
      agendarExecucaoEmDias(2, msg.from, blocoRmkt02);
      agendarExecucaoEmDias(3, msg.from, blocoRmkt03);
      agendarExecucaoEmDias(6, msg.from, blocoRmkt06);
      agendarExecucaoEmDias(10, msg.from, blocoRmkt10);
      agendarExecucaoEmDias(15, msg.from, blocoRmkt15);
      agendarExecucaoEmDias(17, msg.from, blocoRmkt30);
    }

    //Segundo Bloco
    
    if (existsDB(msg.from) && (msg.body !== null) && readFlow(msg.from) === 'step00' && readId(msg.from) !== JSON.stringify(msg.id.id) && readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {
        updateInteract(msg.from, 'typing');
        updateId(msg.from, JSON.stringify(msg.id.id));
        if(!msg.hasMedia){
        updateNome(msg.from, msg.body);}
        if(msg.hasMedia){
        updateNome(msg.from, 'Enviou audio');}
        const chat = await msg.getChat();
        chat.sendSeen();                    
        await chat.sendStateRecording(); //Simulando audio gravando
        await delay(3000); //Delay de 3 segundos
        const audiob03 = MessageMedia.fromFilePath('./a04.opus'); // Arquivo de audio em opus gravado
        await client.sendMessage(msg.from, audiob03, {sendAudioAsVoice: true}); // enviando o audio21
        await delay(45000); //Delay de 3 segundos
        const audiob04 = MessageMedia.fromFilePath('./a05.opus'); // Arquivo de audio em opus gravado
        await client.sendMessage(msg.from, audiob04, {sendAudioAsVoice: true}); // enviando o audio21
        await delay(3000); //Delay de 3 segundos
        await client.sendMessage(msg.from, 'Me responda *aqui abaixo*');
        updateFlow(msg.from,'step01');
        updateInteract(msg.from, 'done');
        salvarNoJSON('superfluxoz01.json',msg.from);
      
    }

    //Final do Segundo Bloco

    //Terceiro Bloco

    if (existsDB(msg.from) && (msg.body !== null) && readFlow(msg.from) === 'step01' && readId(msg.from) !== JSON.stringify(msg.id.id) && readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {
        updateInteract(msg.from, 'typing');
        updateId(msg.from, JSON.stringify(msg.id.id));
        if(!msg.hasMedia){
        updateIdade(msg.from, msg.body);}
        if(msg.hasMedia){
        updateIdade(msg.from, 'Enviou audio');}
        const chat = await msg.getChat();
        chat.sendSeen();
        await delay(5000); //Delay de 33 segundos             
        await chat.sendStateRecording(); //Simulando audio gravando
        await delay(6000); //Delay de 3 segundos
        const audiob05 = MessageMedia.fromFilePath('./a06.opus'); // Arquivo de audio em opus gravado
        await client.sendMessage(msg.from, audiob05, {sendAudioAsVoice: true}); // enviando o audio25        
        await delay(5000); //Delay de 33 segundos 
        const audiob06 = MessageMedia.fromFilePath('./a07.opus'); // Arquivo de audio em opus gravado
        await client.sendMessage(msg.from, audiob06, {sendAudioAsVoice: true}); // enviando o audio25         
        updateFlow(msg.from,'step02');
        updateInteract(msg.from, 'done');
        salvarNoJSON('superfluxoz02.json',msg.from);
      
    }

    //Final do Terceiro Bloco

    //Quarto Bloco

    if (existsDB(msg.from) && (msg.body !== null) && readFlow(msg.from) === 'step02' && readId(msg.from) !== JSON.stringify(msg.id.id)&& readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {
     
        updateInteract(msg.from, 'typing');
        updateId(msg.from, JSON.stringify(msg.id.id));
        if(!msg.hasMedia){
        updateTipo(msg.from, msg.body);}
        if(msg.hasMedia){
        updateTipo(msg.from, 'Enviou audio');}
        const chat = await msg.getChat();
        chat.sendSeen();        
        await delay(5000); //Delay de 3 segundos             
        await chat.sendStateRecording(); //Simulando audio gravando
        await delay(3000); //Delay de 3 segundos
        const audiob06 = MessageMedia.fromFilePath('./a08.opus'); // Arquivo de audio em opus gravado
        await client.sendMessage(msg.from, audiob06, {sendAudioAsVoice: true}); // enviando o audio02
        await delay(4000); //Delay de 3 segundos
        const vid01 = MessageMedia.fromFilePath('./v01.mp4'); // Arquivo de audio em opus gravado
        await client.sendMessage(msg.from, vid01, {sendAudioAsVoice: true}); // enviando o audio02
        await delay(3000); //Delay de 3 segundos
        const audiob07 = MessageMedia.fromFilePath('./a09.opus'); // Arquivo de audio em opus gravado
        await client.sendMessage(msg.from, audiob07, {sendAudioAsVoice: true}); // enviando o audio02
        await delay(4000); //Delay de 3 segundos
        client.sendMessage(msg.from, '🗺 Qual é o seu estado?');  
        updateFlow(msg.from,'step03');
        updateInteract(msg.from, 'done');
        salvarNoJSON('superfluxoz03.json',msg.from);
      
    }

    //Final do Quarto Bloco

    //Quinto Bloco

    if (existsDB(msg.from) && (msg.body !== null) && readFlow(msg.from) === 'step03' && readId(msg.from) !== JSON.stringify(msg.id.id)&& readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {
      
        updateInteract(msg.from, 'typing');
        updateId(msg.from, JSON.stringify(msg.id.id));
        if(!msg.hasMedia){
        updateEstado(msg.from, msg.body);}
        if(msg.hasMedia){
        updateEstado(msg.from, 'Enviou audio');}
        const chat = await msg.getChat();
        chat.sendSeen();
        await delay(5000); //Delay de 10 segundos
        await chat.sendStateTyping(); //Simulando digitação        
        await client.sendMessage(msg.from, 'Um minuto, estou verificando');
        await delay(4000); //Delay de 3 segundos
        const audiob07 = MessageMedia.fromFilePath('./a10.opus'); // Arquivo de audio em opus gravado
        await client.sendMessage(msg.from, audiob07, {sendAudioAsVoice: true}); // enviando o audio03-01
        await delay(5000); //Delay de 3 segundos
        /*await client.sendMessage(msg.from, 'Vou listar os kits disponíveis e valores com o *frete grátis*, um momento por favor. Enquanto isso que te mostrar alguns dos *muitos* relatos de nossos clientes que recebemos todos os dias, esperamos o seu em breve.');
        const vid_01 = MessageMedia.fromFilePath('./vid01_social.mp4'); // arquivo do video
        await client.sendMessage(msg.from, vid_01, { caption: 'Olha o que ele disse' });
        await delay(4000); //Delay de 3 segundos
        const vid_02 = MessageMedia.fromFilePath('./vid02_social.mp4'); // arquivo do video
        await client.sendMessage(msg.from, vid_02, { caption: 'Chegou certinho, olhaa' });
        await delay(114000); //Delay de 2 sminutos
        await client.sendMessage(msg.from, 'Prontinho, perdão pela demora. Escolha o seu kit');
        await delay(3000); //Delay de 1 minuto*/
        await client.sendMessage(msg.from, '📦 *Frete grátis hoje*.\n\n👇 *Digite o número correspondente a opção desejada*');
        await delay(2000); //Delay de 1 minuto
        await client.sendMessage(msg.from, '✅ PAGUE 8 FRASCOS E LEVE 10 por apenas 12x de 59,94R$\n*DIGITE 1* (mais vantajoso)\n\n✅ PAGUE 4 FRASCOS E LEVE 5 por apenas 12x de 39,86R$\n*DIGITE 2*\n\n✅ PAGUE 2 FRASCOS E LEVE 3 por apenas 12x de 29,82R$\n*DIGITE 3*');
        updateFlow(msg.from,'step04');
        updateInteract(msg.from, 'done');
        salvarNoJSON('superfluxoz04.json',msg.from);

        setTimeout(() => {
          if (readFlow(msg.from) === 'step04') {
            client.sendMessage(msg.from, 'Tenho uma oportunidade única aqui para você! Comprando *HOJE* eu te dar de presente e enviar na sua casa um *kit medidor de glicemia* sem nenhum custo adicional, basta realizar a sua compra *HOJE*.\nDigite abaixo o kit escolhido.');
          }
        }, 6*1000*60); //6 minutos
      
    }

    //Final do Quinto Bloco

    //Blocos de Escolha do Produto

    if (existsDB(msg.from) && (msg.body === '1') && readFlow(msg.from) === 'step04' && readId(msg.from) !== JSON.stringify(msg.id.id)&& readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {
      
        updateInteract(msg.from, 'typing');
        updateId(msg.from, JSON.stringify(msg.id.id));
        if(!msg.hasMedia){
        updatePlano(msg.from, msg.body);}
        if(msg.hasMedia){
        updateTipo(msg.from, 'Enviou audio');}        
        const chat = await msg.getChat();
        chat.sendSeen();
        await delay(2000); //Delay de 2 segundos             
        const plano1 = MessageMedia.fromFilePath('./plano1.jpeg'); // arquivo em imagem
        await client.sendMessage(msg.from, plano1, {caption: 'O mais vantajoso!'}); //Enviando a imagem        
        await delay(4000); //Delay de 4 segundos
        await client.sendMessage(msg.from, `*FORMAS DE PAGAMENTO*:\n\n📄 BOLETO à vista\n❖ PIX à vista\n💳CARTÃO (Parcelamento em até 12x)\n\n*Clique no link abaixo* e garanta hoje mesmo o seu *Tratamento de 10 Meses + Frete Grátis*:\n${frasco10}\n\nDigite o número correspondente a opção desejada\n*1.* ❖ COMO PAGAR NO PIX\n*2.* 💳 COMO PAGAR NO CARTÃO\n*3.* 📄 COMO PAGAR NO BOLETO`);
        updateFlow(msg.from,'stepPlano');
        updateInteract(msg.from, 'done');
        salvarNoJSON('superfluxozPlano.json',msg.from);
      
    }

    if (existsDB(msg.from) && (msg.body === '2') && readFlow(msg.from) === 'step04' && readId(msg.from) !== JSON.stringify(msg.id.id)&& readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {
      
        updateInteract(msg.from, 'typing');
        updateId(msg.from, JSON.stringify(msg.id.id));
        if(!msg.hasMedia){
        updatePlano(msg.from, msg.body);}
        if(msg.hasMedia){
        updateTipo(msg.from, 'Enviou audio');}        
        const chat = await msg.getChat();
        chat.sendSeen();
        await delay(2000); //Delay de 2 segundos             
        const plano2 = MessageMedia.fromFilePath('./plano2.jpeg'); // arquivo em imagem
        await client.sendMessage(msg.from, plano2, {caption: 'O mais pedido!'}); //Enviando a imagem
        await delay(4000); //Delay de 4 segundos
        await client.sendMessage(msg.from, `*FORMAS DE PAGAMENTO*:\n\n📄 BOLETO à vista\n❖ PIX à vista\n💳CARTÃO (Parcelamento em até 12x)\n\n*Clique no link abaixo* e garanta hoje mesmo o seu *Tratamento de 5 Meses + Frete Grátis*:\n${frasco5}\n\nDigite o número correspondente a opção desejada\n*1.* ❖ COMO PAGAR NO PIX\n*2.* 💳 COMO PAGAR NO CARTÃO\n*3.* 📄 COMO PAGAR NO BOLETO`);
        updateFlow(msg.from,'stepPlano');
        updateInteract(msg.from, 'done');
        salvarNoJSON('superfluxozPlano.json',msg.from);
      
    }

    if (existsDB(msg.from) && (msg.body === '3') && readFlow(msg.from) === 'step04' && readId(msg.from) !== JSON.stringify(msg.id.id)&& readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {
     
        updateInteract(msg.from, 'typing');
        updateId(msg.from, JSON.stringify(msg.id.id));
        if(!msg.hasMedia){
        updatePlano(msg.from, msg.body);}
        if(msg.hasMedia){
        updateTipo(msg.from, 'Enviou audio');}        
        const chat = await msg.getChat();
        chat.sendSeen();
        await delay(2000); //Delay de 2 segundos             
        const plano3 = MessageMedia.fromFilePath('./plano3.jpeg'); // arquivo em imagem
        await client.sendMessage(msg.from, plano3, {caption: 'Excelente decisão'}); //Enviando a imagem        
        await delay(4000); //Delay de 4 segundos
        await client.sendMessage(msg.from, `*FORMAS DE PAGAMENTO*:\n\n📄 BOLETO à vista\n❖ PIX à vista\n💳CARTÃO (Parcelamento em até 12x)\n\n*Clique no link abaixo* e garanta hoje mesmo o seu *Tratamento de 3 Meses + Frete Grátis*:\n${frasco3}\n\nDigite o número correspondente a opção desejada\n*1.* ❖ COMO PAGAR NO PIX\n*2.* 💳 COMO PAGAR NO CARTÃO\n*3.* 📄 COMO PAGAR NO BOLETO`);
        updateFlow(msg.from,'stepPlano');
        updateInteract(msg.from, 'done');
        salvarNoJSON('superfluxozPlano.json',msg.from);
      
    }

    //Final dos Blocos de Escolha do produto

    //Blocos de escolha da Forma de Pagamento

    if (existsDB(msg.from) && (msg.body === '1') && readFlow(msg.from) === 'stepPlano' && readId(msg.from) !== JSON.stringify(msg.id.id)&& readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {
      
        updateInteract(msg.from, 'typing');
        updateId(msg.from, JSON.stringify(msg.id.id));
        if(!msg.hasMedia){
        updatePagamento(msg.from, msg.body);}
        if(msg.hasMedia){
        updatePagamento(msg.from, 'Enviou audio');}        
        const chat = await msg.getChat();
        chat.sendSeen();
        await chat.sendStateTyping(); //Simulando digitação
        await delay(4000); //Delay de 2 segundos
        const plano = readPlano(msg.from);
        await client.sendMessage(msg.from, `Perfeito! Para fazer seu pedido do *tratamento de ${(() => {
            const plano = readPlano(msg.from);
            switch (plano) {
              case '1':
                return '10 meses';
              case '2':
                return '5 meses';
              case '3':
                return '3 meses';
              default:
                return ''; // Caso o valor não seja 1, 2 ou 3.
            }
          })()}* através do Pix é muito simples.`);
        await delay(5000); //Delay de 2 segundos        
        await client.sendMessage(msg.from, `Basta você acessar o site oficial pelo link que te enviei aqui logo acima. Logo após abrir o site, siga o passo a passo do vídeo abaixo. Você poderá solicitar minha ajuda no momento da compra.`); // enviando o audio04
        await delay(6000); //Delay de 3 segundos
        const vid_03 = MessageMedia.fromFilePath('./vid03_comocomprar.mp4'); // arquivo do video
        await client.sendMessage(msg.from, vid_03, { caption: 'É muito fácil fazer o pagamento, o video acima mostra como' });
        await delay(5000); //Delay de 2 segundos
        await client.sendMessage(msg.from, `${(() => {
            const plano = readPlano(msg.from);
            switch (plano) {
              case '1':
                return `${frasco10}`;
              case '2':
                return `${frasco5}`;
              case '3':
                return `${frasco3}`;
              default:
                return ''; // Caso o valor não seja 1, 2 ou 3.
            }
          })()}`);
        await delay(60000); //Delay de 2 segundos
        await client.sendMessage(msg.from, `*Você quer que eu gere o Pix para você agora? Ou você conseguiu gerar sem a minha ajuda?*\n\nDigite o número correspondente a opção desejada\n\n*1.* EU CONSIGO GERAR\n*2.* PRECISO DE AJUDA`);
        updateFlow(msg.from,'stepPagamento');
        updateInteract(msg.from, 'done');
        salvarNoJSON('superfluxozPix.json',msg.from);
      
    }

    if (existsDB(msg.from) && (msg.body === '2') && readFlow(msg.from) === 'stepPlano' && readId(msg.from) !== JSON.stringify(msg.id.id)&& readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {
      
        updateInteract(msg.from, 'typing');
        updateId(msg.from, JSON.stringify(msg.id.id));
        if(!msg.hasMedia){
        updatePagamento(msg.from, msg.body);}
        if(msg.hasMedia){
        updatePagamento(msg.from, 'Enviou audio');}        
        const chat = await msg.getChat();
        chat.sendSeen();
        await chat.sendStateTyping(); //Simulando digitação
        await delay(4000); //Delay de 2 segundos        
        await client.sendMessage(msg.from, `Perfeito! Para fazer seu pedido do *tratamento de ${(() => {
            const plano = readPlano(msg.from);
            switch (plano) {
              case '1':
                return '10 meses';
              case '2':
                return '5 meses';
              case '3':
                return '3 meses';
              default:
                return ''; // Caso o valor não seja 1, 2 ou 3.
            }
          })()}* através do Cartão é muito simples.`);
        await delay(5000); //Delay de 2 segundos        
        await client.sendMessage(msg.from, `Basta você acessar o site oficial pelo link que te enviei aqui logo acima. Logo após abrir o site, siga o passo a passo do vídeo abaixo. Você poderá solicitar minha ajuda no momento da compra.`); // enviando o audio04
        await delay(6000); //Delay de 3 segundos
        const vid_03 = MessageMedia.fromFilePath('./vid03_comocomprar.mp4'); // arquivo do video
        await client.sendMessage(msg.from, vid_03, { caption: 'É muito fácil fazer o pagamento, o video acima mostra como' });
        await delay(5000); //Delay de 2 segundos  
        await client.sendMessage(msg.from, `${(() => {
            const plano = readPlano(msg.from);
            switch (plano) {
              case '1':
                return `${frasco10}`;
              case '2':
                return `${frasco5}`;
              case '3':
                return `${frasco3}`;
              default:
                return ''; // Caso o valor não seja 1, 2 ou 3.
            }
          })()}`);
        await delay(60000); //Delay de 2 segundos
        await client.sendMessage(msg.from, `*Você quer que eu te ajude no pagamento por cartão? Ou você conseguiu sem a minha ajuda?*\n\nDigite o número correspondente a opção desejada\n\n*1.* EU CONSIGO PAGAR\n*2.* PRECISO DE AJUDA`);
        updateFlow(msg.from,'stepPagamento');
        updateInteract(msg.from, 'done');
        salvarNoJSON('superfluxozCartao.json',msg.from);
     
    }

    if (existsDB(msg.from) && (msg.body === '3') && readFlow(msg.from) === 'stepPlano' && readId(msg.from) !== JSON.stringify(msg.id.id)&& readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {
      
        updateInteract(msg.from, 'typing');
        updateId(msg.from, JSON.stringify(msg.id.id));
        if(!msg.hasMedia){
        updatePagamento(msg.from, msg.body);}
        if(msg.hasMedia){
        updatePagamento(msg.from, 'Enviou audio');}        
        const chat = await msg.getChat();
        chat.sendSeen();
        await chat.sendStateTyping(); //Simulando digitação
        await delay(4000); //Delay de 2 segundos        
        await client.sendMessage(msg.from, `Perfeito! Para fazer seu pedido do *tratamento de ${(() => {
            const plano = readPlano(msg.from);
            switch (plano) {
              case '1':
                return '10 meses';
              case '2':
                return '5 meses';
              case '3':
                return '3 meses';
              default:
                return ''; // Caso o valor não seja 1, 2 ou 3.
            }
          })()}* através de Boleto é muito simples.`);
        await delay(5000); //Delay de 2 segundos        
        await client.sendMessage(msg.from, `Basta você acessar o site oficial pelo link que te enviei aqui logo acima. Logo após abrir o site, siga o passo a passo do vídeo abaixo. Você poderá solicitar minha ajuda no momento da compra.`); // enviando o audio04
        await delay(6000); //Delay de 3 segundos
        const vid_03 = MessageMedia.fromFilePath('./vid03_comocomprar.mp4'); // arquivo do video
        await client.sendMessage(msg.from, vid_03, { caption: 'É muito fácil fazer o pagamento, o video acima mostra como' });
        await delay(5000); //Delay de 2 segundos    
        await client.sendMessage(msg.from, `${(() => {
            const plano = readPlano(msg.from);
            switch (plano) {
              case '1':
                return `${frasco10}`;
              case '2':
                return `${frasco5}`;
              case '3':
                return `${frasco3}`;
              default:
                return ''; // Caso o valor não seja 1, 2 ou 3.
            }
          })()}`);
        await delay(60000); //Delay de 2 segundos
        await client.sendMessage(msg.from, `*Você quer que eu gere o Boleto para você agora? Ou você conseguiu gerar sem a minha ajuda?*\n\nDigite o número correspondente a opção desejada\n\n*1.* EU CONSIGO GERAR\n*2.* PRECISO DE AJUDA`);
        updateFlow(msg.from,'stepPagamento');
        updateInteract(msg.from, 'done');
        salvarNoJSON('superfluxozBoleto.json',msg.from);
     
    }

    //Final dos Blocos de escolha da Forma de Pagamento

    //Blocos de ajuda ao lead

    if (existsDB(msg.from) && (msg.body === '1') && readFlow(msg.from) === 'stepPagamento' && readId(msg.from) !== JSON.stringify(msg.id.id)&& readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {
     
        updateInteract(msg.from, 'typing');
        updateId(msg.from, JSON.stringify(msg.id.id));               
        const chat = await msg.getChat();
        chat.sendSeen();
        await chat.sendStateTyping(); //Simulando digitação
        await delay(3000); //Delay de 2 segundos        
        await client.sendMessage(msg.from, `OK, estarei aqui para te ajudar caso tenha dúvidas no pagamento! �`);
        await delay(4000); //Delay de 2 segundos        
        await client.sendMessage(msg.from, `🔴 Preciso te passar um recado do laboratório 👇`);
        await delay(15000); //Delay de 2 segundos        
        const bvid_02 = MessageMedia.fromFilePath('./bvid02.mp4'); // arquivo do video
        await client.sendMessage(msg.from, bvid_02, { caption: 'Compre o Gotavita apenas de fonte oficial, não deixe que te enganem.'});
        updateFlow(msg.from,'stepEncerra');
        updateInteract(msg.from, 'done');
        salvarNoJSON('superfluxozEncerra.json',msg.from);

        setTimeout(() => {
          if (readFlow(msg.from) === 'stepEncerra') {
            client.sendMessage(msg.from, `Clique no link abaixo para entrar no Grupo Exclusivo.\n\n${grupoInvite}`);
            }
        }, 6*1000*60); //6 minutos
           
    }

    if (existsDB(msg.from) && (msg.body === '2') && readFlow(msg.from) === 'stepPagamento' && readId(msg.from) !== JSON.stringify(msg.id.id)&& readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {
      
        updateInteract(msg.from, 'typing');
        updateId(msg.from, JSON.stringify(msg.id.id));               
        const chat = await msg.getChat();
        chat.sendSeen();
        await chat.sendStateTyping(); //Simulando digitação
        await delay(4000); //Delay de 2 segundos        
        await client.sendMessage(msg.from, `✅ Ok, um momento, já já entrarei em contato para te ajudar com o pagamento`);
        await delay(5000); //Delay de 2 segundos        
        await client.sendMessage(msg.from, `Estou finalizando um atendimento e já venho te ajudar, agradeço imensamente pela compreensão. Peço que mantenha a sua atenção no WhatsApp, pois em alguns minutos venho para dar continuidade no seu atendimento.`); // enviando o audio04
        await delay(6000); //Delay de 3 segundos
        await client.sendMessage(msg.from, `🤝 Por favor, informe-me os seguintes dados para que eu possa gerar para você:

        - Nome completo
        - CPF
        - Nome da rua
        - Bairro
        - Número da residência
        - CEP
        
        Pedimos o seu CPF para incluí-lo no seu pedido, caso você precise retirá-lo nos Correios.`);
        await delay(3000); //Delay de 2 segundos
        await client.sendMessage(msg.from, `✅ Basta aguardar, já já venho te ajudar aqui no WhatsApp.`);
        updateFlow(msg.from,'stepEncerra');
        updateInteract(msg.from, 'done');
        salvarNoJSON('superfluxozEncerra.json',msg.from);

        setTimeout(() => {
          if (readFlow(msg.from) === 'stepEncerra') {
            client.sendMessage(msg.from, `Clique no link abaixo para entrar no Grupo Exclusivo.\n\n${grupoInvite}`);
            }
        }, 6*1000*60); //6 minutos

        /*const timeUntilWakeUp = 6 * 1000 * 60; // 4 minutos
        await new Promise(resolve => setTimeout(resolve, timeUntilWakeUp));
        if (readFlow(msg.from) === 'stepPagamento') {
          await client.sendMessage(msg.from, `🔴 Preciso te passar um recado do laboratório 👇`);
          await delay(15000); //Delay de 2 segundos
          const audiob08 = MessageMedia.fromFilePath('./b08.opus'); // Arquivo de audio em opus gravado
          await client.sendMessage(msg.from, audiob08, {sendAudioAsVoice: true}); // enviando o audio03-01
          await delay(4000); //Delay de 2 segundos
          const bvid_02 = MessageMedia.fromFilePath('./bvid02.mp4'); // arquivo do video
          await client.sendMessage(msg.from, bvid_02, { caption: 'Compre o Gotavita apenas de fonte oficial, não deixe que te enganem.'});
          }*/
       
    }

//Final dos Blocos de ajuda ao lead

//Blocos de Pitch Remarketing

if ((msg.body === '1') && existsDB(msg.from) && (msg.body !== null) && (readFlow(msg.from) === 'step02rmkt' || readFlow(msg.from) === 'step03rmkt01' || readFlow(msg.from) === 'step10rmkt' || readFlow(msg.from) === 'step15rmkt') && readId(msg.from) !== JSON.stringify(msg.id.id) && readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {
  updateInteract(msg.from, 'typing');
  updateId(msg.from, JSON.stringify(msg.id.id));
  if(!msg.hasMedia){
  updateEstado(msg.from, msg.body);}
  if(msg.hasMedia){
  updateEstado(msg.from, 'Enviou audio');}
  const chat = await msg.getChat();
  chat.sendSeen();
  await delay(10000); //Delay de 10 segundos
  await chat.sendStateTyping(); //Simulando digitação
  await client.sendMessage(msg.from, '🚨 *URGENTE!!* 🚨\n\nVerifiquei aqui no meu estoque e consegui separar o seu *medidor de glicemia*, está uma loucura aqui e não sei por quanto tempo vou conseguir segurar o seu *brinde + frete grátis*.\n\nTem que ser rápido para não perder, abaixo dou as opções de tratamento.');
  await delay(3000); //Delay de 1 minuto
  await client.sendMessage(msg.from, '📦 *Frete grátis hoje*.\n\n👇 *Digite o número correspondente a opção desejada*');
  await delay(2000); //Delay de 1 minuto
  await client.sendMessage(msg.from, '✅ PAGUE 8 FRASCOS E LEVE 10 por apenas 12x de 59,94R$\n*DIGITE 1* (mais vantajoso)\n\n✅ PAGUE 4 FRASCOS E LEVE 5 por apenas 12x de 39,86R$\n*DIGITE 2*\n\n✅ PAGUE 2 FRASCOS E LEVE 3 por apenas 12x de 29,82R$\n*DIGITE 3*');
  updateFlow(msg.from,'step04');
  updateInteract(msg.from, 'done');
  salvarNoJSON('superfluxoz04.json',msg.from);

  /*const timeUntilWakeUp = 6 * 1000 * 60; // 4 minutos
  await new Promise(resolve => setTimeout(resolve, timeUntilWakeUp));   

  if (readFlow(msg.from).startsWith('stepRmkt')) {
      await delay(1000); //delay de 2 segundos
      await client.sendMessage(msg.from, 'Vamos começar o tratamento?');                 
    }*/

}

if ((msg.body === '2') && existsDB(msg.from) && (msg.body !== null) && (readFlow(msg.from) === 'step02rmkt' || readFlow(msg.from) === 'step03rmkt01' || readFlow(msg.from) === 'step10rmkt' || readFlow(msg.from) === 'step15rmkt') && readId(msg.from) !== JSON.stringify(msg.id.id) && readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {
 
  updateInteract(msg.from, 'typing');
  updateId(msg.from, JSON.stringify(msg.id.id));
  if(!msg.hasMedia){
  updateEstado(msg.from, msg.body);}
  if(msg.hasMedia){
  updateEstado(msg.from, 'Enviou audio');}
  const chat = await msg.getChat();
  chat.sendSeen();
  await delay(10000); //Delay de 10 segundos
  await chat.sendStateTyping(); //Simulando digitação
  await client.sendMessage(msg.from, `👍 Pronto, não vou mais te mandar mensagens por aqui.
  
  E para me desculpar, estou te mandando um e-book completo Protocolo Antidiabético, ok?`);
  await delay(3000); //Delay de 1 minuto
  await client.sendMessage(msg.from, MessageMedia.fromFilePath('Protocolo_Antidiabetico.pdf'));
  await delay(3000); //Delay de 1 minuto
  await client.sendMessage(msg.from, '99_alimentos.pdf');
  await delay(2000); //Delay de 1 minuto
  await client.sendMessage(msg.from, `🎁 Posso te adicionar no grupo onde constantemente envio livros, conteúdos e alguns presentinhos?
  
  Digite o número correspondente a opção desejada:
  
  1. ✅ Sim! Quero receber os presentes!
  2. ❌ Não! Muito obrigado!`);
  updateFlow(msg.from,'stepExit');
  updateInteract(msg.from, 'done');
  salvarNoJSON('superfluxoz04.json',msg.from);
  
  /*const timeUntilWakeUp = 6 * 1000 * 60; // 4 minutos
  await new Promise(resolve => setTimeout(resolve, timeUntilWakeUp));   
  
  if (readFlow(msg.from).startsWith('stepRmkt')) {
    await delay(1000); //delay de 2 segundos
    await client.sendMessage(msg.from, 'Vamos começar o tratamento?');                 
  }*/  
  
}

//Sequencia Exit

if ((msg.body === '1') && existsDB(msg.from) && (msg.body !== null) && readFlow(msg.from).startsWith('stepExit') && readId(msg.from) !== JSON.stringify(msg.id.id) && readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {
  
  updateInteract(msg.from, 'typing');
  updateId(msg.from, JSON.stringify(msg.id.id));
  if(!msg.hasMedia){
  updateEstado(msg.from, msg.body);}
  if(msg.hasMedia){
  updateEstado(msg.from, 'Enviou audio');}
  const chat = await msg.getChat();
  chat.sendSeen();
  await delay(3000); //Delay de 10 segundos
  await chat.sendStateTyping(); //Simulando digitação
  await client.sendMessage(msg.from, `Excelente!
  
  Entre no grupo:
  ${grupoInvite}
  
  Estou esperando por você, abraços`);
  updateFlow(msg.from,'stepExitConvite');
  updateInteract(msg.from, 'done');
  salvarNoJSON('superfluxoz04.json',msg.from);

  /*const timeUntilWakeUp = 6 * 1000 * 60; // 4 minutos
  await new Promise(resolve => setTimeout(resolve, timeUntilWakeUp));   

  if (readFlow(msg.from).startsWith('stepRmkt')) {
      await delay(1000); //delay de 2 segundos
      await client.sendMessage(msg.from, 'Vamos começar o tratamento?');                 
    }*/
}

if ((msg.body === '2') && existsDB(msg.from) && (msg.body !== null) && readFlow(msg.from).startsWith('stepExit') && readId(msg.from) !== JSON.stringify(msg.id.id) && readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {

updateInteract(msg.from, 'typing');
updateId(msg.from, JSON.stringify(msg.id.id));
if(!msg.hasMedia){
updateEstado(msg.from, msg.body);}
if(msg.hasMedia){
updateEstado(msg.from, 'Enviou audio');}
const chat = await msg.getChat();
chat.sendSeen();
await delay(5000); //Delay de 10 segundos
await chat.sendStateTyping(); //Simulando digitação
await client.sendMessage(msg.from, `É isso! Abraços e sucesso, tchau`);
updateFlow(msg.from,'stepExitExit');
updateInteract(msg.from, 'done');
salvarNoJSON('superfluxoz04.json',msg.from);

/*const timeUntilWakeUp = 6 * 1000 * 60; // 4 minutos
await new Promise(resolve => setTimeout(resolve, timeUntilWakeUp));   

if (readFlow(msg.from).startsWith('stepRmkt')) {
  await delay(1000); //delay de 2 segundos
  await client.sendMessage(msg.from, 'Vamos começar o tratamento?');                 
}*/

}

//Follow ups 03 rmkt

if ((msg.body === '1') && existsDB(msg.from) && (msg.body !== null) && readFlow(msg.from) === 'step03rmkt' && readId(msg.from) !== JSON.stringify(msg.id.id) && readInteract(msg.from) === 'done' && msg.from.endsWith('@c.us')) {
    
    updateInteract(msg.from, 'typing');
    updateId(msg.from, JSON.stringify(msg.id.id));
    if(!msg.hasMedia){
    updateEstado(msg.from, msg.body);}
    if(msg.hasMedia){
    updateEstado(msg.from, 'Enviou audio');}
    const chat = await msg.getChat();
    chat.sendSeen();
    await delay(3000); //Delay de 10 segundos
    await chat.sendStateTyping(); //Simulando digitação
    await client.sendMessage(msg.from, MessageMedia.fromFilePath('99_alimentos.pdf'));
    await delay(3000); //Delay de 1 minuto
    await client.sendMessage(msg.from, 'Depois me diz o que achou. 😊');
    await delay(2000); //Delay de 1 minuto       
    const v03rmkt = MessageMedia.fromFilePath('./v03rmkt.mp4'); // arquivo do video
    await client.sendMessage(numero, v03rmkt);
    await delay(2000); //delay de 3 segundos
    await client.sendMessage(msg.from, 'Olha só o recado de dona vilma....');
    await delay(2000); //delay de 3 segundos
    const a05rmkt = MessageMedia.fromFilePath('./a05rmkt.opus'); // Arquivo de audio em ogg gravado
    await client.sendMessage(msg.from, a05rmkt, {sendAudioAsVoice: true}); // enviando o audio16
    await delay(2000); //delay de 3 segundos
    await client.sendMessage(msg.from, `Compre direto do laboratório com 90 dias de GARANTIA + FRETE GRÁTIS

Digite o número correspondente a opção desejada
    
1. ✅ OFERTAS DE HOJE
2. 🛑 NÃO QUERO MAIS`);
    updateFlow(msg.from,'step03rmkt01');
    updateInteract(msg.from, 'done');
    salvarNoJSON('superfluxoz04.json',msg.from);

    /*const timeUntilWakeUp = 6 * 1000 * 60; // 4 minutos
    await new Promise(resolve => setTimeout(resolve, timeUntilWakeUp));   

    if (readFlow(msg.from).startsWith('stepRmkt')) {
        await delay(1000); //delay de 2 segundos
        await client.sendMessage(msg.from, 'Vamos começar o tratamento?');                 
      }*/
}

//
  
});

// Central de Controle Super Fluxo

function formatarContato(numero, prefixo) {
    const regex = new RegExp(`^${prefixo}(\\d+)`);
    const match = numero.match(regex);
  
    if (match && match[1]) {
      const digits = match[1];
      return `55${digits}@c.us`;
    }
  
    return numero;
  }
  
function getRandomDelay(minDelay, maxDelay) {
    const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
    return Math.floor(randomDelay);
}

function extrairNomeArquivo(str, posicao) {
    const partes = str.split(' ');
    if (posicao >= 0 && posicao < partes.length) {
      return partes[posicao];
    }
    return null;
}
  
function extrairContatos(leadsTopo, leadsFundo, quantidade) {
    if (leadsFundo === null) {
      return leadsTopo.slice(0, quantidade).map(objeto => objeto.numeroId);
    }
  
    const contatos = leadsTopo
      .filter(contato => !leadsFundo.includes(contato))
      .slice(0, quantidade)
      .map(objeto => objeto.numeroId);
    return contatos;
}
  
async function obterUltimaMensagem(contato) {
    const chat = await client.getChatById(contato);
    const mensagens = await chat.fetchMessages({ limit: 1 });
  
    if (mensagens.length > 0) {
      const ultimaMensagem = mensagens[mensagens.length - 1];
      return ultimaMensagem.body;
    }
  
    return "Nenhuma mensagem encontrada";
}  
  
async function escutarGrupos() {
    const chats = await client.getChats();
    const contatos = [];
  
    for (let i = 0; i < chats.length; i++) {
      const chat = chats[i];
      if (!chat.isGroup) continue; // Ignora contatos individuais
  
      const contato = chat.id._serialized;
      const ultimaMensagem = await obterUltimaMensagem(contato);
  
      contatos.push({ contato, ultimaMensagem });
    }
  
    return contatos;
}
  
async function extrairGrupo(grupoId) {
    const chat = await client.getChatById(grupoId);
    const contatos = [];
  
    chat.participants.forEach(participant => {
      if (!participant.isMe) {
        contatos.push(participant.id._serialized);
      }
    });
  
    return contatos;
}  
 
client.on('message_create', async (msg) => {
  
    //Instruções da Central de Controle
    if (msg.fromMe && msg.body.startsWith('!help') && msg.to === msg.from) {  
      try {  
      await client.sendMessage(msg.from, `*Sistema de Controle SuperFluxo Gotavita v1.0*\n\n*Atendimento Humano*\nMétodo Direto: "Em que posso ajudar?"\nMétodo Indireto: "!humano xxyyyyyyyyy"\n\n*Adicionar Lead a Base*\n"Este é um fantástico primeiro passo."\n\n*Constar pagamento e retirar do rmkt*\n"Processamos seu pagamento!"\n\n*Kit Pague 8 leve 10*\n"Tratamento completo, pague 8 e leve 10"\n\n*Kit pague 4 e leve 5*\n"Tratamento, pague 4 e leve 5"\n\n*Kit pague 2 e leve 3*\n"Tratamento, pague 2 e leve 3"\n\n*Pagamento via Pix*\n"Pagamento via Pix, né!"\n\n*Pagamento via Cartao*\n"Pagamento via Cartão, né!"\n\n*Pagamento via Boleto*\n"Pagamento via Boleto, né!"\n\n*Adicionar manualmente a todos os Remarketing*\nNovos leads são adicionados no automático, use apenas caso tenha reinicado o fluxo.\nEnvie para VOCE MESMO:\n!rmkt 11988776655\n\n*Adicionar manualmente um Remarketing específico*\nNovos leads são adicionados no automático, use apenas caso tenha reiniciado o fluxo.\nEnvie para VOCE MESMO:\n!01rmkt 11988776655\nRemarketings possíveis: 01, 02, 03, 06, 10, 15, 17`);
    } catch (error) {
      handleAsyncError(error);
    }
    }

    //Adicionar manualmente ao Rmkt Dia 17
    if (msg.fromMe && msg.body.startsWith('!17rmkt ') && msg.to === msg.from) {
      try {
      let contato = formatarContato(msg.body,'!17rmkt ');
      if(existsDB(contato)){
        updateFlowRmkt(contato, 'stepRmkt');
        //agendarExecucaoEmDias(1, contato, blocoRmkt01);
        //agendarExecucaoEmDias(2, contato, blocoRmkt02);
        //agendarExecucaoEmDias(3, contato, blocoRmkt03);
        //agendarExecucaoEmDias(6, contato, blocoRmkt06);
        //agendarExecucaoEmDias(10, contato, blocoRmkt10);
        //agendarExecucaoEmDias(15, contato, blocoRmkt15);
        agendarExecucaoEmDias(17, contato, blocoRmkt30);
      }
      await client.sendMessage(msg.from, `Adicionei manualmente ao Remarketing 17 o numero: ${contato}`);
    } catch (error) {
      handleAsyncError(error);
    }
    }

    //Adicionar manualmente ao Rmkt Dia 15
    if (msg.fromMe && msg.body.startsWith('!15rmkt ') && msg.to === msg.from) {
      try {
      let contato = formatarContato(msg.body,'!15rmkt ');
      if(existsDB(contato)){
        updateFlowRmkt(contato, 'stepRmkt');
        //agendarExecucaoEmDias(1, contato, blocoRmkt01);
        //agendarExecucaoEmDias(2, contato, blocoRmkt02);
        //agendarExecucaoEmDias(3, contato, blocoRmkt03);
        //agendarExecucaoEmDias(6, contato, blocoRmkt06);
        //agendarExecucaoEmDias(10, contato, blocoRmkt10);
        agendarExecucaoEmDias(15, contato, blocoRmkt15);
        //agendarExecucaoEmDias(17, contato, blocoRmkt30);
      }
      await client.sendMessage(msg.from, `Adicionei manualmente ao Remarketing 15 o numero: ${contato}`);
    } catch (error) {
      handleAsyncError(error);
    }
    }

    //Adicionar manualmente ao Rmkt Dia 10
    if (msg.fromMe && msg.body.startsWith('!10rmkt ') && msg.to === msg.from) {
      try {
      let contato = formatarContato(msg.body,'!10rmkt ');
      if(existsDB(contato)){
        updateFlowRmkt(contato, 'stepRmkt');
        //agendarExecucaoEmDias(1, contato, blocoRmkt01);
        //agendarExecucaoEmDias(2, contato, blocoRmkt02);
        //agendarExecucaoEmDias(3, contato, blocoRmkt03);
        //agendarExecucaoEmDias(6, contato, blocoRmkt06);
        agendarExecucaoEmDias(10, contato, blocoRmkt10);
        /*agendarExecucaoEmDias(15, contato, blocoRmkt15);
        agendarExecucaoEmDias(17, contato, blocoRmkt30);*/
      }
      await client.sendMessage(msg.from, `Adicionei manualmente ao Remarketing 10 o numero: ${contato}`);
    } catch (error) {
      handleAsyncError(error);
    }
    }

    //Adicionar manualmente ao Rmkt Dia 06
    if (msg.fromMe && msg.body.startsWith('!06rmkt ') && msg.to === msg.from) {
      try {
      let contato = formatarContato(msg.body,'!06rmkt ');
      if(existsDB(contato)){
        updateFlowRmkt(contato, 'stepRmkt');
        //agendarExecucaoEmDias(1, contato, blocoRmkt01);
        //agendarExecucaoEmDias(2, contato, blocoRmkt02);
        //agendarExecucaoEmDias(3, contato, blocoRmkt03);
        agendarExecucaoEmDias(6, contato, blocoRmkt06);
        /*agendarExecucaoEmDias(10, contato, blocoRmkt10);
        agendarExecucaoEmDias(15, contato, blocoRmkt15);
        agendarExecucaoEmDias(17, contato, blocoRmkt30);*/
      }
      await client.sendMessage(msg.from, `Adicionei manualmente ao Remarketing 06 o numero: ${contato}`);
    } catch (error) {
      handleAsyncError(error);
    }
    }

    //Adicionar manualmente ao Rmkt Dia 03
    if (msg.fromMe && msg.body.startsWith('!03rmkt ') && msg.to === msg.from) {
      try {
      let contato = formatarContato(msg.body,'!03rmkt ');
      if(existsDB(contato)){
        updateFlowRmkt(contato, 'stepRmkt');
        //agendarExecucaoEmDias(1, contato, blocoRmkt01);
        //agendarExecucaoEmDias(2, contato, blocoRmkt02);
        agendarExecucaoEmDias(3, contato, blocoRmkt03);
        /*agendarExecucaoEmDias(6, contato, blocoRmkt06);
        agendarExecucaoEmDias(10, contato, blocoRmkt10);
        agendarExecucaoEmDias(15, contato, blocoRmkt15);
        agendarExecucaoEmDias(17, contato, blocoRmkt30);*/
      }
      await client.sendMessage(msg.from, `Adicionei manualmente ao Remarketing 03 o numero: ${contato}`);
    } catch (error) {
      handleAsyncError(error);
    }
    }

    //Adicionar manualmente ao Rmkt Dia 02
    if (msg.fromMe && msg.body.startsWith('!02rmkt ') && msg.to === msg.from) {
      try {
      let contato = formatarContato(msg.body,'!02rmkt ');
      if(existsDB(contato)){
        updateFlowRmkt(contato, 'stepRmkt');
        //agendarExecucaoEmDias(1, contato, blocoRmkt01);
        agendarExecucaoEmDias(2, contato, blocoRmkt02);
        /*agendarExecucaoEmDias(3, contato, blocoRmkt03);
        agendarExecucaoEmDias(6, contato, blocoRmkt06);
        agendarExecucaoEmDias(10, contato, blocoRmkt10);
        agendarExecucaoEmDias(15, contato, blocoRmkt15);
        agendarExecucaoEmDias(17, contato, blocoRmkt30);*/
      }
      await client.sendMessage(msg.from, `Adicionei manualmente ao Remarketing 02 o numero: ${contato}`);
    } catch (error) {
      handleAsyncError(error);
    }
    }

    //Adicionar manualmente ao Rmkt Dia 01
    if (msg.fromMe && msg.body.startsWith('!01rmkt ') && msg.to === msg.from) {
      try {
      let contato = formatarContato(msg.body,'!01rmkt ');
      if(existsDB(contato)){
        updateFlowRmkt(contato, 'stepRmkt');
        agendarExecucaoEmDias(1, contato, blocoRmkt01);
        /*agendarExecucaoEmDias(2, contato, blocoRmkt02);
        agendarExecucaoEmDias(3, contato, blocoRmkt03);
        agendarExecucaoEmDias(6, contato, blocoRmkt06);
        agendarExecucaoEmDias(10, contato, blocoRmkt10);
        agendarExecucaoEmDias(15, contato, blocoRmkt15);
        agendarExecucaoEmDias(17, contato, blocoRmkt30);*/
      }
      await client.sendMessage(msg.from, `Adicionei manualmente ao Remarketing 01 o numero: ${contato}`);
    } catch (error) {
      handleAsyncError(error);
    }
    }  

    //Adicionar manualmente ao Rmkt
    if (msg.fromMe && msg.body.startsWith('!rmkt ') && msg.to === msg.from) {
      try {
      let contato = formatarContato(msg.body,'!rmkt ');
      if(existsDB(contato)){
        updateFlowRmkt(contato, 'stepRmkt');
        agendarExecucaoEmDias(1, contato, blocoRmkt01);
        agendarExecucaoEmDias(2, contato, blocoRmkt02);
        agendarExecucaoEmDias(3, contato, blocoRmkt03);
        agendarExecucaoEmDias(6, contato, blocoRmkt06);
        agendarExecucaoEmDias(10, contato, blocoRmkt10);
        agendarExecucaoEmDias(15, contato, blocoRmkt15);
        agendarExecucaoEmDias(17, contato, blocoRmkt30);
      }
      await client.sendMessage(msg.from, `Adicionei manualmente ao Remarketing o numero: ${contato}`);
    } catch (error) {
      handleAsyncError(error);
    }
    }
  
    //Deletar um contato da Base de Dados (Atendimento Humano)
    if (msg.fromMe && msg.body.startsWith('!humano ') && msg.to === msg.from) {
      try {
      let contato = formatarContato(msg.body,'!humano ');
      if(existsDB(contato)){
      deleteObject(contato);}
      await client.sendMessage(msg.from, `Deletei da Base de Dados o numero: ${contato}`);
    } catch (error) {
      handleAsyncError(error);
    }
    }
    
    //Deletar um contato da Base de Dados Método Direto (Atendimento Humano)
    if (msg.fromMe && msg.body === 'Em que posso ajudar?' && msg.to !== msg.from) {
      try {
      if(existsDB(msg.to)){
        deleteObject(msg.to);}
        await client.sendMessage(msg.from, `Deletei da Base de Dados o numero: ${msg.to}`);
      } catch (error) {
        handleAsyncError(error);
      }
    }
  
    //Adicionar um contato na base de dados (Método Direto)
    if (msg.fromMe && msg.body === 'Este é um fantástico primeiro passo.' && msg.to !== msg.from) {
      try {
      if(await !existsDB(msg.to)){

        await client.sendMessage(msg.to, `🥑 Bom dia, tudo bem? Meu nome é *Renato Augusto*, sou *Especialista Autorizado do GotaVita!*

        A partir de agora vou fazer *o seu atendimento* ok. 👍`);                
                await delay(6000); //Delay de 3000 milisegundos mais conhecido como 2 segundos        
                await client.sendMessage(msg.to, `🚨 Mas antes, queria *te convidar* para entrar no *Grupo Exclusivo* que criamos, onde fazemos sorteios de *Brindes* toda semana, como:
        
        ✅ *Kit Medidor de Glicemia*
        ✅ *Caixas com Fitas Medidoras de Glicemia*
        ✅ *Creme para os Pés de Diabético*
        🔖 *e muito mais ...*`);
                await delay(2000); //Delay de 3000 milisegundos mais conhecido como 2 segundos        
                await client.sendMessage(msg.to, `⤵️Para participar do Grupo, basta clicar no link abaixo!
        
        ${grupoInvite}`);
      await delay(2000); //delay de 3 segundos        
      const audiob01 = MessageMedia.fromFilePath('./b01.opus'); // Arquivo de audio em ogg gravado
      await client.sendMessage(msg.to, audiob01, {sendAudioAsVoice: true}); // enviando o audio16
      await delay(5000); //delay de 3 segundos   
      const audiob02 = MessageMedia.fromFilePath('./b02.opus'); // Arquivo de audio em ogg gravado
      await client.sendMessage(msg.to, audiob02, {sendAudioAsVoice: true}); // enviando o audio17        
      addObject(msg.to, 'step00', JSON.stringify(msg.id.id), 'done', null, null, null, null, null, null, 50);
      salvarNoJSON('superfluxoz00.json',msg.to);

      agendarExecucaoEmDias(1, msg.to, blocoRmkt01);
      agendarExecucaoEmDias(2, msg.to, blocoRmkt02);
      agendarExecucaoEmDias(3, msg.to, blocoRmkt03);
      agendarExecucaoEmDias(6, msg.to, blocoRmkt06);
      agendarExecucaoEmDias(10, msg.to, blocoRmkt10);
      agendarExecucaoEmDias(15, msg.to, blocoRmkt15);
      //agendarExecucaoEmDias(30, msg.to, blocoRmkt30);

      await client.sendMessage(msg.from, `Enviei o bloco wpp0 ao numero pelo método direto: ${msg.to}`);

      setTimeout(() => {
        if (readFlow(msg.to) === 'step00') {
        client.sendMessage(msg.to, 'Está podendo falar? Tenho algo muito importante que é do seu interesse para te contar.');
        }
      }, 4*1000*60); //4 minutos
        
      }
    } catch (error) {
      handleAsyncError(error);
    }
    }

    //Retirar do Remarketing e Confirmar pagamento (Método Direto)
    if (msg.fromMe && msg.body === 'Processamos seu pagamento!' && msg.to !== msg.from) {
      try {
      await client.sendMessage(msg.to, `🥑 *Parabéns pela incrível decisão de cuidar da sua saúde* 👍\n\nNós da *Gotavita* estamos contentes em lhe enviar um produto elaborado e construido com muito cuidado e carinho.\n\nSeu tratamento já está *sendo embalado* e logo enviaremos pelos Correios, qualquer duvida sobre o recebimento ou sobre o tratamento não hesite em nos chamar.\n\nFique bem e continue se cuidando, equipe de especialistas *Gotavita*. `);                
      updateFlow(msg.to,'stepPago');
      salvarNoJSON('superfluxozPago.json',msg.to);
      await client.sendMessage(msg.from, `Registrei o pagamento e exclui do Remarketing pelo o método direto: ${msg.to}`);
    } catch (error) {
      handleAsyncError(error);
    }
    }

    //Planos de kit (Método Direto)
    //Pague 8 leve 10
    if (msg.fromMe && msg.body === 'Tratamento completo, pague 8 e leve 10' && msg.to !== msg.from) {
      try {
        updateInteract(msg.to, 'typing');
        updateId(msg.to, JSON.stringify(msg.id.id));        
        updatePlano(msg.to, '1');
        const plano1 = MessageMedia.fromFilePath('./plano1.jpeg'); // arquivo em imagem
        await client.sendMessage(msg.to, plano1, {caption: 'O mais vantajoso!'}); //Enviando a imagem
        await delay(4000); //Delay de 4 segundos
        await client.sendMessage(msg.to, `*FORMAS DE PAGAMENTO*:\n\n📄 BOLETO à vista\n❖ PIX à vista\n💳CARTÃO (Parcelamento em até 12x)\n\n*Clique no link abaixo* e garanta hoje mesmo o seu *Tratamento de 10 Meses + Frete Grátis*: ${frasco10}\n\nDigite o número correspondente a opção desejada\n*1.* ❖ COMO PAGAR NO PIX\n*2.* 💳 COMO PAGAR NO CARTÃO\n*3.* 📄 COMO PAGAR NO BOLETO`);
        updateFlow(msg.to,'stepPlano');
        updateInteract(msg.to, 'done');
        salvarNoJSON('superfluxozPlano.json',msg.to);

        await client.sendMessage(msg.from, `Enviei o bloco *Tratamento completo, pague 8 e leve 10* ao numero pelo método direto para: ${msg.to}`);
      } catch (error) {
        handleAsyncError(error);
      }
    }
    //Pague 4 leve 5
    if (msg.fromMe && msg.body === 'Tratamento, pague 4 e leve 5' && msg.to !== msg.from) {
      try {
        updateInteract(msg.to, 'typing');
        updateId(msg.to, JSON.stringify(msg.id.id));        
        updatePlano(msg.to, '2');
        const plano1 = MessageMedia.fromFilePath('./plano2.jpeg'); // arquivo em imagem
        await client.sendMessage(msg.to, plano1, {caption: 'O mais pedido!'}); //Enviando a imagem
        await delay(4000); //Delay de 4 segundos
        await client.sendMessage(msg.to, `*FORMAS DE PAGAMENTO*:\n\n📄 BOLETO à vista\n❖ PIX à vista\n💳CARTÃO (Parcelamento em até 12x)\n\n*Clique no link abaixo* e garanta hoje mesmo o seu *Tratamento de 5 Meses + Frete Grátis*: ${frasco5}\n\nDigite o número correspondente a opção desejada\n*1.* ❖ COMO PAGAR NO PIX\n*2.* 💳 COMO PAGAR NO CARTÃO\n*3.* 📄 COMO PAGAR NO BOLETO`);
        updateFlow(msg.to,'stepPlano');
        updateInteract(msg.to, 'done');
        salvarNoJSON('superfluxozPlano.json',msg.to);

        await client.sendMessage(msg.from, `Enviei o bloco *Tratamento, pague 4 e leve 5* ao numero pelo método direto para: ${msg.to}`);
      } catch (error) {
        handleAsyncError(error);
      }
    }
    //Pague 2 leve 3
    if (msg.fromMe && msg.body === 'Tratamento, pague 2 e leve 3' && msg.to !== msg.from) {
      try {
        updateInteract(msg.to, 'typing');
        updateId(msg.to, JSON.stringify(msg.id.id));        
        updatePlano(msg.to, '3');
        const plano3 = MessageMedia.fromFilePath('./plano3.jpeg'); // arquivo em imagem
        await client.sendMessage(msg.to, plano3, {caption: 'Tratamento básico!'}); //Enviando a imagem
        await delay(4000); //Delay de 4 segundos
        await client.sendMessage(msg.to, `*FORMAS DE PAGAMENTO*:\n\n📄 BOLETO à vista\n❖ PIX à vista\n💳CARTÃO (Parcelamento em até 12x)\n\n*Clique no link abaixo* e garanta hoje mesmo o seu *Tratamento de 3 Meses + Frete Grátis*: ${frasco3}\n\nDigite o número correspondente a opção desejada\n*1.* ❖ COMO PAGAR NO PIX\n*2.* 💳 COMO PAGAR NO CARTÃO\n*3.* 📄 COMO PAGAR NO BOLETO`);
        updateFlow(msg.to,'stepPlano');
        updateInteract(msg.to, 'done');
        salvarNoJSON('superfluxozPlano.json',msg.to);

        await client.sendMessage(msg.from, `Enviei o bloco *Tratamento, pague 2 e leve 3* ao numero pelo método direto para: ${msg.to}`);
      } catch (error) {
        handleAsyncError(error);
      }
    }

    //Formas de Pagamento (Método Direto)
    //Pagamento via Pix
    if (msg.fromMe && msg.body === 'Pagamento via Pix, né!' && msg.to !== msg.from && (readFlow(msg.to) === 'stepPlano')) {
      try {
        updateInteract(msg.to, 'typing');
        updateId(msg.to, JSON.stringify(msg.id.id));      
        updatePagamento(msg.to, '1');
        await delay(2000); //Delay de 2 segundos        
        await client.sendMessage(msg.to, `Perfeito! Para fazer seu pedido do *tratamento de ${(() => {
            const plano = readPlano(msg.to);
            switch (plano) {
              case '1':
                return '10 meses';
              case '2':
                return '5 meses';
              case '3':
                return '3 meses';
              default:
                return ''; // Caso o valor não seja 1, 2 ou 3.
            }
          })()}* através do Pix é muito simples.`);
        await delay(5000); //Delay de 2 segundos
        await client.sendMessage(msg.to, `${(() => {
            const plano = readPlano(msg.to);
            switch (plano) {
              case '1':
                return `${frasco10}`;
              case '2':
                return `${frasco5}`;
              case '3':
                return `${frasco3}`;
              default:
                return ''; // Caso o valor não seja 1, 2 ou 3.
            }
          })()}`);
        await delay(6000); //Delay de 2 segundos        
        await client.sendMessage(msg.to, `*Você quer que eu gere o Pix para você agora? Ou você conseguiu gerar sem a minha ajuda?*\n\nDigite o número correspondente a opção desejada\n\n*1.* EU CONSIGO GERAR\n*2.* PRECISO DE AJUDA`);
        updateFlow(msg.to,'stepPagamento');
        updateInteract(msg.to, 'done');
        salvarNoJSON('superfluxozPix.json',msg.to);

        await client.sendMessage(msg.from, `Enviei o bloco *Pagamento via Pix, né!* ao numero pelo método direto para: ${msg.to}`);
      } catch (error) {
        handleAsyncError(error);
      }
    }

    //Pagamento via Cartão
    if (msg.fromMe && msg.body === 'Pagamento via Cartão, né!' && msg.to !== msg.from && (readFlow(msg.to) === 'stepPlano')) {
      try {
        updateInteract(msg.to, 'typing');
        updateId(msg.to, JSON.stringify(msg.id.id));      
        updatePagamento(msg.to, '2');
        await delay(2000); //Delay de 2 segundos        
        await client.sendMessage(msg.to, `Perfeito! Para fazer seu pedido do *tratamento de ${(() => {
            const plano = readPlano(msg.to);
            switch (plano) {
              case '1':
                return '10 meses';
              case '2':
                return '5 meses';
              case '3':
                return '3 meses';
              default:
                return ''; // Caso o valor não seja 1, 2 ou 3.
            }
          })()}* através do Cartão é muito simples.`);
        await delay(5000); //Delay de 2 segundos
        await client.sendMessage(msg.to, `${(() => {
            const plano = readPlano(msg.to);
            switch (plano) {
              case '1':
                return `${frasco10}`;
              case '2':
                return `${frasco5}`;
              case '3':
                return `${frasco3}`;
              default:
                return ''; // Caso o valor não seja 1, 2 ou 3.
            }
          })()}`);
        await delay(6000); //Delay de 2 segundos        
        await client.sendMessage(msg.to, `*Você precisa de alguma ajuda no pagamento?*\n\nDigite o número correspondente a opção desejada\n\n*1.* EU CONSIGO SÓ\n*2.* PRECISO DE AJUDA`);
        updateFlow(msg.to,'stepPagamento');
        updateInteract(msg.to, 'done');
        salvarNoJSON('superfluxozCartao.json',msg.to);

        await client.sendMessage(msg.from, `Enviei o bloco *Pagamento via Cartão, né!* ao numero pelo método direto para: ${msg.to}`);
      } catch (error) {
        handleAsyncError(error);
      }
    }

    //Pagamento via Boleto
    if (msg.fromMe && msg.body === 'Pagamento via Boleto, né!' && msg.to !== msg.from && (readFlow(msg.to) === 'stepPlano')) {
      try {
        updateInteract(msg.to, 'typing');
        updateId(msg.to, JSON.stringify(msg.id.id));      
        updatePagamento(msg.to, '3');
        await delay(2000); //Delay de 2 segundos        
        await client.sendMessage(msg.to, `Perfeito! Para fazer seu pedido do *tratamento de ${(() => {
            const plano = readPlano(msg.to);
            switch (plano) {
              case '1':
                return '10 meses';
              case '2':
                return '5 meses';
              case '3':
                return '3 meses';
              default:
                return ''; // Caso o valor não seja 1, 2 ou 3.
            }
          })()}* através do Boleto é muito simples.`);        
        await delay(5000); //Delay de 2 segundos
        await client.sendMessage(msg.to, `${(() => {
            const plano = readPlano(msg.to);
            switch (plano) {
              case '1':
                return `${frasco10}`;
              case '2':
                return `${frasco5}`;
              case '3':
                return `${frasco3}`;
              default:
                return ''; // Caso o valor não seja 1, 2 ou 3.
            }
          })()}`);
        await delay(6000); //Delay de 2 segundos        
        await client.sendMessage(msg.to, `*Você quer que eu gere o Boleto para você agora? Ou você conseguiu gerar sem a minha ajuda?*\n\nDigite o número correspondente a opção desejada\n\n*1.* EU CONSIGO GERAR\n*2.* PRECISO DE AJUDA`);
        updateFlow(msg.to,'stepPagamento');
        updateInteract(msg.to, 'done');
        salvarNoJSON('superfluxozBoleto.json',msg.to);

        await client.sendMessage(msg.from, `Enviei o bloco *Pagamento via Boleto, né!* ao numero pelo método direto para: ${msg.to}`);
      } catch (error) {
        handleAsyncError(error);
      }
    }
  
});