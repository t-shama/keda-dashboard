import React from 'react';
import { ScaledObjectModel } from '../models/ScaledObjectModel';
import { Typography } from '@material-ui/core';

const ScaledObjectCard: React.FunctionComponent<{ scaledObject: ScaledObjectModel }> = (props) => {
    return (
        <Typography component="h4" variant="h6" color="primary" gutterBottom>
            {props.scaledObject.metadata.selfLink}
        </Typography>
    );
};

export default ScaledObjectCard;