window.addEventListener('keydown', function(e){
    if(e.keyCode == 13) {
        try {
            let buttons = document.getElementsByTagName('button')
            for(let i=0;i<buttons.length;i++){
                if(buttons[i].textContent == 'Send'){
                    buttons[i].click()
                    e.preventDefault()
                    break
                }
            }
        } catch(err) {
            console.log(err) 
        }
    }
}, true)
