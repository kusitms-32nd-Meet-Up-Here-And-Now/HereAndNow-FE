# HereAndNow

## 서비스 개요

### 서비스 설명

**HereAndNow**는 데이트 코스와 장소를 기록하고 공유하는 웹 애플리케이션입니다. 사용자들이 자신만의 특별한 순간을 아카이브하고, 다른 사용자들과 코스를 공유하며, 커플 간의 추억을 함께 기록할 수 있는 플랫폼입니다.

#### 주요 기능

- **코스 관리**: 데이트 코스를 등록하고 관리하며, 장소를 추가하고 순서를 정리할 수 있습니다
- **아카이브**: 방문한 장소와 코스를 기록하고 보관하여 나중에 다시 찾아볼 수 있습니다
- **커넥팅**: 커플과 연결하여 함께 추억을 공유하고 기록할 수 있습니다
- **둘러보기**: 다른 사용자들이 공유한 코스와 장소를 탐색하고 발견할 수 있습니다
- **장소 검색**: 위치 기반으로 주변 추천 장소를 찾아볼 수 있습니다
- **인증**: 카카오 소셜 로그인을 통한 간편한 회원가입 및 로그인

### 개발 방식

#### 기술 스택

**Frontend Framework & Library**

- React 19.1.1
- TypeScript 5.9.3
- Vite 7.1.7

**상태 관리 & 데이터 페칭**

- Zustand 5.0.8 (전역 상태 관리)
- TanStack React Query 5.90.2 (서버 상태 관리 및 캐싱)
- Axios 1.12.2 (HTTP 클라이언트)

**스타일링**

- Tailwind CSS 4.1.14
- Framer Motion 12.23.24 (애니메이션)

**라우팅 & UI**

- React Router DOM 7.9.4
- Swiper 12.0.3 (슬라이더 컴포넌트)

**기타**

- React Daum Postcode 3.2.0 (주소 검색)
- HEIC2Any 0.0.4 (이미지 변환)
- Kakao Maps API (지도 서비스)

**개발 도구**

- ESLint 9.36.0
- Prettier 3.6.2
- TypeScript ESLint 8.45.0

#### 아키텍처

**프로젝트 구조**

```
src/
├── apis/          # API 호출 로직 (React Query hooks)
├── assets/        # 이미지, 아이콘 등 정적 리소스
├── common/        # 공통 컴포넌트 (Modal, BottomSheet, KakaoMap 등)
├── hooks/         # 커스텀 훅
├── pages/         # 페이지 컴포넌트
├── routes/        # 라우팅 설정
├── stores/        # Zustand 상태 관리 스토어
├── styles/        # 전역 스타일
├── types/         # TypeScript 타입 정의
└── utils/         # 유틸리티 함수
```

**주요 설계 패턴**

- **컴포넌트 기반 아키텍처**: 재사용 가능한 컴포넌트 중심 설계
- **Custom Hooks 패턴**: API 호출 및 비즈니스 로직을 커스텀 훅으로 분리
- **Protected Routes**: 인증이 필요한 페이지를 보호하는 라우팅 구조
- **API 레이어 분리**: API 호출 로직을 별도 디렉토리로 분리하여 관리

**상태 관리 전략**

- **서버 상태**: React Query를 사용하여 서버 데이터 캐싱 및 동기화
- **클라이언트 상태**: Zustand를 사용하여 전역 클라이언트 상태 관리
- **로컬 상태**: React의 useState, useReducer를 사용하여 컴포넌트 내부 상태 관리

**스타일링 전략**

- Tailwind CSS를 사용한 유틸리티 퍼스트 접근 방식
- 디자인 토큰을 통한 일관된 디자인 시스템 구축
- 반응형 디자인 지원

## Web 배포 링크

<!-- 배포 링크를 여기에 추가해주세요 -->

[배포 링크](https://here-and-now-fe.vercel.app/)
