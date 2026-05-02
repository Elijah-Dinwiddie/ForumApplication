export default function InputTextArea({label, placeholder, type, value="", onChange, height=""}) {
    return (
        <>
            <div className="input-text-area">
                <p className="input-label">{label}</p>
                <textarea 
                required className="input-box padding" 
                placeholder={placeholder} 
                type={type}
                value={value}
                onChange={onChange}
                style = {{height}}
                />
            </div>
            <div className="medium-gap" />
        </>
    )
}
