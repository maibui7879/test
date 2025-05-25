import Header from '../components/Header';
import Footer from '../components/Footer';
import DefaultLayoutProps from './type';
import Sidebar from './Sidebar';
import { privateRoutes } from '../../routes/data';
function DefaultLayout({ children }: DefaultLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1 ">
                <Sidebar routes={privateRoutes}/>
                <main className="flex-grow px-4 sm:px-6 lg:px-8">{children}</main>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
