const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const fs = require('fs/promises');

const validateTests = (email, password) => {
  console.log('validation', email, password);
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
  console.log(testResults);
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

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const talkers = JSON.parse(await fs.readFile('./talker.json'));
  return res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = JSON.parse(await fs.readFile('./talker.json'));
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

app.listen(PORT, async () => {
  console.log('Online');
});
