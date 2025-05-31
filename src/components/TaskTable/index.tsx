import { useState } from 'react';
import { Input, Space, Tag, Button, Drawer, Tabs, Select, DatePicker, Form } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TaskPayload } from '@services/types/types';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import TaskTableContent from './TaskTableContent';
import useDebounce from '@hooks/useDebounce';
import dayjs from 'dayjs';

interface TaskTableProps {
    tasks: TaskPayload[];
    loading: boolean;
    error: string | null;
    onReload: () => void;
    onEditTask: (task: TaskPayload) => void;
}

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'red';
        case 'medium':
            return 'orange';
        case 'low':
            return 'green';
        default:
            return 'blue';
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'todo':
            return 'default';
        case 'in_progress':
            return 'processing';
        case 'done':
            return 'success';
        default:
            return 'default';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'todo':
            return 'Chưa thực hiện';
        case 'in_progress':
            return 'Đang thực hiện';
        case 'done':
            return 'Hoàn thành';
        default:
            return status;
    }
};

function TaskTable({ tasks, loading, error, onReload, onEditTask }: TaskTableProps) {
    const [searchText, setSearchText] = useState('');
    const [selectedTask, setSelectedTask] = useState<TaskPayload | null>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editingKey, setEditingKey] = useState<string | number>('');
    const [form] = Form.useForm();

    const debouncedSearchText = useDebounce(searchText, 300);

    const isEditing = (record: TaskPayload) => {
        const recordId = record.id?.toString() || record._id?.toString();
        const editingId = editingKey.toString();
        return recordId === editingId;
    };

    const edit = (record: TaskPayload) => {
        form.setFieldsValue({
            ...record,
            start_time: dayjs(record.start_time),
            end_time: dayjs(record.end_time),
        });
        const recordId = record.id?.toString() || record._id?.toString() || '';
        setEditingKey(recordId);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (id: string | number | undefined) => {
        if (!id) return;
        try {
            const row = await form.validateFields();
            const taskToUpdate = tasks.find((item) => {
                const itemId = item.id?.toString() || item._id?.toString();
                return itemId === id.toString();
            });

            if (!taskToUpdate) return;

            const updatedTask = {
                ...taskToUpdate,
                ...row,
                start_time: row.start_time.format('YYYY-MM-DD HH:mm:ss'),
                end_time: row.end_time.format('YYYY-MM-DD HH:mm:ss'),
            };

            await onEditTask(updatedTask);
            setEditingKey('');
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleViewDetail = (task: TaskPayload) => {
        setSelectedTask(task);
        setDrawerVisible(true);
    };

    const columns: ColumnsType<TaskPayload> = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '25%',
            render: (_: any, record: TaskPayload) => {
                const editable = isEditing(record);
                return editable ? (
                    <Form.Item
                        name="title"
                        style={{ margin: 0 }}
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input className="hover:border-blue-400 focus:border-blue-400 transition-all duration-200" />
                    </Form.Item>
                ) : (
                    <span className="font-medium hover:text-blue-500 transition-colors duration-200 cursor-pointer">
                        {record.title}
                    </span>
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: '15%',
            filters: [
                { text: 'Chưa thực hiện', value: 'todo' },
                { text: 'Đang thực hiện', value: 'in_progress' },
                { text: 'Hoàn thành', value: 'done' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (_: any, record: TaskPayload) => {
                const editable = isEditing(record);
                return editable ? (
                    <Form.Item
                        name="status"
                        style={{ margin: 0 }}
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select className="hover:border-blue-400 focus:border-blue-400 transition-all duration-200">
                            <Select.Option value="todo">Chưa thực hiện</Select.Option>
                            <Select.Option value="in_progress">Đang thực hiện</Select.Option>
                            <Select.Option value="done">Hoàn thành</Select.Option>
                        </Select>
                    </Form.Item>
                ) : (
                    <Tag
                        color={getStatusColor(record.status)}
                        className="px-3 py-1 hover:opacity-80 transition-opacity duration-200"
                    >
                        {getStatusText(record.status)}
                    </Tag>
                );
            },
        },
        {
            title: 'Độ ưu tiên',
            dataIndex: 'priority',
            key: 'priority',
            width: '15%',
            filters: [
                { text: 'Thấp', value: 'low' },
                { text: 'Trung bình', value: 'medium' },
                { text: 'Cao', value: 'high' },
            ],
            onFilter: (value, record) => record.priority === value,
            render: (_: any, record: TaskPayload) => {
                const editable = isEditing(record);
                return editable ? (
                    <Form.Item
                        name="priority"
                        style={{ margin: 0 }}
                        rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên!' }]}
                    >
                        <Select className="hover:border-blue-400 focus:border-blue-400 transition-all duration-200">
                            <Select.Option value="low">Thấp</Select.Option>
                            <Select.Option value="medium">Trung bình</Select.Option>
                            <Select.Option value="high">Cao</Select.Option>
                        </Select>
                    </Form.Item>
                ) : (
                    <Tag
                        color={getPriorityColor(record.priority)}
                        className="px-3 py-1 hover:opacity-80 transition-opacity duration-200"
                    >
                        {record.priority.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'start_time',
            key: 'start_time',
            width: '15%',
            sorter: (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
            render: (_: any, record: TaskPayload) => {
                const editable = isEditing(record);
                return editable ? (
                    <Form.Item
                        name="start_time"
                        style={{ margin: 0 }}
                        rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            className="w-full hover:border-blue-400 focus:border-blue-400 transition-all duration-200"
                        />
                    </Form.Item>
                ) : (
                    <span className="text-gray-600 hover:text-blue-500 transition-colors duration-200">
                        {dayjs(record.start_time).format('DD/MM/YYYY HH:mm')}
                    </span>
                );
            },
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'end_time',
            key: 'end_time',
            width: '15%',
            sorter: (a, b) => new Date(a.end_time).getTime() - new Date(b.end_time).getTime(),
            render: (_: any, record: TaskPayload) => {
                const editable = isEditing(record);
                return editable ? (
                    <Form.Item
                        name="end_time"
                        style={{ margin: 0 }}
                        rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            className="w-full hover:border-blue-400 focus:border-blue-400 transition-all duration-200"
                        />
                    </Form.Item>
                ) : (
                    <span className="text-gray-600 hover:text-blue-500 transition-colors duration-200">
                        {dayjs(record.end_time).format('DD/MM/YYYY HH:mm')}
                    </span>
                );
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: '15%',
            render: (_: any, record: TaskPayload) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => save(record.id || record._id)}
                            icon={<SaveOutlined />}
                            className="bg-green-500 hover:bg-green-600 transition-colors duration-200"
                        >
                            Lưu
                        </Button>
                        <Button
                            onClick={cancel}
                            icon={<CloseOutlined />}
                            className="hover:border-red-400 hover:text-red-500 transition-colors duration-200"
                        >
                            Hủy
                        </Button>
                    </Space>
                ) : (
                    <Space>
                        <Button
                            type="primary"
                            disabled={editingKey !== ''}
                            onClick={() => edit(record)}
                            icon={<EditOutlined />}
                            className="bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                        >
                            Sửa
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => handleViewDetail(record)}
                            className="bg-purple-500 hover:bg-purple-600 transition-colors duration-200"
                        >
                            Chi tiết
                        </Button>
                    </Space>
                );
            },
        },
    ];

    const filteredTasks = tasks.filter((task) => {
        const searchLower = debouncedSearchText.replace(/^\s+/, '').toLowerCase();
        return task.title.toLowerCase().includes(searchLower);
    });

    const renderTaskDetails = () => {
        if (!selectedTask) return null;

        const items = [
            {
                key: '1',
                label: 'Tổng quan',
                children: (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Thông tin cơ bản</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-gray-600 mb-1">Tiêu đề:</p>
                                    <p className="font-medium text-gray-800">{selectedTask.title}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 mb-1">Trạng thái:</p>
                                    <Tag color={getStatusColor(selectedTask.status)} className="px-3 py-1">
                                        {getStatusText(selectedTask.status)}
                                    </Tag>
                                </div>
                                <div>
                                    <p className="text-gray-600 mb-1">Độ ưu tiên:</p>
                                    <Tag color={getPriorityColor(selectedTask.priority)} className="px-3 py-1">
                                        {selectedTask.priority.toUpperCase()}
                                    </Tag>
                                </div>
                                <div>
                                    <p className="text-gray-600 mb-1">Thời gian bắt đầu:</p>
                                    <p className="text-gray-800">
                                        {dayjs(selectedTask.start_time).format('DD/MM/YYYY HH:mm')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 mb-1">Thời gian kết thúc:</p>
                                    <p className="text-gray-800">
                                        {dayjs(selectedTask.end_time).format('DD/MM/YYYY HH:mm')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Mô tả</h3>
                            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                {selectedTask.description || 'Không có mô tả'}
                            </p>
                        </div>
                    </div>
                ),
            },
            {
                key: '2',
                label: 'Bình luận',
                children: (
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">Chức năng bình luận đang được phát triển...</p>
                    </div>
                ),
            },
        ];

        return <Tabs items={items} />;
    };

    return (
        <div className="h-full">
            <Form form={form} component={false}>
                <TaskTableContent
                    loading={loading}
                    error={error}
                    onReload={onReload}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    filteredTasks={filteredTasks}
                    columns={columns}
                />
            </Form>

            <Drawer
                title={<div className="text-xl font-semibold text-gray-800">Chi tiết công việc</div>}
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                width={window.innerWidth < 768 ? '100%' : '50%'}
                bodyStyle={{ padding: 0 }}
            >
                <div className="p-6">{renderTaskDetails()}</div>
            </Drawer>
        </div>
    );
}

export default TaskTable;
