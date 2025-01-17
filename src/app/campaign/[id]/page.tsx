import {Typography} from "antd";


const {Title,Text,Paragraph} = Typography;
export default function CampaignPage() {

    return <div>
        <div className={'w-full aspect-20/7 flex items-center'}>
            <img src={''} alt={''} className={'rounded-lg aspect-video'}/>
            <div>
                <Title level={4}>Promotion Title</Title>
                <Paragraph>Promotion Description</Paragraph>
            </div>
        </div>
        <div className={'grid grid-cols-4'}>

        </div>
    </div>
}
