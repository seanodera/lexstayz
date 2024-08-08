import React from 'react';
import {
    WifiOutlined,
    CoffeeOutlined,
    CarOutlined,
    AppstoreOutlined,
    PhoneOutlined,
    DesktopOutlined,
    ClockCircleOutlined,
    BellOutlined,
    ShopOutlined,
    SoundOutlined,
    TrophyOutlined,
    HeartOutlined,
    FireTwoTone,
    CheckCircleOutlined,
    QuestionCircleOutlined,
    FileDoneOutlined,
    HomeOutlined,
    SmileOutlined,
    EnvironmentOutlined,
    HistoryOutlined,
    GiftOutlined,
    RestOutlined,
    AppleOutlined,
    ProfileOutlined,
    DollarOutlined,
    TransactionOutlined,
    AudioOutlined,
    TeamOutlined,
    FileProtectOutlined,
    BookOutlined,
    CameraOutlined,
    CrownOutlined,
    UpOutlined, MedicineBoxOutlined, ScissorOutlined, HeatMapOutlined, SafetyOutlined, ToolOutlined
} from '@ant-design/icons';
import {
    FaSwimmer,
    FaSpa,
    FaHotTub,

    FaGolfBall,
    FaBicycle,
    FaBusinessTime,
    FaCar,
    FaShuttleVan,
    FaBaby,
    FaChild,
    FaDog,
    FaSmoking,
    FaBath
} from 'react-icons/fa';
import {GiTennisCourt} from "react-icons/gi";

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
    'On-Site Restaurant(s)': ShopOutlined,
    'Bar/Lounge': SoundOutlined,
    'Coffee Shop': CoffeeOutlined,
    'Breakfast Buffet': AppleOutlined,
    '24-Hour Room Service': ClockCircleOutlined,
    'Fitness Center/Gym': TrophyOutlined,
    'Swimming Pool (Indoor/Outdoor)': FaSwimmer,
    'Spa and Wellness Center': FaSpa,
    'Sauna/Steam Room': HeartOutlined,
    'Massage Services': FaSpa,
    'Hot Tub/Jacuzzi': FaHotTub,
    'Yoga/Pilates Classes': HeartOutlined,
    'Tennis Court': GiTennisCourt,
    'Golf Course': FaGolfBall,
    'Bicycle Rentals': FaBicycle,
    'Business Center': FaBusinessTime,
    'Meeting Rooms': FaBusinessTime,
    'Conference Facilities': AppstoreOutlined,
    'Banquet Halls': CrownOutlined,
    'Audio/Visual Equipment Rental': CameraOutlined,
    'Fax/Photocopying Services': FileDoneOutlined,
    'Secretarial Services': FileProtectOutlined,
    '24-Hour Front Desk': HomeOutlined,
    'Concierge Services': TeamOutlined,
    'Luggage Storage': ProfileOutlined,
    'Laundry/Dry Cleaning Services': RestOutlined,
    'Valet Parking': FaCar,
    'Shuttle Service': FaShuttleVan,
    'Car Rental Desk': CarOutlined,
    'Tour Desk': EnvironmentOutlined,
    'ATM/Cash Machine': DollarOutlined,
    'Currency Exchange': TransactionOutlined,
    'Accessible Rooms': CheckCircleOutlined,
    'Wheelchair Accessibility': QuestionCircleOutlined,
    'Elevator/Lift': UpOutlined,
    'Accessible Parking': HistoryOutlined,
    'Hearing-Impaired Services': AudioOutlined,
    'Babysitting/Child Services': FaBaby,
    'Kids\' Club': FaChild,
    'Children\'s Play Area': FaChild,
    'Family Rooms': TeamOutlined,
    'Cribs/Infant Beds': FaBaby,
    'Children\'s Menu': AppleOutlined,
    'Gift Shop': GiftOutlined,
    'Beauty Salon': CrownOutlined,
    'Garden/Terrace': EnvironmentOutlined,
    'Library': BookOutlined,
    'Pet-Friendly Services': FaDog,
    'Smoking/Non-Smoking Rooms': FaSmoking,
    'Fireplace in Lobby': FireTwoTone,
    'BBQ Facilities': FaBath,
};

const DefaultIcon = SmileOutlined;


// Step 2: Create a function to get the icon for a given amenity
export function getAmenityIcon(amenity: string): IconComponent {
    return amenityIconMap[amenity] || DefaultIcon;
}





