import { Link } from "@inertiajs/react";
import {
    Award,
    BookOpen,
    Building2,
    FolderGit2,
    Gift,
    HelpCircle,
    LayoutGrid,
    Newspaper,
    Package,
    Percent,
    ScrollText,
    Store,
    Tag,
    Tags,
    Ticket,
    Users,
} from "lucide-react";
import AppLogo from "@/components/app-logo";
import { NavFooter } from "@/components/nav-footer";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { dashboard } from "@/routes";
import articleCategoriesRoutes from "@/routes/article-categories";
import articlesRoutes from "@/routes/articles";
import brandsRoutes from "@/routes/brands";
import couponsRoutes from "@/routes/coupons";
import distributorsRoutes from "@/routes/distributors";
import faqCategoriesRoutes from "@/routes/faq-categories";
import giftCardsRoutes from "@/routes/gift-cards";
import logsRoutes from "@/routes/logs";
import offersRoutes from "@/routes/offers";
import productCategoriesRoutes from "@/routes/product-categories";
import productsRoutes from "@/routes/products";
import retailersRoutes from "@/routes/retailers";
import stampProgramsRoutes from "@/routes/stamp-programs";
import usersRoutes from "@/routes/users";
import type { NavItem } from "@/types";

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: "Users",
        href: usersRoutes.index(),
        icon: Users,
    },
    {
        title: "Offers",
        href: offersRoutes.index(),
        icon: Percent,
    },
    {
        title: "Gift Cards",
        href: giftCardsRoutes.index(),
        icon: Gift,
    },
    {
        title: "Coupons",
        href: couponsRoutes.index(),
        icon: Ticket,
    },
    // {
    //     title: 'System Logs',
    //     href: logsRoutes.index(),
    //     icon: ScrollText,
    // },
];

const productNavItems: NavItem[] = [
    {
        title: "Products",
        href: productsRoutes.index(),
        icon: Package,
    },
    {
        title: "Product Categories",
        href: productCategoriesRoutes.index(),
        icon: Tags,
    },
];

// const brandNavItems: NavItem[] = [
//     {
//         title: "Brands",
//         href: brandsRoutes.index(),
//         icon: Tag,
//     },
// ];

const distributorNavItems: NavItem[] = [
    {
        title: "Distributors",
        href: distributorsRoutes.index(),
        icon: Building2,
    },
    {
        title: "Brands",
        href: brandsRoutes.index(),
        icon: Tag,
    },
    {
        title: "Retailers",
        href: retailersRoutes.index(),
        icon: Store,
    },
];

// const retailerNavItems: NavItem[] = [
//     {
//         title: "Retailers",
//         href: retailersRoutes.index(),
//         icon: Store,
//     },
// ];

// const offerNavItems: NavItem[] = [
//     {
//         title: "Offers",
//         href: offersRoutes.index(),
//         icon: Percent,
//     },
// ];

const articleNavItems: NavItem[] = [
    {
        title: "Articles",
        href: articlesRoutes.index(),
        icon: Newspaper,
    },
    {
        title: "Articles Category",
        href: articleCategoriesRoutes.index(),
        icon: Tags,
    },
];

const faqNavItems: NavItem[] = [
    {
        title: "FAQ",
        href: faqCategoriesRoutes.index(),
        icon: HelpCircle,
    },
];

const stampNavItems: NavItem[] = [
    {
        title: "Stamp Programs",
        href: stampProgramsRoutes.index(),
        icon: Award,
    },
];

const LogsNavItems: NavItem[] = [
    {
        title: "System Logs",
        href: logsRoutes.index(),
        icon: ScrollText,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: "Repository",
        href: "https://github.com/laravel/react-starter-kit",
        icon: FolderGit2,
    },
    {
        title: "Documentation",
        href: "https://laravel.com/docs/starter-kits#react",
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader className="border-b border-white/10">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="h-auto group-data-[collapsible=icon]:p-2!"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label="Platform" />
                <NavMain items={productNavItems} label="Products" />
                {/* <NavMain items={brandNavItems} label="Brands" /> */}
                {/* <NavMain items={retailerNavItems} label="Retailers" /> */}
                <NavMain items={distributorNavItems} label="B2B" />
                {/* <NavMain items={offerNavItems} label="Offers" /> */}
                <NavMain items={articleNavItems} label="Articles" />
                <NavMain items={faqNavItems} label="FAQs" />
                <NavMain items={stampNavItems} label="Stamps" />
                <NavMain items={LogsNavItems} label="Logs" />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
