import React from 'react';
import { Button, Form, Input, Select, DatePicker, Tag, Space } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { TaskDetailsProps } from '../type';
import { getPriorityColor, getPriorityText, getStatusColor, getStatusText } from '../../TaskTable/tableState';

const { TextArea } = Input;

interface TaskOverviewProps {
    task: TaskDetailsProps['task'];
    isEditing: boolean;
    form: any;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
    onDelete: () => void;
}

const TaskOverview: React.FC<TaskOverviewProps> = ({ task, isEditing, form, onEdit, onCancel, onSave, onDelete }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Thông tin cơ bản</h3>
                <Space>
                    {isEditing ? (
                        <>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={onSave}
                                className="bg-green-500 hover:bg-green-600"
                            >
                                Lưu
                            </Button>
                            <Button
                                icon={<CloseOutlined />}
                                onClick={onCancel}
                                className="hover:border-red-400 hover:text-red-500"
                            >
                                Hủy
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
                                Chỉnh sửa
                            </Button>
                            <Button type="primary" danger icon={<DeleteOutlined />} onClick={onDelete}>
                                Xóa
                            </Button>
                        </>
                    )}
                </Space>
            </div>
            <Form form={form} layout="vertical">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-gray-600 mb-1">Tiêu đề:</p>
                        {isEditing ? (
                            <Form.Item name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                                <Input className="hover:border-blue-400 focus:border-blue-400" />
                            </Form.Item>
                        ) : (
                            <p className="font-medium text-gray-800">{task.title}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-gray-600 mb-1">Trạng thái:</p>
                        {isEditing ? (
                            <Form.Item name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
                                <Select className="hover:border-blue-400 focus:border-blue-400">
                                    <Select.Option value="todo">Chưa thực hiện</Select.Option>
                                    <Select.Option value="in_progress">Đang thực hiện</Select.Option>
                                    <Select.Option value="done">Hoàn thành</Select.Option>
                                </Select>
                            </Form.Item>
                        ) : (
                            <Tag color={getStatusColor(task.status)} className="px-3 py-1">
                                {getStatusText(task.status)}
                            </Tag>
                        )}
                    </div>
                    <div>
                        <p className="text-gray-600 mb-1">Độ ưu tiên:</p>
                        {isEditing ? (
                            <Form.Item
                                name="priority"
                                rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên!' }]}
                            >
                                <Select className="hover:border-blue-400 focus:border-blue-400">
                                    <Select.Option value="low">Thấp</Select.Option>
                                    <Select.Option value="medium">Trung bình</Select.Option>
                                    <Select.Option value="high">Cao</Select.Option>
                                </Select>
                            </Form.Item>
                        ) : (
                            <Tag color={getPriorityColor(task.priority)} className="px-3 py-1">
                                {getPriorityText(task.priority)}
                            </Tag>
                        )}
                    </div>
                    <div>
                        <p className="text-gray-600 mb-1">Thời gian bắt đầu:</p>
                        {isEditing ? (
                            <Form.Item
                                name="start_time"
                                rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}
                            >
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    className="w-full hover:border-blue-400 focus:border-blue-400"
                                />
                            </Form.Item>
                        ) : (
                            <p className="text-gray-800">{dayjs(task.start_time).format('DD/MM/YYYY HH:mm')}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-gray-600 mb-1">Thời gian kết thúc:</p>
                        {isEditing ? (
                            <Form.Item
                                name="end_time"
                                rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}
                            >
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    className="w-full hover:border-blue-400 focus:border-blue-400"
                                />
                            </Form.Item>
                        ) : (
                            <p className="text-gray-800">{dayjs(task.end_time).format('DD/MM/YYYY HH:mm')}</p>
                        )}
                    </div>
                </div>
                <div>
                    <p className="text-gray-600 mb-1">Mô tả:</p>
                    {isEditing ? (
                        <Form.Item name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
                            <TextArea rows={4} className="hover:border-blue-400 focus:border-blue-400" />
                        </Form.Item>
                    ) : (
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                            {task.description || 'Không có mô tả'}
                        </p>
                    )}
                </div>
            </Form>
        </div>
    );
};

export default TaskOverview;
