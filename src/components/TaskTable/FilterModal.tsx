import React from 'react';
import { Modal, Form, DatePicker, Select, Button, Space } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { FilterModalProps } from './types';
import { STATUS_TAGS, PRIORITY_TAGS } from './tableState';
import dayjs from 'dayjs';

const FilterModal = ({ visible, onClose, onFilter, teamId, teamMembers = [] }: FilterModalProps) => {
    const [form] = Form.useForm();

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const filters: any = {};

            if (values.status) {
                filters.status = values.status;
            }

            if (values.priority) {
                filters.priority = values.priority;
            }

            if (values.dateRange) {
                const [startDate, endDate] = values.dateRange;
                filters.startDate = dayjs(startDate).format('YYYY-MM-DD HH:mm:ss');
                filters.endDate = dayjs(endDate).format('YYYY-MM-DD HH:mm:ss');
            }

            if (values.assignee) {
                filters.assigned_user_id = values.assignee;
            }

            // Chỉ gửi các filter có giá trị
            const validFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null && value !== ''),
            );

            onFilter(validFilters);
            onClose();
        });
    };

    const handleReset = () => {
        form.resetFields();
        onFilter({});
    };

    return (
        <Modal
            title={
                <div className="flex items-center text-lg sm:text-xl font-semibold">
                    <FilterOutlined className="mr-2" />
                    Lọc công việc
                </div>
            }
            open={visible}
            onCancel={onClose}
            width={window.innerWidth < 640 ? '95%' : 500}
            className="filter-modal"
            footer={[
                <Space key="footer" className="w-full justify-end">
                    <Button icon={<ReloadOutlined />} onClick={handleReset} className="!flex !items-center">
                        Đặt lại
                    </Button>
                    <Button type="primary" onClick={handleSubmit} className="!flex !items-center">
                        Áp dụng
                    </Button>
                </Space>,
            ]}
        >
            <Form form={form} layout="vertical" className="space-y-4">
                <Form.Item name="status" label={<span className="text-sm sm:text-base font-medium">Trạng thái</span>}>
                    <Select
                        placeholder="Chọn trạng thái"
                        allowClear
                        className="w-full"
                        options={Object.entries(STATUS_TAGS).map(([value, { text }]) => ({
                            value,
                            label: text,
                        }))}
                    />
                </Form.Item>

                <Form.Item name="priority" label={<span className="text-sm sm:text-base font-medium">Độ ưu tiên</span>}>
                    <Select
                        placeholder="Chọn độ ưu tiên"
                        allowClear
                        className="w-full"
                        options={Object.entries(PRIORITY_TAGS).map(([value, { text }]) => ({
                            value,
                            label: text,
                        }))}
                    />
                </Form.Item>

                {teamId && teamMembers && teamMembers.length > 0 && (
                    <Form.Item
                        name="assignee"
                        label={<span className="text-sm sm:text-base font-medium">Người thực hiện</span>}
                    >
                        <Select
                            placeholder="Chọn người thực hiện"
                            allowClear
                            className="w-full"
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label as string).toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {teamMembers.map((member) => (
                                <Select.Option key={member.id} value={member.id}>
                                    {member.full_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                <Form.Item name="dateRange" label={<span className="text-sm sm:text-base font-medium">Thời gian</span>}>
                    <DatePicker.RangePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        className="w-full"
                        placeholder={['Từ ngày', 'Đến ngày']}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FilterModal;
