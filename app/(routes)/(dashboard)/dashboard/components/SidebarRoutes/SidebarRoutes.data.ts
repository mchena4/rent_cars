import { Car, Calendar, Heart, SquareGanttChart } from "lucide-react";


export const dataGeneralSidebar = [
    {
        icon: Car,
        label: "Cars",
        href: "/dashboard"
    },
    {
        icon: Calendar,
        label: "Cars Reserves",
        href: "/reserves"
    },
    {
        icon: Heart,
        label: "Loved Cars",
        href: "/loved_cars"
    }
];

export const dataAdminSidebar = [
    {
        icon: SquareGanttChart,
        label: "Manage Cars",
        href: "/dashboard/admin/cars-manager"
    },
    {
        icon: Calendar,
        label: "Manage Reserves",
        href: "/dashboard/admin/reserves-admin"
    }
];