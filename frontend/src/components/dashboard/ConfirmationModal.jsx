import React from 'react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar' }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content confirmation-modal">
                <div className="modal-header">
                    <h2>{title}</h2>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button className="modal-btn cancel-btn" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className="modal-btn confirm-btn" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }
                .modal-content {
                    background: #1a1a1a;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    padding: 2.5rem;
                    max-width: 450px;
                    width: 90%;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                    animation: slideUp 0.3s ease;
                }
                h2 {
                    margin-bottom: 1rem;
                    color: #fff;
                    font-size: 1.5rem;
                }
                p {
                    color: rgba(255, 255, 255, 0.6);
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }
                .modal-footer {
                    display: flex;
                    gap: 1rem;
                }
                .modal-btn {
                    flex: 1;
                    padding: 1rem;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                }
                .cancel-btn {
                    background: rgba(255, 255, 255, 0.05);
                    color: #fff;
                }
                .cancel-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .confirm-btn {
                    background: #f0e000;
                    color: #000;
                }
                .confirm-btn:hover {
                    filter: brightness(1.1);
                    box-shadow: 0 4px 15px rgba(240, 224, 0, 0.3);
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ConfirmationModal;
