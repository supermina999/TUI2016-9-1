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
