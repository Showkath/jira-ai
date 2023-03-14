import api, { storage } from "@forge/api";

const OpenAIApiKey = process.env.OPEN_AI_KEY;
const OpenAIUrl = process.env.OPEN_AI_URL;

export const generateDescription = async ({
  description,
  issueKey,
  issueId,
}) => {
  try {
    const storageKey = "generatedDescription" + issueKey + issueId;

    if (!(description instanceof Object)) return description;

    const storageDescription = await storage.get(storageKey);

    if (storageDescription) return storageDescription;

    const { descriptionFormatted, summary } = description;

    let prompt = "";

    prompt +=
      "Gere uma descrição em markdown com quebra de linha para a seguinte tarefa com o título: ";
    prompt += summary;
    prompt += "\n\n";
    prompt += "E a seguinte descrição ou template: ";
    prompt += descriptionFormatted;

    //POST https://api.openai.com/v1/completions
//POST https://api.openai.com/v1/completions/engines/text-davinci-003/completions
const bodyInJSON = JSON.stringify({
  n: 1,
  max_tokens: 1000,
  prompt,
  temperature: 0.5,
  top_p: 1,
});

 
 //POST https://api.openai.com/v1/chat/completions
/*
const bodyInJSON = JSON.stringify({
  n: 1,
  model: 'gpt-3.5-turbo',
  max_tokens: 5000,
  prompt,
  temperature: 0.5,
  top_p: 1,
});
*/
const response = await api.fetch(
  OpenAIUrl + "/engines/text-davinci-003/completions",
  //OpenAIUrl + "/chat/completions",
  {
    body: bodyInJSON,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OpenAIApiKey}`,
    },
  }
);

    console.log(response);

    const data = await response.json();

    console.log(data);

    await storage.set(storageKey, data.choices[0].text);

    return data.choices[0].text;
  } catch (error) {
    console.log(error);

    return "Não foi possível gerar a descrição.";
  }
};
