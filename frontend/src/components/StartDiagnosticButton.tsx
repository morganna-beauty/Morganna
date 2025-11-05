'use client';

import { memo, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Star from '@/Icons/Star';
import { useI18n } from '@/hooks/useI18n';

interface StartDiagnosticButtonProps {
  className?: string;
  buttonClassName?: string;
  textKey?: 'routine.button' | 'hero.button';
}

const StartDiagnosticButtonComponent = ({ 
  className = '', 
  buttonClassName = '',
  textKey = 'routine.button'
}: StartDiagnosticButtonProps) => {
  const router = useRouter();
  const { t } = useI18n();

  const handleClick = useCallback(() => {
    router.push('/diagnostic');
  }, [router]);

  const baseButtonClasses = useMemo(() => 'flex flex-row justify-center items-center w-[203px] h-12 hover:opacity-90 transition-opacity', []);
  const baseInnerClasses = useMemo(() => 'flex flex-row justify-center items-center px-4 py-[10px] gap-2 w-[203px] h-10 bg-[#215E6B] rounded-[100px]', []);

  const buttonClasses = useMemo(() => 
    className ? `${baseButtonClasses} ${className}` : baseButtonClasses,
    [className, baseButtonClasses]
  );

  const innerClasses = useMemo(() => 
    buttonClassName ? `${baseInnerClasses} ${buttonClassName}` : baseInnerClasses,
    [buttonClassName, baseInnerClasses]
  );

  const buttonText = useMemo(() => t(textKey), [t, textKey]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={buttonClasses}
    >
      <div className={innerClasses}>
        <Star className="w-5 h-5 text-white flex-none" />
        <span className="font-medium text-sm leading-5 tracking-[0.1px] text-white flex-none">
          {buttonText}
        </span>
      </div>
    </button>
  );
};

export const StartDiagnosticButton = memo(StartDiagnosticButtonComponent);
StartDiagnosticButton.displayName = 'StartDiagnosticButton';

