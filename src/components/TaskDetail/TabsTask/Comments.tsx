import React from 'react';
import { Button, List, Space, Typography, Input, Avatar } from 'antd';
import { SendOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { TaskComment } from '@services/types/types';

const { TextArea } = Input;
const { Text } = Typography;

interface CommentsProps {
    comments: TaskComment[];
    newComment: string;
    loading: boolean;
    editingCommentId: number | null;
    editCommentText: string;
    onCommentChange: (value: string) => void;
    onAddComment: () => void;
    onEditComment: (comment: TaskComment) => void;
    onCancelEdit: () => void;
    onSaveEdit: (commentId: number) => void;
    onDeleteComment: (commentId: number) => void;
    onEditCommentTextChange: (value: string) => void;
}

const Comments: React.FC<CommentsProps> = ({
    comments,
    newComment,
    loading,
    editingCommentId,
    editCommentText,
    onCommentChange,
    onAddComment,
    onEditComment,
    onCancelEdit,
    onSaveEdit,
    onDeleteComment,
    onEditCommentTextChange,
}) => {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex gap-2">
                    <TextArea
                        value={newComment}
                        onChange={(e) => onCommentChange(e.target.value)}
                        placeholder="Viết bình luận..."
                        rows={3}
                        className="flex-1"
                    />
                    <Button type="primary" onClick={onAddComment} icon={<SendOutlined />} loading={loading}>
                        Gửi
                    </Button>
                </div>
                {comments && comments.length > 0 ? (
                    <List
                        dataSource={comments}
                        renderItem={(comment) => (
                            <List.Item
                                actions={[
                                    editingCommentId === comment.id ? (
                                        <Space>
                                            <Button
                                                type="primary"
                                                size="small"
                                                onClick={() => onSaveEdit(comment.id)}
                                                loading={loading}
                                            >
                                                Lưu
                                            </Button>
                                            <Button size="small" onClick={onCancelEdit}>
                                                Hủy
                                            </Button>
                                        </Space>
                                    ) : (
                                        <Space>
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={() => onEditComment(comment)}
                                            />
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => onDeleteComment(comment.id)}
                                            />
                                        </Space>
                                    ),
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar>{comment.full_name ? comment.full_name.toUpperCase() : 'U'}</Avatar>
                                    }
                                    title={
                                        <Space>
                                            <span className="font-medium">
                                                {comment.full_name ? comment.full_name : 'Người dùng'}
                                            </span>
                                            <Text type="secondary" className="text-sm">
                                                {dayjs(comment.created_at).format('DD/MM/YYYY HH:mm')}
                                            </Text>
                                        </Space>
                                    }
                                    description={
                                        <div className="mt-2">
                                            {editingCommentId === comment.id ? (
                                                <TextArea
                                                    value={editCommentText}
                                                    onChange={(e) => onEditCommentTextChange(e.target.value)}
                                                    rows={3}
                                                    className="w-full"
                                                />
                                            ) : (
                                                <p className="text-gray-800">{comment.comment}</p>
                                            )}
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <div className="text-center py-4 text-gray-500">Chưa có bình luận nào</div>
                )}
            </div>
        </div>
    );
};

export default Comments;
