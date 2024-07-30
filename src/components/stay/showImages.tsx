import {Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import {Image} from "antd";

export function ShowImagesDialog({open, setOpen, images}: {open: boolean, setOpen: (open: boolean) => void, images: string[]}) {
    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
                <DialogPanel className="bg-white w-1/2 h-3/4 p-6 rounded-lg max-w-3xl mx-auto overflow-y-auto">
                    <DialogTitle className="text-2xl font-semibold mb-4">All Images</DialogTitle>
                    <div className="grid grid-cols-3 gap-4">
                        {images.map((image, index) => (
                            <Image key={index} src={image} alt={`Image ${index}`} className="w-full h-auto"/>
                        ))}
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg">
                        Close
                    </button>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
