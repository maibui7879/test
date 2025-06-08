import React from 'react';
import { Modal, Form, DatePicker, Select, Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { FilterModalProps } from './types';
import dayjs from 'dayjs';

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onFilter, teamMembers }) => {
    const [form] = Form.useForm();

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const filters: any = {};

            // Xử lý status
            if (values.status) {
                filters.status = values.status;
            }

            // Xử lý priority
            if (values.priority) {
                filters.priority = values.priority;
            }

            // Xử lý date range
            if (values.dateRange) {
                filters.startDate = values.dateRange[0].format('YYYY-MM-DD HH:mm:ss');
                filters.endDate = values.dateRange[1].format('YYYY-MM-DD HH:mm:ss');
            }

            // Xử lý assignee (nếu có)
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
                <div className="flex items-center">
                    <FilterOutlined className="mr-2" />
                    Lọc công việc
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="reset" onClick={handleReset}>
                    Đặt lại
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Áp dụng
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="status" label="Trạng thái">
                    <Select placeholder="Chọn trạng thái" allowClear>
                        <Select.Option value="todo">Chưa thực hiện</Select.Option>
                        <Select.Option value="in_progress">Đang thực hiện</Select.Option>
                        <Select.Option value="done">Hoàn thành</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name="priority" label="Độ ưu tiên">
                    <Select placeholder="Chọn độ ưu tiên" allowClear>
                        <Select.Option value="low">Thấp</Select.Option>
                        <Select.Option value="medium">Trung bình</Select.Option>
                        <Select.Option value="high">Cao</Select.Option>
                    </Select>
                </Form.Item>

                {teamMembers && (
                    <Form.Item name="assignee" label="Người thực hiện">
                        <Select placeholder="Chọn người thực hiện" allowClear>
                            {teamMembers.map((member) => (
                                <Select.Option key={member.id} value={member.id}>
                                    {member.full_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                <Form.Item name="dateRange" label="Thời gian">
                    <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" className="w-full" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FilterModal;
