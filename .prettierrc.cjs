// .prettierrc.cjs
module.exports = {
  printWidth: 120, // 한 줄 최대 길이
  tabWidth: 2, // 탭 너비
  semi: true, // 세미콜론 사용
  singleQuote: true, // 작은따옴표 사용
  trailingComma: "all", // 후행 쉼표 사용
  bracketSpacing: true, // 객체 리터럴에서 괄호 사이 공백
  arrowParens: "avoid", // 화살표 함수 매개변수가 하나일 때 괄호 생략
  endOfLine: "auto", // OS에 맞는 라인 엔딩 사용
  plugins: ["prettier-plugin-tailwindcss"],
};
