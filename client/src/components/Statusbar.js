import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    //store.history = useHistory();
    const history = useHistory();
    let text ="";
    console.log(store.listMarkedForDeletion);
    console.log(store.currentList);
    let pathName = history.location.pathname;
    //console.log(pathName);
    //if(pathName.includes("/"))
    if (store.currentList != null && pathName.includes("/top5list/"))
        text = store.currentList.name;
    return (
        <div id="top5-statusbar">
            {text}
        </div>
    );
}

export default Statusbar;