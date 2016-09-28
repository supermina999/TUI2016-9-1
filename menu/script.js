var menu = {
    isOptionsOn: false,
    isStatsOn: false,
    isExitBottomOn: false,
    show: function () {
        var image = document.createElement('img');
        image.src = 'menu.jpg';
        image.width = 100;
        image.height = 70;
        image.onmouseover = function () {
            this.src = 'menu2.jpg';
        }
        image.onmouseout = function () {
            this.src = 'menu.jpg';
        }
        image.onclick = function () {
            if (!menu.isOptionsOn) {
                options.show();
                menu.isOptionsOn = true;
            }
            else
            {
                options.hide();
                menu.isOptionsOn = false;
            }


            if (!menu.isStatsOn) {
                stats.show();
                menu.isStatsOn = true;
            }
            else
            {
                stats.hide();
                menu.isStatsOn = false;
            }


            if (!menu.isExitBottomOn) {
                exitBottom.show();
                menu.isExitBottomOn = true;
            }
            else
            {
                exitBottom.hide();
                menu.isExitBottomOn = false;
            }
        }
        var div = document.createElement('div');
        div.appendChild(image);
        div.style.left = 1810;
        div.style.top = 10;
        document.body.appendChild(div);
    }
}

var options = {
    show: function () {
        var image = document.createElement('img');
        image.id = 'imgOption';
        image.src = 'menu.jpg';
        image.width = 100;
        image.height = 70;
        image.onmouseover = function () {
            this.src = 'menu2.jpg';
        }
        image.onmouseout = function () {
            this.src = 'menu.jpg';
        }
        var div = document.createElement('div');
        div.appendChild(image);
        div.style.left = 860;
        div.style.top = 300;
        document.body.appendChild(div);
    },
    hide: function () {
        var image = document.getElementById('imgOption');
        if (image != null)
        {
            image.parentElement.removeChild(image);
        }
    }
}

var stats = {
    show: function () {
        var image = document.createElement('img');
        image.id = 'imgStats';
        image.src = 'menu.jpg';
        image.width = 100;
        image.height = 70;
        image.onmouseover = function () {
            this.src = 'menu2.jpg';
        }
        image.onmouseout = function () {
            this.src = 'menu.jpg';
        }
        var div = document.createElement('div');
        div.appendChild(image);
        div.style.left = 860;
        div.style.top = 400;
        document.body.appendChild(div);
    },
    hide: function () {
        var image = document.getElementById('imgStats');
        if (image != null)
        {
            image.parentElement.removeChild(image);
        }
    }
}

var exitBottom = {
    show: function () {
        var image = document.createElement('img');
        image.id = 'imgExitBottom';
        image.src = 'menu.jpg';
        image.width = 100;
        image.height = 70;
        image.onmouseover = function () {
            this.src = 'menu2.jpg';
        };
        image.onmouseout = function () {
            this.src = 'menu.jpg';
        };
        var div = document.createElement('div');
        div.appendChild(image);
        div.style.left = 860;
        div.style.top = 500;
        document.body.appendChild(div);
    },
    hide: function () {
        var image = document.getElementById('imgExitBottom');
        if (image != null)
        {
            image.parentElement.removeChild(image);
        }
    }
}

menu.show();
