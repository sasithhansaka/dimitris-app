import { type ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement>
) {
    return (
        <img
            src="/perkLogo.png"
            alt="Logo"
            {...props}
        />
    );
}