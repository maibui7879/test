import React, { useState } from 'react';
import { Form, Input, Button, Card, Upload, message, Modal } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

interface SettingsProps {
    teamId: string | undefined;
}

const Settings = ({ teamId }: SettingsProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            console.log('Form values:', values);
            message.success('Cập nhật thông tin nhóm thành công!');
        } catch (error) {
            message.error('Có lỗi xảy ra khi cập nhật thông tin nhóm!');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTeam = () => {
        Modal.confirm({
            title: 'Xác nhận xóa nhóm',
            content: 'Bạn có chắc chắn muốn xóa nhóm này? Hành động này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                message.success('Đã xóa nhóm thành công!');
            },
        });
    };

    const uploadProps: UploadProps = {
        name: 'file',
        action: '/api/upload', // Replace with your upload endpoint
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} tải lên thành công`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} tải lên thất bại`);
            }
        },
    };

    return (
        <div className="space-y-6">
            <Card title="Thông tin cơ bản">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        name: 'Tên nhóm mẫu',
                        description: 'Mô tả về nhóm của bạn',
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Tên nhóm"
                        rules={[{ required: true, message: 'Vui lòng nhập tên nhóm' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item label="Logo nhóm">
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>Tải lên logo</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Lưu thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Card title="Cài đặt nâng cao" className="bg-red-50">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-red-600 mb-2">Vùng nguy hiểm</h3>
                        <p className="text-gray-600 mb-4">
                            Các hành động trong khu vực này có thể ảnh hưởng nghiêm trọng đến nhóm của bạn. Vui lòng cẩn
                            thận khi thực hiện.
                        </p>
                    </div>

                    <Button danger icon={<DeleteOutlined />} onClick={handleDeleteTeam}>
                        Xóa nhóm
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Settings;
