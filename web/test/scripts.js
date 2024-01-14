window.addEventListener('keydown', function(e) {
    const keyCode = e.code;
    if( keyCode == 'Escape') {
        console.log('reload')
        P._reload();
    }
})