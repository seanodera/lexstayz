'use client'
import {Button, Card, Col, DatePicker, Image, Input, Row, Select} from "antd";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectCurrentUser, updateUserAsync} from "@/slices/authenticationSlice";
import {useState} from "react";
import dayjs from "dayjs";
import {dateReader} from "@/lib/utils";


export default function AccountInfo() {
    const user = useAppSelector(selectCurrentUser)
    const [editMode, setEditMode] = useState<boolean>(false)
    const dispatch = useAppDispatch();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");

    const handleCancel = () => {
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setPhone(user.phone || "");
        setDateOfBirth(user.dob || "");
        setEditMode(false);
    }
    const handleEditMode = () => {
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setPhone(user.phone || "");
        setDateOfBirth(user.dob || "");
        setEditMode(true);
    }
    const handleApply = () => {
        const details = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            dob: dateOfBirth,
            gender: gender,
        }
        dispatch(updateUserAsync({details: details}));
        setEditMode(false);
    }

    if (!user) {
        return <div></div>
    } else {
        return <Card title={'Profile Information'} className={''} extra={<div className={'flex gap-2'}>
            {!editMode && <Button type={'primary'} ghost onClick={handleEditMode}>{'Edit'}</Button>}
            {editMode && <Button danger onClick={handleCancel}>Cancel</Button>}
            {editMode && <Button type={'primary'} onClick={handleApply}>Apply</Button>}
        </div>}>
            <Row gutter={[16, 16]}>
                <Col sm={24} md={6} className={'flex flex-col gap-1 justify-center items-center'}>
                    {user.avatar ? <Image className={'bg-primary aspect-square rounded-full w-full'} src={user.avatar}
                                          alt={'img'}/> :
                        <div
                            className={'bg-primary aspect-square rounded-full flex items-center justify-center text-5xl w-max p-8 text-white'}>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</div>}
                </Col>
                <Col sm={24} md={18}>
                    <div className={'grid grid-cols-2 gap-3'}>
                        <div className={''}>
                            <h3 className={'mb-0'}>First Name</h3>
                            {editMode ? <Input placeholder={''} value={firstName} defaultValue={user.firstName}
                                               onChange={(e) => setFirstName(e.target.value)}/> :
                                <h3 className={'font-bold'}>{user.firstName}</h3>}
                        </div>
                        <div className={''}>
                            <h3 className={'mb-0'}>Last Name</h3>
                            {editMode ? <Input placeholder={''} value={lastName} defaultValue={user.lastName}
                                               onChange={(e) => setLastName(e.target.value)}/> :
                                <h3 className={'font-bold'}>{user.lastName}</h3>}
                        </div>
                        <div className={'max-md:col-span-2'}>
                            <h3 className={'mb-0'}>Email address</h3>
                            <h3 className={'font-bold'}>{user.email}</h3>
                        </div>
                        <div className={''}>
                            <h3 className={'mb-0'}>Phone Number</h3>
                            {editMode ? <Input placeholder={''} value={phone} defaultValue={user.phone}
                                               onChange={(e) => setPhone(e.target.value)}/> :
                                <h3 className={'font-bold'}>{user.phone}</h3>}
                        </div>
                        <div>
                            <h3 className={'mb-0'}>Date Of Birth</h3>
                            {editMode ? <DatePicker className={'w-full'} format={'DD MMMM YYYY'} value={dateOfBirth && dayjs(dateOfBirth)}
                                                    defaultValue={user.dob && dayjs(user.dob)}
                                                    onChange={(e) => setDateOfBirth(e.toISOString())}/> :
                                <h3 className={'font-bold'}>{user.dob ? dateReader({date: user.dob}) : '-'}</h3>}
                        </div>
                        <div>
                            <h3 className={'mb-0'}>Gender</h3>

                            {editMode ? <Select className={'w-full'} value={gender} defaultValue={user.gender}
                                                onChange={(value) => setGender(value)} options={[
                                    {
                                        label: 'Male',
                                        value: 'Male'
                                    },
                                    {
                                        label: 'Female',
                                        value: 'Female',
                                    },
                                    {
                                        label: 'I prefer not to say',
                                        value: '-'
                                    }
                                ]}/> :
                                <h3 className={'font-bold'}>{user.gender ? user.gender : '-'}</h3>}
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    }
}