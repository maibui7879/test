import { Layout, Menu } from 'antd';
import { HomeOutlined, TeamOutlined, BookOutlined, AppstoreOutlined, NotificationOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
// import config from '~/config';

const { Sider } = Layout;

const Sidebar = () => {
    return <Sider width={250} style={{ background: '#fff' }}></Sider>;
};

export default Sidebar;
