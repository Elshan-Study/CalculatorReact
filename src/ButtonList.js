export default function ButtonList({myButtons, onClick}) {

    return myButtons.map(x =>
        <button key={x} onClick={() => onClick(x)}>
            {x}
        </button>
    );
}