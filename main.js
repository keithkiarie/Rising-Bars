var gamecanvas = document.getElementById("gamecanvas");
var displayarea = document.getElementById("displayarea");
var level_display = document.getElementById("level_display");
var ctx = gamecanvas.getContext("2d");
var toggle_game_button = document.getElementById("toggle_game_button");
var game_session = false; // true if the game is being played (bars and ball are moving)
var rising_rate = initial_rising_rate; // the speed with which the bars rise, but increases during the game, integer
var bar_objects = []; //container for all the bar

gamecanvas.width = window.innerWidth * 0.6;
gamecanvas.height = window.innerHeight * 0.7;


change_bar_color = () => {
    bar_color = document.getElementById("bar_color_picker").value;
}

//listen for keyboard input
window.addEventListener('keydown', function (e) {
    ball.key = e.keyCode;
});
window.addEventListener('keyup', function (e) {
    ball.key = false;
});

//listen for touch input
gamecanvas.addEventListener('touchstart', function (e) {
    if (event.touches[0].clientX < gamecanvas.width / 2) {
        ball.key = 37;
    } else if (event.touches[0].clientX > gamecanvas.width / 2) {
        ball.key = 39;
    }
});
gamecanvas.addEventListener('touchend', function (e) {
    ball.key = false;
});


//return a random horizontal position of bars
random_x = () => {
    let x = Math.random() * gamecanvas.width;
    if (x >= gamecanvas.width - bar_width) {
        x -= bar_width;
    }
    return x;
}


clear_canvas = () => {
    ctx.clearRect(-ball_radius, -ball_radius, gamecanvas.width + 2 * ball_radius, gamecanvas.height + 2 *
        ball_radius);
}

bars_initialization = () => {
    //clear the canvas, initialize the holder for bar objects then create new bars
    clear_canvas();

    bar_objects = [];
    for (let i = 0; i < bars_number; i++) {
        bar_objects[i] = new Bar(random_x(), bars_initial_y, bar_width, bar_height, i);
    }

    ball.x = ball_initial_x;
    ball.y = ball_initial_y;
    ball.key = false;

    rising_rate = initial_rising_rate;
    level_display.innerHTML = 0;
    info_display = "";
}

startgame = () => {
    //put the window in full screen
    enter_fullscreen();

    game_session = true;

    //increases rising rate per level
    level_timer = setInterval(function () {
        if (toggle_game_button.innerHTML == "Pause") {
            rising_rate += rising_rate_increase;
            level_display.innerHTML = parseInt(level_display.innerHTML) + 1;
        }
    }, period_per_level);

    //initial interval for calling the sequence of actions on ball and bars until all bars appear on the screen
    inital_bar_movement = setInterval(function () {
        if (game_session) {

            //if the vertical position of the last bar has not changed
            if (bar_objects[bar_objects.length - 1].y == bars_initial_y) {
                clear_canvas();
                for (let i = 0; i < bar_objects.length; i++) {
                    if (i != 0) {
                        if (bar_objects[i].y - bar_objects[i - 1].y > minimum_y_distance()) {
                            bar_objects[i].sequence();
                        }
                    } else {
                        bar_objects[i].sequence();
                    }
                }

            } else {
                //interval for calling the sequence of actions on ball and bars past the initialization
                bar_movement = setInterval(function () {
                    if (game_session) {
                        clear_canvas();
                        for (let i = 0; i < bar_objects.length; i++) {
                            bar_objects[i].sequence();
                        }
                    } else {
                        clearInterval(bar_movement);
                        status_checker();
                    }
                }, refresh_interval);
                clearInterval(inital_bar_movement);
            }

        } else {
            clearInterval(inital_bar_movement);
            status_checker();
        }
    }, refresh_interval);

}

controller = () => {
    if (toggle_game_button.innerHTML == "Start") {
        bars_initialization();
        startgame();
        toggle_game_button.innerHTML = "Pause";
    } else if (toggle_game_button.innerHTML == "Pause") {
        game_session = false;
        toggle_game_button.innerHTML = "Resume";
        close_fullscreen();
    } else if (toggle_game_button.innerHTML == "Resume") {
        game_session = true;
        toggle_game_button.innerHTML = "Pause";
        startgame();
    }
}

status_checker = () => {

    if (toggle_game_button.innerHTML == "Pause") {
        info_display.innerHTML = "Game Over!";
        toggle_game_button.innerHTML = "Start";
        clearInterval(level_timer);
    }
    if (toggle_game_button.innerHTML == "Resume") {

    }
}

enter_fullscreen = () => {
    if (displayarea.requestFullscreen) {
        displayarea.requestFullscreen();
    } else if (displayarea.mozRequestFullScreen) {
        /* Firefox */
        displayarea.mozRequestFullScreen();
    } else if (displayarea.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        displayarea.webkitRequestFullscreen();
    } else if (displayarea.msRequestFullscreen) {
        /* IE/Edge */
        displayarea.msRequestFullscreen();
    }
    gamecanvas.width = window.innerWidth * 0.8;
    gamecanvas.height = window.innerHeight * 0.8;
    document.getElementById("exit_fullscreen_btn").style.display = "block";
}

close_fullscreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
    }
    document.getElementById("exit_fullscreen_btn").style.display = "none";
}