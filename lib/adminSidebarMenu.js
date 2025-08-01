// Admin Sidebar icons.
import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";

export const adminAppSidebarMenu = [
    {
        title: "Dashboard",
        url: ADMIN_DASHBOARD,
        icon: AiOutlineDashboard,
    },
    {
        title: "Categories",
        url: "#",
        icon: BiCategory,
        submenu: [
            {
                title: "Add Category",
                url: "#"
            },
            {
                title: "All Category",
                url: "#"
            },
        ]
    },
    {
        title: "Products",
        url: "#",
        icon: IoShirtOutline,
        submenu: [
            {
                title: "Add Product",
                url: "#"
            },
            {
                title: "Add Variant",
                url: "#"
            },
            {
                title: "All Products",
                url: "#"
            },
            {
                title: "Products Variants",
                url: "#"
            },
        ]

    },
    {
        title: "Coupons",
        url: "#",
        icon: RiCoupon2Line,
        submenu: [
            {
                title: "Add Coupon",
                url: "#"
            },
            {
                title: "All Coupons",
                url: "#"
            },
        ]
    },
    {
        title: "Orders",
        url: "#",
        icon: MdOutlineShoppingBag,
    },
    {
        title: "Customers",
        url: "#",
        icon: LuUserRound,
    },
    {
        title: "Ratings & Reviews",
        url: "#",
        icon: IoMdStarOutline,
    },
    {
        title: "Media",
        url: "#",
        icon: MdOutlinePermMedia,
    },
]