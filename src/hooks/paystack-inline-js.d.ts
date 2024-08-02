// paystack-inline-js.d.ts
declare module '@paystack/inline-js' {
    namespace PaystackPop {
        interface Options {
            key: string;
            email: string;
            amount: number;
            currency?: string;
            ref?: string;
            metadata?: any;
            callback?: (response: { reference: string }) => void;
            onClose?: () => void;
        }

        function setup(options: Options): { openIframe: () => void };
    }

    const PaystackPop: {
        setup: typeof PaystackPop.setup;
    };

    export = PaystackPop;
}
