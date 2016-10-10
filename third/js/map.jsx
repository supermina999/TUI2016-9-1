window.Map = React.createClass({
    getDefaultProps: function() {
        return {
            cells: [],
            cell_types: []
        }
    },
    getInitialState: function() {
        return {
            count: [0, 0],
            selectedGeneral: false,
            player: 0
        }
    },


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
        for (var i = 0; i < this.props.number_of_columns; i++) this.props.cells.push(new Array(this.props.cells_in_column));
        this.getCellTypes();
    },
    render: function() {
        var even_row_style = {
            width: (this.props.cell_width * Math.sqrt(3)) * this.props.cells_in_row + 50,
            height: this.props.cell_height,
            marginTop: -this.props.cell_height / 2
        };
        var odd_row_style = {
            width: (this.props.cell_width * Math.sqrt(3)) * this.props.cells_in_row + 50,
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
            <div className="Map">
                <ControlPanel parent={this}></ControlPanel>
                <div style={{height: this.props.cell_height / 2}}></div>
                { cells }
            </div>
        )
    },
    
    finishMove: function() {
        var player = 1 - this.state.player;
        this.setState({player: player, selectedGeneral: false});
        this.props.cells[this.props.startCells[player].x][this.props.startCells[player].y].setState({general: player, movesLeft: 2});
        this.props.cells.forEach(function(column) {
            column.forEach(function (cell) {
                if (cell.general !== false) cell.setState({movesLeft: 2});
            });
        });
    },
    build: function() {
        var id = this.state.selectedGeneral, cell = this.props.cells[id.x][id.y];
        cell.setState({general: false, movesLeft: 0});
        this.setState({selectedGeneral: false});
        cell.buildFortress(1, this.state.player);
        this.props.cells[this.props.startCells[0].x][this.props.startCells[0].y].assignCell(true, 0);
        this.props.cells[this.props.startCells[1]][this.props.startCells[1].y].assignCell(true, 1);
    },
    
    componentDidMount: function() {
        var num = this.props.cells_in_column * this.props.number_of_columns;
        var id, cell, startCells = [];
        do {
            id = Math.trunc(Math.random() * num);
            cell = this.props.cells[Math.trunc(id / this.props.cells_in_column)][id % this.props.cells_in_column];
        } while (!cell.isFree());
        startCells.push(cell.props.id);
        cell.buildFortress(true, 0);
        cell.setState({general: 0, movesLeft: 2});
        do {
            id = Math.trunc(Math.random() * num);
            cell = this.props.cells[Math.trunc(id / this.props.cells_in_column)][id % this.props.cells_in_column];
        } while (!cell.isFree() || cell.nearAllies(0));
        startCells.push(cell.props.id);
        cell.buildFortress(true, 1);
        this.props.startCells = startCells;
    }
});

React.render(<Map cells_in_column={8} number_of_columns={8} cell_width={70}></Map>, document.getElementById("react1"));