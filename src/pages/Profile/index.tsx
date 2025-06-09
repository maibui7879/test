import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Input, Button, Avatar, Typography, Divider, DatePicker, Upload, Select } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    PhoneOutlined,
    HomeOutlined,
    CameraOutlined,
} from '@ant-design/icons';
import { useUser } from '@/contexts/useAuth/userContext';
import { getMeProfile, updateMeProfile, changePassMe } from '@/services/userServices';
import { useMessage } from '@/hooks/useMessage';
import dayjs from 'dayjs';
import { ChangePasswordPayload, UpdateUserProfile } from '@services/types/types';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ChangePassword extends ChangePasswordPayload {
    confirmPassword: string;
}

const Profile = () => {
    const { user } = useUser();
    const { message, contextHolder } = useMessage();
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<any>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getMeProfile();
                if (res) {
                    if (res.avatar_url) {
                        setAvatarUrl(res.avatar_url);
                    }

                    form.setFieldsValue({
                        full_name: res.full_name,
                        email: res.email,
                        phone_number: res.phone_number || '',
                        gender: res.gender || 'other',
                        address: res.address || '',
                        bio: res.bio || '',
                        date_of_birth: res.date_of_birth ? dayjs(res.date_of_birth) : null,
                    });
                }
            } catch (error) {
                message.error({ key: 'fetch-profile-error', content: 'Failed to fetch profile' });
            }
        };

        fetchProfile();
    }, [form, message]);

    const handleFileChange = useCallback((info: any) => {
        const file = info.file.originFileObj;
        console.log('File selected:', file);
        if (file) {
            setAvatarFile(file);
            setAvatarUrl(URL.createObjectURL(file));
        }
    }, []);

    const handleError = useCallback(
        (error: unknown, defaultMessage: string, key: string) => {
            let errorMessage = defaultMessage;
            if (error instanceof Error && 'response' in error) {
                errorMessage = (error as any).response?.data?.message || 'Server error';
            } else if (error instanceof Error && 'request' in error) {
                errorMessage = 'No response from server';
            }
            message.error({ key, content: errorMessage });
        },
        [message],
    );

    const handleProfileUpdate = useCallback(
        async (values: Partial<UpdateUserProfile>) => {
            if (!user?.id) {
                message.error({ key: 'update-error', content: 'User not found' });
                return;
            }

            const loadingKey = 'update-profile-loading';
            setLoading(true);
            message.loading({ key: loadingKey, content: 'Updating profile...' });

            try {
                const payload: Partial<UpdateUserProfile> = {
                    full_name: values.full_name?.trim(),
                    phone_number: values.phone_number?.trim(),
                    gender: values.gender,
                    address: values.address?.trim(),
                    bio: values.bio?.trim(),
                };

                if (values.date_of_birth) {
                    const date = values.date_of_birth as any;
                    payload.date_of_birth = date?.format?.('YYYY-MM-DD') || null;
                }

                payload.avatar = avatarFile instanceof File ? avatarFile : user.avatar_url;

                const res = await updateMeProfile(payload);
                if (!res) return;

                if (res.avatar_url) {
                    setAvatarUrl(res.avatar_url);
                    setAvatarFile(null);
                }

                form.setFieldsValue({
                    full_name: res.full_name,
                    email: res.email,
                    phone_number: res.phone_number || '',
                    gender: res.gender || 'other',
                    address: res.address || '',
                    bio: res.bio || '',
                    date_of_birth: res.date_of_birth ? dayjs(res.date_of_birth) : null,
                });

                message.success({ key: loadingKey, content: 'Profile updated successfully!' });
            } catch (error) {
                console.error('Update error:', error);
                handleError(error, 'Failed to update profile', loadingKey);
            } finally {
                setLoading(false);
            }
        },
        [user, avatarFile, form, message, handleError],
    );

    const handlePasswordChange = useCallback(
        async (values: ChangePassword) => {
            if (!user?.id) return;

            const loadingKey = 'change-password-loading';
            setLoading(true);
            message.loading({ key: loadingKey, content: 'Changing password...' });

            try {
                const { confirmPassword, ...passwordData } = values;
                await changePassMe(passwordData);
                message.success({ key: loadingKey, content: 'Password changed successfully!' });
                passwordForm.resetFields();
            } catch (error) {
                handleError(error, 'Failed to change password', loadingKey);
            } finally {
                setLoading(false);
            }
        },
        [user, passwordForm, message, handleError],
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            {contextHolder}
            <div className="max-w-4xl mx-auto">
                <Card className="shadow-xl border-0 bg-white">
                    <div className="text-center mb-8">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <Avatar
                                size={120}
                                src={avatarUrl}
                                icon={<UserOutlined />}
                                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <Upload
                                customRequest={({ onSuccess }) => setTimeout(() => onSuccess?.('ok'), 0)}
                                onChange={handleFileChange}
                                showUploadList={false}
                                accept="image/*"
                                beforeUpload={(file) => {
                                    const isLt3M = file.size / 1024 / 1024 < 3;
                                    if (!isLt3M) {
                                        message.error({
                                            key: 'upload-size-error',
                                            content: 'Image must be smaller than 3MB!',
                                        });
                                        return Upload.LIST_IGNORE;
                                    }
                                    return true;
                                }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                                    <CameraOutlined className="text-white text-2xl" />
                                </div>
                            </Upload>
                        </div>
                        <Title level={4} className="mt-3 text-gray-800 font-semibold">
                            {user?.full_name || 'No name provided'}
                        </Title>
                    </div>

                    <Divider>Profile Information</Divider>

                    <Form form={form} layout="vertical" onFinish={handleProfileUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                name="full_name"
                                label="Full Name"
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || value.trim().length > 0) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Please enter your full name'));
                                        },
                                    }),
                                ]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Enter full name" />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Please enter a valid email'));
                                        },
                                    }),
                                ]}
                            >
                                <Input prefix={<MailOutlined />} disabled />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                name="phone_number"
                                label="Phone Number"
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || /^[0-9]{10}$/.test(value)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Please enter a valid phone number'));
                                        },
                                    }),
                                ]}
                            >
                                <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
                            </Form.Item>
                            <Form.Item
                                name="gender"
                                label="Gender"
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || ['male', 'female', 'other'].includes(value)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Please select a valid gender'));
                                        },
                                    }),
                                ]}
                            >
                                <Select>
                                    <Option value="male">Male</Option>
                                    <Option value="female">Female</Option>
                                    <Option value="other">Other</Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <Form.Item name="address" label="Address">
                            <Input prefix={<HomeOutlined />} placeholder="Enter address" />
                        </Form.Item>

                        <Form.Item
                            name="date_of_birth"
                            label="Date of Birth"
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || dayjs(value).isValid()) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Please enter a valid date'));
                                    },
                                }),
                            ]}
                        >
                            <DatePicker className="w-full" placeholder="Select date of birth" format="DD/MM/YYYY" />
                        </Form.Item>

                        <Form.Item name="bio" label="Bio">
                            <TextArea rows={4} placeholder="Enter your bio" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} className="w-full">
                                Update Profile
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider>Change Password</Divider>

                    <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange}>
                        <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true }]}>
                            <Input.Password prefix={<LockOutlined />} placeholder="Enter current password" />
                        </Form.Item>

                        <Form.Item name="newPassword" label="New Password" rules={[{ required: true, min: 6 }]}>
                            <Input.Password prefix={<LockOutlined />} placeholder="Enter new password" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Confirm New Password"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Please confirm your new password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} className="w-full">
                                Change Password
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
