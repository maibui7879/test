import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Button, message } from 'antd';
import { TaskPayload } from '../../services/types/types';
import { createTask, updateTask } from '../../services/taskServices';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface TaskFormProps {
    onSuccess?: () => void;
    initialValues?: TaskPayload;
    mode?: 'create' | 'edit';
}

const TaskForm: React.FC<TaskFormProps> = ({ onSuccess, initialValues, mode = 'create' }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                start_time: dayjs(initialValues.start_time),
                end_time: dayjs(initialValues.end_time),
            });
        }
    }, [initialValues, form]);

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            const taskData: TaskPayload = {
                ...(initialValues || {}),
                title: values.title,
                description: values.description || '',
                start_time: values.start_time.format('YYYY-MM-DD HH:mm:ss'),
                end_time: values.end_time.format('YYYY-MM-DD HH:mm:ss'),
                status: values.status || 'todo',
                priority: values.priority,
            };

            if (mode === 'create') {
                await createTask(taskData);
                message.success('Tạo công việc thành công!');
            } else {
                if (!initialValues?.id) {
                    throw new Error('Không tìm thấy ID của công việc');
                }
                await updateTask(Number(initialValues.id), taskData);
                message.success('Cập nhật công việc thành công!');
            }
            onSuccess?.();
        } catch (error: any) {
            if (error.message === 'Công việc với tên này đã tồn tại!') {
                message.error('Tên công việc này đã tồn tại. Vui lòng chọn tên khác!');
            } else if (error.message === 'Định dạng start_time không hợp lệ!') {
                message.error('Định dạng thời gian không hợp lệ. Vui lòng kiểm tra lại!');
            } else {
                message.error('Có lỗi xảy ra khi xử lý công việc. Vui lòng thử lại!');
            }
            console.error('Error handling task:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="task-form">
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                <Input placeholder="Nhập tiêu đề công việc" />
            </Form.Item>

            <Form.Item name="description" label="Mô tả">
                <TextArea rows={4} placeholder="Nhập mô tả công việc" />
            </Form.Item>

            <Form.Item
                name="start_time"
                label="Thời gian bắt đầu"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
            >
                <DatePicker showTime format="YYYY-MM-DD HH:mm" placeholder="Chọn thời gian bắt đầu" />
            </Form.Item>

            <Form.Item
                name="end_time"
                label="Thời gian kết thúc"
                rules={[
                    { required: true, message: 'Vui lòng chọn thời gian kết thúc' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || !getFieldValue('start_time') || value.isAfter(getFieldValue('start_time'))) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Thời gian kết thúc phải sau thời gian bắt đầu'));
                        },
                    }),
                ]}
            >
                <DatePicker showTime format="YYYY-MM-DD HH:mm" placeholder="Chọn thời gian kết thúc" />
            </Form.Item>

            <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
                <Select placeholder="Chọn trạng thái">
                    <Select.Option value="todo">Chưa thực hiện</Select.Option>
                    <Select.Option value="in_progress">Đang thực hiện</Select.Option>
                    <Select.Option value="done">Hoàn thành</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="priority"
                label="Độ ưu tiên"
                rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên' }]}
            >
                <Select placeholder="Chọn độ ưu tiên">
                    <Select.Option value="low">Thấp</Select.Option>
                    <Select.Option value="medium">Trung bình</Select.Option>
                    <Select.Option value="high">Cao</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    {mode === 'create' ? 'Tạo công việc' : 'Cập nhật'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default TaskForm;
