import { useEffect } from "react";
import { CSSTransition } from "react-transition-group";

import styles from "../css/Modal.module.css";

const Modal = ({ children, show, handleCloseModal, handleSubmitModal }) => {
  // Close the modal when escaped is pressed
  const closeOnEscapeKeyDown = (e) => {
    if ((e.charCode || e.keyCode) === 27) {
      handleCloseModal(e);
    }
  };

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    return function cleanUp() {
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
  }, []);

  const computedShow = (show) => (show ? styles.show : "");

  return (
    <CSSTransition in={show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
      <div
        className={styles.modal + " " + computedShow(show)}
        onClick={(e) => handleCloseModal(e)}
      >
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          {/*HEADER*/}
          <div className={styles.modalHeader}>
            <h4 className={styles.modalTitle}>Modal Title</h4>
          </div>

          {/*CONTENT*/}
          <div className={styles.modalBody}>{children}</div>

          {/*FOOTER*/}
          <div className={styles.modalFooter}>
            <button
              onClick={(e) => handleCloseModal(e)}
              className={styles.modalCloseBtn}
            >
              Close
            </button>
            <button onClick={(e) => handleSubmitModal(e)} className={styles.modalValidateBtn}>Add Skill</button>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Modal;
