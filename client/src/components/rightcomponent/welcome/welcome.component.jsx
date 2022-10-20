import { Stack } from "react-bootstrap";

import "./welcome.component.scss";

function WelcomeComponent() {
  
  return (
    <Stack className="welcome_right_container m-0">
      <div className="chatroom_details d-flex align-items-center justify-content-center">
          <h1>WELCOME TO KACHAT!</h1>
      </div>
    </Stack>
  );
};

export default WelcomeComponent;
