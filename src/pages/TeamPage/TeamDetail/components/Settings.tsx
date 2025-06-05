import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Card, Upload, Modal, Row, Col, Typography, Spin } from 'antd';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import {
    DeleteOutlined,
    UserOutlined,
    MailOutlined,
    ClockCircleOutlined,
    EditOutlined,
    LoadingOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useMessage } from '@/hooks/useMessage';
import { useNavigate } from 'react-router-dom';
import getTeamById from '@/services/teamServices/getTeamById';
import { Team } from '@services/types/types';
import { deleteTeam, updateTeam } from '@services/teamServices';
import { useUser } from '@/contexts/useAuth/userContext';
import type { UpdateTeamPayload } from '@/services/types/types';

const { Title, Text } = Typography;

interface SettingsProps {
    teamId: string | undefined;
    onSettingsChange?: () => void;
}

const getBase64 = (img: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const Settings = ({ teamId, onSettingsChange }: SettingsProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetchingTeam, setFetchingTeam] = useState(true);
    const [teamData, setTeamData] = useState<Team | undefined>(undefined);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const { message, contextHolder } = useMessage();
    const navigate = useNavigate();
    const { user } = useUser();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
    const draggleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!teamId) {
                setFetchingTeam(false);
                return;
            }
            setFetchingTeam(true);
            setFetchError(null);
            try {
                const data = await getTeamById(teamId);
                setTeamData(data);
                form.setFieldsValue({
                    name: data.name,
                    description: data.description,
                });
                setAvatarUrl(data.avatar_url || '');
            } catch (error: any) {
                console.error('Error fetching team data:', error);
                setFetchError(error.message || 'Không thể tải thông tin nhóm.');
                message.error({
                    key: 'fetch-error',
                    content: error.message || 'Không thể tải thông tin nhóm.',
                });
            } finally {
                setFetchingTeam(false);
            }
        };
        fetchData();
    }, [teamId, form, message]);

    const beforeUpload = (file: File) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error({
                key: 'upload-type-error',
                content: 'Chỉ có thể tải lên file JPG/PNG!',
            });
            return Upload.LIST_IGNORE;
        }
        const isLt3M = file.size / 1024 / 1024 < 3;
        if (!isLt3M) {
            message.error({
                key: 'upload-size-error',
                content: 'Ảnh phải nhỏ hơn 3MB!',
            });
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    const handleFileChange: UploadProps['onChange'] = (info) => {
        const file = info.file.originFileObj;
        if (file) {
            setAvatarFile(file);
            setAvatarUrl(URL.createObjectURL(file));
        }
    };

    const uploadButton = (
        <div className="flex flex-col items-center justify-center h-full">
            {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="mt-2">Tải ảnh lên</div>
        </div>
    );

    const handleSubmit = async (values: any) => {
        if (!teamId || !teamData) {
            message.error({ key: 'update-team', content: 'Không tìm thấy thông tin nhóm' });
            return;
        }

        try {
            setLoading(true);
            message.loading({ key: 'update-team', content: 'Đang cập nhật thông tin nhóm...' });

            const payload: UpdateTeamPayload = {
                name: values.name.trim(),
                description: values.description.trim(),
                avatar: values.avatar_url?.[0]?.originFileObj || null,
            };

            const response = await updateTeam(Number(teamId), payload);
            if (response) {
                setTeamData((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        name: values.name.trim(),
                        description: values.description.trim(),
                        avatar_url: values.avatar_url?.[0]?.originFileObj
                            ? URL.createObjectURL(values.avatar_url[0].originFileObj)
                            : prev.avatar_url,
                    };
                });
                setIsEditing(false);
                message.success({ key: 'update-team', content: 'Cập nhật thông tin nhóm thành công!' });
                if (onSettingsChange) {
                    onSettingsChange();
                }
            }
        } catch (error: any) {
            message.error({ key: 'update-team', content: error.message || 'Không thể cập nhật thông tin nhóm' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarUrl(teamData?.avatar_url || '');
        form.setFieldsValue({
            name: teamData?.name,
            description: teamData?.description,
        });
    };

    const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };

    const handleDeleteTeam = () => {
        if (!teamId) return;
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!teamId) return;

        setDeleteLoading(true);
        try {
            await deleteTeam(Number(teamId));
            setDeleteModalOpen(false);

            if (teamData?.creator_id === user?.id) {
                navigate('/teams/created');
            } else {
                navigate('/teams/joined');
            }
        } catch (error: any) {
            console.error('Error deleting team:', error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
    };

    if (fetchingTeam) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" tip="Đang tải thông tin nhóm..." />
            </div>
        );
    }

    if (fetchError || !teamId || !teamData) {
        return (
            <div className="text-center text-red-500 mt-8">
                <p>{fetchError || 'Không thể tải thông tin nhóm.'}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {contextHolder}
            <Card title="Thông tin cơ bản" className="shadow-lg rounded-lg mb-6">
                <Row gutter={[24, 24]} align="top">
                    <Col xs={24} md={8} className="flex justify-center md:justify-start">
                        <div className="relative w-48 h-48 mb-4">
                            {isEditing ? (
                                <Upload
                                    name="avatar"
                                    listType="picture-circle"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    customRequest={({ onSuccess }) => setTimeout(() => onSuccess?.('ok'), 0)}
                                    beforeUpload={beforeUpload}
                                    onChange={handleFileChange}
                                >
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt="Team Avatar"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        uploadButton
                                    )}
                                </Upload>
                            ) : (
                                <img
                                    src={avatarUrl || '/default-team-avatar.png'}
                                    alt="Team Avatar"
                                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            )}
                        </div>
                    </Col>
                    <Col xs={24} md={16}>
                        {isEditing ? (
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                initialValues={{
                                    name: teamData.name,
                                    description: teamData.description,
                                }}
                            >
                                <Form.Item
                                    name="name"
                                    label="Tên nhóm"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tên nhóm' },
                                        { min: 3, message: 'Tên nhóm phải có ít nhất 3 ký tự' },
                                    ]}
                                >
                                    <Input placeholder="Nhập tên nhóm" />
                                </Form.Item>

                                <Form.Item
                                    name="description"
                                    label="Mô tả"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mô tả' },
                                        { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự' },
                                    ]}
                                >
                                    <Input.TextArea
                                        rows={4}
                                        placeholder="Nhập mô tả về nhóm của bạn"
                                        maxLength={500}
                                        showCount
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <div className="flex gap-2">
                                        <Button type="primary" htmlType="submit" loading={loading}>
                                            Lưu thay đổi
                                        </Button>
                                        <Button onClick={handleCancel}>Hủy</Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow pr-4">
                                        <div className="mb-3">
                                            <div className="font-semibold text-gray-700">Tên nhóm:</div>
                                            <div>{teamData.name || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-700">Mô tả:</div>
                                            <div>{teamData.description || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <Button type="text" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                                        Chỉnh sửa
                                    </Button>
                                </div>

                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <Title level={5} className="mt-0 mb-4 text-gray-700">
                                        Thông tin người tạo
                                    </Title>
                                    <div className="space-y-3 text-gray-600">
                                        <div className="flex items-center">
                                            <UserOutlined className="text-gray-500 mr-2" />
                                            <Text>{teamData.creator_name || 'N/A'}</Text>
                                        </div>
                                        <div className="flex items-center">
                                            <MailOutlined className="text-gray-500 mr-2" />
                                            <Text>{teamData.creator_email || 'N/A'}</Text>
                                        </div>
                                        <div className="flex items-center">
                                            <ClockCircleOutlined className="text-gray-500 mr-2" />
                                            <Text>
                                                {teamData.created_at
                                                    ? new Date(teamData.created_at).toLocaleDateString('vi-VN')
                                                    : 'N/A'}
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Col>
                </Row>
            </Card>

            <Card title="Cài đặt nâng cao" className="shadow-lg rounded-lg bg-red-50 border border-red-200">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-red-700 mb-2">Vùng nguy hiểm</h3>
                        <p className="text-red-600 mb-4">
                            Các hành động trong khu vực này có thể ảnh hưởng nghiêm trọng đến nhóm của bạn. Vui lòng cẩn
                            thận khi thực hiện.
                        </p>
                    </div>

                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleDeleteTeam}
                        className="hover:!bg-red-600 transition-colors duration-200"
                    >
                        Xóa nhóm
                    </Button>
                </div>
            </Card>

            <Modal
                title={
                    <div
                        style={{ width: '100%', cursor: 'move' }}
                        onMouseOver={() => {
                            if (disabled) {
                                setDisabled(false);
                            }
                        }}
                        onMouseOut={() => {
                            setDisabled(true);
                        }}
                        onFocus={() => {}}
                        onBlur={() => {}}
                    >
                        Xác nhận xóa nhóm
                    </div>
                }
                open={deleteModalOpen}
                onOk={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                okText="Đồng ý xóa"
                cancelText="Hủy"
                okType="danger"
                okButtonProps={{
                    danger: true,
                    className: 'hover:!bg-red-600',
                    loading: deleteLoading,
                }}
                cancelButtonProps={{
                    className: 'hover:!bg-gray-100',
                    disabled: deleteLoading,
                }}
                modalRender={(modal) => (
                    <Draggable
                        disabled={disabled}
                        bounds={bounds}
                        nodeRef={draggleRef as React.RefObject<HTMLElement>}
                        onStart={(event, uiData) => onStart(event, uiData)}
                    >
                        <div ref={draggleRef}>{modal}</div>
                    </Draggable>
                )}
            >
                <div className="space-y-4">
                    <p className="text-red-600 font-medium">Bạn có chắc chắn muốn xóa nhóm này?</p>
                    <p className="text-gray-600">
                        Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn tất cả dữ liệu liên quan đến nhóm.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default Settings;
