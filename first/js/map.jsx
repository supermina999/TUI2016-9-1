window.Map = React.createClass({
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
            cells: [],
            result: null,
            cell_types: []
        }
    },
    getInitialState: function() {
        return {
            player: 0,
            count: [0, 0, 0],
            map_style: {
                WebkitFilter: '',
                marginTop: 0
            }
        }
    },
    cantMove: function(player) {
        var cells = this.props.cells, ans = true;
        //console.clear();
        for (var i = 0; i < this.props.number_of_columns; i++) {
            for (var j = 0; j < this.props.cells_in_column; j++)
            {
                if (cells[i][j].possibleMove(player)) {
                    //console.log(i, j, player);
                    ans = false;
                    if (cells[i][j].samePlayer(player)) cells[i][j].setState({cell_type: 14 + player});
                    else if (cells[i][j].samePlayer(player ^ 1)) cells[i][j].setState({cell_type: 14 + player ^ 1});
                    else cells[i][j].setState({cell_type: 3});
                }
                else cells[i][j].makeDeselected();
            }
        }
        return ans;
    },
    nextMove: function() {
        //console.log("Next move");
        var player = this.state.player ^ 1;
        if (this.cantMove(player)) {
            if (this.cantMove(1 - player)) this.props.result.finishGame();
            else player = 1 - player;
        }
        this.setState({player: player});
    },
    getCellTypes: function() {
        var arr = new Array(this.props.cells_in_column);
        arr.fill(0);
        this.props.cell_types = new Array(this.props.number_of_columns);
        this.props.cell_types.fill(arr);
        this.props.cell_types.forEach(function(arr) {
            arr.forEach(function(type) {
                console.log(type);
            });
        });
    },
    componentWillMount: function() {
        this.props.cell_height = this.props.cell_width * Math.sqrt(3) / 2;
        var st = this.state.map_style;
        st.marginTop = this.props.cell_height / 2;
        this.setState({map_style: st});
        for (var i = 0; i < this.props.number_of_columns; i++) this.props.cells.push(new Array(this.props.cells_in_column));
        this.getCellTypes();
    },
    render: function() {
        var even_row_style = {
            width: (this.props.cell_width * Math.sqrt(3)) * (this.props.number_of_columns + 1) / 2 + 50,
            height: this.props.cell_height,
            marginTop: -this.props.cell_height / 2
        };
        var odd_row_style = {
            width: (this.props.cell_width * Math.sqrt(3)) * this.props.number_of_columns / 2 + 50,
            height: this.props.cell_height,
            marginTop: -this.props.cell_height / 2,
            marginLeft: this.props.cell_width * 3 / 4
        };

        // -------------------------------------------------------------------------------------------------------------

        var cells = [];
        for (var i = 0; i < 2 * this.props.cells_in_column; i++) {
            var cells_row = [];
            for (var j = 0; j < Math.trunc(this.props.number_of_columns / 2) + (i % 2 == 0 && this.props.number_of_columns % 2); j++)
                    cells_row.push(<Cell width={ this.props.cell_width }
                                         default_cell_type={ this.props.cell_types[j * 2 + i % 2][Math.trunc(i / 2)] }
                                         parent={ this }
                                         id={{x: j * 2 + i % 2, y: Math.trunc(i / 2)}} />);
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
    },
    componentDidMount: function() {
        var id, cell, startCells = [], num = this.props.cells_in_column * this.props.number_of_columns;
        do {
            id = Math.trunc(Math.random() * num);
            cell = this.props.cells[Math.trunc(id / this.props.cells_in_column)][id % this.props.cells_in_column];
        } while (!cell.isFree());
        cell.buildFortress(true, 0);
        do {
            id = Math.trunc(Math.random() * num);
            cell = this.props.cells[Math.trunc(id / this.props.cells_in_column)][id % this.props.cells_in_column];
        } while (!cell.isFree() || cell.nearAllies(0));
        cell.buildFortress(true, 1);
        this.cantMove(0);
    }
});

React.render(<Map cell_width={70} cells_in_column={5} number_of_columns={5} />, document.getElementById('react1'));