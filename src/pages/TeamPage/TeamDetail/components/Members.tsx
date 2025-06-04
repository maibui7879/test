import React, { useState } from 'react';
import { Table, Avatar, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface Member {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
    avatar?: string;
}

interface MembersProps {
    teamId: string | undefined;
}

const Members = ({ teamId }: MembersProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const columns: ColumnsType<Member> = [
        {
            title: 'Thành viên',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Avatar src={record.avatar}>{text[0]}</Avatar>
                    <div>
                        <div className="font-medium">{text}</div>
                        <div className="text-gray-500 text-sm">{record.email}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => (
                <span
                    className={`px-2 py-1 rounded-full text-sm ${
                        role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}
                >
                    {role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                </span>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="text" danger icon={<UserDeleteOutlined />} onClick={() => handleRemoveMember(record)}>
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    // Mock data
    const data: Member[] = [
        {
            id: '1',
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            role: 'admin',
            avatar: 'https://i.pravatar.cc/150?img=1',
        },
        {
            id: '2',
            name: 'Trần Thị B',
            email: 'tranthib@example.com',
            role: 'member',
            avatar: 'https://i.pravatar.cc/150?img=2',
        },
    ];

    const handleAddMember = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            console.log('Form values:', values);
            message.success('Thêm thành viên thành công!');
            setIsModalVisible(false);
            form.resetFields();
        });
    };

    const handleRemoveMember = (member: Member) => {
        Modal.confirm({
            title: 'Xác nhận xóa thành viên',
            content: `Bạn có chắc chắn muốn xóa thành viên ${member.name} khỏi nhóm?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                message.success('Đã xóa thành viên khỏi nhóm!');
            },
        });
    };

    return (
        <div>
            <div className="mb-4">
                <Button type="primary" icon={<UserAddOutlined />} onClick={handleAddMember}>
                    Thêm thành viên
                </Button>
            </div>

            <Table columns={columns} dataSource={data} rowKey="id" />

            <Modal
                title="Thêm thành viên mới"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                width={500}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="Vai trò"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                    >
                        <Select>
                            <Select.Option value="admin">Quản trị viên</Select.Option>
                            <Select.Option value="member">Thành viên</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Members;
