import React, { useState, useEffect } from 'react';
import { Input, Space, Tag, Button, Drawer, Select, DatePicker, Form, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TaskPayload, UserProfile } from '@services/types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import TaskTableContent from './TaskTableContent';
import useDebounce from '@hooks/useDebounce';
import dayjs from 'dayjs';
import {
    getPriorityColor,
    getPriorityText,
    getRoleColor,
    getRoleText,
    getStatusColor,
    getStatusText,
} from './tableState';
import { TaskTableProps } from './types';
import TaskDetails from '../TaskDetail/TaskDetails';

const TaskTable: React.FC<TaskTableProps> = ({
    tasks,
    loading,
    error,
    onReload,
    onEditTask,
    onDeleteTask,
    currentPage,
    totalTasks,
    onPageChange,
    teamId,
    teamMembers = [],
    onAssignTask,
}) => {
    const [searchText, setSearchText] = useState('');
    const [selectedTask, setSelectedTask] = useState<TaskPayload | null>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingTask, setEditingTask] = useState<TaskPayload | null>(null);
    const [form] = Form.useForm();
    const [localTasks, setLocalTasks] = useState<TaskPayload[]>(tasks);

    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    const debouncedSearchText = useDebounce(searchText, 300);

    const edit = (record: TaskPayload) => {
        form.setFieldsValue({
            ...record,
            start_time: dayjs(record.start_time),
            end_time: dayjs(record.end_time),
        });
        setEditingTask(record);
        setIsEditing(true);
    };

    const cancel = () => {
        setIsEditing(false);
        setEditingTask(null);
    };

    const save = async (id: string | number | undefined) => {
        if (!id) return;
        try {
            const row = await form.validateFields();
            const taskToUpdate = localTasks.find((item) => {
                const itemId = item.id?.toString();
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
            setIsEditing(false);
            setEditingTask(null);
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleViewDetail = (task: TaskPayload) => {
        setSelectedTask(task);
        setDrawerVisible(true);
    };

    const handleDeleteTask = async (taskId: string | number) => {
        try {
            await onDeleteTask(taskId);
            setLocalTasks((prevTasks) =>
                prevTasks.filter((task) => {
                    const id = task.id;
                    return id !== taskId;
                }),
            );
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const columns: ColumnsType<TaskPayload> = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '25%',
            align: 'center' as const,
            ellipsis: true,
            render: (_: any, record: TaskPayload) => {
                const editable = isEditing && editingTask?.id === record.id;
                return editable ? (
                    <Form.Item
                        name="title"
                        style={{ margin: 0 }}
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input className="animate-fade-in hover:border-blue-400 focus:border-blue-400 transition-all duration-200" />
                    </Form.Item>
                ) : (
                    <span className="font-medium hover:text-blue-500 transition-all duration-200 cursor-pointer truncate block max-w-[200px]">
                        {record.title}
                    </span>
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: '12%',
            align: 'center' as const,
            responsive: ['lg'],
            filters: [
                { text: 'Chưa thực hiện', value: 'todo' },
                { text: 'Đang thực hiện', value: 'in_progress' },
                { text: 'Hoàn thành', value: 'done' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (_: any, record: TaskPayload) => {
                const editable = isEditing && editingTask?.id === record.id;
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
            width: '12%',
            align: 'center' as const,
            responsive: ['lg'],
            filters: [
                { text: 'Thấp', value: 'low' },
                { text: 'Trung bình', value: 'medium' },
                { text: 'Cao', value: 'high' },
            ],
            onFilter: (value, record) => record.priority === value,
            render: (_: any, record: TaskPayload) => {
                const editable = isEditing && editingTask?.id === record.id;
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
                        {getPriorityText(record.priority)}
                    </Tag>
                );
            },
        },
        ...(teamId
            ? [
                  {
                      title: 'Người thực hiện',
                      dataIndex: 'assigned_user_id',
                      key: 'assigned_user_id',
                      width: '20%',
                      align: 'center' as const,
                      ellipsis: true,
                      render: (_: any, record: TaskPayload) => {
                          const editable = isEditing && editingTask?.id === record.id;
                          const assignedUser = teamMembers.find(
                              (user: UserProfile) => user.id === record.assigned_user_id,
                          );

                          return editable ? (
                              <Form.Item name="assigned_user_id" style={{ margin: 0 }}>
                                  <Select
                                      showSearch
                                      placeholder="Chọn người thực hiện"
                                      defaultValue={
                                          record.assigned_user_id ? Number(record.assigned_user_id) : undefined
                                      }
                                      value={record.assigned_user_id ? Number(record.assigned_user_id) : undefined}
                                      onChange={async (value: number) => {
                                          if (record.id && onAssignTask) {
                                              try {
                                                  await onAssignTask(Number(record.id), value);
                                                  const updatedTask = {
                                                      ...record,
                                                      assigned_user_id: value,
                                                  };
                                                  await onEditTask(updatedTask);
                                              } catch (error) {
                                                  console.error('Error assigning task:', error);
                                              }
                                          }
                                      }}
                                      filterOption={(input, option) =>
                                          (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                      }
                                      className="w-full hover:border-blue-400 focus:border-blue-400 transition-all duration-200"
                                  >
                                      {teamMembers.map((user: UserProfile) => (
                                          <Select.Option
                                              key={user.id}
                                              value={user.id}
                                              label={`${user.full_name} (${getRoleText(user.role)})`}
                                          >
                                              <div className="flex items-center justify-between">
                                                  <span className="font-medium">{user.full_name}</span>
                                                  <Tag color={getRoleColor(user.role)} className="ml-2">
                                                      {getRoleText(user.role)}
                                                  </Tag>
                                              </div>
                                          </Select.Option>
                                      ))}
                                  </Select>
                              </Form.Item>
                          ) : (
                              <span className="text-gray-600 hover:text-blue-500 transition-colors duration-200">
                                  {assignedUser ? (
                                      <div className="flex items-center">
                                          <span className="truncate">{assignedUser.full_name}</span>
                                          <Tag color={getRoleColor(assignedUser.role)} className="ml-2 flex-shrink-0">
                                              {getRoleText(assignedUser.role)}
                                          </Tag>
                                      </div>
                                  ) : (
                                      'Chưa giao'
                                  )}
                              </span>
                          );
                      },
                  },
              ]
            : []),
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'start_time',
            key: 'start_time',
            width: '13%',
            align: 'center' as const,
            responsive: ['lg'],
            sorter: (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
            render: (_: any, record: TaskPayload) => {
                const editable = isEditing && editingTask?.id === record.id;
                const date = dayjs(record.start_time);
                const currentYear = dayjs().year();
                const format = date.year() === currentYear ? 'DD/MM' : 'DD/MM/YYYY';

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
                        {date.format(format)}
                    </span>
                );
            },
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'end_time',
            key: 'end_time',
            width: '13%',
            align: 'center' as const,
            sorter: (a, b) => new Date(a.end_time).getTime() - new Date(b.end_time).getTime(),
            render: (_: any, record: TaskPayload) => {
                const editable = isEditing && editingTask?.id === record.id;
                const date = dayjs(record.end_time);
                const currentYear = dayjs().year();
                const format = date.year() === currentYear ? 'DD/MM' : 'DD/MM/YYYY';

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
                        {date.format(format)}
                    </span>
                );
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: '15%',
            align: 'center' as const,
            className: '!w-[120px] sm:!w-[15%]',
            render: (_: any, record: TaskPayload) => {
                const editable = isEditing && editingTask?.id === record.id;
                return editable ? (
                    <Space className="animate-fade-in w-full justify-center">
                        <Button
                            type="primary"
                            onClick={() => save(record.id)}
                            icon={<FontAwesomeIcon icon={faSave} className="text-sm sm:text-base" />}
                            className="!bg-green-400 hover:!bg-green-500 transition-all duration-200 !w-6 !h-6 sm:!w-8 sm:!h-8 !p-0 flex items-center justify-center"
                        ></Button>
                        <Button
                            onClick={cancel}
                            icon={<FontAwesomeIcon icon={faTimes} className="text-sm sm:text-base" />}
                            className="hover:!border-red-400 hover:!text-red-500 transition-all duration-200 !w-6 !h-6 sm:!w-8 sm:!h-8 !p-0 flex items-center justify-center"
                        />
                    </Space>
                ) : (
                    <Space className="animate-fade-in w-full justify-center" size="small">
                        <Button
                            type="primary"
                            disabled={isEditing}
                            onClick={() => edit(record)}
                            icon={<FontAwesomeIcon icon={faEdit} className="text-sm sm:text-base" />}
                            className="!bg-blue-500 hover:!bg-blue-600 transition-all duration-200 !w-6 !h-6 sm:!w-8 sm:!h-8 !p-0 flex items-center justify-center"
                        />
                        <Button
                            type="primary"
                            onClick={() => handleViewDetail(record)}
                            icon={<FontAwesomeIcon icon={faEye} className="text-sm sm:text-base" />}
                            className="!bg-purple-500 hover:!bg-purple-600 transition-all duration-200 !w-6 !h-6 sm:!w-8 sm:!h-8 !p-0 flex items-center justify-center"
                        />
                        <Popconfirm
                            title="Xóa công việc"
                            description="Bạn có chắc chắn muốn xóa công việc này?"
                            onConfirm={() => {
                                const taskId = record.id;
                                if (taskId) {
                                    handleDeleteTask(taskId);
                                }
                            }}
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                        >
                            <Button
                                type="primary"
                                icon={<FontAwesomeIcon icon={faTrash} className="text-sm sm:text-base" />}
                                className="!bg-red-500 hover:!bg-red-600 transition-all duration-200 !w-6 !h-6 sm:!w-8 sm:!h-8 !p-0 flex items-center justify-center"
                            />
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    const filteredTasks = localTasks.filter((task) => {
        const searchLower = debouncedSearchText.replace(/^\s+/, '').toLowerCase();
        return task.title.toLowerCase().includes(searchLower);
    });

    const renderTaskDetails = () => {
        if (!selectedTask) return null;
        return (
            <TaskDetails
                task={selectedTask}
                onEditTask={onEditTask}
                onDeleteTask={handleDeleteTask}
                onReload={onReload}
                teamId={teamId}
            />
        );
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
                    currentPage={currentPage}
                    totalTasks={totalTasks}
                    onPageChange={onPageChange}
                    teamId={teamId}
                    onEditTask={onEditTask}
                    onDeleteTask={handleDeleteTask}
                    teamMembers={teamMembers}
                    onAssignTask={onAssignTask}
                />
            </Form>

            <Drawer
                title={<div className="text-xl font-semibold text-gray-800">Chi tiết công việc</div>}
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                closable
                destroyOnHidden
                width={window.innerWidth < 768 ? '100%' : '50%'}
            >
                <div className="p-6">{renderTaskDetails()}</div>
            </Drawer>
        </div>
    );
};

export default TaskTable;
