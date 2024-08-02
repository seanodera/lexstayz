import RoomComponent, {RoomComponentPortrait} from "@/components/Grid Items/roomComponent";

export default function FeaturedRoom({ stay } : any)  {
    return (
        <div className="mb-4">
            <h3 className="text-2xl font-semibold mb-2">Featured Room</h3>
            {stay.rooms.slice(0, 1).map((room:any, index: number) => (
                <RoomComponentPortrait
                    room={room}
                    stay={stay}
                    key={index}
                    className="shadow-md bg-primary-50 text-dark rounded-2xl p-4"
                />
            ))}
        </div>
    );
}
