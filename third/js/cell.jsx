window.Cell = React.createClass({
    getInitialState: function() {
        return {
            cell_type: 0,
            default_cell_type: 0,
            general: false,
            movesLeft: 0
        }
    },

    isSea: function() {
        var type = this.state.default_cell_type;
        return (type == 1 || type == 9 || type == 10);
    },
    isMountain: function() {
        var type = this.state.default_cell_type;
        return (10 < type && type < 14);
    },
    isFree: function() {
        return (!this.isSea() && !this.isMountain());
    },
    playerBelong: function() {
        var type = this.state.cell_type;
        if (type == 5 || type == 6 || type == 9 || type == 12) return 0;
        if (type == 7 || type == 8 || type == 10 || type == 13) return 1;
        return -1;
    },
    samePlayer: function(player) {
        var type = this.state.default_cell_type;
        if (player && type != 7 && type != 8 && type != 10 && type != 13) return 0;
        if (!player && type != 5 && type != 6 && type != 9 && type != 12) return 0;
        return 1;
    },
    nearAllies: function(player) {
        var id = this.props.id, parent = this.props.parent, cells = parent.props.cells, x = id.x, y = id.y, ans = 0;
        if (this.samePlayer(player)) ans++;
        if (y > 0 && cells[x][y - 1].samePlayer(player)) ans++;
        if (y < parent.props.cells_in_column - 1 && cells[x][y + 1].samePlayer(player)) ans++;
        if (x > 0) {
            if (cells[x - 1][y].samePlayer(player)) ans++;
            if (x % 2 == 0) {
                if (y > 0 && cells[x - 1][y - 1].samePlayer(player)) ans++;
            }
            else if (y < parent.props.cells_in_column - 1 && cells[x - 1][y + 1].samePlayer(player)) ans++;
        }
        if (x < parent.props.number_of_columns - 1) {
            if (cells[x + 1][y].samePlayer(player)) ans++;
            if (x % 2 == 0) {
                if (y > 0 && cells[x + 1][y - 1].samePlayer(player)) ans++;
            }
            else if (y < parent.props.cells_in_column - 1 && cells[x + 1][y + 1].samePlayer(player)) ans++;
        }
        return ans;
    },

    assignCell: function (isFort, play, first) {
        var player = play * 2, type = this.state.default_cell_type, player_belong = 2,
            count = this.props.parent.state.count, startCells = this.props.parent.props.startCells,
            cells = this.props.parent.props.cells;
        if (!first && (cells[startCells[0].x][startCells[0].y] == this || cells[startCells[0].x][startCells[0].y] == this)) return;

        if (type == 5 || type == 6 || type == 9 || type == 12) player_belong = 0;
        if (type == 7 || type == 8 || type == 10 || type == 13) player_belong = 1;
        count[player / 2]++;
        count[player_belong]--;
        this.props.parent.setState({count: count});
        if (type == 2 || type == 4 || type == 6 || type == 8 || isFort) type = 6 + player;
        else if (type == 1 || type == 9 || type == 10) type = 9 + player / 2;
        else if (type == 11 || type == 12 || type == 13) type = 12 + player / 2;
        else type = 5 + player;
        this.state.cell_type = this.state.default_cell_type = type;
        this.setState({cell_type: type, default_cell_type: type});
    },
    buildFortress: function(first, player) {
        var id = this.props.id, parent = this.props.parent, cells = parent.props.cells, x = id.x, y = id.y;
        if (isNaN(player)) player = parent.state.player;
        this.assignCell(true, player, first);
        if (y > 0) cells[x][y - 1].assignCell(false, player, first);
        if (y < parent.props.cells_in_column - 1) cells[x][y + 1].assignCell(false, player, first);
        if (x > 0) {
            cells[x - 1][y].assignCell(false, player, first);
            if (x % 2 == 0) {
                if (y > 0) cells[x - 1][y - 1].assignCell(false, player, first);
            }
            else if (y < parent.props.cells_in_column - 1) cells[x - 1][y + 1].assignCell(false, player, first);
        }
        if (x < parent.props.number_of_columns - 1) {
            cells[x + 1][y].assignCell(false, player, first);
            if (x % 2 == 0) {
                if (y > 0) cells[x + 1][y - 1].assignCell(false, player, first);
            }
            else if (y < parent.props.cells_in_column - 1) cells[x + 1][y + 1].assignCell(false, player, first);
        }
    },

    distanceTo: function(idTo) {
        var parent = this.props.parent,
            cells = parent.props.cells,
            dist = new Array(parent.props.number_of_columns),
            u = new Array(parent.props.number_of_columns),
            player = parent.state.player;
        for (var i = 0; i < dist.length; i++) {
            dist[i] = new Array(parent.props.cells_in_column);
            dist[i].fill(100000000);
        }
        for (var i = 0; i < u.length; i++) {
            u[i] = new Array(parent.props.cells_in_column);
            u[i].fill(false);
        }
        dist[this.props.id.x][this.props.id.y] = 0;
        for (var i = 0; i < parent.props.cells_in_column * parent.props.number_of_columns; i++) {
            var id = -1;
            for (var j = 0; j < u.length; j++)
                for (var k = 0; k < u[j].length; k++) {
                    //console.log(u[j][k], dist[j][k]);
                    if (!u[j][k] && (id == -1 || dist[id.x][id.y] > dist[j][k])) {
                        id = {x: j, y: k};
                        //console.log(id);
                    }
                }
            //console.log(id);
            u[id.x][id.y] = true;
            var curSea = cells[id.x][id.y].isSea();

            function relaxCell(cellId) {
                if (cellId.x < 0 || cellId.x >= parent.props.number_of_columns||
                    cellId.y < 0 || cellId.y >= parent.props.cells_in_column) return;
                var cell = cells[cellId.x][cellId.y], pl = cell.playerBelong();
                if ((pl == player || pl == -1) && !cell.isMountain()) dist[cellId.x][cellId.y] = Math.min(dist[cellId.x][cellId.y],
                                                                                dist[id.x][id.y] + (curSea && cell.isFree() ? 2 : 1));
            }

            relaxCell({x: id.x - 1, y: id.y});
            relaxCell({x: id.x + 1, y: id.y});
            relaxCell({x: id.x, y: id.y - 1});
            relaxCell({x: id.x, y: id.y + 1});
            relaxCell({x: id.x - 1, y: id.y + id.x % 2 ? 1 : -1});
            relaxCell({x: id.x + 1, y: id.y + id.x % 2 ? 1 : -1});
        }
        return dist[idTo.x][idTo.y];
    },
    handleClick: function() {
        var parent = this.props.parent, lastGeneral = parent.state.selectedGeneral, pb = this.playerBelong();
        if (lastGeneral === false) {
            //console.log(this.state.general, parent.state.player, this.state.movesLeft);
            if (this.state.general === parent.state.player) parent.setState({selectedGeneral: this.props.id});
        } else {
            if (this == parent.props.cells[lastGeneral.x][lastGeneral.y]) {
                parent.setState({selectedGeneral: false});
                return;
            }
            if (this.state.general !== false || (pb != parent.state.player && pb != -1)) return;
            var dist = parent.props.cells[lastGeneral.x][lastGeneral.y].distanceTo(this.props.id),
                lastCell = parent.props.cells[lastGeneral.x][lastGeneral.y],
                movesLeft = lastCell.state.movesLeft,
                lastGen = lastCell.state.general;
            if (dist <= movesLeft) {
                lastCell.setState({general: false, movesLeft: 0});
                this.setState({general: lastGen, movesLeft: movesLeft - dist});
                parent.setState({selectedGeneral: false});
            }
        }
    },

    componentWillMount: function() {
        this.setState({cell_type: this.props.default_cell_type, default_cell_type: this.props.default_cell_type});
        this.props.parent.props.cells[this.props.id.x][this.props.id.y] = this;
    },
    render: function() {
        var imgsrc = "../img/cell_type" + this.state.cell_type + ".png";
        var style = {
            marginRight: this.props.width / 2,
            height: this.props.width * Math.sqrt(3) / 2,
            width: this.props.width
        };
        if (this.state.general === false) return (
            <div className="Cell" style={ style } onClick={ this.handleClick }>
                <img src={ imgsrc } width={ this.props.width } />
            </div>
        );
        else return (
            <div className="Cell" style={ style } onClick={ this.handleClick }>
                <img src={ imgsrc } style={{width: this.props.width, position: "absolute", zIndex: 1}} />
                <img src={ "../img/general" + this.state.general + ".png" } style={{width: this.props.width / 2, position: "absolute", zIndex: 3, height: style.height, marginLeft: style.width / 4}} />
            </div>
        )
    }
});