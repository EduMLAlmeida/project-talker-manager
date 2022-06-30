const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const talkersFile = './talker.json';

const fs = require('fs/promises');
const validateTalkerData = require('./validationHelpers');

// emailRegex retirado do projeto recipes app.
const validateTests = (email, password) => {
  const testResults = [];
  const emailCheck = email !== '' && email !== undefined;
  testResults.push(emailCheck);
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const emailValidation = emailRegex.test(email);
  testResults.push(emailValidation);
  const passwordCheck = password !== '' && password !== undefined;
  testResults.push(passwordCheck);
  if (password === undefined) {
    testResults.push(false);
    return testResults;
  }
  const passwordValidation = password.length > 5;
  testResults.push(passwordValidation);
  return testResults;
};

const codeReturner = (testResults, res) => {
  if (!testResults[0]) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!testResults[1]) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!testResults[2]) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (!testResults[3]) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
};

// função createToken retirada de https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/
const createToken = () => {
  let token = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i += 1) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
};

// lógica para identificar maior ID existente retirada de https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math/max
const generateId = (talkers) => {
const idCollection = [];
talkers.forEach((talker) => {
  idCollection.push(talker.id);
});
const maxId = idCollection.reduce((a, b) => Math.max(a, b), -Infinity);
return maxId + 1;
};

const saveTalker = async (talkerData, res) => {
  const talkers = JSON.parse(await fs.readFile(talkersFile));
  const data = talkerData;
  const id = generateId(talkers);
  data.id = id;
  talkers.push(data);
  const newTalkers = JSON.stringify(talkers);
  await fs.writeFile(talkersFile, newTalkers);
  return res.status(201).json(talkers[talkers.length - 1]);
};

const updateTalker = async (talkerData, res, id) => {
  const talkers = JSON.parse(await fs.readFile(talkersFile));
  const data = talkerData;
  data.id = Number(id);
  talkers.forEach((talker, index) => {
    if (talker.id === Number(id)) {
      talkers[index] = data;
    }
  });
  const newTalkers = JSON.stringify(talkers);
  await fs.writeFile(talkersFile, newTalkers);
  return res.status(200).json(talkers[id - 1]);
};

const deleteTalker = async (res, id) => {
  const talkers = JSON.parse(await fs.readFile(talkersFile));
  talkers.forEach((talker, index) => {
    if (talker.id === Number(id)) {
      talkers.splice(index);
    }
  });
  const newTalkers = JSON.stringify(talkers);
  await fs.writeFile(talkersFile, newTalkers);
};

const talkerDataCodeReturner3 = (testResults, res) => {
  if (!testResults[8]) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
};

const talkerDataCodeReturner2 = (testResults, res) => {
  if (!testResults[4]) { return res.status(400).json({ message: 'O campo "talk" é obrigatório' }); }
  if (!testResults[5]) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!testResults[6]) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  if (!testResults[7]) { return res.status(400).json({ message: 'O campo "rate" é obrigatório' }); }
  talkerDataCodeReturner3(testResults, res);
};

const talkerDataCodeReturner = (testResults, res) => {
  if (!testResults[0]) { return res.status(400).json({ message: 'O campo "name" é obrigatório' }); }
  if (!testResults[1]) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  if (!testResults[2]) { return res.status(400).json({ message: 'O campo "age" é obrigatório' }); }
  if (!testResults[3]) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  talkerDataCodeReturner2(testResults, res);
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const talkers = JSON.parse(await fs.readFile(talkersFile));
  return res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = JSON.parse(await fs.readFile(talkersFile));
  const talker = talkers.find((element) => element.id === Number(id));
  if (!talker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(talker);
});

app.post('/login', (req, res) => {
  const testResults = validateTests(req.body.email, req.body.password);
  const isValid = testResults.every((result) => result === true);
  const token = createToken();
  if (isValid) {
    return res.status(200).json({ token });
  }
  codeReturner(testResults, res);
});

app.post('/talker', async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (req.headers.authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  const testResults = validateTalkerData(req.body);
  const isOk = testResults.every((result) => result === true);
  if (isOk) {
    saveTalker(req.body, res);
  } else {    
    talkerDataCodeReturner(testResults, res);
  }
});

app.put('/talker/:id', (req, res) => {
  const { id } = req.params;
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (req.headers.authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  const testResults = validateTalkerData(req.body);
  const isOk = testResults.every((result) => result === true);
  if (isOk) {
    updateTalker(req.body, res, id);
  } else {    
    talkerDataCodeReturner(testResults, res);
  }
});

app.delete('/talker/:id', (req, res) => {
  const { id } = req.params;
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (req.headers.authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  deleteTalker(res, id);
  return res.status(204).end();
});

app.listen(PORT, async () => {
  console.log('Online');
});
