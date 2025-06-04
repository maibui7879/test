import React, { useState } from 'react';
import { Table, Tag, Button, Space, Modal, Form, Input, Select, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface Task {
    id: string;
    title: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    assignee: string;
    dueDate: string;
}

interface TasksProps {
    teamId: string | undefined;
}

const Tasks = ({ teamId }: TasksProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const columns: ColumnsType<Task> = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusColors = {
                    pending: 'warning',
                    in_progress: 'processing',
                    completed: 'success',
                };
                const statusLabels = {
                    pending: 'Chờ thực hiện',
                    in_progress: 'Đang thực hiện',
                    completed: 'Hoàn thành',
                };
                return (
                    <Tag color={statusColors[status as keyof typeof statusColors]}>
                        {statusLabels[status as keyof typeof statusLabels]}
                    </Tag>
                );
            },
        },
        {
            title: 'Độ ưu tiên',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority: string) => {
                const priorityColors = {
                    low: 'blue',
                    medium: 'orange',
                    high: 'red',
                };
                const priorityLabels = {
                    low: 'Thấp',
                    medium: 'Trung bình',
                    high: 'Cao',
                };
                return (
                    <Tag color={priorityColors[priority as keyof typeof priorityColors]}>
                        {priorityLabels[priority as keyof typeof priorityLabels]}
                    </Tag>
                );
            },
        },
        {
            title: 'Người thực hiện',
            dataIndex: 'assignee',
            key: 'assignee',
        },
        {
            title: 'Hạn hoàn thành',
            dataIndex: 'dueDate',
            key: 'dueDate',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link">Chỉnh sửa</Button>
                    <Button type="link" danger>
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    // Mock data
    const data: Task[] = [
        {
            id: '1',
            title: 'Thiết kế giao diện',
            status: 'in_progress',
            priority: 'high',
            assignee: 'Nguyễn Văn A',
            dueDate: '2024-03-20',
        },
        {
            id: '2',
            title: 'Phát triển API',
            status: 'pending',
            priority: 'medium',
            assignee: 'Trần Thị B',
            dueDate: '2024-03-25',
        },
    ];

    const handleAddTask = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            console.log('Form values:', values);
            setIsModalVisible(false);
            form.resetFields();
        });
    };

    return (
        <div>
            <div className="mb-4">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTask}>
                    Thêm nhiệm vụ
                </Button>
            </div>

            <Table columns={columns} dataSource={data} rowKey="id" />

            <Modal
                title="Thêm nhiệm vụ mới"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select>
                            <Select.Option value="pending">Chờ thực hiện</Select.Option>
                            <Select.Option value="in_progress">Đang thực hiện</Select.Option>
                            <Select.Option value="completed">Hoàn thành</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="priority"
                        label="Độ ưu tiên"
                        rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên' }]}
                    >
                        <Select>
                            <Select.Option value="low">Thấp</Select.Option>
                            <Select.Option value="medium">Trung bình</Select.Option>
                            <Select.Option value="high">Cao</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="assignee"
                        label="Người thực hiện"
                        rules={[{ required: true, message: 'Vui lòng chọn người thực hiện' }]}
                    >
                        <Select>
                            <Select.Option value="Nguyễn Văn A">Nguyễn Văn A</Select.Option>
                            <Select.Option value="Trần Thị B">Trần Thị B</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="dueDate"
                        label="Hạn hoàn thành"
                        rules={[{ required: true, message: 'Vui lòng chọn hạn hoàn thành' }]}
                    >
                        <DatePicker className="w-full" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Tasks;
