import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveItem_Transaction from '../transactions/MoveItem_Transaction'
import ChangeItem_Transaction from '../transactions/ChangeItem_Transaction'
import DeleteModal from '../components/DeleteModal'
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    SET_LIST_MARKED_FOR_DELETION: "SET_LIST_MARKED_FOR_DELETION",
    INCREMENT_LIST_COUNTER: "INCREMENT_LIST_COUNTER",
    SET_ITEM_ACTIVE: "SET_ITEM_ACTIVE"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        itemActive: false,
        listMarkedForDeletion: null,
        isListNameEditActive: false,
        isItemEditActive: false

    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                console.log("CHANGE_LIST_NAME reducer called");
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.top5List,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    itemActive: store.itemActive
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                console.log("CLOSE_CURRENT_LIST reducer called");
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    itemActive: store.itemActive
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                console.log("LOAD_ID_NAME_PAIRS reducer called");
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    itemActive: store.itemActive
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                console.log("SET_CURRENT_LIST reducer called");
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    itemActive: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                console.log("SET_LIST_NAME_EDIT_ACTIVE reducer called");
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    itemActive: store.itemActive
                });
            }
            //START DELETING A LIST
            case GlobalStoreActionType.SET_LIST_MARKED_FOR_DELETION: {
                console.log("SET_LIST_MARKED_FOR_DELETION reducer called");
                let newListMarkedForDeletion = null;
                let newCurrentList = null;
                if(payload !== null){
                    newCurrentList = payload;
                    newListMarkedForDeletion = payload._id;
                }
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: newCurrentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: store.isListNameEditActive,
                    isItemEditActive: store.isItemEditActive,
                    listMarkedForDeletion: newListMarkedForDeletion,
                    itemActive: store.itemActive
                });
            }
            // INCREMENT LIST COUNTER
            case GlobalStoreActionType.INCREMENT_LIST_COUNTER: {
                console.log("INCREMENT_LIST_COUNTER reducer called");
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: payload,
                    isListNameEditActive: store.isListNameEditActive,
                    isItemEditActive: store.isItemEditActive,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    itemActive: store.itemActive
                });
            }
            case GlobalStoreActionType.SET_ITEM_ACTIVE: {
                console.log("Item active reducer called");
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: store.isListNameEditActive,
                    isItemEditActive: store.isItemEditActive,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    itemActive: payload
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;
                // console.log(top5List);
                top5List.name = newName;
                async function updateList(top5List) {
                    response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        async function getListPairs(top5List) {
                            response = await api.getTop5ListPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        top5List: top5List
                                    }
                                });
                            }
                        }
                        getListPairs(top5List);
                    }
                }
                updateList(top5List);
            }
        }
        asyncChangeListName(id);
    }

    //CREATING A NEW LIST...
    store.createNewList = function (){
        async function asyncCreateNewList() {
            console.log(store.idNamePairs);
            let minId = 0;
            for(let i = 0; i < store.idNamePairs.length; i++){
                if (store.idNamePairs[i].name.includes("Untitled List ")){
                    minId = parseInt(store.idNamePairs[i].name.substring("Untitled List ".length))
                    if(minId >= store.newListCounter){
                        store.newListCounter = minId + 1;
                    }
                }
            }
            console.log("Old new list counter: ", store.newListCounter);
            let body = {"name": "Untitled List " + store.newListCounter, "items": ["", "", "", "", ""]}
            let response = await api.createTop5List(body);
            if(response.data.success){
                let id = response.data.top5List._id;
                console.log("New list id: ", id);
                store.loadIdNamePairs();
                store.setCurrentList(id);
                // storeReducer({
                //     type: GlobalStoreActionType.INCREMENT_LIST_COUNTER,
                //     payload: store.newListCounter + 1
                // });
                store.newListCounter = store.newListCounter + 1;
                console.log("new list counter: ", store.newListCounter);
            }
        }
        asyncCreateNewList();
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        console.log("Calling close current list");
        tps.clearAllTransactions();
        // let modal = document.getElementById("close-button");
        // modal.classList.add(" disabled");
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getTop5ListPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
                let minId = 0;
                for(let i = 0; i < response.data.idNamePairs.length; i++){
                    if (response.data.idNamePairs[i].name.includes("Untitled List ")){
                        minId = parseInt(response.data.idNamePairs[i].name.substring("Untitled List ".length))
                        if(minId >= store.newListCounter){
                            store.newListCounter = minId + 1;
                        }
                    }
                }
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;

                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    store.history.push("/top5list/" + top5List._id);
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: top5List
                    });
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.addMoveItemTransaction = function (start, end) {
        let transaction = new MoveItem_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    store.moveItem = function (start, end) {
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = store.currentList.items[start];
            for (let i = start; i < end; i++) {
                store.currentList.items[i] = store.currentList.items[i + 1];
            }
            store.currentList.items[end] = temp;
        }
        else if (start > end) {
            let temp = store.currentList.items[start];
            for (let i = start; i > end; i--) {
                store.currentList.items[i] = store.currentList.items[i - 1];
            }
            store.currentList.items[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        if(store.hasTransactionToUndo()){
            console.log("Undo!");
            tps.undoTransaction();
        }
    }

    store.redo = function () {
        if(store.hasTransactionToRedo()){
            console.log("Redo!");
            tps.doTransaction();
        }
    }
    store.hasTransactionToUndo = function() {
        console.log("in undo, item active: ", store.itemActive);
        return tps.hasTransactionToUndo() && store.itemActive === false;
    }
    store.hasTransactionToRedo = function() {
        return tps.hasTransactionToRedo() && store.itemActive === false;
    }

    store.addChangeItemTransaction = function (index, oldText, newText) {
        let transaction = new ChangeItem_Transaction(store, index, oldText, newText);
        tps.addTransaction(transaction);
    }

    store.changeItem = function (index, newText){
        let items = store.currentList.items;
        items[index] = newText;
        store.updateCurrentList();
    }


    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.markListForDeletion = function(id){
        async function asyncMarkListForDeletion(id) {
            async function synchronize(id){
                const response = await api.getTop5ListById(id);
                if (response.data.success) {
                    console.log(response);
                    console.log("Set the stores current list", response.data.top5List);
                    storeReducer({
                        type: GlobalStoreActionType.SET_LIST_MARKED_FOR_DELETION,
                        payload: response.data.top5List
                    });
                    return true;
                    //let waitResponse = await api.getTop5ListById(id);
                }
            }
            await synchronize(id);
            console.log("Current list before opening the delete modal: ", store.currentList);
            let modal = document.getElementById("delete-modal");
            modal.classList.add("is-visible");
        }
        asyncMarkListForDeletion(id);
    }

    // store.showDeleteModal = function(event){
    //     event.stopProagation();
    //     console.log("Current list before opening the delete modal: ", store.currentList);
    //     let modal = document.getElementById("delete-modal");
    //     modal.classList.add("is-visible");
    // }

    store.isAListMarkedForDeletion = function(){
        if(!store){
            return false;
        }
        return store.listMarkedForDeletion !== null;
    }

    store.hideDeleteListModal = function () {
        async function asyncHideDeleteListModal() {
            console.log("Marking list for deletion...");
            storeReducer({
                type: GlobalStoreActionType.SET_LIST_MARKED_FOR_DELETION,
                payload: null
            });
        }
        asyncHideDeleteListModal();
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
    }

    store.deleteMarkedList = function (){
        async function asyncDeleteList() {
            try{
                let markedListId = store.listMarkedForDeletion;
                console.log("ATTEMPTING TO DELETE LIST W/ ID: ", markedListId);
                if(markedListId != null){
                    let response = await api.deleteTop5ListById(markedListId);
                    if(response.data.success){
                        //store.loadIdNamePairs();
                    }
                    else if(response.status === 404) {
                        throw "404 error";
                        //return Promise.reject('error 404')
                    }
                }
            }
            catch(err){
                console.log(err);
            }
        }
        //asyncDeleteList("API FAILED TO FIND THE LIST MARKED FOR DELETION: ", store.listMarkedForDeletion);
        asyncDeleteList().then(value => {
            console.log("Promise value from deleting: ", value);
            store.hideDeleteListModal();
            store.loadIdNamePairs();
        });
    }
    window.addEventListener("unhandledrejection", function(promiseRejectionEvent) { 
        console.log("ERROR EVENT HANDLER");
        // handle error here, for example log   
    });

    store.setItemActive = function (bool) {
        async function setItem(bool) {
            console.log("Inside setItemActive fn, setting item active to: ", bool);
            storeReducer({
                type: GlobalStoreActionType.SET_ITEM_ACTIVE,
                payload: bool
            });
        }
        setItem(bool);
    }


    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}