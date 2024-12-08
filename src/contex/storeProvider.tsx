'use client'
import {Provider} from 'react-redux'
import store from "@/data/store";
import {ReactNode} from "react";
import {AntdRegistry} from "@ant-design/nextjs-registry";
import ContextProvider from "@/contex/ContextProvider";
import {ConfigProvider} from "antd";
import {ErrorProvider} from "@/contex/errorContext";
import ErrorDialog from "@/components/dialogs/ErrorDialog";


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

export default function StoreProvider({children}: { children: ReactNode }) {


    return <Provider store={store}>
        <ErrorProvider>
            <ConfigProvider theme={theme}>
                <ContextProvider>
                {children}
                </ContextProvider>
            </ConfigProvider>
            <ErrorDialog/>
        </ErrorProvider>
    </Provider>
}
