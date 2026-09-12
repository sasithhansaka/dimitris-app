import AuthLayoutTemplate from "@/layouts/auth/auth-simple-layout";

export default function AuthLayout({
    title = "",
    description = "",
    hideLogo = false,
    children,
}: {
    title?: string;
    description?: string;
    hideLogo?: boolean;
    children: React.ReactNode;
}) {
    return (
        <AuthLayoutTemplate
            title={title}
            description={description}
            hideLogo={hideLogo}
        >
            {children}
        </AuthLayoutTemplate>
    );
}
