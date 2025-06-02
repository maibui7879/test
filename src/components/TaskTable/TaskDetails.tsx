import React, { useState, useEffect, useCallback } from 'react';
import {
    Tabs,
    Tag,
    Input,
    Button,
    Upload,
    List,
    Space,
    Typography,
    Avatar,
    Modal,
    Select,
    DatePicker,
    Form,
} from 'antd';
import {
    UploadOutlined,
    PaperClipOutlined,
    DeleteOutlined,
    SendOutlined,
    EditOutlined,
    SaveOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { TaskDetailsProps } from './types';
import { getPriorityColor, getPriorityText, getStatusColor, getStatusText } from './tableState';
import { TaskNotesAndAttachments, TaskComment } from '@services/types/types';
import { getTaskComments, createTaskComment, updateTaskComment, deleteTaskComment } from '@services/teamServices';
import { getNAbyTask, createNA, deleteN } from '@services/taskServices';
import TaskForm from '@components/TaskForm';
import useNotification from '@components/Notification';
import { message } from 'antd';

const { TextArea } = Input;
const { Text } = Typography;

function TaskDetails({ task, onEditTask, onDeleteTask, onReload }: TaskDetailsProps) {
    const [notesAndAttachments, setNotesAndAttachments] = useState<TaskNotesAndAttachments[]>([]);
    const [comments, setComments] = useState<TaskComment[]>([]);
    const [newNote, setNewNote] = useState('');
    const [newFile, setNewFile] = useState<File | null>(null);
    const [newComment, setNewComment] = useState('');
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editCommentText, setEditCommentText] = useState('');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const notification = useNotification();

    const fetchComments = useCallback(async () => {
        try {
            if (!task.id) return;
            const response = await getTaskComments(Number(task.id));
            setComments(Array.isArray(response) ? response : []);
        } catch (error) {
            notification.error('fetchComments', 'Không thể tải bình luận');
            setComments([]);
        }
    }, [task.id, notification]);

    const fetchNotesAndAttachments = useCallback(async () => {
        try {
            if (!task.id) return;
            const response = await getNAbyTask(Number(task.id));
            setNotesAndAttachments(response || []);
        } catch (error) {
            notification.error('fetchNotes', 'Không thể tải ghi chú và tệp đính kèm');
            setNotesAndAttachments([]);
        }
    }, [task.id, notification]);

    useEffect(() => {
        if (task.id) {
            fetchComments();
            fetchNotesAndAttachments();
        }
    }, [task.id, fetchComments, fetchNotesAndAttachments]);

    const handleAddNoteAndFile = useCallback(async () => {
        if ((!newNote.trim() && !newFile) || !task.id) return;
        const key = 'addNoteAndFile';
        try {
            notification.loading(key, 'Đang thêm ghi chú và tệp đính kèm...');
            setLoading(true);
            await createNA(Number(task.id), {
                note: newNote.trim() || undefined,
                file: newFile || undefined,
            });
            setNewNote('');
            setNewFile(null);
            await fetchNotesAndAttachments();
            notification.success(key, 'Thêm ghi chú và tệp đính kèm thành công!');
        } catch (error) {
            notification.error(key, 'Không thể thêm ghi chú và tệp đính kèm');
        } finally {
            setLoading(false);
        }
    }, [newNote, newFile, task.id, fetchNotesAndAttachments, notification]);

    const handleDeleteNote = useCallback(
        async (noteId: number) => {
            const key = 'deleteNote';
            try {
                notification.loading(key, 'Đang xóa ghi chú...');
                await deleteN(noteId);
                await fetchNotesAndAttachments();
                notification.success(key, 'Xóa ghi chú thành công!');
            } catch (error) {
                notification.error(key, 'Không thể xóa ghi chú');
            }
        },
        [fetchNotesAndAttachments, notification],
    );

    const handleFileChange = useCallback((info: any) => {
        if (info.file.status === 'done') {
            setNewFile(info.file.originFileObj);
        }
    }, []);

    const handleAddComment = useCallback(async () => {
        if (!newComment.trim() || !task.id) return;
        const key = 'addComment';
        try {
            notification.loading(key, 'Đang thêm bình luận...');
            setLoading(true);
            await createTaskComment(Number(task.id), newComment);
            setNewComment('');
            await fetchComments();
            notification.success(key, 'Thêm bình luận thành công!');
        } catch (error) {
            notification.error(key, 'Không thể thêm bình luận');
        } finally {
            setLoading(false);
        }
    }, [newComment, task.id, fetchComments, notification]);

    const handleDeleteComment = useCallback(
        async (commentId: number) => {
            const key = 'deleteComment';
            try {
                notification.loading(key, 'Đang xóa bình luận...');
                await deleteTaskComment(commentId);
                await fetchComments();
                notification.success(key, 'Xóa bình luận thành công!');
            } catch (error) {
                notification.error(key, 'Không thể xóa bình luận');
            }
        },
        [fetchComments, notification],
    );

    const handleEditComment = useCallback((comment: TaskComment) => {
        setEditingCommentId(comment.id);
        setEditCommentText(comment.comment);
    }, []);

    const handleCancelEdit = useCallback(() => {
        setEditingCommentId(null);
        setEditCommentText('');
    }, []);

    const handleSaveEdit = useCallback(
        async (commentId: number) => {
            const key = 'saveEdit';
            try {
                notification.loading(key, 'Đang cập nhật bình luận...');
                setLoading(true);
                await updateTaskComment(commentId, editCommentText);
                await fetchComments();
                setEditingCommentId(null);
                setEditCommentText('');
                notification.success(key, 'Cập nhật bình luận thành công!');
            } catch (error) {
                notification.error(key, 'Không thể cập nhật bình luận');
            } finally {
                setLoading(false);
            }
        },
        [editCommentText, fetchComments, notification],
    );

    const handleEditTask = useCallback(
        async (taskData: any) => {
            const key = 'editTask';
            try {
                const updatedTask = {
                    ...task,
                    ...taskData,
                    start_time: taskData.date[0].format('YYYY-MM-DD HH:mm:ss'),
                    end_time: taskData.date[1].format('YYYY-MM-DD HH:mm:ss'),
                };

                onEditTask(updatedTask);
                setIsEditModalVisible(false);

                notification.loading(key, 'Đang cập nhật công việc...');

                await onEditTask(updatedTask);
                onReload?.();
                notification.success(key, 'Cập nhật công việc thành công!');
            } catch (error) {
                notification.error(key, 'Không thể cập nhật công việc');
            }
        },
        [onEditTask, onReload, notification, task],
    );

    const handleDeleteTask = useCallback(async () => {
        if (!task.id) return;
        const key = 'deleteTask';
        try {
            notification.loading(key, 'Đang xóa công việc...');
            await onDeleteTask(task.id);
            window.location.reload();
        } catch (error) {
            notification.error(key, 'Không thể xóa công việc');
        }
    }, [task.id, onDeleteTask, notification]);

    const handleEdit = useCallback(() => {
        form.setFieldsValue({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            start_time: dayjs(task.start_time),
            end_time: dayjs(task.end_time),
        });
        setIsEditing(true);
    }, [form, task]);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        form.resetFields();
    }, [form]);

    const handleSave = useCallback(async () => {
        try {
            const values = await form.validateFields();
            const updatedTask = {
                ...task,
                ...values,
                start_time: values.start_time.format('YYYY-MM-DD HH:mm:ss'),
                end_time: values.end_time.format('YYYY-MM-DD HH:mm:ss'),
            };
            await onEditTask(updatedTask);
            setIsEditing(false);
            onReload?.();
        } catch (error) {
            notification.error('saveTask', 'Không thể lưu thay đổi');
        }
    }, [form, task, onEditTask, onReload, notification]);

    // Helper function to format file size
    const formatFileSize = (bytes: number | null | undefined): string => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    };

    const items = [
        {
            key: '1',
            label: 'Tổng quan',
            children: (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Thông tin cơ bản</h3>
                        <Space>
                            {isEditing ? (
                                <>
                                    <Button
                                        type="primary"
                                        icon={<SaveOutlined />}
                                        onClick={handleSave}
                                        className="bg-green-500 hover:bg-green-600"
                                    >
                                        Lưu
                                    </Button>
                                    <Button
                                        icon={<CloseOutlined />}
                                        onClick={handleCancel}
                                        className="hover:border-red-400 hover:text-red-500"
                                    >
                                        Hủy
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                                        Chỉnh sửa
                                    </Button>
                                    <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleDeleteTask}>
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
                                    <Form.Item
                                        name="title"
                                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                                    >
                                        <Input className="hover:border-blue-400 focus:border-blue-400" />
                                    </Form.Item>
                                ) : (
                                    <p className="font-medium text-gray-800">{task.title}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-gray-600 mb-1">Trạng thái:</p>
                                {isEditing ? (
                                    <Form.Item
                                        name="status"
                                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                                    >
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
                                <Form.Item
                                    name="description"
                                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                                >
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
            ),
        },
        {
            key: '2',
            label: 'Ghi chú & Tệp đính kèm',
            children: (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Thêm ghi chú và tệp đính kèm</h3>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-4">
                                <TextArea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Nhập ghi chú..."
                                    rows={3}
                                    className="w-full"
                                    maxLength={500}
                                    showCount
                                />
                                <div className="flex items-center gap-4">
                                    <Upload
                                        customRequest={({ onSuccess }) => setTimeout(() => onSuccess?.('ok'), 0)}
                                        onChange={handleFileChange}
                                        showUploadList={false}
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                        beforeUpload={(file) => {
                                            const isLt10M = file.size / 1024 / 1024 < 10;
                                            if (!isLt10M) {
                                                notification.error('fileSize', 'Tệp phải nhỏ hơn 10MB!');
                                                return false;
                                            }
                                            return true;
                                        }}
                                    >
                                        <Button icon={<UploadOutlined />}>Chọn tệp</Button>
                                    </Upload>
                                    {newFile && (
                                        <div className="flex items-center gap-2">
                                            <PaperClipOutlined />
                                            <span className="text-sm text-gray-600">{newFile.name}</span>
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => setNewFile(null)}
                                            />
                                        </div>
                                    )}
                                </div>
                                <Button
                                    type="primary"
                                    onClick={handleAddNoteAndFile}
                                    loading={loading}
                                    disabled={!newNote.trim() && !newFile}
                                    className="w-full"
                                >
                                    Thêm
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Danh sách ghi chú và tệp đính kèm</h3>
                        {notesAndAttachments.length > 0 ? (
                            <List
                                dataSource={notesAndAttachments}
                                renderItem={(item) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                key="delete"
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleDeleteNote(item.id)}
                                                loading={loading}
                                            />,
                                        ]}
                                    >
                                        <div className="w-full">
                                            {item.content && (
                                                <p className="text-gray-800 whitespace-pre-wrap mb-2">{item.content}</p>
                                            )}
                                            {item.file_url && (
                                                <div className="flex items-center gap-2">
                                                    <PaperClipOutlined className="text-gray-400" />
                                                    <a
                                                        href={item.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        {item.file_name}
                                                    </a>
                                                    <Text type="secondary" className="text-sm">
                                                        ({formatFileSize(item.file_size)})
                                                    </Text>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mt-2">
                                                <Text type="secondary" className="text-sm">
                                                    {dayjs(item.created_at).format('DD/MM/YYYY HH:mm')}
                                                </Text>
                                                {item.updated_at !== item.created_at && (
                                                    <Text type="secondary" className="text-sm">
                                                        (Đã chỉnh sửa)
                                                    </Text>
                                                )}
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
                                <PaperClipOutlined className="text-4xl text-gray-400 mb-2" />
                                <p className="text-gray-500">Chưa có ghi chú và tệp đính kèm nào</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Thêm ghi chú hoặc tệp đính kèm để theo dõi công việc
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: '3',
            label: 'Bình luận',
            children: (
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <TextArea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Viết bình luận..."
                                rows={3}
                                className="flex-1"
                            />
                            <Button type="primary" onClick={handleAddComment} icon={<SendOutlined />} loading={loading}>
                                Gửi
                            </Button>
                        </div>
                        {comments && comments.length > 0 ? (
                            <List
                                dataSource={comments}
                                renderItem={(comment) => (
                                    <List.Item
                                        actions={[
                                            editingCommentId === comment.id ? (
                                                <Space>
                                                    <Button
                                                        type="primary"
                                                        size="small"
                                                        onClick={() => handleSaveEdit(comment.id)}
                                                        loading={loading}
                                                    >
                                                        Lưu
                                                    </Button>
                                                    <Button size="small" onClick={handleCancelEdit}>
                                                        Hủy
                                                    </Button>
                                                </Space>
                                            ) : (
                                                <Space>
                                                    <Button
                                                        type="text"
                                                        icon={<EditOutlined />}
                                                        onClick={() => handleEditComment(comment)}
                                                    />
                                                    <Button
                                                        type="text"
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                    />
                                                </Space>
                                            ),
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar>
                                                    {comment.full_name ? comment.full_name.toUpperCase() : 'U'}
                                                </Avatar>
                                            }
                                            title={
                                                <Space>
                                                    <span className="font-medium">
                                                        {comment.full_name ? comment.full_name : 'Người dùng'}
                                                    </span>
                                                    <Text type="secondary" className="text-sm">
                                                        {dayjs(comment.created_at).format('DD/MM/YYYY HH:mm')}
                                                    </Text>
                                                </Space>
                                            }
                                            description={
                                                <div className="mt-2">
                                                    {editingCommentId === comment.id ? (
                                                        <TextArea
                                                            value={editCommentText}
                                                            onChange={(e) => setEditCommentText(e.target.value)}
                                                            rows={3}
                                                            className="w-full"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-800">{comment.comment}</p>
                                                    )}
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <div className="text-center py-4 text-gray-500">Chưa có bình luận nào</div>
                        )}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <>
            {contextHolder}
            <Tabs items={items} />
            <Modal
                title="Chỉnh sửa công việc"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
                width={700}
            >
                <TaskForm
                    taskId={task.id || ''}
                    initialValues={{
                        title: task.title,
                        description: task.description,
                        status: task.status,
                        priority: task.priority,
                        date: [dayjs(task.start_time), dayjs(task.end_time)],
                    }}
                    onTaskCreated={handleEditTask}
                    onClose={() => setIsEditModalVisible(false)}
                />
            </Modal>
        </>
    );
}

export default TaskDetails;
