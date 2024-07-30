import {Tag} from "antd";


export function getTag(value: string) {
    switch (value) {
        case 'Pending':
            return <Tag color={'warning'}>{value}</Tag>
        case 'Confirmed':
            return <Tag color={'success'}>{value}</Tag>
        case 'Rejected':
            return <Tag color={'error'}>{value}</Tag>
        case 'Canceled':
            return <Tag color={'error'}>{value}</Tag>
        case 'Past' :
            return <Tag color={'processing'}>{value}</Tag>
        case 'Completed':
            return <Tag color={'success'}>{value}</Tag>
        case 'Published':
            return <Tag color={'purple'}>{value}</Tag>
        default:
            return <Tag color={'default'}>{value}</Tag>
    }

}

export function getRooms(value: Array<any>) {
    let numRooms = 0
    value.forEach((room) => {
        numRooms += room.numRooms;
    })
    return numRooms;
}