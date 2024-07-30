'use client'
import DateComponent from "@/components/DateComponent";
import {useAppDispatch} from "@/hooks/hooks";
import {updateDates} from "@/slices/bookingSlice";

export default function StayDate() {
    const dispatch = useAppDispatch()
    return (
        <div className="bg-primary-50 rounded-2xl p-4 my-4 shadow-md">
            <div className="text-xl font-semibold mb-1">Date</div>
            <div className="flex max-md:flex-col gap-4">
                <div className="border border-gray-500 rounded-xl py-2 px-3">
                    <DateComponent onChange={(startDate, endDate) => {
                        dispatch(updateDates({
                            startDate: startDate? startDate.toString(): '',
                            endDate: endDate? endDate.toString(): '',
                            length: 0
                        }))
                    }}/>
                </div>
                <div className="shadow-md rounded-xl bg-primary py-2 px-3 text-white">Check Availability</div>
            </div>
        </div>
    );
}
