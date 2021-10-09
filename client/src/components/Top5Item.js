import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [draggedTo, setDraggedTo] = useState(0);
    const [ editNumber, setEditNumber ] = useState(-1);

    function handleDragStart(event) {
        event.dataTransfer.setData("item", event.target.id);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("item");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        setDraggedTo(false);
        // UPDATE THE LIST if the source and target arent the same
        if(sourceId !== targetId){
            store.addMoveItemTransaction(sourceId, targetId);
        }
    }

    function handleOnClick(event, newEditNumber) {
        store.setItemActive(true);
        console.log("Item active updated: ", store.itemActive);
        event.preventDefault();
        event.autoFocus = true;
        console.log("New index number: ", newEditNumber);
        setEditNumber(newEditNumber);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter" || event.code=== "NumpadEnter") {
            handleBlur(event);
        }
    }

    function handleBlur(event) {
        event.preventDefault();
        store.setItemActive(false);
        console.log("Item active updated: ", store.itemActive);
        setEditNumber(-1);
        saveAndUpdate(event)
    }

    function saveAndUpdate(event){
        console.log("Inside save and update...");
        console.log("Value inside event: ", event.target.value);
        let newText = event.target.value;
        // If they're not the same text, create a transaction to update the text and save it!
        if (newText !== props.text){
            store.addChangeItemTransaction(index, props.text, newText);
        }
    }

    let { index } = props;
    let itemClass = "top5-item";
    if (draggedTo) {
        itemClass = "top5-item-dragged-to";
    }
    let item = 
        <div
        id={'item-' + (index + 1)}
        className={itemClass}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        draggable="true"
    >
        <input
            type="button"
            id={"edit-item-" + index + 1}
            className="list-card-button"
            value={"\u270E"}
            onClick = {(e) => handleOnClick(e, index + 1)}
        />
        {props.text}
    </div>;
    if(editNumber === index + 1){
        item =
        <label
        id={'item-' + (index + 1)}
        className={itemClass}
        draggable="true"
    >
        <input autoFocus
            type="text"
            //id={"edit-item-" + index + 1}
            //className="list-card-button"
            defaultValue={props.text}
            onBlur = {handleBlur}
            onKeyPress = {handleKeyPress}
            
            //onClick = {(e) => handleOnClick(e, index + 1)}
        />
    </label>;
    }





    return (
        
        item
        
        )
}

export default Top5Item;