import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Avatar, Row, Col, Typography, Divider, DatePicker, Upload, Select } from 'antd';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    SaveOutlined,
    PhoneOutlined,
    HomeOutlined,
    CameraOutlined,
} from '@ant-design/icons';
import { useUser } from '@/contexts/useAuth/userContext';
import { UserProfile, UpdateUserProfile, ChangePasswordPayload } from '@/services/types/types';
import { getMeProfile, updateMeProfile, changePassMe } from '@/services/userServices';
import { useMessage } from '@/hooks/useMessage';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const genderMap: Record<string, string> = {
    male: 'Nam',
    female: 'Nữ',
    other: 'Khác',
};

interface CustomUploadFile extends UploadFile {
    originFileObj?: RcFile;
}

interface FormValues {
    full_name?: string;
    email?: string;
    phone_number?: string;
    gender?: string;
    address?: string;
    bio?: string;
    date_of_birth?: any;
}

const Profile: React.FC = () => {
    const { user, fetchUserInfo } = useUser();
    const { message, contextHolder } = useMessage();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [passwordForm] = Form.useForm();
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [fileList, setFileList] = useState<CustomUploadFile[]>([]);
    const [selectedGender, setSelectedGender] = useState<string>('other');

    useEffect(() => {
        const fetchProfile = async (): Promise<void> => {
            try {
                const res = await getMeProfile();
                if (res) {
                    await fetchUserInfo();

                    if (res.avatar_url) {
                        setAvatarUrl(res.avatar_url);
                        setFileList([
                            {
                                uid: '-1',
                                name: 'avatar.png',
                                status: 'done',
                                url: res.avatar_url,
                            },
                        ]);
                    }

                    setSelectedGender(res.gender || 'other');

                    form.setFieldsValue({
                        full_name: res.full_name,
                        email: res.email,
                        phone_number: res.phone_number || '',
                        gender: res.gender || 'other',
                        address: res.address || '',
                        bio: res.bio || '',
                        date_of_birth: res.date_of_birth ? res.date_of_birth : null,
                    });
                }
            } catch (error) {
                console.error('Không thể lấy thông tin profile:', error);
                message.error({
                    key: 'fetch-profile-error',
                    content: 'Không thể lấy thông tin profile',
                });
            }
        };

        fetchProfile();
    }, []);

    const uploadProps = {
        onRemove: () => {
            setFileList([]);
            setAvatarUrl('');
        },
        beforeUpload: (file: RcFile) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error({
                    key: 'upload-image-error',
                    content: 'Bạn chỉ có thể tải lên file hình ảnh!',
                });
                return Upload.LIST_IGNORE;
            }

            const isLessThan3MB = file.size / 1024 / 1024 < 3;
            if (!isLessThan3MB) {
                message.error({
                    key: 'upload-size-error',
                    content: 'Hình ảnh phải nhỏ hơn 3MB!',
                });
                return Upload.LIST_IGNORE;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setAvatarUrl(reader.result as string);
            };

            setFileList([
                {
                    uid: '-1',
                    name: file.name,
                    status: 'done',
                    originFileObj: file,
                },
            ]);
            return false;
        },
        fileList,
        listType: 'picture' as const,
        maxCount: 1,
        multiple: false,
    };

    const handleProfileUpdate = async (values: FormValues): Promise<void> => {
        if (!user?.id) return;

        values.gender = selectedGender;

        setLoading(true);
        const loadingKey = 'update-profile-loading';
        message.loading({
            key: loadingKey,
            content: 'Đang cập nhật thông tin...',
        });

        try {
            const updateData: UpdateUserProfile = {
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
                full_name: values.full_name,
                phone_number: values.phone_number,
                gender: values.gender,
                address: values.address,
                bio: values.bio,
                date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null,
                avatar_url: fileList[0]?.originFileObj || user.avatar_url,
            };

            const res = await updateMeProfile(updateData);

            if (res) {
                await fetchUserInfo();
                message.success({
                    key: loadingKey,
                    content: 'Cập nhật thông tin thành công!',
                });
            }
        } catch (error: any) {
            console.error('Error updating profile:', error);
            let errorMessage = 'Không thể cập nhật thông tin. Vui lòng thử lại!';

            if (error.response) {
                errorMessage = `Không thể cập nhật thông tin: ${error.response.data.message || error.response.data.err || 'Lỗi server'}`;
            } else if (error.request) {
                errorMessage = 'Không nhận được phản hồi từ server. Vui lòng thử lại!';
            }

            message.error({
                key: loadingKey,
                content: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (values: { currentPassword: string; newPassword: string }): Promise<void> => {
        if (!user?.id) return;

        setLoading(true);
        const loadingKey = 'change-password-loading';
        message.loading({
            key: loadingKey,
            content: 'Đang thay đổi mật khẩu...',
        });

        try {
            const payload: ChangePasswordPayload = {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            };

            await changePassMe(payload);
            message.success({
                key: loadingKey,
                content: 'Đổi mật khẩu thành công!',
            });
            passwordForm.resetFields();
        } catch (error: any) {
            console.error('Error changing password:', error);
            let errorMessage = 'Không thể thay đổi mật khẩu. Vui lòng thử lại!';

            if (error.response) {
                errorMessage = `Không thể thay đổi mật khẩu: ${error.response.data.message || error.response.data.err || 'Lỗi server'}`;
            } else if (error.request) {
                errorMessage = 'Không nhận được phản hồi từ server. Vui lòng thử lại!';
            }

            message.error({
                key: loadingKey,
                content: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            {contextHolder}
            <div className="max-w-4xl mx-auto">
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <div className="text-center mb-8">
                        <Upload {...uploadProps} className="avatar-uploader">
                            <div className="relative w-32 h-32 mx-auto mb-4">
                                <Avatar
                                    size={120}
                                    src={avatarUrl}
                                    icon={<UserOutlined />}
                                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200">
                                    <CameraOutlined className="text-white text-2xl" />
                                </div>
                            </div>
                        </Upload>
                        <Title level={4} className="mt-3 text-gray-800 font-semibold">
                            {user?.full_name || 'Chưa cập nhật tên'}
                        </Title>
                    </div>

                    <Divider className="my-8 border-gray-200" />

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleProfileUpdate}
                        initialValues={{ gender: 'other' }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                name="full_name"
                                label={<span className="text-gray-700 font-medium">Họ và tên</span>}
                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined className="text-blue-500" />}
                                    placeholder="Nhập họ và tên"
                                    className="rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label={<span className="text-gray-700 font-medium">Email</span>}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined className="text-blue-500" />}
                                    disabled
                                    className="rounded-lg bg-gray-50 cursor-not-allowed"
                                />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                name="phone_number"
                                label={<span className="text-gray-700 font-medium">Số điện thoại</span>}
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input
                                    prefix={<PhoneOutlined className="text-blue-500" />}
                                    placeholder="Nhập số điện thoại"
                                    className="rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                />
                            </Form.Item>
                            <Form.Item
                                name="gender"
                                label={<span className="text-gray-700 font-medium">Giới tính</span>}
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                            >
                                <Select
                                    value={selectedGender}
                                    onChange={setSelectedGender}
                                    className="rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                >
                                    <Option value="male">Nam</Option>
                                    <Option value="female">Nữ</Option>
                                    <Option value="other">Khác</Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <Form.Item name="address" label={<span className="text-gray-700 font-medium">Địa chỉ</span>}>
                            <Input
                                prefix={<HomeOutlined className="text-blue-500" />}
                                placeholder="Nhập địa chỉ"
                                className="rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            />
                        </Form.Item>

                        <Form.Item
                            name="date_of_birth"
                            label={<span className="text-gray-700 font-medium">Ngày sinh</span>}
                        >
                            <DatePicker
                                className="w-full rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                placeholder="Chọn ngày sinh"
                                format="DD/MM/YYYY"
                            />
                        </Form.Item>

                        <Form.Item name="bio" label={<span className="text-gray-700 font-medium">Giới thiệu</span>}>
                            <TextArea
                                rows={4}
                                placeholder="Nhập giới thiệu về bản thân"
                                className="rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                icon={<SaveOutlined />}
                                className="w-full h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Cập nhật thông tin
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider className="my-8 border-gray-200">
                        <span className="text-gray-500 font-medium">Đổi mật khẩu</span>
                    </Divider>

                    <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange} className="space-y-6">
                        <Form.Item
                            name="currentPassword"
                            label={<span className="text-gray-700 font-medium">Mật khẩu hiện tại</span>}
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-blue-500" />}
                                placeholder="Nhập mật khẩu hiện tại"
                                className="rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            />
                        </Form.Item>

                        <Form.Item
                            name="newPassword"
                            label={<span className="text-gray-700 font-medium">Mật khẩu mới</span>}
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-blue-500" />}
                                placeholder="Nhập mật khẩu mới"
                                className="rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label={<span className="text-gray-700 font-medium">Xác nhận mật khẩu mới</span>}
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-blue-500" />}
                                placeholder="Nhập lại mật khẩu mới"
                                className="rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                icon={<LockOutlined />}
                                className="w-full h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Đổi mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
