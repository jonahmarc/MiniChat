import { Stack } from 'react-bootstrap';

import './message-history.component.scss';


const data = []

//! display the messages to the DOM
export const onMessageReceived = (payload) =>{
    const payloadData = JSON.parse(payload.body)
    console.log("MESSAGE: ", payloadData )
    data.push(payloadData)
}

const Messages = () => {
    return (
        <div className='messages_history mt-2 p-0 d-flex flex-column'>
            <div className="received align-self-start ms-2 mb-3 p-2">
                <p className='m-0 p-0 fs-6 fw-lighter'><em>iandave</em></p>
                <p className='m-0 p-0 fs-6 fw-lighter'><em>10/12/22 17:37</em></p>
                <p className='m-0 p-0'>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Repellat quasi dicta repudiandae velit excepturi! 
                    Beatae vel excepturi ipsum odio assumenda facere ipsa unde dolore consequatur fugiat. 
                    Maxime nobis adipisci dicta.
                </p>
            </div>
            <div className="sent align-self-end me-2 mb-3 p-2">
                <p className='m-0 p-0 fs-6 fw-lighter'><em>10/12/22 18:13</em></p>
                <p className='m-0 p-0'>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Repellat quasi dicta repudiandae velit excepturi! 
                    Beatae vel excepturi ipsum odio assumenda facere ipsa unde dolore consequatur fugiat. 
                    Maxime nobis adipisci dicta.
                </p>
            </div>
        </div>
    );
}

export default Messages;