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

// emailRegex retirado do projeto recipes app
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

const saveTalker = async (talkerData, res) => {
  const talkers = JSON.parse(await fs.readFile(talkersFile));
  const data = talkerData;
  const id = talkers.length + 1;
  data.id = id;
  talkers.push(data);
  const newTalkers = JSON.stringify(talkers);
  await fs.writeFile(talkersFile, newTalkers);
  return res.status(201).json(talkers[talkers.length - 1]);
};

const validateTalkerName = (name) => {
  const testResults = [];
  const nameCheck = name !== '' && name !== undefined;
  testResults.push(nameCheck);
  if (name === undefined) {
    testResults.push(false);
    return testResults;
  }
  const nameValidation = name.length > 2;
  testResults.push(nameValidation);
  return testResults;
};

const validateTalkerAge = (age) => {
  const testResults = [];
  const ageCheck = age !== '' && age !== undefined;
  testResults.push(ageCheck);
  if (age === undefined) {
    testResults.push(false);
    return testResults;
  }
  const ageValidation = age > 17;
  testResults.push(ageValidation);
  return testResults;
};

const validateTalkField = (talk) => {
  const testResults = [];
  const talkCheck = talk !== '' && talk !== undefined;
  testResults.push(talkCheck);
  return testResults;
};

// dateRegex retirado de https://levitrares.com/host-https-qastack.com.br/programming/15491894/regex-to-validate-date-format-dd-mm-yyyy
const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/;

const validateWatchedAt = (data) => {
  const testResults = [];
  if (data.talk === undefined) {
    testResults.push(false);
    testResults.push(false);
    return testResults;
  }
  const watchedAtCheck = data.talk.watchedAt !== '' && data.talk.watchedAt !== undefined;
  testResults.push(watchedAtCheck);
  if (data.talk.watchedAt === undefined) {
    testResults.push(false);
    return testResults;
  }
  const watchedAtValidation = dateRegex.test(data.talk.watchedAt);
  testResults.push(watchedAtValidation);
  return testResults;
};

const validateRate2 = (data) => {
  const testResults = [];
  const { rate } = data.talk;
  const rateCheck = rate !== '' && rate !== undefined;
  testResults.push(rateCheck);
  if (rate === undefined) {
    testResults.push(false);
    return testResults;
  }
  const rateValidation = Number.isInteger(rate) && rate > 0 && rate < 6;
  testResults.push(rateValidation);
  return testResults;
};

const validateRate = (data) => {
  const testResults = [];
  if (data.talk === undefined) {
    testResults.push(false);
    testResults.push(false);
    return testResults;
  }
  const result = validateRate2(data);
  return result;
};

const validateTalkerData = (talkerData) => {
  const testResults = [];
  const { name, age, talk } = talkerData;
  const nameValidation = validateTalkerName(name);
  nameValidation.forEach((validation) => testResults.push(validation));
  const ageValidation = validateTalkerAge(age);
  ageValidation.forEach((validation) => testResults.push(validation));
  const talkValidation = validateTalkField(talk);
  talkValidation.forEach((validation) => testResults.push(validation));
  const watchedAtValidation = validateWatchedAt(talkerData);
  watchedAtValidation.forEach((validation) => testResults.push(validation));
  const rateValidation = validateRate(talkerData);
  rateValidation.forEach((validation) => testResults.push(validation));
  return testResults;
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

app.listen(PORT, async () => {
  console.log('Online');
});
