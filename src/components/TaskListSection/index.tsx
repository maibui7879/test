import React, { ReactNode } from 'react';

interface TaskListSectionProps {
    title: string;
    children: ReactNode;
}

const TaskListSection: React.FC<TaskListSectionProps> = ({ title, children }) => {
    return (
        <div className="task-list-section">
            <h2>{title}</h2>
            <div className="task-list">{children}</div>
        </div>
    );
};

export default TaskListSection;
