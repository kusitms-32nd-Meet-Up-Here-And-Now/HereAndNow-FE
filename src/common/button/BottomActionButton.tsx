import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface BottomActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  containerClassName?: string;
  activeClassName?: string;
  disabledClassName?: string;
}

const BottomActionButton = ({
  children,
  containerClassName = '',
  activeClassName = 'bg-pink-6 hover:bg-pink-7 text-white',
  disabledClassName = 'bg-neutral-2 text-neutral-6 cursor-not-allowed',
  className = '',
  disabled,
  ...buttonProps
}: BottomActionButtonProps) => {
  const containerBaseClass = 'mx-auto flex w-full max-w-md justify-center';
  const buttonBaseClass = 'text-s4 w-full max-w-[362px] rounded-lg px-5 py-3 transition-colors';

  const stateClass = disabled ? disabledClassName : activeClassName;

  return (
    <div className={`${containerBaseClass} ${containerClassName}`}>
      <button {...buttonProps} disabled={disabled} className={`${buttonBaseClass} ${stateClass} ${className}`.trim()}>
        {children}
      </button>
    </div>
  );
};

export default BottomActionButton;
