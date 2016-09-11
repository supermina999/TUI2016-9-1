var Cell = React.createClass({
    getInitialState: function() {
        return {
            cell_type: 0,
            default_cell_type: 0
        }
    },
    getDefaultProps: function() {
        return {
            neighbours: null
        }
    },
    isFree: function() {
        var type = this.state.default_cell_type;
        return (type == 0 || type == 5 || type == 7);
    },
    possibleMove: function(player) {
        var id = this.props.id,
            cir = this.props.parent.props.cells_in_row,
            row = (Math.trunc(id / cir) & 1) * 2 - 1,
            num = this.props.parent.props.cells.length;
        if (this.samePlayer(player)) return 0;
        if (id >= 2 * cir &&
            this.props.parent.props.cells[id - 2 * cir].nearAllies(player) &&
            this.props.parent.props.cells[id - 2 * cir].isFree()) return 1;
        if (id + 2 * cir < num &&
            this.props.parent.props.cells[id + 2 * cir].nearAllies(player) &&
            this.props.parent.props.cells[id + 2 * cir].isFree()) return 1;
        if (id >= cir  &&
            this.props.parent.props.cells[id - cir].nearAllies(player) &&
            this.props.parent.props.cells[id - cir].isFree()) return 1;
        if (id + cir < num &&
            this.props.parent.props.cells[id + cir].nearAllies(player) &&
            this.props.parent.props.cells[id + cir].isFree()) return 1;
        if (id >= cir - row &&
            id % cir + row < cir &&
            id % cir + row >= 0 &&
            this.props.parent.props.cells[id - cir + row].nearAllies(player) &&
            this.props.parent.props.cells[id - cir + row].isFree()) return 1;
        if (id + cir + row < num &&
            id % cir + row < cir &&
            id % cir + row >= 0 &&
            this.props.parent.props.cells[id + cir + row].nearAllies(player) &&
            this.props.parent.props.cells[id + cir + row].isFree()) return 1;
        return 0;
    },
    componentWillMount: function() {
        this.setState({cell_type: this.props.default_cell_type, default_cell_type: this.props.default_cell_type});
        this.props.parent.props.cells.push(this);
    },
    samePlayer: function(player) {
        var type = this.state.default_cell_type;
        if (player && type != 7 && type != 8 && type != 10 && type != 13) return 0;
        if (!player && type != 5 && type != 6 && type != 9 && type != 12) return 0;
        return 1;
    },
    assignCell: function (isFort, play, assignType) {
        var player = play * 2, type = this.state.default_cell_type, player_belong = 2,
            count = this.props.parent.state.count;
        if (type == 5 || type == 6 || type == 9 || type == 12) player_belong = 0;
        if (type == 7 || type == 8 || type == 10 || type == 13) player_belong = 1;
        if (isNaN(assignType))
        {
            count[player / 2]++;
            count[player_belong]--;
            this.props.parent.setState({count: count});
            if (type == 2 || type == 4 || type == 6 || type == 8 || isFort) type = 6 + player;
            else if (type == 1 || type == 9 || type == 10) type = 9 + player / 2;
            else if (type == 11 || type == 12 || type == 13) type = 12 + player / 2;
            else type = 5 + player;
            this.state.cell_type = this.state.default_cell_type = type;
            this.setState({cell_type: type, default_cell_type: type});
        } else {
            var stateChange = this.props.parent.state.resultChange;
            if (isFort) type = 16 + play;
            else if (type == 2 || type == 6 || type == 8) type = 4;
            else if (type == 1 || type == 9 || type == 10) type = 19;
            else if (type == 11 || type == 12 || type == 13) type = 18;
            else if (type == 0 || type == 5 || type == 7) type = 20;
            if (this.samePlayer(play)) {
                if (!isFort) type = this.state.default_cell_type;
            }
            else stateChange[play]++;
            if (this.samePlayer(play ^ 1))
                stateChange[1 - play]--;
            this.setState({cell_type: type});
            this.props.parent.setState({resultChange: stateChange});
        }
    },
    nearAllies: function(player) {
        var id = this.props.id,
            cir = this.props.parent.props.cells_in_row,
            row = (Math.trunc(id / cir) & 1) * 2 - 1,
            num = this.props.parent.props.cells.length,
            ans = 0,
            k = 0;
        if (this.samePlayer(player)) ans++;
        if (id >= 2 * cir) {
            if (this.props.parent.props.cells[id - 2 * cir].samePlayer(player)) ans++;
        } else k++;
        if (id + 2 * cir < num) {
            if (this.props.parent.props.cells[id + 2 * cir].samePlayer(player)) ans++;
        } else k++;
        if (id >= cir) {
            if (this.props.parent.props.cells[id - cir].samePlayer(player)) ans++;
        } else k++;
        if (id + cir < num) {
            if (this.props.parent.props.cells[id + cir].samePlayer(player)) ans++;
        } else k++;
        if (id >= cir - row && id % cir + row < cir && id % cir + row >= 0) {
            if (this.props.parent.props.cells[id - cir + row].samePlayer(player)) ans++;
        } else k++;
        if (id + cir + row < num && id % cir + row < cir && id % cir + row >= 0) {
            if (this.props.parent.props.cells[id + cir + row].samePlayer(player)) ans++;
        } else k++;
        if (this.props.neighbours == null) this.props.neighbours = k;
        return ans;
    },
    buildFortress: function(first, play, type) {
        var id = this.props.id,
            cir = this.props.parent.props.cells_in_row,
            row = (Math.trunc(id / cir) & 1) * 2 - 1,
            num = this.props.parent.props.cells.length,
            player = play,
            spec = !isNaN(player);
        if (!spec) player = this.props.parent.state.player;
        if (isNaN(type) && !first && !this.nearAllies(player)) return 0;
        this.assignCell(1, player, type);
        if (id >= 2 * cir) {
            this.props.parent.props.cells[id - 2 * cir].assignCell(0, player, type);
        }
        if (id + 2 * cir < num) {
            this.props.parent.props.cells[id + 2 * cir].assignCell(0, player, type);
        }
        if (id >= cir) {
            this.props.parent.props.cells[id - cir].assignCell(0, player, type);
        }
        if (id + cir < num) {
            this.props.parent.props.cells[id + cir].assignCell(0, player, type);
        }
        if (id >= cir - row && id % cir + row < cir && id % cir + row >= 0) {
            this.props.parent.props.cells[id - cir + row].assignCell(0, player, type);
        }
        if (id + cir + row < num && id % cir + row < cir && id % cir + row >= 0) {
            this.props.parent.props.cells[id + cir + row].assignCell(0, player, type);
        }
        if (!spec && isNaN(type)) this.props.parent.nextMove();
        return 1;
    },
    makeSelected: function() {
        var type = this.state.cell_type, player = this.props.parent.state.player;
        if (type == 3 || type == 14 || type == 15) {
            this.props.parent.clearAll();
            this.buildFortress(0, player, 0);
        }
        else if (type == 16 || type == 17) {
            this.props.parent.setState({resultChange: [0, 0]});
            return this.buildFortress(0);
        } else {
            this.props.parent.setState({resultChange: [0, 0]});
            this.props.parent.clearAll();
            this.props.parent.cantMove(player);
        }
    },
    makeDeselected: function() {
        this.setState({cell_type: this.state.default_cell_type});
    },
    handleClick: function () {
        /*var id = this.props.id, lst = this.props.parent.props.selected_cell, isSet = this.makeSelected();
         if (lst != id) {
         //if (last != null)
         this.props.parent.props.selected_cell = id;
         } else if (isSet) this.props.parent.props.selected_cell = null;*/
        this.props.parent.setState({resultChange: [0, 0]});
        return this.buildFortress(0);
    },
    render: function() {
        var imgsrc = "img/cell_type" + this.state.cell_type + ".png";
        var style = {
            marginRight: this.props.width * (Math.sqrt(3) - 1)
        };
        return (
            <div className="Cell" style={ style } onClick={ this.handleClick }>
                <img src={ imgsrc } width={ this.props.width } />
            </div>
        )
    },
    componentDidMount: function() {
        var num = this.props.parent.props.cells.length;
        if (this.props.id == num - 1) {
            var id, cell;
            do {
                id = Math.trunc(Math.random() * num);
                cell = this.props.parent.props.cells[id];
            } while (!cell.isFree());
            cell.buildFortress(1, 0);
            do {
                id = Math.trunc(Math.random() * num);
                cell = this.props.parent.props.cells[id];
            } while (!cell.isFree() || cell.nearAllies(0));
            cell.buildFortress(1, 1);
            this.props.parent.cantMove(0);
        }
    }
});

var ResultTable = React.createClass({
    getInitialState: function() {
        return {
            isEnded: false
        }
    },
    finishGame: function() {
        this.setState({isEnded: true});
    },
    transformText: function(text) {
        var ans = [];
        var colors = ["green", "red", "blue", "brown", "purple", "orange"];
        for (var i = 0; i < text.length; i++) {
            var r = Math.trunc(Math.random() * colors.length);
            ans.push(<span style={{ color: colors[r] }}>{ text[i] }</span>);
        }
        return <i>{ ans }</i>;
    },
    render: function() {
        var txt = "Waiting for player " + (this.props.parent.state.player + 1),
            stateChange = this.props.parent.state.resultChange,
            results = this.props.parent.state.count;
        var elem = [];
        if (stateChange[0] || stateChange[1]) {
            console.log(stateChange);
            elem.push(<h2 style={{color: "#9acd32"}}>Current move will make: {results[0] + stateChange[0]} : {results[1] + stateChange[1]}</h2>);
        }
        if (this.state.isEnded) {
            elem.push(<div className="prettyButton"><a href="main.html">New game</a></div>);
            var txt = this.props.parent.state.count[0] == this.props.parent.state.count ?
                "It's a tie." : (this.props.parent.state.count[0] > this.props.parent.state.count[1] ?
                "First" : "Second") + " player wins.";
        }
        return (
            <div style={{marginTop: 0}}>
                <h1>Count: { (this.props.parent.state.count[0]) + " : " + (this.props.parent.state.count[1]) }</h1>
                <h2 color="yellow">{ this.transformText(txt) }</h2>
                { elem }
            </div>
        )
    },
    componentDidMount: function() {
        this.props.parent.props.result = this;
    }
});

var Map = React.createClass({
    getRandomCellType: function(fr) {
        var sum = 0;
        for (var i = 0; i < fr.length; i++) sum += fr[i];
        var x = Math.trunc(Math.random() * sum), i = 0;
        while (x >= fr[i])
        {
            x -= fr[i];
            i++;
        }
        return i;
    },
    getDefaultProps: function() {
        return {
            cell_heigth: 0,
            selected_cell: null,
            cells: [],
            result: null
        }
    },
    getInitialState: function() {
        return {
            player: 0,
            count: [0, 0, 0],
            map_style: {
                WebkitFilter: '',
                marginTop: 0
            },
            problems: 0,
            resultChange: [0, 0]
        }
    },
    cantMove: function(player) {
        var cells = this.props.cells, ans = 1;
        for (var i = 0; i < cells.length; i++) {
            if (cells[i].possibleMove(player)) ans = 0;
            var na = cells[i].nearAllies(player);
            if (na && cells[i].isFree()) {
                if (cells[i].samePlayer(player)) cells[i].setState({cell_type: 14 + player});
                else if (cells[i].samePlayer(player ^ 1)) cells[i].setState({cell_type: 14 + player ^ 1});
                else cells[i].setState({cell_type: 3});
            }
            else cells[i].makeDeselected();
        }
        return ans;
    },
    clearAll: function() {
        var cells = this.props.cells;
        for (var i = 0; i < cells.length; i++) cells[i].makeDeselected();
    },
    nextMove: function() {
        var player = this.state.player ^ 1, problem = this.state.problems;
        if (problem == 1) player = 1;
        if (problem == 2) player = 0;
        if (this.state.count[1] && this.cantMove(player)) {
            if ((problem == 2 && !player) || (problem == 1 && player)) this.props.result.finishGame();
            if (player && !problem) {
                problem = 2;
                player = 0;
            }
            if (!player && !problem) {
                problem = 1;
                player = 1;
            }

        }
        this.setState({player: player, problems: problem});
    },
    componentWillMount: function() {
        this.props.cell_height = this.props.cell_width * Math.sqrt(3) / 2;
        var st = this.state.map_style;
        st.marginTop = this.props.cell_height / 2;
        this.setState({map_style: st});
    },
    render: function() {
        var even_row_style = {
            width: (this.props.cell_width * Math.sqrt(3)) * this.props.cells_in_row + 50,
            marginTop: -this.props.cell_height / 2
        };
        var odd_row_style = {
            width: (this.props.cell_width * Math.sqrt(3)) * this.props.cells_in_row + 50,
            marginTop: -this.props.cell_height / 2,
            marginLeft: this.props.cell_width * Math.sqrt(3) / 2
        };

        // -------------------------------------------------------------------------------------------------------------

        var cells = [];
        for (var i = 0; i < this.props.number_of_rows; i++) {
            var cells_row = [];
            for (var j = 0; j < this.props.cells_in_row; j++)
                cells_row.push(<Cell width={ this.props.cell_width }
                                     default_cell_type={ this.getRandomCellType([4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]) }
                                     parent={ this }
                                     id={ j + i * this.props.cells_in_row } />);
            if (i & 1) cells.push(<div style={odd_row_style}
                                       className="cells_row">{ cells_row }</div>);
            else cells.push(<div style={even_row_style}
                                 className="cells_row">{ cells_row }</div>);
        }

        // -------------------------------------------------------------------------------------------------------------

        return (
            <div className="Map" style={ this.state.map_style }>
                <ResultTable parent={ this } />
                <div style={{height: this.props.cell_height / 2}}></div>
                { cells }
            </div>
        )
    }
});

React.render(<Map cell_width={70} cells_in_row={13} number_of_rows={20} />, document.getElementById('react1'));