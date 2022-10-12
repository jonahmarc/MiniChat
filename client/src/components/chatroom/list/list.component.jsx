import { useState, useEffect } from 'react';

import { Button, ListGroup } from 'react-bootstrap';

import './list.component.scss';

import ManageChatRoom from '../manage/manage.component';

const RoomsList = (props) => {

    const [allChecked, setAllChecked] = useState(false);
    const [checked, setChecked] = useState(false);

    let check= allChecked;

    useEffect(()=>{
        console.log(allChecked);
    },[allChecked] )
    
    useEffect(()=>{
        console.log(checked);
    },[checked] )

    const handleAllChecked = (e) => {
        setAllChecked(!allChecked);
        if (check) {
            setChecked(true);
        }
    }

    const handleChecked = () => {
        setChecked(!checked);
    }

    let selectAll;
    let checkbox;
    let joined;
    let manage;

    if (props.type == 'profile') {
        selectAll = <ListGroup.Item action variant="light" className='d-grid gap-2 d-flex align-items-center justify-content-start sticky-top'>
                        <input className="form-check-input m-0" type="checkbox" id="checkboxNoLabel" value=""/>
                        <h6 className='mb-0 me-auto'>Select All</h6>
                        <Button variant='danger'><i class="bi bi-trash3-fill"></i></Button>
                    </ListGroup.Item>;
        checkbox = <input className="form-check-input m-0" type="checkbox" id="checkboxNoLabel" value=""/>;
        manage = <ManageChatRoom type='MANAGE' />;
    }
    else {
        joined = <i class="bi bi-check-circle-fill text-success" variant="success"></i>;
    }

    return (
        <ListGroup  className='rooms_list'>
            {selectAll}
            <ListGroup.Item action variant="light" className='d-grid gap-2 d-flex align-items-center justify-content-start'>
                {checkbox}
                {joined}
                <figure className='d-flex flex-column align-items-center m-0 p-0'>
                    <blockquote class="blockquote m-0 p-0">
                        <h6>Hangouts</h6>
                    </blockquote>
                    <figcaption class="blockquote-footer m-0 p-0">
                        jonahmarc
                    </figcaption>
                </figure>
                <i className="ms-auto bi bi-lock-fill"></i>
                {/* <i class="bi bi-unlock"></i> */}
                {manage}
            </ListGroup.Item>
        </ListGroup>
    );
}

export default RoomsList;