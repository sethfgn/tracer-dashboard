interface ContainerProps {
    children: React.ReactNode;
}
//flex absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 box border h-64 w-1/3 p-5
const Container = (props: ContainerProps) => {
    return (
        <div className="flex rounded-xl shadow-md bg-theme-background dark:bg-theme-background">
            {props.children}
        </div>
    );
};

export default Container;
