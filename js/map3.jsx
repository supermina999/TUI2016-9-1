var Cell = React.createClass({
    getInitialState: function() {
        return {
            cell_type: 0
        }
    },
    componentWilMount: function() {
        this.setState({cell_type: this.props.cell_type});
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
    }
});

var Map = React.createClass({
    componentWillMount: function() {
        this.props.cell_height = this.props.cell_width * Math.sqrt(3) / 2;
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
                                     cell_type={ 1 }
                                     parent={ this }
                                     id={ j + i * this.props.cells_in_row } />);
            if (i & 1) cells.push(<div style={odd_row_style}
                                       className="cells_row">{ cells_row }</div>);
            else cells.push(<div style={even_row_style}
                                 className="cells_row">{ cells_row }</div>);
        }

        // -------------------------------------------------------------------------------------------------------------

        return (
            <div className="Map">
                <div style={{height: this.props.cell_height / 2}}></div>
                { cells }
            </div>
        )
    }
});

React.render(<Map cells_in_row={10} number_of_rows={10} cell_width={70}></Map>, document.getElementById("react1"));

