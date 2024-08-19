import type {Metadata} from "next";
import 'antd/dist/reset.css';
import "../styles/globals.css";
import StoreProvider from "@/contex/storeProvider";
import {AntdRegistry} from "@ant-design/nextjs-registry";



export const metadata: Metadata = {
    title: "Lexstayz",
    description: "A travellers dream",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={'h-screen bg-[#f5f5f5]'}><AntdRegistry><StoreProvider>
            {children}
        </StoreProvider></AntdRegistry>
        </body>

        </html>
);
}
