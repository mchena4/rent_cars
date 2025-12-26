import React from "react";

export type CalendarProps = React.HTMLAttributes<HTMLDivElement> & {
    setDateSelected: React.Dispatch<
    React.SetStateAction<{ from: Date | undefined; to: Date | undefined }>
    >;
    carPriceDay: string;
};