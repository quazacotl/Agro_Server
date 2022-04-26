interface SearchInputProps {
    inputState: string,
    inputHandler: (value: string)=>void,
    attr: string,
    clearInputs: ()=>void
    id: string
}

const SearchInput = (props:SearchInputProps) => {
    return (
        <div className={'flex flex-col'}>
            <label className={'text-xl text-white'} htmlFor={props.id}>{`Поиск по ${props.attr}`}</label>
            <input
                id={props.id}
                autoFocus={props.id === 'reg'}
                type="text"
                className={'my-3 px-4 rounded-lg text-stone-800 focus:border-none focus:ring-0 focus:ring-offset-0 focus:shadow-input-focus h-10'}
                value={props.inputState}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    props.inputHandler(event.currentTarget.value)
                    props.clearInputs()
                }}
                placeholder={`Введите 3 символа`}
            />
        </div>

    )
}
export default SearchInput