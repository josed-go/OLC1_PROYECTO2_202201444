const ArrowIcon = (props) => {

    return (
        <svg 
            className="text-gray-100 hover:text-white align-middle text-center h-full"
            // style={{transform: "rotate(-45deg)"}
            xmlns="http://www.w3.org/2000/svg" 
            width="1em" 
            height="1em" 
            viewBox="0 0 24 24"
            {...props}
            >
            <path fill="currentColor" d="m3.55 12l7.35 7.35q.375.375.363.875t-.388.875q-.375.375-.875.375t-.875-.375l-7.7-7.675q-.3-.3-.45-.675T.825 12q0-.375.15-.75t.45-.675l7.7-7.7q.375-.375.888-.363t.887.388q.375.375.375.875t-.375.875z"/>
            {/* <path fill="currentColor" d="m 12 -3.55 L 19.35 -10.9 Q 19.725 -11.275 20.225 -11.263 T 21.1 -10.875 Q 21.475 -10.5 21.475 -10 T 21.1 -9.125 L 13.425 -1.425 Q 13.125 -1.125 12.75 -0.975 T 12 -0.825 Q 11.625 -0.825 11.25 -0.975 T 10.575 -1.425 L 2.875 -9.125 Q 2.5 -9.5 2.512 -10.013 T 2.9 -10.9 Q 3.275 -11.275 3.775 -11.275 T 4.65 -10.9 Z"/> */}
        </svg>
    )
}

export default ArrowIcon
