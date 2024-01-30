"use client"
import React, { useEffect, useRef } from "react"
import styles from "../../styles/Modal.module.css"

type Props = {
  isOpened: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ isOpened, onClose, children }: Props) {
  const ref: any = useRef()

  useEffect(() => {
    if (isOpened) {
      ref.current?.showModal()
    } else {
      ref.current?.close()
    }
  }, [isOpened])

  const preventAutoClose = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <dialog
      className="w-96 border-2 m-auto p-4"
      ref={ref}
      onCancel={onClose}
      onClick={onClose}
    >
      <div onClick={preventAutoClose}>{children}</div>
    </dialog>
  )
}

// .modal {
//     width: 400px;
//     border: 1px solid;
//     border-radius: 10px;
//     margin: auto;
//     padding: 16px;
// }

// .modal::backdrop {
//     background: rgba(0,0,0,.5);
//     display: flex;
//     justify-content: center;
//     align-items: center;
// }
