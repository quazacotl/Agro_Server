import Store from "../state/Store";
import { observer } from "mobx-react-lite"

const CurrentUser = observer(() => {

    const setCurrentUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
        Store.setCurrentUser(e.target.value)
    }

    return (
        <div className={'h-full flex gap-6 items-center'}>
            <label className={'text-xl text-white'} htmlFor="curr-user">Оператор</label>
            <select
                defaultValue={Store.currentUser}
                className={'rounded-lg w-46 py-1 text-lg focus:border-none focus:ring-0 focus:ring-offset-0'}
                name="curr-user"
                id="curr-user"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrentUser(e)}
            >
                {Store.currentUsers ? Store.currentUsers.map(item => (
                    <option
                        key={item._id}
                        value={item.name}
                    >
                        {item.name}
                    </option>
                )) : null}
            </select>
        </div>
    );
});

export default CurrentUser;