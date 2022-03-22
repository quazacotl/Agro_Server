import Store from "../state/Store";
import {observer} from "mobx-react-lite";

const BubbleContext = observer(() => {
    return (
        <div
            className={'px-4 py-2 whitespace-pre-wrap rounded-lg bg-white absolute border border-amber-400'}
            style={{top: `${Store.bubbleContextYCoord - 40}px`, left: `${Store.bubbleContextXCoord + 20}px`}}
        >{Store.bubbleContextText}
        </div>
    );
});

export default BubbleContext;