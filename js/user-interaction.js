MouseHandler = {
  onmousedown: function(e)
  {
    mouse.button = e.which;
    mouse.px = mouse.x;
    mouse.py = mouse.y;

    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.down = true;

    mouseDownX = mouse.x;
    mouseDownY = mouse.y;

    e.preventDefault();
  },
  onmouseup: function(e)
  {
    mouse.down = false;

    HitBall();

    e.preventDefault();
  },
  onmousemove: function(e)
  {
    if (mouse.down == true)
    {
      mouse.px = mouse.x;
      mouse.py = mouse.y;

      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
  }
};
