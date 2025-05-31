import SidebarItem from './SidebarItem';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';
import { SidebarProps } from './type';

function Sidebar({ children, items, className = '', header, footer }: SidebarProps) {
    const renderContent = () => {
        if (items) {
            return (
                <div className="flex-1 overflow-y-auto px-1.5 py-2 space-y-0.5">
                    {items.map((item, index) => (
                        <SidebarItem
                            key={index}
                            icon={item.icon}
                            path={item.path}
                            label={item.label}
                            subItems={item.subItems}
                        />
                    ))}
                </div>
            );
        }
        return children;
    };

    return (
        <nav
            className={`relative bg-gray-900 min-h-screen py-4 w-16 xl:w-[240px] transition-all duration-300 shadow-xl ${className}`}
        >
            {header || <SidebarHeader />}
            <div className="mt-4">{renderContent()}</div>
            {footer || <SidebarFooter />}
        </nav>
    );
}

export default Sidebar;
