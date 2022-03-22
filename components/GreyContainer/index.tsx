import React from 'react';

interface GreyContainerProps {
    children: React.ReactNode;
}

const GreyContainer = (props: GreyContainerProps) => {
    return (
        <div className="mt-5 px-5 pt-5 pb-5 rounded-xl bg-cool-gray-100 dark:bg-theme-background-secondary">
            {props.children}
        </div>
    );
};

export default GreyContainer;
