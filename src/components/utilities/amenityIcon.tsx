import React from 'react';
import {
    HeatMapOutlined, WifiOutlined, DesktopOutlined, PhoneOutlined, CoffeeOutlined,
    SafetyOutlined, ToolOutlined, ScissorOutlined, BellOutlined, ClockCircleOutlined,
    SmileOutlined, MedicineBoxOutlined, AppstoreOutlined, QuestionOutlined
} from '@ant-design/icons';


type IconComponent = React.ComponentType;

const amenityIconMap: Record<string, IconComponent> = {
    'Air Conditioning/Heating': HeatMapOutlined,
    'Wi-Fi/Internet Access': WifiOutlined,
    'TV with Cable/Satellite Channels': DesktopOutlined,
    'Telephone': PhoneOutlined,
    'Mini-Bar': CoffeeOutlined,
    'Coffee/Tea Maker': CoffeeOutlined,
    'In-Room Safe': SafetyOutlined,
    'Work Desk': DesktopOutlined,
    'Iron and Ironing Board': ToolOutlined,
    'Hairdryer': ScissorOutlined,
    'Room Service': BellOutlined,
    'Alarm Clock/Radio': ClockCircleOutlined,
    'Bathrobes and Slippers': SmileOutlined,
    'Toiletries': MedicineBoxOutlined,
    'Closet/Wardrobe': AppstoreOutlined,
};

// Step 2: Create a function to get the icon for a given amenity
export function getAmenityIcon(amenity: string): IconComponent {
    return amenityIconMap[amenity] || QuestionOutlined;
}





