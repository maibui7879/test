import React, { useState, useCallback, useMemo } from 'react';
import {
    Card,
    Button,
    Modal,
    List,
    Spin,
    Tag,
    ConfigProvider,
    Calendar,
    Avatar,
    Tooltip,
    Typography,
    Space,
} from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import TaskForm from '@/components/TaskForm';
import { TaskPayload } from '@services/types/types';

const { Text } = Typography;

const EVENT_COLORS = {
    done: '#059669',
    in_progress: '#2563EB',
    high: '#DC2626',
    medium: '#D97706',
    low: '#059669',
    default: '#4B5563',
} as const;

const getEventColor = (status: string, priority: string) => {
    if (status === 'done') return EVENT_COLORS.done;
    if (status === 'in_progress') return EVENT_COLORS.in_progress;
    if (priority === 'high') return EVENT_COLORS.high;
    if (priority === 'medium') return EVENT_COLORS.medium;
    return EVENT_COLORS.default;
};

const STATUS_TAGS = {
    todo: { color: 'default', text: 'Chờ thực hiện' },
    in_progress: { color: 'processing', text: 'Đang thực hiện' },
    done: { color: 'success', text: 'Hoàn thành' },
};

const PRIORITY_TAGS = {
    low: { color: 'success', text: 'Thấp' },
    medium: { color: 'warning', text: 'Trung bình' },
    high: { color: 'error', text: 'Cao' },
};

interface CalendarComponentProps {
    tasks: TaskPayload[];
    loading?: boolean;
    onTaskCreated?: (taskData: TaskPayload) => void;
}

const CalendarComponent = ({ tasks, loading = false, onTaskCreated }: CalendarComponentProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTask, setSelectedTask] = useState<TaskPayload | null>(null);

    const selectedDateTasks = useMemo(() => {
        if (!selectedDate) return [];
        return tasks.filter((task) => {
            const start = dayjs(task.start_time);
            const end = dayjs(task.end_time);
            const date = dayjs(selectedDate);
            return (
                (start.isSame(date, 'day') || start.isBefore(date)) && (end.isSame(date, 'day') || end.isAfter(date))
            );
        });
    }, [selectedDate, tasks]);

    const handleDateSelect = useCallback((date: Dayjs) => {
        setSelectedDate(date.toDate());
        setIsViewModalOpen(true);
    }, []);

    const handleTaskSubmit = useCallback(
        (taskData: TaskPayload) => {
            if (selectedTask) {
                // Update existing task
                const updatedTask = {
                    ...selectedTask,
                    ...taskData,
                };
                onTaskCreated?.(updatedTask);
            } else {
                // Create new task
                onTaskCreated?.(taskData);
            }
            setIsModalOpen(false);
            setSelectedTask(null);
        },
        [onTaskCreated, selectedTask],
    );

    const handleEditTask = (task: TaskPayload) => {
        if (!task.id) return toast.error('Không tìm thấy ID công việc');
        setSelectedTask(task);
        setIsModalOpen(true);
        setIsViewModalOpen(false);
    };

    const dateCellRender: CalendarProps<Dayjs>['cellRender'] = useCallback(
        (date: Dayjs) => {
            const dayTasks = tasks.filter((task) => {
                const start = dayjs(task.start_time);
                const end = dayjs(task.end_time);
                return (
                    (start.isSame(date, 'day') || start.isBefore(date)) &&
                    (end.isSame(date, 'day') || end.isAfter(date))
                );
            });

            if (dayTasks.length === 0) return null;

            const maxDisplay = 5;
            const displayTasks = dayTasks.slice(0, maxDisplay);
            const extraCount = dayTasks.length - maxDisplay;

            return (
                <>
                    <div className="absolute top-1 left-1">
                        <span className="text-xl font-semibold text-gray-600">{dayTasks.length} công việc</span>
                    </div>
                    <div className="absolute bottom-1 left-1 right-1 flex items-center justify-center space-x-1">
                        {displayTasks.map((task, index) => (
                            <Tooltip key={index} title={task.title}>
                                <Avatar
                                    size={20}
                                    style={{
                                        backgroundColor: getEventColor(task.status, task.priority),
                                        fontSize: 10,
                                    }}
                                >
                                    {task.title.charAt(0).toUpperCase()}
                                </Avatar>
                            </Tooltip>
                        ))}
                        {extraCount > 0 && (
                            <Tooltip title={`+${extraCount} công việc`}>
                                <Avatar
                                    size={20}
                                    style={{
                                        backgroundColor: '#d9d9d9',
                                        fontSize: 10,
                                    }}
                                >
                                    <FontAwesomeIcon icon={faEllipsisH} />
                                </Avatar>
                            </Tooltip>
                        )}
                    </div>
                </>
            );
        },
        [tasks],
    );

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: EVENT_COLORS.in_progress,
                    fontFamily: 'Inter, sans-serif',
                    borderRadius: 8,
                },
                components: {
                    Button: { borderRadius: 8, controlHeight: 44, paddingInline: 20 },
                    Modal: { borderRadius: 12, padding: 24 },
                    Card: { borderRadius: 12 },
                },
            }}
        >
            <div className="p-4 sm:p-6 bg-gray-50 space-y-4 text-base sm:text-sm">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lịch công việc</h1>
                    <Button
                        type="primary"
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={() => {
                            setIsModalOpen(true);
                            setSelectedTask(null);
                        }}
                    >
                        Thêm công việc
                    </Button>
                </div>

                <Card className="shadow">
                    <Spin spinning={loading} tip="Đang tải công việc...">
                        <Calendar
                            onSelect={handleDateSelect}
                            cellRender={dateCellRender}
                            className="custom-calendar [&_.ant-picker-calendar-date]:min-h-[100px]"
                            fullscreen={true}
                        />
                    </Spin>
                </Card>

                {/* Form Modal */}
                <Modal
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={null}
                    title={selectedTask ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
                    style={{ maxWidth: 600 }}
                >
                    <TaskForm
                        key={selectedTask?.id || 'new'}
                        taskId={selectedTask?.id}
                        initialValues={
                            selectedTask
                                ? {
                                      title: selectedTask.title,
                                      description: selectedTask.description,
                                      status: selectedTask.status,
                                      priority: selectedTask.priority,
                                      date: [dayjs(selectedTask.start_time), dayjs(selectedTask.end_time)],
                                  }
                                : undefined
                        }
                        onTaskCreated={handleTaskSubmit}
                        onClose={() => setIsModalOpen(false)}
                    />
                </Modal>

                {/* View Tasks Modal */}
                <Modal
                    open={isViewModalOpen}
                    onCancel={() => setIsViewModalOpen(false)}
                    title={
                        <div>
                            <div className="text-xl font-bold">
                                Công việc ngày {dayjs(selectedDate).format('DD/MM/YYYY')}
                            </div>
                            <div className="text-sm text-gray-500">{dayjs(selectedDate).format('dddd')}</div>
                        </div>
                    }
                    footer={
                        <Button
                            icon={<FontAwesomeIcon icon={faPlus} />}
                            onClick={() => {
                                setIsModalOpen(true);
                                setIsViewModalOpen(false);
                            }}
                        >
                            Thêm công việc
                        </Button>
                    }
                    style={{ maxWidth: 600 }}
                >
                    <List
                        dataSource={selectedDateTasks}
                        renderItem={(task) => (
                            <List.Item
                                onClick={() => handleEditTask(task)}
                                className="cursor-pointer hover:bg-gray-100 px-0 py-3"
                            >
                                <List.Item.Meta
                                    title={<div className="text-lg font-semibold">{task.title}</div>}
                                    description={
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            <Tag color={STATUS_TAGS[task.status].color}>
                                                {STATUS_TAGS[task.status].text}
                                            </Tag>
                                            <Tag color={PRIORITY_TAGS[task.priority].color}>
                                                {PRIORITY_TAGS[task.priority].text}
                                            </Tag>
                                            <span className="text-sm text-gray-600">
                                                {dayjs(task.start_time).format('HH:mm')} -{' '}
                                                {dayjs(task.end_time).format('HH:mm')}
                                            </span>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Modal>
            </div>
        </ConfigProvider>
    );
};

export default CalendarComponent;
