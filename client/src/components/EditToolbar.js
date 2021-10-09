import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "top5-button";
    let disabledButtonClass = "top5-button-disabled";
    
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        //console.log(history);
        console.log(store.currentList);
        if(store.currentList !== null){
            history.push("/");
            store.closeCurrentList();
        }
    }
    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }
    return (
        <div id="edit-toolbar">
            <div
                disabled={editStatus}
                id='undo-button'
                onClick={handleUndo}
                className={store.currentList != null && store.hasTransactionToUndo() ? enabledButtonClass : disabledButtonClass}>
                &#x21B6;
            </div>
            <div
                disabled={editStatus}
                id='redo-button'
                onClick={handleRedo}
                className={store.currentList != null && store.hasTransactionToRedo() ? enabledButtonClass : disabledButtonClass}>
                &#x21B7;
            </div>
            <div
                disabled={editStatus}
                id='close-button'
                onClick={handleClose}
                className={store.currentList != null && store.listMarkedForDeletion == null? enabledButtonClass : disabledButtonClass}>
                &#x24E7;
            </div>
        </div>
    )
}

export default EditToolbar;