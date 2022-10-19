import { useState, useRef } from "react";

import { Button, Modal, Form } from "react-bootstrap";

import { connect } from "react-redux";

const ManageChatRoom = (props) => {
    
  const [roomData, setRoomData] = useState({
    roomName: "",
    private: false,
    password: "",
  });

  const roomName = useRef();
  const privacy = useRef();
  const password = useRef();
    
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [checked, setChecked] = useState(false);
  const [validated, setValidated] = useState(false);


  const saveNewRoom =  () => {
    const newRoomData = {
        name: roomData.roomName,
        private: roomData.private,
        password: roomData.password,
      };
      //!fetch("http://localhost:8080/kachat/rooms/634d20e14173ec4c9fd9e402" FOR THE FINAL SERVER
      fetch("http://localhost:8081/kachat/rooms/6344bdc8238f801b0124710d",{
      method:"POST",
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(newRoomData)
    }).then(()=>{
      console.log("new room created")   
      console.log(newRoomData)
    })
  }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        }

        setValidated(true);
    };

    const deleteRoom = (e) => {

    }

    let btn;
    let title;
    let del;

    if(props.type == 'CREATE') {
        btn = <Button onClick={handleShow}>
                    <i className="bi bi-plus-lg"></i>
                </Button>;
        title = "Create New";
    }
    else if (props.type == 'MANAGE') {
        btn = <Button onClick={handleShow}>
                    <i className="bi bi-gear"></i>
                </Button>;
        title = "Update";
        del = <Button  variant="outline-danger" onClick={deleteRoom}>
                    DELETE  
                </Button>;
    }

  return (
    <>
      {btn}

      <Modal centered="true" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title} Chat Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                ref={privacy}
                checked={checked}
                type="checkbox"
                label="Set Private"
                onChange={(e) => setChecked(e.target.checked)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                ref={roomName}
                type="text"
                placeholder="Enter Room Name"
                required
                value={roomData.roomName}
                onChange={(e) =>
                  setRoomData({ ...roomData, roomName: e.target.value })
                }
              />
            </Form.Group>
            {checked && (
              <Form.Group className="mb-3">
                <Form.Control
                    ref={password}
                    type="text"
                    placeholder="Password"
                    required
                    value={roomData.password}
                    onChange={(e) =>
                        setRoomData({
                        ...roomData,
                        password: e.target.value,
                        private: true,
                        })
                    }
                />
              </Form.Group>
            )}
            <Form.Group className="d-grid gap-2 d-md-flex justify-content-md-end">
                {del}
              <Button variant="secondary" onClick={handleClose}>
                CANCEL
              </Button>
              <Button className="ml-5" type="submit" variant="primary">
                {props.type}
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};


const mapStateToProps = ({currentRoom}) => ({
    currentRoom
  });

export default connect(mapStateToProps)(ManageChatRoom);



//             <Modal centered='true' show={show} onHide={handleClose}>
//                 <Modal.Header closeButton>
//                 <Modal.Title>{title} Chat Room</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form  noValidate validated={validated} onSubmit={handleSubmit} >
//                         <Form.Group className="mb-3" controlId="formBasicCheckbox">
//                             <Form.Check checked={checked} type="checkbox" label="Set Private" onChange={(e) => setChecked(e.target.checked)} />
//                         </Form.Group>
//                         <Form.Group className="mb-3">
//                             <Form.Control type="text" placeholder="Enter Room Name" required/>
//                         </Form.Group>
//                         {checked && (
//                             <Form.Group className="mb-3">
//                                 <Form.Control type="text" placeholder="Password" required/>
//                             </Form.Group>
//                         )}
//                         <Form.Group className="d-grid gap-2 d-md-flex justify-content-md-end">
//                             {del}
//                             <Button  variant="secondary" onClick={handleClose}>
//                                 CANCEL  
//                             </Button>
//                             <Button className="ml-5" type="submit" variant="primary">
//                                 {props.type}
//                             </Button>
//                         </Form.Group>
//                     </Form>
//                 </Modal.Body>
//             </Modal>
//   if (props.type == "CREATE") {
//     btn = (
//       <Button onClick={handleShow}>
//         <i class="bi bi-plus-lg"></i>
//       </Button>
//     );
//     title = "Create New";
//   } else if (props.type == "MANAGE") {
//     btn = (
//       <Button onClick={handleShow}>
//         <i class="bi bi-gear"></i>
//       </Button>
//     );
//     title = "Update";
//   }
