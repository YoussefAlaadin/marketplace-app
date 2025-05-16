export function txtSlicer(txt=String, max) {
    if (txt.length >= max) {
        return (
            `${txt.slice(0, max)}...`
        )
    }
    else {
        return(txt)
    }
}
