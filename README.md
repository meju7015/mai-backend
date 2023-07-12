## MAI project
이 프로젝트는 openai embedding을 이용하여 문장의 유사도를 측정하고, prompt 에 의해 더 나은 embedding을 얻기위한 프로젝트 입니다.

# 1. pinecone 
- 벡터 저장을 위해 pinecone(https://www.pinecone.io/)을 이용합니다. pinecone 에 가입한후 콘솔로 접속합니다.
- pinecone에서 프로젝트를 생성하고 Indexes를 생성합니다.
- 생성된 Index이름을 .env 파일의 PINECONE_INDEX_NAME에 입력합니다.
- API Keys 를 생성하고 .env 파일의 PINECONE_API_KEY에 입력합니다.
- enviroment 를 확인 한 후 .env 파일의 PINECONE_ENVIRONMENT에 입력합니다.

# 2. openai
- api 이용을 위해 openai(https://platform.openai.com/)에 가입합니다.
- openai 에서 API Keys 를 생성하고 .env 파일의 OPENAI_API_KEY에 입력합니다.
- 요금이 많이 발생하는것을 방지하기 위해서 Rate limits 을 설정할것을 권장합니다. (3$ 정도)
- 

# 3. database
- 데이터베이스는 mysql을 사용합니다.
- docker-compose.yml 의 db 서비스만 실행합니다.
- .env파일의 DATABASE 관련 정보를 입력합니다. (example 그대로 두면 됩니다.)

# 4. 실행
```bash
npm install
npm run start:dev
```
