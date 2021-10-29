import React from 'react';
import { parseSted, steder, STED_PREFIX } from './Categories.js'
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
    formcontrol: {
        float: 'right',
        minWidth: 200,
        marginRight: '14px'
    }
});

class PlaceSelector extends React.Component {
    state = {
        sted: parseSted(window.location.hash)
    };

    render() {
        const classes = this.props.classes;

        const stedValgt = (event) => {
            const value = event.target.value;
            this.setState({ sted: value });
            window.location.hash = STED_PREFIX + value;

            this.props.parentCallbackPlace(value);
            event.preventDefault();
        }

        const stederListe = steder;

        return (
            <form autoComplete="off">
                <FormControl className={classes.formcontrol}>
                    <InputLabel htmlFor="sted">Velg sted</InputLabel>
                    <Select
                        value={this.state.sted}
                        onChange={stedValgt}
                        inputProps={{
                            id: 'sted'
                        }}
                    >
                        <MenuItem value='alle'>Alle</MenuItem>
                        {stederListe.map(([key, value]) =>
                            <MenuItem key={key} value={key}>{value}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </form>
        );
    }
}

export default withStyles(styles)(PlaceSelector);