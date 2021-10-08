import { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { GlobalStoreContext } from '../store'
/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ editActive, setEditActive ] = useState(false);
    const [ text, setText ] = useState("");
    store.history = useHistory();
    const { idNamePair, selected } = props;

    function handleLoadList(event) {
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);
            
                handleUpdateText(event);
            // CHANGE THE CURRENT LIST
            store.setCurrentList(_id);
        }
    }

    function handleToggleEdit(event) {
        console.log("Handle toggle eddit called");
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        console.log("newActive: ", newActive);
        if (newActive) {
            store.setIsListNameEditActive();
        }
        // else{
        //     store.setIsListNameEditActive
        // }
        setEditActive(newActive);
    }

    function handleKeyPress(event) {
        handleUpdateText(event);
        console.log(text);
        console.log(event.code);
        if (event.code === "Enter" || event.code=== "NumpadEnter") {
            let id = event.target.id.substring("list-".length);
            console.log("Id: ", id);
            store.changeListName(id, event.target.value);
            console.log("calling toggle edit from key press...");
            toggleEdit();
        }
    }

    function handleBlur(event){
        handleUpdateText(event);
        let id = event.target.id.substring("list-".length);
        console.log("calling toggle edit from blur...");
        toggleEdit();
    }

    function handleUpdateText(event) {
        console.log("updating text to :", event.target.value )
        setText(event.target.value );
    }

    function handleDelete(event){
        //need to pull up the modal here...
        console.log("calling handle delete...");
        // let id = event.target.id.substring("delete-list-".length);
        // store.deleteList(id);
        // store.loadIdNamePairs();
    }


    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }
    let cardElement =
        <div
            id={idNamePair._id}
            key={idNamePair._id}
            onClick={handleLoadList}
            className={'list-card ' + selectClass}>
            <span
                id={"list-card-text-" + idNamePair._id}
                key={"span-" + idNamePair._id}
                className="list-card-text">
                {idNamePair.name}
            </span>
            <input
                disabled={cardStatus}
                type="button"
                id={"delete-list-" + idNamePair._id}
                onClick = {handleDelete}
                className="list-card-button"
                value={"\u2715"}
            />
            <input
                disabled={cardStatus}
                type="button"
                id={"edit-list-" + idNamePair._id}
                className="list-card-button"
                onClick={handleToggleEdit}
                value={"\u270E"}
            />
        </div>;

    if (editActive) {
        cardElement =
            <input
                id={"list-" + idNamePair._id}
                className='list-card'
                type='text'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                onBlur = {handleBlur}
                defaultValue={idNamePair.name}
                autoFocus
            />;
    }
    return (
        cardElement
    );
}

export default ListCard;