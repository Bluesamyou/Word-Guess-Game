var gameState ={
    user : ""
}



Swal.fire({
    imageUrl: './assets/images/waving_hand_sign_1024.gif',
    imageHeight: 125,
    imageAlt: 'A tall image',
    background: 'rgba(0,0,0,0.9)',
    html : `<h3 style="color:white;">Hello there,</h3>
            <h4 style="color:pink;"> Please enter your name below to begin</h4>`,
    input: 'text', 
    preConfirm : (user) => {
        if (user !== ""){
            gameState.user = user;
            document.getElementById('user').textContent = user.toUpperCase();
        }

    }
    }
    )