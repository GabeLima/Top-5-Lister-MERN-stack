import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ListCard from './ListCard.js'
import { GlobalStoreContext } from '../store'
import DeleteModal from './DeleteModal'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const ListSelector = () => {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function addListCallback() {
        console.log("Inside add list callback");
        console.log(store.listNameActive);
        if(store.isListNameEditActive === false){
            store.createNewList();
        }
    }

    let listCard = "";
    if (store) {
        listCard = store.idNamePairs.map((pair) => (
            <ListCard
                key={pair._id}
                idNamePair={pair}
                selected={false}
            />
        ))
    }
    return (
        <div id="top5-list-selector">
            <div id="list-selector-heading">
                <input
                    //disabled = {store.isListNameEditActive === true}
                    type="button"
                    id="add-list-button"
                    className={store.isListNameEditActive === false? "top5-button": "top5-button-disabled"}
                    onClick = {addListCallback}
                    value="+" />
                Your Lists
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
                                <DeleteModal 
                    markedForDeletion = {store.isAListMarkedForDeletion()}
                />
            </div>
        </div>)
}

export default ListSelector;