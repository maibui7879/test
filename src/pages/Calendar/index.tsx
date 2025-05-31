import { useState, useEffect, useCallback, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';
import { Card, Button, Modal, List, Spin, Tag } from 'antd';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FaIcon from '@/utils/FaIconUtils';
import { getAllTaskUser } from '@services/taskServices';
import { TaskPayload } from '@services/types/types';
import dayjs from 'dayjs';
import TaskForm from '@/components/TaskForm';

const EVENT_COLORS = {
    done: '#059669',
    in_progress: '#2563EB',
    high: '#DC2626',
    medium: '#D97706',
    low: '#059669',
    default: '#4B5563',
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

function Calendar() {
    const [tasks, setTasks] = useState<TaskPayload[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTask, setSelectedTask] = useState<TaskPayload | null>(null);
    const [selectedDateTasks, setSelectedDateTasks] = useState<TaskPayload[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllTaskUser({
                page: 1,
                limit: 999999999,
            });

            if (response?.personalTasks) {
                const sortedTasks = [...response.personalTasks].sort(
                    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
                );
                setTasks(sortedTasks);
            } else {
                throw new Error('Định dạng dữ liệu không hợp lệ');
            }
        } catch (error: any) {
            console.error('Error fetching tasks:', error);
            toast.error(error.message || 'Không thể tải danh sách công việc', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleDateSelect = useCallback(
        (selectInfo: any) => {
            const selectedDate = selectInfo.start;
            const dayTasks = tasks.filter((task) => {
                const taskStartDate = dayjs(task.start_time);
                const taskEndDate = dayjs(task.end_time);
                const selectedDay = dayjs(selectedDate);

                // Kiểm tra nếu task nằm trong khoảng thời gian của ngày được chọn
                return (
                    (taskStartDate.isSame(selectedDay, 'day') || taskStartDate.isBefore(selectedDay, 'day')) &&
                    (taskEndDate.isSame(selectedDay, 'day') || taskEndDate.isAfter(selectedDay, 'day'))
                );
            });

            setSelectedDate(selectedDate);
            setSelectedDateTasks(dayTasks);
            setIsViewModalOpen(true);
        },
        [tasks],
    );

    const handleEventClick = useCallback(
        (clickInfo: any) => {
            const task = tasks.find((t) => t.id === clickInfo.event.id);
            if (task) {
                setSelectedTask(task);
                setIsModalOpen(true);
            }
        },
        [tasks],
    );

    const handleModalCancel = useCallback(() => {
        setIsModalOpen(false);
        setSelectedTask(null);
    }, []);

    const handleTaskCreated = useCallback(
        (taskData: TaskPayload) => {
            if (selectedTask) {
                // Nếu đang chỉnh sửa task
                const updatedTask = {
                    ...taskData,
                    id: selectedTask.id,
                    _id: selectedTask._id,
                };

                // Cập nhật trong danh sách tasks
                setTasks((prevTasks) => {
                    // Tạo bản sao của danh sách hiện tại
                    const currentTasks = [...prevTasks];
                    // Tìm và cập nhật task cần sửa
                    const taskIndex = currentTasks.findIndex(
                        (task) => task.id === selectedTask.id || task._id === selectedTask._id,
                    );
                    if (taskIndex !== -1) {
                        currentTasks[taskIndex] = updatedTask;
                    }
                    return currentTasks.sort(
                        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
                    );
                });

                if (selectedDate) {
                    setSelectedDateTasks((prevTasks) => {
                        const currentTasks = [...prevTasks];
                        const taskIndex = currentTasks.findIndex(
                            (task) => task.id === selectedTask.id || task._id === selectedTask._id,
                        );
                        if (taskIndex !== -1) {
                            currentTasks[taskIndex] = updatedTask;
                        }
                        return currentTasks.sort(
                            (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
                        );
                    });
                }
            } else {
                // Nếu đang tạo task mới
                setTasks((prevTasks) => {
                    const newTasks = [...prevTasks, taskData];
                    return newTasks.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
                });

                // Thêm task mới vào selectedDateTasks nếu task thuộc ngày đang xem
                if (selectedDate) {
                    const taskDate = dayjs(taskData.start_time);
                    if (taskDate.format('YYYY-MM-DD') === dayjs(selectedDate).format('YYYY-MM-DD')) {
                        setSelectedDateTasks((prevTasks) => {
                            const newTasks = [...prevTasks, taskData];
                            return newTasks.sort(
                                (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
                            );
                        });
                    }
                }
            }
            setIsModalOpen(false);
            setSelectedTask(null);
        },
        [selectedTask, selectedDate],
    );

    const getEventColor = useCallback((status: string, priority: string) => {
        if (status === 'done') return EVENT_COLORS.done;
        if (status === 'in_progress') return EVENT_COLORS.in_progress;
        if (priority === 'high') return EVENT_COLORS.high;
        if (priority === 'medium') return EVENT_COLORS.medium;
        return EVENT_COLORS.default;
    }, []);

    const calendarEvents = useMemo(
        () =>
            tasks.map((task) => ({
                id: task.id,
                title: task.title,
                start: task.start_time,
                end: task.end_time,
                backgroundColor: getEventColor(task.status, task.priority),
                borderColor: getEventColor(task.status, task.priority),
                extendedProps: {
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                },
            })),
        [tasks, getEventColor],
    );

    const handleAddNewTask = useCallback(() => {
        setSelectedTask(null);
        setIsViewModalOpen(false);
        setIsModalOpen(true);
    }, []);

    const handleEditTask = useCallback((task: TaskPayload) => {
        if (!task.id && !task._id) {
            toast.error('Không tìm thấy ID của công việc để chỉnh sửa');
            return;
        }

        setSelectedTask(task);
        setIsViewModalOpen(false);
        setIsModalOpen(true);
    }, []);

    const renderEventContent = useCallback(
        (eventInfo: any) => {
            const { event } = eventInfo;
            const date = dayjs(event.start);
            const dayTasks = tasks.filter((task) => {
                const taskDate = dayjs(task.start_time);
                return taskDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
            });

            return (
                <div className="p-0.5">
                    <div className="font-medium truncate text-base">{event.title}</div>
                </div>
            );
        },
        [tasks],
    );

    return (
        <div className="space-y-4 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-semibold text-gray-800">Lịch công việc</h1>
                <Button type="primary" icon={<FaIcon icon={FaPlus} />} onClick={handleAddNewTask}>
                    Thêm công việc
                </Button>
            </div>

            <Card className="shadow-sm">
                <Spin spinning={loading}>
                    <div className="overflow-x-auto">
                        <div className="calendar-custom">
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                                }}
                                locale={viLocale}
                                selectable={true}
                                selectMirror={true}
                                dayMaxEvents={3}
                                weekends={true}
                                events={calendarEvents}
                                select={handleDateSelect}
                                eventClick={handleEventClick}
                                height="auto"
                                eventTimeFormat={{
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    meridiem: false,
                                    hour12: false,
                                }}
                                eventDisplay="block"
                                eventMinHeight={12}
                                slotMinTime="06:00:00"
                                slotMaxTime="22:00:00"
                                allDaySlot={false}
                                slotDuration="00:30:00"
                                slotLabelInterval="01:00"
                                nowIndicator={true}
                                businessHours={{
                                    daysOfWeek: [1, 2, 3, 4, 5],
                                    startTime: '08:00',
                                    endTime: '18:00',
                                }}
                                eventContent={renderEventContent}
                                moreLinkContent={(args) => {
                                    return `+${args.num} công việc`;
                                }}
                                views={{
                                    dayGridMonth: {
                                        dayMaxEventRows: 3,
                                        fixedWeekCount: false,
                                        showNonCurrentDates: false,
                                    },
                                    timeGridWeek: {
                                        dayHeaderFormat: { weekday: 'long' },
                                        slotMinTime: '06:00:00',
                                        slotMaxTime: '22:00:00',
                                        slotDuration: '00:30:00',
                                        slotLabelInterval: '01:00',
                                    },
                                    timeGridDay: {
                                        slotMinTime: '06:00:00',
                                        slotMaxTime: '22:00:00',
                                        slotDuration: '00:30:00',
                                        slotLabelInterval: '01:00',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </Spin>
            </Card>

            <Modal
                title={`Công việc ngày ${selectedDate ? dayjs(selectedDate).format('DD/MM/YYYY') : ''}`}
                open={isViewModalOpen}
                onCancel={() => setIsViewModalOpen(false)}
                footer={[
                    <Button key="add" type="primary" onClick={handleAddNewTask}>
                        Thêm công việc mới
                    </Button>,
                ]}
                width={600}
            >
                <List
                    dataSource={selectedDateTasks}
                    renderItem={(task) => (
                        <List.Item
                            key={task.id}
                            actions={[
                                <Button type="link" onClick={() => handleEditTask(task)}>
                                    Chỉnh sửa
                                </Button>,
                            ]}
                        >
                            <List.Item.Meta
                                title={task.title}
                                description={
                                    <div className="space-y-2">
                                        <div>{task.description}</div>
                                        <div className="flex gap-2">
                                            <Tag color={STATUS_TAGS[task.status].color}>
                                                {STATUS_TAGS[task.status].text}
                                            </Tag>
                                            <Tag color={PRIORITY_TAGS[task.priority].color}>
                                                {PRIORITY_TAGS[task.priority].text}
                                            </Tag>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {dayjs(task.start_time).format('HH:mm')} -
                                            {dayjs(task.end_time).format('HH:mm')}
                                        </div>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                    locale={{
                        emptyText: 'Không có công việc nào trong ngày này',
                    }}
                />
            </Modal>

            <Modal
                title={selectedTask ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
                open={isModalOpen}
                onCancel={handleModalCancel}
                footer={null}
                width={600}
            >
                <TaskForm
                    onTaskCreated={handleTaskCreated}
                    onClose={handleModalCancel}
                    initialValues={
                        selectedTask
                            ? {
                                  title: selectedTask.title,
                                  description: selectedTask.description,
                                  status: selectedTask.status,
                                  priority: selectedTask.priority,
                                  date: [dayjs(selectedTask.start_time), dayjs(selectedTask.end_time)],
                              }
                            : selectedDate
                              ? {
                                    date: [dayjs(selectedDate), dayjs(selectedDate).add(1, 'hour')],
                                }
                              : undefined
                    }
                    taskId={selectedTask?.id || selectedTask?._id}
                />
            </Modal>

            <style>{`
                .calendar-custom {
                    --fc-border-color: #E5E7EB;
                    --fc-button-bg-color: #2563EB;
                    --fc-button-border-color: #2563EB;
                    --fc-button-hover-bg-color: #1D4ED8;
                    --fc-button-hover-border-color: #1D4ED8;
                    --fc-button-active-bg-color: #1E40AF;
                    --fc-button-active-border-color: #1E40AF;
                    --fc-today-bg-color: #EFF6FF;
                    --fc-neutral-bg-color: #F9FAFB;
                    --fc-list-event-hover-bg-color: #F3F4F6;
                    --fc-highlight-color: rgba(188, 232, 241, 0.3);
                    min-height: 600px;
                    width: 100%;
                }

                .calendar-custom .fc {
                    width: 100% !important;
                }

                .calendar-custom .fc-view-harness {
                    min-height: 500px;
                }

                .calendar-custom .fc-scrollgrid {
                    border: none !important;
                }

                .calendar-custom .fc-scrollgrid-section > * {
                    border: 1px solid var(--fc-border-color);
                }

                .calendar-custom .fc-daygrid-body {
                    width: 100% !important;
                }

                .calendar-custom .fc-daygrid-day-frame {
                    min-height: 100px;
                }

                .calendar-custom .fc-event {
                    border-radius: 4px;
                    border: none;
                    padding: 0.5px 4px;
                    margin: 1px 0;
                    transition: all 0.2s ease;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                    background-color: rgba(37, 99, 235, 0.1);
                }

                .calendar-custom .fc-event-title {
                    font-weight: 500;
                    font-size: 1.1rem;
                    line-height: 1.2;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .calendar-custom .fc-event-time {
                    font-size: 1rem;
                    opacity: 0.9;
                }

                .calendar-custom .fc-more-link {
                    font-size: 1rem;
                    color: #2563EB;
                    font-weight: 600;
                }

                .calendar-custom .fc-daygrid-day {
                    width: 14.28% !important;
                }

                .calendar-custom .fc-col-header-cell {
                    width: 14.28% !important;
                }

                .calendar-custom .fc-scrollgrid-section-body {
                    width: 100% !important;
                }

                .calendar-custom .fc-scrollgrid-section-header {
                    width: 100% !important;
                }

                @media (max-width: 768px) {
                    .calendar-custom {
                        min-height: 400px;
                    }

                    .calendar-custom .fc-view-harness {
                        min-height: 300px;
                    }

                    .calendar-custom .fc-toolbar {
                        flex-direction: column;
                        gap: 8px;
                    }

                    .calendar-custom .fc-toolbar-chunk {
                        display: flex;
                        justify-content: center;
                    }

                    .calendar-custom .fc-toolbar-title {
                        font-size: 1.2rem !important;
                    }

                    .calendar-custom .fc-button {
                        padding: 4px 8px !important;
                        font-size: 0.9rem !important;
                    }

                    .calendar-custom .fc-daygrid-day-number {
                        font-size: 0.9rem;
                    }

                    .calendar-custom .fc-event-title {
                        font-size: 0.9rem;
                    }

                    .calendar-custom .fc-event-time {
                        font-size: 0.8rem;
                    }

                    .calendar-custom .fc-more-link {
                        font-size: 0.8rem;
                    }
                }

                @media (max-width: 480px) {
                    .calendar-custom {
                        min-height: 300px;
                    }

                    .calendar-custom .fc-view-harness {
                        min-height: 200px;
                    }

                    .calendar-custom .fc-toolbar-title {
                        font-size: 1rem !important;
                    }

                    .calendar-custom .fc-button {
                        padding: 3px 6px !important;
                        font-size: 0.8rem !important;
                    }

                    .calendar-custom .fc-daygrid-day-number {
                        font-size: 0.8rem;
                    }

                    .calendar-custom .fc-event-title {
                        font-size: 0.8rem;
                    }

                    .calendar-custom .fc-event-time {
                        font-size: 0.7rem;
                    }

                    .calendar-custom .fc-more-link {
                        font-size: 0.7rem;
                    }

                    .calendar-custom .fc-daygrid-day-frame {
                        min-height: 80px;
                    }
                }
            `}</style>
        </div>
    );
}

export default Calendar;
