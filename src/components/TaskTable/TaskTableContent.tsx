import React from 'react';
import { Table, Input, Button, Spin, Tooltip } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { TaskPayload } from '@services/types/types';
import useDebounce from '@hooks/useDebounce';

interface TaskTableContentProps {
    loading: boolean;
    error: string | null;
    onReload: () => void;
    searchText: string;
    setSearchText: (text: string) => void;
    filteredTasks: TaskPayload[];
    columns: any[];
}

function TaskTableContent({
    loading,
    error,
    onReload,
    searchText,
    setSearchText,
    filteredTasks,
    columns,
}: TaskTableContentProps) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg shadow-sm">
                <Spin size="large" className="text-blue-500" />
                <p className="mt-4 text-gray-600 font-medium">Đang tải danh sách công việc...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 border border-red-200 rounded-lg my-5">
                <h2 className="text-red-600 text-xl font-semibold mb-4">Lỗi</h2>
                <p className="text-red-500 mb-6 text-base">{error}</p>
                <Button
                    type="primary"
                    onClick={onReload}
                    icon={<ReloadOutlined />}
                    className="bg-red-500 hover:bg-red-600"
                >
                    Thử lại
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <Input.Search
                    placeholder="Tìm kiếm theo tiêu đề"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-80"
                    prefix={<SearchOutlined className="text-gray-400" />}
                    allowClear
                />
                <div className="text-sm text-gray-500">
                    Tổng số: <span className="font-medium text-blue-600">{filteredTasks.length}</span> công việc
                </div>
            </div>
            <Table
                dataSource={filteredTasks}
                columns={columns}
                rowKey={(record) => (record.id ? String(record.id) : String(record._id))}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} công việc`,
                    className: 'mt-4',
                }}
                className="task-table"
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
}

export default TaskTableContent;
