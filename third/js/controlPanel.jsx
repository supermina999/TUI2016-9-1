window.ControlPanel = React.createClass({
    render: function() {
        var parent = this.props.parent, colors = ["red", "rgb(163, 73, 164)"];
        return (
            <div>
                <h1>Count: <span style={{color: colors[0]}}>{ (parent.state.count[0])}</span> : <span style={{color: colors[1]}}>{(parent.state.count[1]) }</span></h1>
                <h2><span style={{color: colors[parent.state.player]}}>{parent.state.player == 0 ? "First" : "Second"}</span> player's move.
                    <span style={{color: "#4B5320"}}>{parent.state.selectedGeneral === false ? "" :
                    " This general has " + parent.props.cells[parent.state.selectedGeneral.x][parent.state.selectedGeneral.y].state.movesLeft +
                    " moves left. (Click again to deselect)"}</span>
                </h2>
                <button onClick={ parent.finishMove }>Finish move</button>
                <button onClick={ parent.build }
                        disabled={parent.state.selectedGeneral === false ||
                                  parent.props.cells[parent.state.selectedGeneral.x][parent.state.selectedGeneral.y].state.movesLeft == 0 ||
                                  parent.props.cells[parent.state.selectedGeneral.x][parent.state.selectedGeneral.y].isSea()}
                        >Build fortress</button>
            </div>
        )
    }
});