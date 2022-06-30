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

  module.exports = validateTalkerData;