import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
/*
    This modal is shown when the user asks to delete a list. Note 
    that before this is shown a list has to be marked for deletion,
    which means its id has to be known so that we can retrieve its
    information and display its name in this modal. If the user presses
    confirm, it will be deleted.
    
    @author McKilla Gorilla
*/
function DeleteModal(props) {
    const { store } = useContext(GlobalStoreContext);
    const { markedForDeletion} = props;
    let name = "";
    if (store.currentList) {
        name = store.currentList.name;
    }
    function handleDeleteList(event) {
        event.stopPropagation();
        store.deleteMarkedList();
    }
    function handleCloseModal(event) {
        event.stopPropagation();
        store.hideDeleteListModal();
    }
    let visibleClass = "modal";
    // if(markedForDeletion === true){
    //     visibleClass = ".modal.is-visible";
    //     console.log("list isn't marked for deletion, somehow make delete modal visible");
    // }
    return (
        <div
            className={visibleClass}
            id="delete-modal"
            data-animation="slideInOutLeft"
            >
            <div className="modal-dialog">
                <header className="dialog-header">
                    Delete the {name} Top 5 List?
                </header>
                <div id="confirm-cancel-container">
                    <button
                        id="dialog-yes-button"
                        className="modal-button"
                        onClick={handleDeleteList}
                    >Confirm</button>
                    <button
                        id="dialog-no-button"
                        className="modal-button"
                        onClick={handleCloseModal}
                    >Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;