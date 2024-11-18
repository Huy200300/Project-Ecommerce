import React from 'react';
import { FaTimes } from 'react-icons/fa';

const GenericModal = ({ isOpen, title, children, onClose, footer, classNameCus, isTitle = true }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 top-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className={`bg-white p-6 rounded-md w-full max-w-4xl ${classNameCus ? classNameCus : "h-auto"} flex flex-col justify-between`}>
                {
                    isTitle && <div className='flex items-center justify-between mb-4'>
                        <h2 className="text-xl font-bold uppercase">{title}</h2>
                        <button onClick={onClose} className='hover:bg-red-500 group p-1.5 rounded-full'>
                            <FaTimes className="text-red-500 group-hover:text-white" />
                        </button>
                    </div>
                }
                <div className='overflow-y-auto font-semibold'>
                    {children}
                </div>
                {footer && (
                    <div className="mt-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenericModal;
