import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, Input, Select, DatePicker, Tag, Space, Spin, message } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { TaskDetailsProps } from '../type';
import { getPriorityColor, getPriorityText, getStatusColor, getStatusText } from '../../TaskTable/tableState';
import getMembers from '@services/teamServices/teamMembers/getMembersTeam';
import { TeamMemberInfo } from '@services/teamServices/teamMembers/getMembersTeam';

const { TextArea } = Input;

interface TaskOverviewProps {
    task: TaskDetailsProps['task'];
    isEditing: boolean;
    form: any;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
    onDelete: () => void;
    teamId?: TaskDetailsProps['teamId'];
}

const TaskOverview: React.FC<TaskOverviewProps> = ({
    task,
    isEditing,
    form,
    onEdit,
    onCancel,
    onSave,
    onDelete,
    teamId,
}) => {
    const [teamMembers, setTeamMembers] = useState<TeamMemberInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [showFullTitle, setShowFullTitle] = useState(false);

    const fetchTeamMembers = useCallback(async () => {
        if (!teamId) return;
        setLoading(true);
        try {
            const members = await getMembers(Number(teamId));
            setTeamMembers(members);
        } catch (error) {
            console.error('Error fetching team members:', error);
            message.error('Không thể tải danh sách thành viên đội.');
        } finally {
            setLoading(false);
        }
    }, [teamId]);

    useEffect(() => {
        fetchTeamMembers();
    }, [fetchTeamMembers]);

    // Sync form values when editing starts or task changes
    useEffect(() => {
        if (isEditing) {
            form.setFieldsValue({
                title: task.title,
                status: task.status,
                assigned_user_id: task.assigned_user_id,
                priority: task.priority,
                start_time: task.start_time ? dayjs(task.start_time) : null,
                end_time: task.end_time ? dayjs(task.end_time) : null,
                description: task.description,
            });
        } else {
            form.resetFields();
            setShowFullTitle(false);
        }
    }, [isEditing, task, form]);

    const assignedUser = teamMembers.find((user) => user.id === task.assigned_user_id);

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
                {/* Tiêu đề */}
                <div>
                    <p className="text-gray-600 mb-1 font-bold">Tiêu đề:</p>
                    {isEditing ? (
                        <Form.Item
                            name="title"
                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                            validateTrigger={['onBlur', 'onSubmit']}
                        >
                            <Input className="hover:border-blue-400 focus:border-blue-400" />
                        </Form.Item>
                    ) : (
                        <div className="flex flex-col">
                            <div
                                className={`font-medium text-gray-800 ${
                                    showFullTitle
                                        ? 'whitespace-normal max-w-full'
                                        : 'max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap'
                                }`}
                                title={!showFullTitle ? task.title : undefined}
                            >
                                {task.title}
                            </div>
                            {task.title.length > 30 && (
                                <button
                                    type="button"
                                    className="text-blue-500 underline text-sm mt-1 self-start"
                                    onClick={() => setShowFullTitle((prev) => !prev)}
                                >
                                    {showFullTitle ? 'Ẩn bớt' : 'Xem chi tiết'}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Trạng thái và độ ưu tiên */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-gray-600 mb-1 font-bold">Trạng thái:</p>
                        {isEditing ? (
                            <Form.Item name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
                                <Select className="hover:border-blue-400 focus:border-blue-400" allowClear>
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
                        <p className="text-gray-600 mb-1 font-bold">Độ ưu tiên:</p>
                        {isEditing ? (
                            <Form.Item
                                name="priority"
                                rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên!' }]}
                            >
                                <Select className="hover:border-blue-400 focus:border-blue-400" allowClear>
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
                </div>

                {/* Thời gian bắt đầu và kết thúc */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-gray-600 mb-1 font-bold">Thời gian bắt đầu:</p>
                        {isEditing ? (
                            <Form.Item name="start_time">
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    className="w-full hover:border-blue-400 focus:border-blue-400"
                                />
                            </Form.Item>
                        ) : (
                            <p className="text-gray-800">
                                {task.start_time ? dayjs(task.start_time).format('DD/MM/YYYY HH:mm') : '-'}
                            </p>
                        )}
                    </div>
                    <div>
                        <p className="text-gray-600 mb-1 font-bold">Thời gian kết thúc:</p>
                        {isEditing ? (
                            <Form.Item name="end_time">
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    className="w-full hover:border-blue-400 focus:border-blue-400"
                                />
                            </Form.Item>
                        ) : (
                            <p className="text-gray-800">
                                {task.end_time ? dayjs(task.end_time).format('DD/MM/YYYY HH:mm') : '-'}
                            </p>
                        )}
                    </div>
                </div>

                {/* Người thực hiện */}
                {teamId && (
                    <div>
                        <p className="text-gray-600 mb-1 font-bold">Người thực hiện:</p>
                        {loading ? (
                            <Spin />
                        ) : isEditing ? (
                            <Form.Item
                                name="assigned_user_id"
                                rules={[{ required: true, message: 'Chọn người thực hiện!' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Chọn người thực hiện"
                                    filterOption={(input, option) =>
                                        (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                    }
                                    className="hover:border-blue-400 focus:border-blue-400"
                                    optionLabelProp="label"
                                >
                                    {teamMembers.map((user) => (
                                        <Select.Option
                                            key={user.id}
                                            value={user.id}
                                            label={`${user.full_name} (${user.role})`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{user.full_name}</span>
                                                <small className="text-gray-400">{user.role}</small>
                                            </div>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        ) : (
                            <div className="flex items-center">
                                {assignedUser ? (
                                    <>
                                        <span className="font-medium text-gray-800">{assignedUser.full_name}</span>
                                        <Tag color="blue" className="ml-2">
                                            {assignedUser.role}
                                        </Tag>
                                    </>
                                ) : (
                                    <span className="text-gray-500">Chưa giao</span>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Mô tả */}
                <div>
                    <p className="text-gray-600 mb-1 font-bold">Mô tả:</p>
                    {isEditing ? (
                        <Form.Item
                            name="description"
                            rules={[{ required: true, message: 'Nhập mô tả!' }]}
                            validateTrigger={['onBlur', 'onSubmit']}
                        >
                            <TextArea rows={3} className="hover:border-blue-400 focus:border-blue-400" />
                        </Form.Item>
                    ) : (
                        <p className="text-gray-800 whitespace-pre-wrap">{task.description}</p>
                    )}
                </div>
            </Form>
        </div>
    );
};

export default TaskOverview;
