import type {Metadata} from "next";
import 'antd/dist/reset.css';
import "../styles/globals.css";
import {AntdRegistry} from "@ant-design/nextjs-registry";
import {ConfigProvider} from "antd";
import StoreProvider from "@/contex/storeProvider";
import ContextProvider from "@/contex/ContextProvider";


// antd theme
const theme = {
    token: {
        colorPrimary: "#584cf4",
        colorInfo: "#584cf4",
    },
};

const darkTheme = {
    token: {
        colorPrimary: "#584cf4",
        colorInfo: "#584cf4",
        wireframe: false,
        colorBgBase: "#221a4c"
    },
    algorithm: "dark"
}

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
        <head>
            <script src="https://js.paystack.co/v2/inline.js" defer/>
        </head>
        <body className={'min-h-screen bg-[#f5f5f5]'}><StoreProvider><AntdRegistry>
            <ConfigProvider theme={theme}><ContextProvider>
                <div className={'h-screen w-full'}>{children}</div>
            </ContextProvider></ConfigProvider> </AntdRegistry></StoreProvider>
        </body>

        </html>
);
}
