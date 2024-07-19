import RoomComponent from "@/components/roomComponent";

export default function AvailableRooms({ stay}: { stay: any }) {
    return (
        <div>
            <h3 className="text-2xl font-semibold my-2">Available Rooms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {stay.rooms.map((room:any, index: number) => (
                    <RoomComponent room={room} stay={stay} key={index} />
                ))}
            </div>
        </div>
    );
}
