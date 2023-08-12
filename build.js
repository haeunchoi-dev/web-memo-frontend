const fs = require('fs');
const dotenv = require('dotenv'); // npm install dotenv 필요

// .env 파일에서 환경변수 불러오기
dotenv.config();

// 템플릿 파일 읽기
let content = fs.readFileSync('src/env.template.js', 'utf-8');

// 환경변수로 템플릿 문자열 대체
content = content.replace('%%API_URL%%', process.env.API_URL);

// 결과를 출력 파일로 저장
fs.writeFileSync('src/env.js', content);

console.log('Build completed!');
