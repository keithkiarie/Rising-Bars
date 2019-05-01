var initial_rising_rate = 10; // the speed with which the bars rise
var rising_rate_increase = 1;
var gravity = 0.1; // the speed with which the ball falls
var unit_distance_change = 0.3; // distance an object moves
var ball_swerve = 0.05; // speed of the horizontal movement of ball

var period_per_level = 10000; // level increases after this time interval

var bar_width = 70;
var bar_height = 10;
var bars_initial_y = gamecanvas.height + 10; //the vertical position where bars start from
var bars_number = 6; // the number of bars in a game session

var ball_radius = 5; // radius of the ball
var ball_initial_x = gamecanvas.width / 2;
var ball_initial_y = 50;
var bar_color = "blue";
var ball_color = "black";

var refresh_interval = 15; // time that elapses before objects are cleared then redrawn on the screen

minimum_y_distance = () => {
    return gamecanvas.height * 1.1 / bars_number;
};