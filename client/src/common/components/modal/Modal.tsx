import { createPortal } from 'react-dom';

type ModalProps = {
    children: Readonly<React.ReactNode>;
};

export default function Modal({ children }: ModalProps) {
    return createPortal(
        <div>
            <div>
                <header>Header</header>
                <button>&times;</button>
            </div>

            {children}
        </div>,
        document.getElementById('root')!,
    );
}
