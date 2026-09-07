import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    FolderGit2,
    LayoutGrid,
    Newspaper,
    Package,
    ScrollText,
    Store,
    Tag,
    Tags,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import articleCategoriesRoutes from '@/routes/article-categories';
import articlesRoutes from '@/routes/articles';
import brandsRoutes from '@/routes/brands';
import distributorsRoutes from '@/routes/distributors';
import logsRoutes from '@/routes/logs';
import productCategoriesRoutes from '@/routes/product-categories';
import productsRoutes from '@/routes/products';
import retailersRoutes from '@/routes/retailers';
import usersRoutes from '@/routes/users';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        href: usersRoutes.index(),
        icon: Users,
    },
    // {
    //     title: 'System Logs',
    //     href: logsRoutes.index(),
    //     icon: ScrollText,
    // },
];

const articleNavItems: NavItem[] = [
    {
        title: 'Articles',
        href: articlesRoutes.index(),
        icon: Newspaper,
    },
    {
        title: 'Articles Category',
        href: articleCategoriesRoutes.index(),
        icon: Tags,
    },
];

const distributorNavItems: NavItem[] = [
    {
        title: 'Distributors',
        href: distributorsRoutes.index(),
        icon: Building2,
    },
];

const brandNavItems: NavItem[] = [
    {
        title: 'Brands',
        href: brandsRoutes.index(),
        icon: Tag,
    },
];

const productNavItems: NavItem[] = [
    {
        title: 'Products',
        href: productsRoutes.index(),
        icon: Package,
    },
    {
        title: 'Product Categories',
        href: productCategoriesRoutes.index(),
        icon: Tags,
    },
];

const retailerNavItems: NavItem[] = [
    {
        title: 'Retailers',
        href: retailersRoutes.index(),
        icon: Store,
    },
];

const LogsNavItems: NavItem[] = [
    {
        title: 'System Logs',
        href: logsRoutes.index(),
        icon: ScrollText,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader className="border-b border-white/10">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label="Platform" />
                <NavMain items={articleNavItems} label="Articles" />
                <NavMain items={distributorNavItems} label="Distributors" />
                <NavMain items={brandNavItems} label="Brands" />
                <NavMain items={productNavItems} label="Products" />
                <NavMain items={retailerNavItems} label="Retailers" />
                <NavMain items={LogsNavItems} label="Logs" />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
