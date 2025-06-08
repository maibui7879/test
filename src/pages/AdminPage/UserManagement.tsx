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
} from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined, SearchOutlined } from '@ant-design/icons';
import { getUsersApi, createUserApi, updateUserApi, deleteUserApi } from '../../services/adminServices';
import type { User, CreateUserParams } from '../../services/types/types';
import type { UpdateUserBody } from '../../services/adminServices/updateUser';

const { Search } = AntInput;

type UserRole = 'admin' | 'member';
type UserStatus = 'active' | 'inactive';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [searchText, setSearchText] = useState('');
    const [resetPassword, setResetPassword] = useState(false);

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

    const handleUpdateRole = async (userId: string, role: UserRole) => {
        try {
            const updateData: UpdateUserBody = { role };
            await updateUserApi(userId, updateData);
            message.success('Cập nhật vai trò thành công');
            fetchUsers();
        } catch (error) {
            message.error('Không thể cập nhật vai trò');
        }
    };

    const handleUpdateStatus = async (userId: string, status: UserStatus) => {
        try {
            const updateData: UpdateUserBody = { status };
            await updateUserApi(userId, updateData);
            message.success('Cập nhật trạng thái thành công');
            fetchUsers();
        } catch (error) {
            message.error('Không thể cập nhật trạng thái');
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

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a: User, b: User) => a.email.localeCompare(b.email),
        },
        {
            title: 'Họ và tên',
            dataIndex: 'full_name',
            key: 'full_name',
            sorter: (a: User, b: User) => (a.full_name || '').localeCompare(b.full_name || ''),
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role: UserRole, record: User) => (
                <Select
                    value={role}
                    onChange={(value: UserRole) => handleUpdateRole(record.id.toString(), value)}
                    style={{ width: 120 }}
                >
                    <Select.Option value="member">Member</Select.Option>
                    <Select.Option value="admin">Admin</Select.Option>
                </Select>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: UserStatus, record: User) => (
                <Select
                    value={status}
                    onChange={(value: UserStatus) => handleUpdateStatus(record.id.toString(), value)}
                    style={{ width: 120 }}
                >
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="inactive">Inactive</Select.Option>
                </Select>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => new Date(date).toLocaleDateString(),
            sorter: (a: User, b: User) =>
                new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime(),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: User) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingUser(record);
                            setModalVisible(true);
                            setResetPassword(false);
                        }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa người dùng này?"
                        onConfirm={() => handleDeleteUser(record.id.toString())}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

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
                    placeholder="Tìm kiếm theo email hoặc tên"
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
                                Reset mật khẩu
                            </Checkbox>
                        </Form.Item>
                    )}

                    <Form.Item
                        name="role"
                        label="Vai trò"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                    >
                        <Select>
                            <Select.Option value="member">Member</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select>
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="inactive">Inactive</Select.Option>
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
