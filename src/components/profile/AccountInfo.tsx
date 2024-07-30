'use client'
import {Card, Col, Row} from "antd";
import {useAppSelector} from "@/hooks/hooks";
import {selectCurrentUser} from "@/slices/authenticationSlice";


export default function AccountInfo(){
    const userDetails = useAppSelector(selectCurrentUser)
    return <Card className={''}>
        <Row>
            <Col>

            </Col>
            <Col>

            </Col>
        </Row>
    </Card>
}