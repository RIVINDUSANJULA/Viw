import { type ReactNode } from 'react'


interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: Props) {

    if (!isOpen) return null;

  return (
    <div>
        <div>
            <div>
                <h1>{title}</h1>
                <button onClick={onClose}></button>
            </div>
            <div>
                {children}
            </div>
        </div>
    </div>
  )
}
