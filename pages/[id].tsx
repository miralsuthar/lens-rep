import { useState } from "react";
import { Button } from "../components";
import Modal from "react-modal";

const Feed = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [numberOfOptions, setNumberOfOptions] = useState(2);

  const customStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <div>
      <div>
        <Button
          title={"create post"}
          onClick={() => setModalIsOpen(true)}
          classname="ml-auto"
        />
        <Modal isOpen={modalIsOpen} style={customStyle}>
          <button onClick={() => setModalIsOpen(false)}>close</button>
          <div>
            <input type="text" placeholder="title" />
            <div>
              <h1>Options:</h1>
              {/* {Array.from(Array(numberOfOptions).keys()).map((i) => () } */}
            </div>
            <button>create option</button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Feed;
