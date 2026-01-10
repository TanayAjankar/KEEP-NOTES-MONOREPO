function Modal({ children }) {
    return (
        <div
            className="modal-overlay"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                className="modal-content"
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "5px",
                    position: "relative",
                    zIndex: 1001,
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default Modal;
