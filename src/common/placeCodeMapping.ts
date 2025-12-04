/**
 * 업종명과 업종 코드 매핑
 * 한국어 업종명을 카카오 업종 코드로 변환
 */
export const placeCodeMapping: Record<string, string> = {
  // 대형마트
  대형마트: 'MT1',
  // 편의점
  편의점: 'CS2',
  // 어린이집, 유치원
  '어린이집, 유치원': 'PS3',
  // 학교
  학교: 'SC4',
  // 학원
  학원: 'AC5',
  // 주차장
  주차장: 'PK6',
  // 주유소, 충전소
  '주유소, 충전소': 'OL7',
  // 지하철역
  지하철역: 'SW8',
  // 은행
  은행: 'BK9',
  // 문화시설
  문화시설: 'CT1',
  // 중개업소
  중개업소: 'AG2',
  // 공공기관
  공공기관: 'PO3',
  // 관광명소
  관광명소: 'AT4',
  // 숙박
  숙박: 'AD5',
  // 음식점
  음식점: 'FD6',
  // 카페
  카페: 'CE7',
  // 병원
  병원: 'HP8',
  // 약국
  약국: 'PM9',
};

/**
 * 업종명 배열을 업종 코드 문자열로 변환
 * @param placeNames 업종명 배열
 * @returns 쉼표로 구분된 업종 코드 문자열 (예: "AT4,FD6,CE7")
 */
export const convertPlaceNamesToCodeString = (placeNames: string[]): string | undefined => {
  if (placeNames.length === 0) return undefined;

  const codes = placeNames
    .map(name => placeCodeMapping[name])
    .filter((code): code is string => code !== undefined);

  return codes.length > 0 ? codes.join(',') : undefined;
};

/**
 * 업종 코드 문자열을 업종명 배열로 변환
 * @param codeString 쉼표로 구분된 업종 코드 문자열 (예: "AT4,FD6,CE7")
 * @returns 업종명 배열
 */
export const convertCodeStringToPlaceNames = (codeString: string): string[] => {
  if (!codeString) return [];

  const codes = codeString.split(',');
  const reverseMapping: Record<string, string> = Object.fromEntries(
    Object.entries(placeCodeMapping).map(([name, code]) => [code, name])
  );

  return codes.map(code => reverseMapping[code]).filter((name): name is string => name !== undefined);
};

