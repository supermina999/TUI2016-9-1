window.Cell = React.createClass({
    getInitialState: function() {
        return {
            cell_type: 0,
            default_cell_type: 0,
            isFirst: false
        }
    },
    isFree: function() {
        var type = this.state.default_cell_type;
        return (type == 0 || type == 5 || type == 7);
    },
    possibleMove: function(player) {
        var id = this.props.id, parent = this.props.parent, cells = parent.props.cells, x = id.x, y = id.y;
        //console.log(x, y);
        if (!this.isFree() || !this.nearAllies(player)) return false;
        if (!this.samePlayer(player)) return true;
        if (y > 0 && !cells[x][y - 1].samePlayer(player)) return true;
        if (y < parent.props.cells_in_column - 1 && !cells[x][y + 1].samePlayer(player)) return true;
        if (x > 0) {
            if (!cells[x - 1][y].samePlayer(player)) return true;
            if (x % 2 == 0) {
                if (y > 0 && !cells[x - 1][y - 1].samePlayer(player)) return true;
            }
            else if (y < parent.props.cells_in_column - 1 && !cells[x - 1][y + 1].samePlayer(player)) return true;
        }
        if (x < parent.props.number_of_columns - 1) {
            if (!cells[x + 1][y].samePlayer(player)) return true;
            if (x % 2 == 0) {
                if (y > 0 && !cells[x + 1][y - 1].samePlayer(player)) return true;
            }
            else if (y < parent.props.cells_in_column - 1 && !cells[x + 1][y + 1].samePlayer(player)) return true;
        }
        return false;
    },
    componentWillMount: function() {
        this.setState({cell_type: this.props.default_cell_type, default_cell_type: this.props.default_cell_type});
        this.props.parent.props.cells[this.props.id.x][this.props.id.y] = this;
    },
    samePlayer: function(player) {
        var type = this.state.default_cell_type;
        if (player && type != 7 && type != 8 && type != 10 && type != 13) return 0;
        if (!player && type != 5 && type != 6 && type != 9 && type != 12) return 0;
        return 1;
    },
    assignCell: function (isFort, play) {
        var player = play * 2, type = this.state.default_cell_type, player_belong = 2,
            count = this.props.parent.state.count;
        if (this.state.isFirst) return;
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
    buildFortress: function(first, player) {
        var id = this.props.id, parent = this.props.parent, cells = parent.props.cells, x = id.x, y = id.y;
        if (isNaN(player)) player = parent.state.player;
        if (!first && !this.nearAllies(player)) return;
        this.assignCell(true, player);
        if (y > 0) cells[x][y - 1].assignCell(false, player);
        if (y < parent.props.cells_in_column - 1) cells[x][y + 1].assignCell(false, player);
        if (x > 0) {
            cells[x - 1][y].assignCell(false, player);
            if (x % 2 == 0) {
                if (y > 0) cells[x - 1][y - 1].assignCell(false, player);
            }
            else if (y < parent.props.cells_in_column - 1) cells[x - 1][y + 1].assignCell(false, player);
        }
        if (x < parent.props.number_of_columns - 1) {
            cells[x + 1][y].assignCell(false, player);
            if (x % 2 == 0) {
                if (y > 0) cells[x + 1][y - 1].assignCell(false, player);
            }
            else if (y < parent.props.cells_in_column - 1) cells[x + 1][y + 1].assignCell(false, player);
        }
        if (!first) this.props.parent.nextMove()
        else {
            this.setState({isFirst: true});
        }
        //console.log(this.props.id, this.props.isFirst);
    },
    handleClick: function () {
        return this.buildFortress(0);
    },
    makeDeselected: function() {
        this.setState({cell_type: this.state.default_cell_type});
    },
    render: function() {
        var imgsrc = "../img/cell_type" + this.state.cell_type + ".png";
        var style = {
            marginRight: this.props.width / 2,
            height: this.props.width * Math.sqrt(3) / 2
        };
        return (
            <div className="Cell" style={ style } onClick={ this.handleClick }>
                <img src={ imgsrc } width={ this.props.width } />
            </div>
        )
    }
});