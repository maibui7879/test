import Header from '../components/Header';
import Footer from '../components/Footer';
import DefaultLayoutProps from './type';

function DefaultLayout({ children }: DefaultLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1 mx-auto px-4 sm:px-6 lg:px-8">
                {/* <Sidebar /> */}
                <main className="flex-grow">{children}</main>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
