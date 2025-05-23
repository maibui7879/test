import React, { useState, forwardRef, ImgHTMLAttributes } from 'react';
import images from '../../assets/images';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src?: string;
    alt?: string;
    className?: string;
    fallback?: string;
}

const Image = forwardRef<HTMLImageElement, ImageProps>(
    ({ src, alt, className = '', fallback: customFallback = images.noImage, ...props }, ref) => {
        const [fallback, setFallback] = useState<string>('');

        const handleError = () => {
            setFallback(customFallback);
        };

        return (
            <img
                className={`overflow-hidden ${className}`}
                ref={ref}
                src={src || fallback}
                alt={alt}
                {...props}
                onError={handleError}
            />
        );
    },
);

export default Image;
