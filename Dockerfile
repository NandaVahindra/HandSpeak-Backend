FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000

ENV HOST=0.0.0.0

ENV MODEL_BISINDO='https://storage.googleapis.com/capstone-bucket-model-bisindo/model.json'

ENV MODEL_SIBI_RGB='https://storage.googleapis.com/capstone-bucket-model-sibi/ml_model_sibi_tfjs/model.json'

EXPOSE 3000

CMD ["npm","start"]