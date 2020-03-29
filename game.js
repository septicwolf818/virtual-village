var username = undefined;
var map = Array();
var playerX = 0;
var playerY = 0;
var playerFacing = "d";
var inInventory = false;
var inGame = false;
var inventory = [];
var selectedItem = undefined;
var time = 6000;
var timer = undefined;
var days = 0;
var night = false;
var spawnRock = false;
var spawnTallGrass = false;
var food = 5;

function timeWorker() {
    time += 1;
    if (time % 100 >= 60) time = time - (time % 1000) + 1000;
    document.getElementById("clock").innerHTML = (time - time % 1000) / 1000 + ":" + (time % 1000);
    if (Math.random() < 0.01) {
        food -= 1;
        document.getElementById("food").innerHTML = "";
        for (var i = 0; i < food; i++) {
            document.getElementById("food").innerHTML += "<img width=\"10%\" src=\"ui/food-full.png\">";
        }
        for (var i = 0; i < 10 - food; i++) {
            document.getElementById("food").innerHTML += "<img width=\"10%\" src=\"ui/food-empty.png\">";
        }
        if (food <= 0) {
            alert("You died!");
            window.location.reload();
        }
    }
    if (time > 24000) {
        time = 0;
        days++;
    }
    if (time < 6000 || time > 19000) {
        night = true;
    } else {
        night = false;
    }
    if (Math.random() < 0.01) {
        console.log("New rock");
        spawnRock = true;
    }
    if (Math.random() < 0.05) {
        console.log("New tall grass")
        spawnTallGrass = true;
    }
    x = 0;
    y = 0;
    var tiles = document.getElementsByClassName("tile");

    for (i = 0; i < tiles.length; i++) {
        if (tiles[i].childElementCount == 0 && spawnRock && Math.random() < 0.025) {
            map[y][x] = "R";
            var rock = document.createElement("div");
            rock.classList.add("env");
            rock.classList.add("rock");
            tiles[i].appendChild(rock);
            spawnRock = false;
        } else if (tiles[i].childElementCount == 0 && spawnTallGrass && Math.random() < 0.025) {
            map[y][x] = "TG";
            var tallgrass = document.createElement("div");
            tallgrass.classList.add("env");
            tallgrass.classList.add("tallgrass");
            tiles[i].appendChild(tallgrass);
            spawnTallGrass = false;
        }
        if (night) {
            tiles[i].style.filter = "brightness(50%)";
        } else {
            tiles[i].style.filter = "brightness(100%)";
        }
        if (tiles[i].childElementCount > 0) {
            nodes = tiles[i].childNodes;
            for (j = 0; j < nodes.length; j++) {
                if (nodes[j].classList.contains("sapling")) {
                    if (Math.random() < 0.01) {
                        nodes[j].classList.remove("sapling");
                        nodes[j].classList.add("tree");
                        map[y][x] = "T";
                    }
                } else if (nodes[j].classList.contains("seeds")) {
                    if (Math.random() < 0.01) {
                        nodes[j].classList.remove("seeds");
                        nodes[j].classList.add("wheat");
                        map[y][x] = "WH";
                    }
                }
            }

        }
        x++;
        if (x >= 10) {
            y++;
            x = 0;
        }
    }
}

function playerInput(e) {
    if (inGame) {
        if ((e.code == "KeyW" || e.code == "ArrowUp") && !inInventory) {
            if (playerFacing == "u") {
                if (playerY > 0) {
                    if (map[playerY - 1][playerX] == "G") {
                        playerY--;
                    }
                }
            } else {
                playerFacing = "u";
            }

        } else if ((e.code == "KeyS" || e.code == "ArrowDown") && !inInventory) {
            if (playerFacing == "d") {
                if (playerY < map.length - 1) {
                    if (map[playerY + 1][playerX] == "G") {
                        playerY++;
                    }
                }
            } else {
                playerFacing = "d";

            }
        } else if ((e.code == "KeyA" || e.code == "ArrowLeft") && !inInventory) {
            if (playerFacing == "l") {
                if (playerX > 0) {
                    if (map[playerY][playerX - 1] == "G") {
                        playerX--;
                    }
                }
            } else {
                playerFacing = "l";
            }
        } else if ((e.code == "KeyD" || e.code == "ArrowRight") && !inInventory) {
            if (playerFacing == "r") {
                if (playerX < map[0].length) {
                    if (map[playerY][playerX + 1] == "G") {
                        playerX++;
                    }
                }
            } else {
                playerFacing = "r";
            }

        } else if ((e.code == "KeyQ") && !inInventory) {
            if (selectedItem == undefined) {
                return;
            }
            x = 0;
            y = 0;
            var tiles = document.getElementsByClassName("tile");
            var letter = selectedItem[0].toUpperCase();

            switch (selectedItem) {
                case "apple":
                    if (food < 10) {
                        feed();
                        removeFromInventory("apple");
                    }
                    return;
                case "bread":
                    if (food < 10) {
                        removeFromInventory("bread");
                        feed();
                    }
                    return;
            }
            node = document.createElement("div");
            node.classList.add("env");
            node.classList.add(selectedItem);


            for (i = 0; i < tiles.length; i++) {
                if (tiles[i].childElementCount == 0) {

                    switch (playerFacing) {
                        case "u":
                            if (x == playerX && y == playerY - 1) {
                                tiles[i].appendChild(node);
                                map[y][x] = letter;
                                removeFromInventory(selectedItem);
                            };
                            break;
                        case "d":
                            if (x == playerX && y == playerY + 1) {
                                tiles[i].appendChild(node);
                                map[y][x] = letter;
                                removeFromInventory(selectedItem);
                            };
                            break;
                        case "l":
                            if (x == playerX - 1 && y == playerY) {
                                tiles[i].appendChild(node);
                                map[y][x] = letter;
                                removeFromInventory(selectedItem);
                            };
                            break;
                        case "r":
                            if (x == playerX + 1 && y == playerY) {
                                tiles[i].appendChild(node);
                                map[y][x] = letter;
                                removeFromInventory(selectedItem);
                            };
                            break;
                    }
                }
                x++;
                if (x >= 10) {
                    y++;
                    x = 0;
                }
            }

        } else if (e.code == "KeyE") {
            if (inInventory) {
                document.getElementById("inventory").style.display = "none";
                document.getElementById("game").style.display = "block";

            } else {
                document.getElementById("items").innerHTML = "";
                for (var i = 0; i < inventory.length; i++) {
                    document.getElementById("items").innerHTML += "<p onclick=\"selectItem('" + inventory[i][1] + "')\"><img width=\"10%\" src=\"env/" + inventory[i][1] + ".png\"> x " + inventory[i][0] + "</p>";
                }
                document.getElementById("inventory").style.display = "block";
                document.getElementById("game").style.display = "none";
            }
            document.getElementById("food").innerHTML = "";
            for (var i = 0; i < food; i++) {
                document.getElementById("food").innerHTML += "<img width=\"10%\" src=\"ui/food-full.png\">";
            }
            for (var i = 0; i < 10 - food; i++) {
                document.getElementById("food").innerHTML += "<img width=\"10%\" src=\"ui/food-empty.png\">";
            }

            inInventory = !inInventory;
        } else if (e.code == "Space" && !inInventory) {
            x = 0;
            y = 0;
            var tiles = document.getElementsByClassName("tile");
            for (i = 0; i < tiles.length; i++) {
                if (tiles[i].childElementCount > 0) {
                    var nodes = tiles[i].childNodes;
                    for (var j = 0; j < nodes.length; j++) {

                        switch (playerFacing) {
                            case "u":
                                if (x == playerX && y == playerY - 1) {
                                    addToInventory(nodes[j].classList);
                                    nodes[j].remove();
                                    map[y][x] = "G";
                                };
                                break;
                            case "d":
                                if (x == playerX && y == playerY + 1) {
                                    addToInventory(nodes[j].classList);
                                    nodes[j].remove();
                                    map[y][x] = "G";
                                };
                                break;
                            case "l":
                                if (x == playerX - 1 && y == playerY) {
                                    addToInventory(nodes[j].classList);
                                    nodes[j].remove();
                                    map[y][x] = "G";
                                };
                                break;
                            case "r":
                                if (x == playerX + 1 && y == playerY) {
                                    addToInventory(nodes[j].classList);
                                    nodes[j].remove();
                                    map[y][x] = "G";
                                };
                                break;
                        }

                    }
                }
                x++;
                if (x >= 10) {
                    y++;
                    x = 0;
                }
            }

        }


        x = 0;
        y = 0;
        var tiles = document.getElementsByClassName("tile");
        for (i = 0; i < tiles.length; i++) {
            if (tiles[i].childElementCount > 0) {
                var nodes = tiles[i].childNodes;
                for (var j = 0; j < nodes.length; j++) {
                    if (nodes[j].classList.contains("player-d") || nodes[j].classList.contains("player-u") || nodes[j].classList.contains("player-l") || nodes[j].classList.contains("player-r")) {
                        nodes[j].remove();
                    }
                }

            }
            if (x == playerX && y == playerY) {
                var player = document.createElement("div");
                player.classList.add("env");
                switch (playerFacing) {
                    case "l":
                        player.classList.add("player-l");
                        break;
                    case "r":
                        player.classList.add("player-r");
                        break;
                    case "u":
                        player.classList.add("player-u");
                        break;
                    case "d":
                        player.classList.add("player-d");
                        break;
                }
                tiles[i].appendChild(player);
            }
            x++;
            if (x >= 10) {
                y++;
                x = 0;
            }
        }
        resizeMap();
    }
}

function selectItem(name) {
    selectedItem = name;
    closeInventory();
}

function closeInventory() {
    inInventory = false;
    document.getElementById("game").style.display = "block";
    document.getElementById("inventory").style.display = "none";
    resizeMap();

}

function addToInventory(classList) {
    var node = classList[1];
    var item = undefined;
    switch (node) {
        case "tree":
            item = "wood";
            for (var i = parseInt(Math.random() * 3) + 1; i > 0; i--) {
                addToInventory(["", "sapling"]);
            }
            addToInventory(["", "apple"]);
            break;
        case "tallgrass":
            if (Math.random() < 0.3) {
                addToInventory(["", "seeds"])
            }
            return;
        case "rock":
            item = "brick";
            break;
        case "wood":
            item = "wood";
            break;
        case "brick":
            item = "brick";
            break;
        case "sapling":
            item = "sapling";
            break;
        case "seeds":
            item = "seeds";
            break;
        case "apple":
            item = "apple";
            break;
        case "wheat":
            item = "wheat";
            for (var i = parseInt(Math.random() * 3); i > 0; i--)
                addToInventory(["", "seeds"])
            break;
    }
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i][1] == item) {
            inventory[i][0]++;
            return;
        }

    }
    inventory.push([1, item]);
}

function removeFromInventory(item) {
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i][1] == item) {
            inventory[i][0]--;
            if (inventory[i][0] <= 0) {
                inventory.splice(i, 1);
                selectedItem = undefined;
            }
            return;
        }

    }
}

function feed() {
    food += 1;
}

function resizeMap() {
    var tiles = document.getElementsByClassName("tile");
    var map = document.getElementById("map");
    map.style.height = map.offsetWidth + "px";
    for (var i = 0; i < tiles.length; i++) {
        tiles[i].style.height = (map.offsetWidth / 10) + "px";

    }
}

function setup() {
    username = document.getElementById("username").value;
    if (!username) {
        username = "user"
    }
    inGame = true;
    setInterval(timeWorker, 1000);
    document.getElementById("header").innerHTML = username + "'s village";

    for (var y = 0; y < 10; y++) {
        temp = Array();
        for (var x = 0; x < 10; x++) {
            temp.push("G");
        }
        map.push(temp);
    }

    for (var y = 0; y < map.length; y++) {
        for (var x = 0; x < map[y].length; x++) {
            var tmp = document.createElement("div");
            tmp.classList.add("tile");
            if (Math.random() < 0.1) {
                map[y][x] = "R";
                var rock = document.createElement("div");
                rock.classList.add("env");
                rock.classList.add("rock");
                tmp.appendChild(rock);
            } else if (Math.random() < 0.1) {
                var rock = document.createElement("div");
                map[y][x] = "T";
                rock.classList.add("env");
                rock.classList.add("tree");
                tmp.appendChild(rock);
            } else if (Math.random() < 0.1) {
                var tallgrass = document.createElement("div");
                map[y][x] = "TG";
                tallgrass.classList.add("env");
                tallgrass.classList.add("tallgrass");
                tmp.appendChild(tallgrass);
            }
            document.getElementById("map").appendChild(tmp);
        }
    }


    var tiles = document.getElementsByClassName("tile");
    for (i = 0; i < tiles.length; i++) {
        if (tiles[i].childElementCount > 0) {
            playerX++;
            if (playerX >= 10) {
                playerY++;
                playerX = 0;
            }
        } else {
            player = document.createElement("div");
            player.classList.add("env");
            player.classList.add("player-d");
            tiles[i].appendChild(player);
            break;

        }

    }
    document.getElementById("setup").style.display = "none";
    document.getElementById("game").style.display = "block";
    resizeMap();

}
window.addEventListener("resize", resizeMap);
document.addEventListener("keydown", playerInput);