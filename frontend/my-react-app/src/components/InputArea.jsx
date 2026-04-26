export default function InputArea({label, placeholder, type, value="", onChange}) {
    return (
        <>
            <div className="input-area">
                <p className="input-label">{label}</p>
                <input 
                required className="input-box" 
                placeholder={placeholder} 
                type={type}
                value={value}
                onChange={onChange}
                />
            </div>
            <div className="medium-gap" />
        </>
    )
}
