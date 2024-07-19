export default function Description({stay}: { stay: any }) {
    return (
        <div className="py-4 border-t border-b border-gray-500">
            <p className="max-lg:line-clamp-5">{stay.description}</p>
        </div>
    );
}
