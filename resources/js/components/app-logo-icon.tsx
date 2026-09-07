import { type ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement>
) {
    return (
        <img
            src="/new_perk_logo.png"
            alt="Logo"
            {...props}
        />
    );
}