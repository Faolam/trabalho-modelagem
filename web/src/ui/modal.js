import ReactModal from "react-modal";

ReactModal.defaultStyles = {};

export function Modal({ children, ...rest }) {
  return (
    <ReactModal
      style={{
        overlay: {
          zIndex: 10000,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        content: {
          width: 'auto',
          height: 'auto',
          maxHeight: 'calc(100% - 3rem)',
          maxWidth: 'calc(100% - 4rem)',
          background: '#fff',
          overflow: 'auto',
          borderRadius: '8px',
          outline: 'none',
          padding: '2.6rem'
        }
      }}
      appElement={document.body}
      {...rest}
    >
      {children}
    </ReactModal>
  );
}