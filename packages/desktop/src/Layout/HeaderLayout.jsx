import Header from "../components/Header";

const HeaderLayout = ({ children }) => {
    // Use the same value as your header height
    const headerHeight = "60px";

    return (
        <>
            <Header headerHeight={headerHeight} />
            <main
                style={{
                    paddingTop: headerHeight,
                    minHeight: `calc(100vh - ${headerHeight})`,
                }}
            >
                {children}
            </main>
        </>
    );
};

export default HeaderLayout;
