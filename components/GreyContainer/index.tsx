interface GreyContainerProps {
    children: React.ReactNode;
}

const GreyContainer = (props: GreyContainerProps) => {
    return (
        <div className="w-1/4 h-32 mt-5 px-5 pt-10 pb-5 rounded-xl bg-cool-gray-200 dark:bg-theme-background-secondary">
            <div className="font-bold text-2xl opacity-50">{props.children}</div>
        </div>
    );
};

export default GreyContainer;
