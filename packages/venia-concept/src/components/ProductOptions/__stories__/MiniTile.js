import { createElement } from 'react';
import { storiesOf } from '@storybook/react';
import Option from '../option';
import Options from '../options';
import miniTileClasses from '../miniTile.css';
import { miniTile, miniTileDisabled, miniTileSelected, miniTiles} from '../mock_data';

const stories = storiesOf('Product Options/Mini Tile', module);

stories.add(
    'Mini Tile', () => (
        <Option
            item={miniTile}
            classes={miniTileClasses}>
            Test
        </Option>
    )
);

stories.add(
    'Mini Tile disabled', () => (
        <Option
            item={miniTileDisabled}
            classes={miniTileClasses}>
            Test
        </Option>
    )
);


stories.add(
    'Mini Tile selected', () => (
        <Option
            item={miniTileSelected}
            classes={miniTileClasses}>
            Test
        </Option>
    )
);


stories.add(
    'Mini Tile list', () => (
        <Options
            options={miniTiles}
            >
        </Options>
    )
);


