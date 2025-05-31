import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, Button } from 'antd';
import { createTask } from '@services/taskServices';
import { TaskPayload } from '@services/types/types';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const { TextArea } = Input;

interface TaskFormProps {
    onTaskCreated?: (task: TaskPayload) => void;
    onClose?: () => void;
}

function TaskForm({ onTaskCreated, onClose }: TaskFormProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            const taskData: TaskPayload = {
                title: values.title,
                description: values.description || '',
                start_time: values.start_time
                    ? values.start_time.format('YYYY-MM-DD HH:mm:ss')
                    : dayjs().format('YYYY-MM-DD HH:mm:ss'),
                end_time: values.end_time
                    ? values.end_time.format('YYYY-MM-DD HH:mm:ss')
                    : dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
                status: values.status || 'todo',
                priority: values.priority || 'medium',
            };

            await createTask(taskData);
            toast.success('Tạo công việc thành công!');
            form.resetFields();
            onTaskCreated?.(taskData);
            onClose?.();
        } catch (error: any) {
            if (error.message === 'Công việc với tên này đã tồn tại!') {
                toast.error('Tên công việc này đã tồn tại. Vui lòng chọn tên khác!');
            } else if (error.message === 'Định dạng start_time không hợp lệ!') {
                toast.error('Định dạng thời gian không hợp lệ. Vui lòng kiểm tra lại!');
            } else {
                toast.error('Có lỗi xảy ra khi xử lý công việc. Vui lòng thử lại!');
            }
            console.error('Error handling task:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-4 p-4 bg-white rounded-lg shadow-sm"
        >
            <Form.Item
                name="title"
                label={<span className="text-gray-700 font-medium">Tiêu đề</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
                <Input
                    placeholder="Nhập tiêu đề công việc"
                    className="rounded-md hover:border-blue-400 focus:border-blue-400"
                />
            </Form.Item>

            <Form.Item name="description" label={<span className="text-gray-700 font-medium">Mô tả</span>}>
                <TextArea
                    rows={4}
                    placeholder="Nhập mô tả công việc"
                    className="rounded-md hover:border-blue-400 focus:border-blue-400"
                />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                    name="start_time"
                    label={<span className="text-gray-700 font-medium">Thời gian bắt đầu</span>}
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        placeholder="Chọn thời gian bắt đầu"
                        className="w-full rounded-md hover:border-blue-400 focus:border-blue-400"
                    />
                </Form.Item>

                <Form.Item
                    name="end_time"
                    label={<span className="text-gray-700 font-medium">Thời gian kết thúc</span>}
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        placeholder="Chọn thời gian kết thúc"
                        className="w-full rounded-md hover:border-blue-400 focus:border-blue-400"
                    />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="status" label={<span className="text-gray-700 font-medium">Trạng thái</span>}>
                    <Select
                        placeholder="Chọn trạng thái"
                        className="w-full rounded-md hover:border-blue-400 focus:border-blue-400"
                    >
                        <Select.Option value="todo">Chưa thực hiện</Select.Option>
                        <Select.Option value="in_progress">Đang thực hiện</Select.Option>
                        <Select.Option value="done">Hoàn thành</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name="priority" label={<span className="text-gray-700 font-medium">Độ ưu tiên</span>}>
                    <Select
                        placeholder="Chọn độ ưu tiên"
                        className="w-full rounded-md hover:border-blue-400 focus:border-blue-400"
                    >
                        <Select.Option value="low">Thấp</Select.Option>
                        <Select.Option value="medium">Trung bình</Select.Option>
                        <Select.Option value="high">Cao</Select.Option>
                    </Select>
                </Form.Item>
            </div>

            <Form.Item className="mb-0">
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full md:w-auto"
                    icon={<PlusOutlined />}
                >
                    Tạo công việc
                </Button>
            </Form.Item>
        </Form>
    );
}

export default TaskForm;
