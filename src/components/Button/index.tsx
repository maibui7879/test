import React, { ReactNode, MouseEvent } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

interface ButtonProps {
    to?: string;
    href?: string;
    primary?: boolean;
    outline?: boolean;
    text?: boolean;
    rounded?: boolean;
    disabled?: boolean;
    small?: boolean;
    large?: boolean;
    children: ReactNode;
    className?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
    [key: string]: any; // để nhận các props khác nếu cần
}

function Button({
    to,
    href,
    primary = false,
    outline = false,
    text = false,
    rounded = false,
    disabled = false,
    small = false,
    large = false,
    children,
    className,
    leftIcon,
    rightIcon,
    onClick,
    ...passProps
}: ButtonProps) {
    let Comp: React.ElementType = 'button';

    const classes = classNames(
        'inline-flex items-center justify-center font-semibold transition-all duration-300 select-none cursor-pointer min-w-[100px] rounded-md',
        {
            'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700': primary,
            'border border-blue-600 text-blue-600 hover:bg-blue-100': outline,
            'bg-transparent text-blue-600 hover:underline': text,
            'rounded-full shadow-sm border border-gray-300 hover:bg-gray-100': rounded,
            'opacity-50 cursor-not-allowed pointer-events-none': disabled,
            'px-2 py-1 min-w-[30px] text-sm': small,
            'px-4 py-3 min-w-[140px] text-lg': large,
        },
        className,
    );

    const props: { [key: string]: any } = {
        onClick,
        ...passProps,
    };

    if (disabled) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }

    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    }

    return (
        <Comp className={classes} {...props}>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </Comp>
    );
}

export default Button;
// to	    string	    Đường dẫn nội bộ dùng cho React Router Link	undefined
// href	    string	    Đường dẫn bên ngoài (thẻ <a>)	undefined
// primary	boolean	    Kiểu button chính với nền xanh	false
// outline	boolean	    Kiểu button viền xanh	false
// text	    boolean	    Kiểu button chỉ có text (trong suốt, hover underline)	false
// rounded	boolean	    Button bo tròn, có bóng nhẹ	false
// disabled	boolean	    Vô hiệu hóa button, không thể click	false
// small	boolean	    Kích thước nhỏ	false
// large	boolean	    Kích thước lớn	false
// children	ReactNode	Nội dung hiển thị trong button	(bắt buộc)
// className string	    Thêm class CSS tùy chỉnh	undefined
// leftIcon	ReactNode	Icon hiển thị bên trái text	undefined
// rightIcon	ReactNode	Icon hiển thị bên phải text	undefined
// onClick	(e: MouseEvent) => void	Hàm xử lý sự kiện click	undefined
