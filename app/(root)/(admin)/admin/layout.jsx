import AppSidebar from "@/components/ui/application/admin/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";


export default function layout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>{children}</main>
        </SidebarProvider>
    )
}
