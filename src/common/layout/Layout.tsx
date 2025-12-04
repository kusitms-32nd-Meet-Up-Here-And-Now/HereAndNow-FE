import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import PageHeader from './PageHeader';

interface LayoutProps {
  withHeader?: boolean;
  withBottomNavigation?: boolean;
  pageTitle?: string;
}

const Layout = ({ withHeader = true, pageTitle, withBottomNavigation = true }: LayoutProps) => {
  const location = useLocation();
  const isExplorePage = location.pathname === '/explore';

  return (
    <div className="min-h-screen">
      <main className="mx-auto min-h-screen w-full max-w-[402px] bg-white pb-16 shadow-lg">
        {withHeader && <Header />}
        {pageTitle && <PageHeader title={pageTitle} />}

        <section className={`overflow-x-hidden ${!isExplorePage ? 'px-5' : ''}`}>
          <Outlet />
        </section>
      </main>

      {withBottomNavigation && <BottomNavigation />}
    </div>
  );
};

export default Layout;
