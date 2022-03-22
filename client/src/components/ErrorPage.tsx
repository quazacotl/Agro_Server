interface ErrorPageProps {
    errorText: String
}

const ErrorPage = (props: ErrorPageProps) => {
    return (
        <div className="bg-white relative w-full" >
            <div className={'w-full h-full'}>
                <img className={'object-contain m-auto'} src="/dribbble_1.gif" alt="error"/>
            </div>
            <h2 className={'absolute left-1/2 -translate-x-1/2 top-10 text-2xl text-black'}>{props.errorText}</h2>
        </div>
        
    )
}

export default ErrorPage;
