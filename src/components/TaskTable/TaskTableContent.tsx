import { Table, Input, Button, Spin, Pagination } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate, faSearch } from '@fortawesome/free-solid-svg-icons';
import { TaskTableContentProps } from './types';

function TaskTableContent({
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
                    icon={<FontAwesomeIcon icon={faRotate} />}
                    className="bg-red-500 hover:bg-red-600"
                >
                    Thử lại
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white ">
            <div className="flex justify-between items-center mb-6">
                <Input.Search
                    placeholder="Tìm kiếm theo tiêu đề"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-80"
                    prefix={<FontAwesomeIcon icon={faSearch} className="text-gray-400" />}
                    allowClear
                />
            </div>
            <Table
                dataSource={filteredTasks}
                columns={columns}
                rowKey={(record) => (record.id ? String(record.id) : String(record._id))}
                pagination={false}
                className="task-table"
                scroll={{ x: 'max-content' }}
            />
            <div className="flex justify-center mt-4">
                <Pagination current={currentPage} pageSize={10} total={totalTasks} onChange={onPageChange} />
            </div>
        </div>
    );
}

export default TaskTableContent;
