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
    let counter = 0;
    function refreshPage(){
        sessionStorage.setItem("reloading", "true");

        console.log("Inside refresh page!");
        if(counter === 0 && store.idNamePairs.length === 0 && history != null && history.location != null){
            let pathName = history.location.pathname;
            console.log(pathName);
            if(pathName.includes("/top5list/")){
                console.log("Loading the id name pairs after refresh!");
                let id = pathName.substring("/top5list/".length);
                console.log(id);
                store.loadIdNamePairs();
                store.setCurrentList(id);
            }
            counter = 1;
        }
    }
    window.onload = function() {
        var reloading = sessionStorage.getItem("reloading");
        if(reloading !== true){
            refreshPage();
        }
    }


    let enabledButtonClass = "top5-button";
    let disabledButtonClass = "top5-button-disabled";
    
    function handleUndo(event) {
        //event.stopPropagation();
        store.undo();
    }
    function handleRedo(event) {

        store.redo();
    }
    function handleClose() {
        // let pathName = history.location.pathname;
        // console.log(history);
        // console.log(store);
        // console.log(store.currentList);
        // console.log(store.currentList === null);
        // console.log(store.listNameActive === false);
        // console.log(store.currentList === null);
        if(store.currentList !== null || (store.currentList === null && store.listNameActive === false && store.idNamePairs.length === 0)){
            history.push("/");
            store.closeCurrentList();
        }
    }
    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }
    console.log("Item active: ", store.itemActive);
    return (
        <div id="edit-toolbar">
            <div
                disabled={editStatus}
                id='undo-button'
                onClick={handleUndo}
                className={store.currentList != null && store.hasTransactionToUndo() && store.itemActive === false ? enabledButtonClass : disabledButtonClass}>
                &#x21B6;
            </div>
            <div
                disabled={editStatus}
                id='redo-button'
                onClick={handleRedo}
                className={store.currentList != null && store.hasTransactionToRedo() && store.itemActive === false ? enabledButtonClass : disabledButtonClass}>
                &#x21B7;
            </div>
            <div
                disabled={editStatus}
                id='close-button'
                onClick={handleClose}
                className={store.currentList != null && store.listMarkedForDeletion == null && store.itemActive === false ? enabledButtonClass : disabledButtonClass}>
                &#x24E7;
            </div>
        </div>
    )
}

export default EditToolbar;