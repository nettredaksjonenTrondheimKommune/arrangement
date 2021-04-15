import React from 'react';
import { categories, parseCategory, CATEGORY_PREFIX } from './Categories.js'
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
    formcontrol: {
        float: 'right',
        minWidth: 200,
    }
});

class CategorySelector extends React.Component {
    state = {
        kategori: parseCategory(window.location.hash)
    }

    render() {
        const classes = this.props.classes;

        const kategoriValgt = (event) => {
            const value = event.target.value;
            this.setState({ kategori: value });
            window.location.hash = CATEGORY_PREFIX + value;
        }

        const kategorier = Object.entries(categories);
        kategorier.sort(sorterEtterNavn);

        return (
            <form autoComplete="off">
                <FormControl className={classes.formcontrol}>
                    <InputLabel htmlFor="kategori">Velg kategori</InputLabel>
                    <Select
                        value={this.state.kategori}
                        onChange={kategoriValgt}
                        inputProps={{
                            id: 'kategori',
                        }}
                    >
                        <MenuItem value='alle'>Alle</MenuItem>
                        {kategorier.map(([key, value]) =>
                            <MenuItem key={key} value={key}>{value}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </form>
        );
    }
}
function sorterEtterNavn(a, b) {
    const navnA = a[1];
    const navnB = b[1];

    if (navnA < navnB) {
        return -1;
    }
    else if (navnA > navnB) {
        return 1;
    }

    return 0;
}

export default withStyles(styles)(CategorySelector);