/**
 * 지역별 역 정보 매핑
 * 지역 -> 역명 매핑
 */
export const STATION_MAPPING: Record<string, string> = {
  // 강북/성북
  강북: '미아사거리역',
  성북: '미아사거리역',

  // 노원/도봉/의정부
  노원: '노원역',
  도봉: '노원역',
  의정부: '노원역',

  // 은평/서대문
  은평: '홍제역',
  서대문: '홍제역',

  // 종로
  종로: '종각역',

  // 대학로
  대학로: '혜화역',

  // 홍대/연남
  홍대: '홍대입구역',
  연남: '홍대입구역',

  // 신촌
  신촌: '신촌역',

  // 마포
  마포: '홍대입구역',

  // 광화문/인사동
  광화문: '광화문',
  인사동: '광화문',

  // 명동/중구
  명동: '명동역',
  중구: '명동역',

  // 용산
  용산: '용산역',

  // 이태원
  이태원: '이태원역',

  // 성수
  성수: '성수역',

  // 동대문/성동
  동대문: '왕십리역',
  성동: '왕십리역',

  // 광진구
  광진구: '건대입구역',

  // 강서/양천/김포
  강서: '가양역',
  양천: '가양역',
  김포: '가양역',

  // 영등포
  영등포: '영등포역',

  // 동작
  동작: '이수역',

  // 가로수길
  가로수길: '신사역',

  // 서초
  서초: '서초역',

  // 강남
  강남: '강남역',

  // 구로/금천
  구로: '구로디지털단지역',
  금천: '구로디지털단지역',

  // 관악
  관악: '서울대입구역',

  // 강동/하남
  강동: '강동역',
  하남: '강동역',

  // 잠실
  잠실: '잠실역',
};

/**
 * 지역명으로 역명을 찾는 함수
 * @param region 지역명
 * @returns 역명 (없으면 undefined)
 */
export const getStationByRegion = (region: string): string | undefined => {
  return STATION_MAPPING[region];
};

/**
 * 역명으로 지역명 배열을 찾는 함수 (역전 검색)
 * @param station 역명
 * @returns 해당 역을 사용하는 지역명 배열
 */
export const getRegionsByStation = (station: string): string[] => {
  return Object.entries(STATION_MAPPING)
    .filter(([, stationName]) => stationName === station)
    .map(([region]) => region);
};

/**
 * 모든 역명 목록 (중복 제거)
 * @returns 역명 배열
 */
export const getAllStations = (): string[] => {
  return Array.from(new Set(Object.values(STATION_MAPPING))).sort();
};

/**
 * 모든 지역명 목록
 * @returns 지역명 배열
 */
export const getAllRegions = (): string[] => {
  return Object.keys(STATION_MAPPING).sort();
};

/**
 * 지역 그룹 목록 (":" 왼쪽에 표시할 지역명)
 * 여러 지역이 같은 역을 사용하는 경우 "/"로 구분
 */
export const REGION_GROUPS = [
  '강북/성북',
  '노원/도봉/의정부',
  '은평/서대문',
  '종로',
  '대학로',
  '홍대/연남',
  '신촌',
  '마포',
  '광화문/인사동',
  '명동/중구',
  '용산',
  '이태원',
  '성수',
  '동대문/성동',
  '광진구',
  '강서/양천/김포',
  '영등포',
  '동작',
  '가로수길',
  '서초',
  '강남',
  '구로/금천',
  '관악',
  '강동/하남',
  '잠실',
] as const;
