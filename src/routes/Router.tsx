import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '@pages/home/HomePage';
import ArchivePage from '@pages/archive/ArchivePage';
import Layout from '@common/layout/Layout';
import KakaoCallback from '@pages/oauth/KakaoCallback';
import LoginPage from '@pages/login/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import CourseSave from '@pages/place/CourseSave';
import AddPlacePage from '@pages/place/AddPlacePage';
import ArchiveSearchPage from '@pages/archive/ArchiveSearchPage';
import PlaceDetail from '@pages/place/PlaceDetail';
import CourseRegister from '@pages/place/CourseRegister';
import CourseSubmit from '@pages/place/CourseSubmit';
import CourseResult from '@pages/place/CoureResult';
import ConnectingPage from '@pages/connecting/ConnectingPage';
import ProfileModifyPage from '@pages/connecting/ProfileModifyPage';
import ConnectingSearchPage from '@pages/connecting/ConnectingSearchPage';
import ConnectingArchive from '@pages/connecting/ConnectingArchive';
import ConnectingCourseDetail from '@pages/connecting/ConnectingCourseDetail';
import ArchiveDetailPage from '@pages/archive/ArchiveDetailPage';
import ArchivePlacePage from '@pages/archive/ArchivePlacePage';
import ArchiveSavePage from '@pages/archive/ArchiveSavePage';
import ExplorePage from '@pages/explore/ExplorePage';
import ExploreCoursePage from '@pages/explore/ExploreCoursePage';
import ExploreSearchPage from '@pages/explore/ExploreSearchPage';
import Mypage from '@pages/mypage/Mypage';
import SettingPage from '@pages/mypage/SettingPage';

interface RouterProps {
  enableAuthCheck?: boolean; // 디버깅용: 인증 체크 활성화/비활성화 (기본값: true)
}

const Router = ({ enableAuthCheck = true }: RouterProps) => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 퍼블릭 라우트 (인증 불필요) */}
        <Route element={<Layout withHeader={false} withBottomNavigation={false} />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/oauth/kakao" element={<KakaoCallback />} />
          <Route path="/auth/callback" element={<KakaoCallback />} />
        </Route>

        {/* 보호된 라우트 (인증 필요) */}
        <Route element={<ProtectedRoute enabled={enableAuthCheck} />}>
          {/* 코스 등록 페이지 */}
          <Route element={<Layout withHeader={false} withBottomNavigation={false} pageTitle="코스 등록" />}>
            <Route path="/place/save-place" element={<CourseSave />} />
            <Route path="/place/course/submit" element={<CourseSubmit />} />
          </Route>

          {/* 장소 세부설명 페이지 */}
          <Route element={<Layout withHeader={false} withBottomNavigation={false} pageTitle="장소 세부설명" />}>
            <Route path="/place/register" element={<CourseRegister />} />
            <Route path="/place/detail" element={<PlaceDetail />} />
          </Route>

          {/* 장소 추가 페이지 */}
          <Route element={<Layout withHeader={false} withBottomNavigation={false} pageTitle="장소 추가" />}>
            <Route path="/place/add-place" element={<AddPlacePage />} />
          </Route>

          {/* 코스 결과 페이지 */}
          <Route element={<Layout withHeader={false} withBottomNavigation={false} />}>
            <Route path="/place/course/result" element={<CourseResult />} />
          </Route>

          {/* 프로필 수정 페이지 */}
          <Route element={<Layout withHeader={false} withBottomNavigation={false} pageTitle="수정" />}>
            <Route path="/connecting/profile-modify" element={<ProfileModifyPage />} />
          </Route>

          {/* 커넥팅 검색 페이지 */}
          <Route element={<Layout withHeader={false} withBottomNavigation={false} pageTitle="검색" />}>
            <Route path="/connecting/search" element={<ConnectingSearchPage />} />
          </Route>

          {/* 커넥팅 아카이브 페이지 */}
          <Route element={<Layout withHeader={false} withBottomNavigation={false} pageTitle="커넥팅 아카이브" />}>
            <Route path="/connecting/archive" element={<ConnectingArchive />} />
          </Route>

          {/* 커넥팅 코스 상세 페이지 */}
          <Route element={<Layout withHeader={false} withBottomNavigation={false} pageTitle="코스 상세" />}>
            <Route path="/connecting/course/detail/:id" element={<ConnectingCourseDetail />} />
          </Route>

          {/* 마이페이지 */}
          <Route element={<Layout withHeader={false} withBottomNavigation={false} pageTitle="MY" />}>
            <Route path="/mypage" element={<Mypage />} />
          </Route>

          {/* 설정 페이지 */}
          <Route element={<Layout withHeader={false} withBottomNavigation={false} pageTitle="설정" />}>
            <Route path="/setting" element={<SettingPage />} />
          </Route>

          {/* 아카이브 검색 페이지 */}
          <Route element={<Layout withHeader={false} withBottomNavigation={false} pageTitle="검색" />}>
            <Route path="/archive/search" element={<ArchiveSearchPage />} />
          </Route>

          {/* 아카이브 저장 페이지 */}
          <Route element={<Layout withHeader={false} withBottomNavigation={false} pageTitle="저장" />}>
            <Route path="/archive/save" element={<ArchiveSavePage />} />
          </Route>

          {/* 아카이브 상세 페이지 */}
          <Route element={<Layout withHeader={false} withBottomNavigation={false} pageTitle="아카이빙" />}>
            <Route path="/archive/:id" element={<ArchiveDetailPage />} />
          </Route>

          {/* 아카이브 상세 페이지 - 장소 */}
          <Route element={<Layout withHeader={false} withBottomNavigation={false} pageTitle="아카이빙" />}>
            <Route path="/archive/place/:id" element={<ArchivePlacePage />} />
          </Route>

          {/* 둘러보기 페이지 */}
          <Route element={<Layout withHeader={false} withBottomNavigation={true} />}>
            <Route path="/explore" element={<ExplorePage />} />
          </Route>

          {/* 둘러보기 - 코스 */}
          <Route element={<Layout withHeader={false} withBottomNavigation={false} />}>
            <Route path="/explore/course" element={<ExploreCoursePage />} />
          </Route>

          {/* 둘러보기 - 검색 */}
          <Route element={<Layout withHeader={false} withBottomNavigation={false} pageTitle="검색" />}>
            <Route path="/explore/search" element={<ExploreSearchPage />} />
          </Route>

          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/archive" element={<ArchivePage />} />
          </Route>
          <Route element={<Layout withBottomNavigation={false} />}>
            <Route path="/connecting" element={<ConnectingPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
