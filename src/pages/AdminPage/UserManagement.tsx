import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Space,
    Modal,
    Form,
    Input,
    Select,
    message,
    Popconfirm,
    Input as AntInput,
    Checkbox,
    Tag,
} from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined, SearchOutlined } from '@ant-design/icons';
import { getUsersApi, createUserApi, updateUserApi, deleteUserApi } from '../../services/adminServices';
import type { User, CreateUserParams } from '../../services/types/types';
import type { UpdateUserBody } from '../../services/adminServices/updateUser';
import type { ColumnsType } from 'antd/es/table';

const { Search } = AntInput;

type UserRole = 'admin' | 'member';
type UserStatus = 'active' | 'inactive';

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [searchText, setSearchText] = useState('');
    const [resetPassword, setResetPassword] = useState(false);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 576);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getUsersApi();
            if (response?.data.users) {
                setUsers(response.data.users);
                setFilteredUsers(response.data.users);
            }
        } catch (error) {
            message.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (values: CreateUserParams) => {
        try {
            await createUserApi(values);
            message.success('Tạo người dùng thành công');
            setModalVisible(false);
            form.resetFields();
            fetchUsers();
        } catch (error) {
            message.error('Không thể tạo người dùng');
        }
    };

    const handleUpdateUser = async (values: any) => {
        if (!editingUser) return;

        try {
            const updateData: UpdateUserBody = {
                full_name: values.full_name,
                role: values.role,
                status: values.status,
            };

            if (resetPassword) {
                updateData.resetPassword = true;
            }

            await updateUserApi(editingUser.id.toString(), updateData);
            message.success('Cập nhật người dùng thành công');
            setModalVisible(false);
            form.resetFields();
            setResetPassword(false);
            fetchUsers();
        } catch (error) {
            message.error('Không thể cập nhật người dùng');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            await deleteUserApi({ userId });
            message.success('Xóa người dùng thành công');
            fetchUsers();
        } catch (error) {
            message.error('Không thể xóa người dùng');
        }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = users.filter(
            (user) =>
                user.email.toLowerCase().includes(value.toLowerCase()) ||
                (user.full_name && user.full_name.toLowerCase().includes(value.toLowerCase())),
        );
        setFilteredUsers(filtered);
    };

    const columns: ColumnsType<User> = React.useMemo(() => [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
            width: 200,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'full_name',
            key: 'full_name',
            sorter: (a, b) => (a.full_name || '').localeCompare(b.full_name || ''),
            width: 200,
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role: UserRole) => {
                const color = role === 'admin' ? 'blue' : 'magenta';
                const roleText = role === 'admin' ? 'Quản trị viên' : 'Người dùng';
                return <Tag color={color}>{roleText}</Tag>;
            },
            width: 130,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: UserStatus) => {
                const color = status === 'active' ? 'green' : 'volcano';
                const statusText = status === 'active' ? 'Hoạt động' : 'Ngưng hoạt động';
                return <Tag color={color}>{statusText}</Tag>;
            },
            width: 130,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime(),
            width: 150,
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            width: isMobile ? 80 : 130,
            render: (_: any, record: User) => (
                <Space size="middle" style={{ minWidth: 120 }}>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingUser(record);
                            setModalVisible(true);
                            setResetPassword(false);
                        }}
                        style={{ whiteSpace: 'nowrap' }}
                        size="small"
                    >
                        {!isMobile && 'Sửa'}
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa người dùng này?"
                        onConfirm={() => handleDeleteUser(record.id.toString())}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            ),
        },
    ], [isMobile]);

    return (
        <div className="p-6">
            <div className="mb-4 flex justify-between items-center">
                <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={() => {
                        setEditingUser(null);
                        setModalVisible(true);
                        setResetPassword(false);
                    }}
                >
                    Thêm người dùng
                </Button>
                <Search
                    placeholder="Tìm kiếm theo email hoặc họ và tên"
                    allowClear
                    enterButton={<SearchOutlined />}
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                />
            </div>

            <Table
                columns={columns}
                dataSource={filteredUsers}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng số ${total} người dùng`,
                }}
                scroll={{ x: 900 }}
            />

            <Modal
                title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                    setResetPassword(false);
                }}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={editingUser ? handleUpdateUser : handleCreateUser}
                    initialValues={editingUser || {}}
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                    >
                        <Input disabled={!!editingUser} />
                    </Form.Item>

                    <Form.Item
                        name="full_name"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                    >
                        <Input />
                    </Form.Item>

                    {!editingUser && (
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    )}

                    {editingUser && (
                        <Form.Item>
                            <Checkbox checked={resetPassword} onChange={(e) => setResetPassword(e.target.checked)}>
                                Đặt lại mật khẩu
                            </Checkbox>
                        </Form.Item>
                    )}

                    <Form.Item
                        name="role"
                        label="Vai trò"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                    >
                        <Select>
                            <Select.Option value="member">Thành viên</Select.Option>
                            <Select.Option value="admin">Quản trị viên</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select>
                            <Select.Option value="active">Hoạt động</Select.Option>
                            <Select.Option value="inactive">Ngưng hoạt động</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingUser ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;
