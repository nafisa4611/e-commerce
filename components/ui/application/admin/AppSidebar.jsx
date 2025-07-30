import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import logoBlack from "@/public/assets/images/logo-black.png";
import logoWhite from "@/public/assets/images/logo-white.png";
import { Button } from "../../button";
import { IoMdClose } from "react-icons/io";
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../collapsible";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

export default function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader className="border-b h-14 p-0">
                <div className="flex items-center justify-between px-4">
                    <div>
                        <Image
                            src={logoBlack.src}
                            height={40}
                            width={100}
                            className="block dark:hidden"
                            alt="logo-dark"
                        />
                        <Image
                            src={logoWhite.src}
                            height={40}
                            width={100}
                            className="hidden dark:block"
                            alt="logo-light"
                        />

                    </div>
                    <Button type="button" size="icon" className="">
                        <IoMdClose />
                    </Button>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-3">
                <SidebarMenu>
                    {
                        adminAppSidebarMenu.map((menu, index) => (
                            <Collapsible
                                key={index}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton className="font-semibold px-2 py-5" asChild>
                                            <Link href={menu?.url}>
                                                <menu.icon />
                                                {menu.title}
                                                {menu.submenu && menu.submenu.length > 0 &&
                                                    <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                }

                                            </Link>
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    {
                                        menu.submenu && menu.submenu.length > 0 && 
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {
                                                    menu.submenu.map((subMenuItem, subMenuIndex) => (
                                                        <SidebarMenuSubItem key={subMenuIndex}>
                                                            <SidebarMenuSubButton asChild className="px-2 py-5">
                                                                <Link href={subMenuItem.url}>
                                                                    {subMenuItem.title}
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))
                                                }
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    }
                                </SidebarMenuItem>
                            </Collapsible>
                        ))
                    }
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}
