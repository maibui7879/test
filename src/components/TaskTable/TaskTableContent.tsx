import React from 'react';
import { Table, Input, Button } from 'antd';
import { TaskTableContentProps } from './types';

const TaskTableContent = ({
    loading,
    error,
    onReload,
    searchText,
    setSearchText,
    filteredTasks,
    columns,
    currentPage,
    totalTasks,
    onPageChange,
}: TaskTableContentProps) => {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleReload = () => {
        onReload();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Input
                    placeholder="Tìm kiếm công việc..."
                    value={searchText}
                    onChange={handleSearch}
                    className="w-64 hover:border-blue-400 focus:border-blue-400 transition-all duration-200"
                />
                <Button
                    type="primary"
                    onClick={handleReload}
                    className="!bg-blue-500 hover:!bg-blue-600 transition-all duration-200"
                >
                    Tải lại
                </Button>
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <Table
                columns={columns}
                dataSource={filteredTasks}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: currentPage,
                    total: totalTasks,
                    pageSize: 10,
                    onChange: onPageChange,
                    showSizeChanger: false,
                    position: ['bottomCenter'],
                }}
                className="animate-fade-in"
            />
        </div>
    );
};

export default TaskTableContent;
