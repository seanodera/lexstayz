import DateComponent from "@/components/DateComponent";

export default function StayDate() {
    return (
        <div className="bg-primary-50 rounded-2xl p-4 my-4 shadow-md">
            <div className="text-xl font-semibold mb-1">Date</div>
            <div className="flex max-md:flex-col gap-4">
                <div className="border border-gray-500 rounded-xl py-2 px-3">
                    <DateComponent onChange={(startDate, endDate) => { }} />
                </div>
                <div className="shadow-md rounded-xl bg-primary py-2 px-3 text-white">Check Availability</div>
            </div>
        </div>
    );
}
